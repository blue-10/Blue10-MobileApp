import { ApiServiceRequests } from './ApiServiceRequests';
import { Environment } from './types';

/**
 * Some placeholder response before they really get implemented.
 */
export class PlaceholderResponsesApi extends ApiServiceRequests {
  public async getEnvironments(): Promise<Environment[]> {
    return [
      {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        name: 'Environment 1',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        name: 'Environment 2',
      },
      {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        name: 'Environment 3',
      },
    ];
  }
}
