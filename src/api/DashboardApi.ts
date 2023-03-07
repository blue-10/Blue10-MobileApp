import { GetDashboardParams } from './ApiRequests';
import { GetDashboardResponse } from './ApiResponses';
import { ApiServiceRequests } from './ApiServiceRequests';

/**
 * Dashboard API
 */
export class DashboardApi extends ApiServiceRequests {
  public async get(params?: GetDashboardParams): Promise<GetDashboardResponse> {
    const { data } = await this.getAxios().post<GetDashboardResponse>('/Dashboard', params);

    return data;
  }
}
