import { GetCompanyResponse } from './ApiResponses';
import { ApiServiceRequests } from './ApiServiceRequests';

export class CompanyApi extends ApiServiceRequests {
  public async all(): Promise<GetCompanyResponse> {
    const { data } = await this.getAxios().get<GetCompanyResponse>('/Company');

    return data;
  }
}
