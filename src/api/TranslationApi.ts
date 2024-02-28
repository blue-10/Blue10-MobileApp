import type { GetSourceResponse } from './ApiResponses';
import { ApiServiceRequests } from './ApiServiceRequests';

export class TranslationApi extends ApiServiceRequests {
  public async getSource(locale: string, source: string): Promise<GetSourceResponse> {
    const url = new URL('/Translations/GetBySource', this.getApiService().baseUrl);
    url.searchParams.append('Locale', locale);
    url.searchParams.append('Source', source);
    const { data } = await this.getAxios().get<GetSourceResponse>(url.toString());

    return data;
  }
}
