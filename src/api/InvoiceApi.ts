import { PagedResults } from '../entity/system/types';
import { GetInvoiceOverviewParams, PostNewActionParams } from './ApiRequests';
import {
  GetActionsForInvoiceResponse,
  GetInvoiceAttachmentResponse,
  GetInvoiceDetailsResponse,
  GetInvoiceHistoryResponse,
  GetInvoiceImageResponse,
  GetInvoiceLinesResponse,
  GetInvoiceOverviewResponse,
  GetInvoicePackingSlipResponse,
} from './ApiResponses';
import { ApiServiceRequests } from './ApiServiceRequests';

export class InvoiceApi extends ApiServiceRequests {
  /**
   * Invoice overview
   */
  public async overview(params: GetInvoiceOverviewParams): Promise<PagedResults<GetInvoiceOverviewResponse>> {
    const { data } = await this.getAxios().post<GetInvoiceOverviewResponse>(
      '/Document/GetOverview?DocumentType=1',
      params,
    );

    return this.wrapDataInPagedResult(data, params.CurrentPage, params.PageSize);
  }

  /**
   * Get details of a invoice
   */
  public async get(id: string): Promise<GetInvoiceDetailsResponse> {
    const url = new URL('/Document/GetDetail/', this.getApiService().baseUrl);
    url.searchParams.append('id', id);
    // 1 = the invoice self, 2 =  next invoice in result?, 3 = previous invoice in result?
    url.searchParams.append('method', '1');
    url.searchParams.append('documentType', '1');
    const { data } = await this.getAxios().post<GetInvoiceDetailsResponse>(url.toString(), {});

    return data;
  }

  /**
   * Get image count of specific invoice
   */
  public async getImageCount(id: string): Promise<number> {
    const url = new URL(`/DocumentScan/GetImageCountForDocument/${id}`, this.getApiService().baseUrl);
    url.searchParams.append('documentId', id);
    url.searchParams.append('documentType', '1');

    const { data } = await this.getAxios().get<number>(url.toString());
    return data;
  }

  /**
   * Get image of a invoice by index.
   */
  public async getImage(id: string, index: number): Promise<GetInvoiceImageResponse> {
    const url = new URL(`/DocumentScan/GetImageInformationForDocument/${id}`, this.getApiService().baseUrl);
    url.searchParams.append('documentId', id);
    url.searchParams.append('documentType', '1');
    url.searchParams.append('pageNumber', index.toString());

    const { data } = await this.getAxios().get<GetInvoiceImageResponse>(url.toString());

    return data;
  }

  /**
   * Get attachments of a invoice
   */
  public async getAttachments(id: string): Promise<GetInvoiceAttachmentResponse> {
    const { data } = await this.getAxios().get<GetInvoiceAttachmentResponse>(
      `/File/GetAttachments/${id}?documentType=1`,
    );
    return data;
  }

  /**
   * Get packing slips of a invoice
   */
  public async getPackingSlips(id: string): Promise<GetInvoicePackingSlipResponse> {
    const { data } = await this.getAxios().get<GetInvoicePackingSlipResponse>(
      `/PackingSlip/GetByDocumentId/${id}?documentType=1`,
    );
    return data;
  }

  /**
   * Get invoice lines of a invoice
   */
  public async getInvoiceLines(invoiceId: string, companyId: string): Promise<GetInvoiceLinesResponse> {
    const url = new URL(`/InvoiceLine/GetByInvoiceId/${invoiceId}?documentType=1`, this.getApiService().baseUrl);
    url.searchParams.append('documentType', '1');
    url.searchParams.append('companyId', companyId);
    url.searchParams.append('isPostedInErp', 'false');
    const { data } = await this.getAxios().get<GetInvoiceLinesResponse>(url.toString());

    return data;
  }

  /**
   * Get invoice history
   */
  public async getInvoiceHistory(id: string): Promise<GetInvoiceHistoryResponse> {
    const { data } = await this.getAxios().get<GetInvoiceHistoryResponse>(
      `/History/GetByInvoiceId/${id}?documentType=1`,
    );
    return data;
  }

  /**
   * Get actions that you can do on a invoice.
   */
  public async getActionsForInvoice (id: string): Promise<GetActionsForInvoiceResponse> {
    const { data } = await this.getAxios().get<GetActionsForInvoiceResponse>(
      `/DocumentAction/GetActionsForInvoice/${id}?documentType=1`,
    );

    return data;
  }

  /**
   * Post new action to a invoice
   */
  public async postNewActions(params: PostNewActionParams): Promise<string> {
    const { data } = await this.getAxios().post<string>('/Document/PostNewAction/', params);

    // OK is Document_Saved_Successfully
    // Error example Document_Changed_By_Other_User
    // Error Required_Next_User_Id
    return data;
  }
}
