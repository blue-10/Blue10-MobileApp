import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { addMinutes, isBefore } from 'date-fns';
import jwtDecode, { JwtPayload } from 'jwt-decode';

import { inDevelopment } from '../utils/inDevelopment';
import * as ApiResponse from './ApiResponses';
import { CompanyApi } from './CompanyApi';
import { DashboardApi } from './DashboardApi';
import { FileApi } from './FileApi';
import { InvoiceApi } from './InvoiceApi';
import { TranslationApi } from './TranslationApi';
import { UserApi } from './UserApi';

export const REFRESH_GET_BEFORE_IN_MINUTES = -15;

/**
 * Api service class
 */
export class ApiService {
  private axiosInstance: AxiosInstance;
  public baseUrl: string;

  // token
  private token?: string;
  public refreshToken: string;

  public customerId?: string;
  public customerName?: string;

  // request that can be done with the api.
  public readonly dashboard: DashboardApi;
  public readonly company: CompanyApi;
  public readonly file: FileApi;
  public readonly invoice: InvoiceApi;
  public readonly user: UserApi;
  public readonly translation: TranslationApi;

  constructor(baseUrl: string, refreshToken: string) {
    this.refreshToken = refreshToken;
    this.baseUrl = baseUrl;
    this.axiosInstance = axios.create();

    // setup requests collections
    this.dashboard = new DashboardApi(this);
    this.company = new CompanyApi(this);
    this.file = new FileApi(this);
    this.invoice = new InvoiceApi(this);
    this.user = new UserApi(this);
    this.translation = new TranslationApi(this);

    this.createAxiosInstance();
  }

  /**
   *  Get refresh token
   */
  public async refreshAccessToken(refreshToken: string): Promise<ApiResponse.RefreshAccessTokenResponse> {
    const { data } = await axios.get<ApiResponse.RefreshAccessTokenResponse>(
      '/AuthorizedUser/RefreshAccessToken',
      {
        baseURL: this.baseUrl,
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    this.refreshToken = refreshToken;
    this.token = data.Token;

    // set customer information
    this.customerId = data.CustomerId;
    this.customerName = data.CustomerName;

    return data;
  }

  /**
   * Request a new refresh token
   *
   * @returns
   */
  public async requestNewRefreshToken(): Promise<ApiResponse.RefreshRefreshTokenResponse> {
    const { data } = await axios.get<ApiResponse.RefreshAccessTokenResponse>(
      '/AuthorizedUser/RefreshAccessToken',
      {
        baseURL: this.baseUrl,
        headers: {
          Authorization: `Bearer ${this.refreshToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    this.refreshToken = data.Token;

    return data;
  }

  /**
   * Returns the axios requests
   */
  public getAxios() {
    return this.axiosInstance;
  }

  /**
   * Check if the refresh token is still valid
   */
  public isRefreshTokenStillValid(): boolean {
    return isBefore(new Date(), this.getRefreshTokenExpireDate());
  }

  /**
   * Get expire date of refresh date
   */
  public getRefreshTokenExpireDate(): Date {
    const jwt = jwtDecode<JwtPayload>(this.refreshToken);
    if (jwt.exp) {
      const expDate = new Date(0);
      expDate.setUTCSeconds(jwt.exp);
      return expDate;
    } else { // no exp set default to 5 minutes from now.
      return addMinutes(new Date(), 5);
    }
  }

  /**
   * Returns if a new refresh token can be fetched
   */
  public canGetNewRefreshToken(): boolean {
    return isBefore(addMinutes(this.getRefreshTokenExpireDate(), REFRESH_GET_BEFORE_IN_MINUTES), new Date());
  }

  /**
   * Create axios instance
   */
  private createAxiosInstance(): void {
    const config: AxiosRequestConfig = {
      baseURL: this.baseUrl,
    };

    this.axiosInstance = axios.create(config);

    this.axiosInstance.interceptors.request.use(
      async (config) => {
        // no token set yet? then we are getting a new token

        if (!this.token) {
          await this.refreshAccessToken(this.refreshToken);
        }

        // TODO: check if token is still valid. If not we will create new token

        config.headers.setAuthorization(`Bearer ${this.token}`);

        return config;
      },
      (error) => Promise.reject(error));

    // handling when token is not refresh on time
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest: InternalAxiosRequestConfig & { _retry?: boolean} | undefined = error.config;
        if (originalRequest && error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // set new token in request
          const { Token } = await this.refreshAccessToken(this.refreshToken);
          this.axiosInstance.defaults.headers.common.Authorization = `Bearer ${Token}`;

          return this.axiosInstance(originalRequest);
        }

        return Promise.reject(error);
      });

    // request debugger
    if (inDevelopment()) {
      this.axiosInstance.interceptors.response.use((response) => {
        // eslint-disable-next-line no-console
        console.log('Response:', response.request._url, response.status);
        return response;
      });
    }
  }
}
