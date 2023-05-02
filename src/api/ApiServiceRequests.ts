import { AxiosInstance } from 'axios';

import { PagedResults } from '../entity/system/types';
import { ApiService } from './ApiService';

export class ApiServiceRequests {
  private apiService: ApiService;

  constructor (apiService: ApiService) {
    this.apiService = apiService;
  }

  protected getAxios(): AxiosInstance {
    return this.apiService.getAxios();
  }

  protected wrapDataInPagedResult<T>(data: T, page = 1, pageSize = 25): PagedResults<T> {
    const dataLength = (data instanceof Array) ? data.length : 0;
    const totalResults = ((data instanceof Array) && data.length > 0) ? data[0].Count : 0;
    const currentPagePosition = (page * pageSize) + dataLength;

    return {
      data,
      paging: {
        current: page,
        next: currentPagePosition < totalResults ? page + 1 : undefined,
        previous: page > 1 ? page - 1 : undefined,
        total: dataLength,
        totalResults,
      },
    };
  }

  protected getApiService(): ApiService {
    return this.apiService;
  }
}
