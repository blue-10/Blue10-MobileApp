import { ApiServiceRequests } from './ApiServiceRequests';

export class FileApi extends ApiServiceRequests {
  public async startUploadSession(companyId: string, documentType: number): Promise<string> {
    const { data } = await this.getAxios().post<string>(
      '/File/StartUploadSession',
      null,
      {
        params: { companyId, documentType },
      });

    return data;
  }

  public async uploadDocumentForSource(sessionId: string, documentPath: string): Promise<string> {
    const baseName = documentPath.split('/').pop() as string;

    const formData = new FormData();
    // @ts-ignore
    formData.append(baseName, { name: baseName, type: 'application/pdf', uri: documentPath });

    const { data } = await this.getAxios().post<string>(
      `/File/UploadDocumentForSource/${sessionId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return data;
  }

  public async finalizeUploadSession(sessionId: string): Promise<string> {
    const { data } = await this.getAxios().put<string>(`/File/FinalizeUploadSession/${sessionId}`);

    return data;
  }
}
