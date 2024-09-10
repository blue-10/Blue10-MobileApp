import type { getAllUsersResponse, GetCurrentUserResponse } from './ApiResponses';
import { ApiServiceRequests } from './ApiServiceRequests';

export class UserApi extends ApiServiceRequests {
  /**
   * Get all users including deleted once.
   */
  public async getAllUsers(): Promise<getAllUsersResponse> {
    const { data } = await this.getAxios().get<getAllUsersResponse>('/User?includeDeleted=false');

    return data;
  }

  /**
   * Get current user
   */
  public async getCurrentUser(): Promise<GetCurrentUserResponse> {
    const { data } = await this.getAxios().get('/User/GetCurrentUser');

    return data;
  }
}
