import type { UserResponseItem } from '../../api/ApiResponses';
import type { User } from './types';

export const normalizeUserFromResponse = (response: UserResponseItem): User => ({
  abbreviation: response.Abbreviation,
  email: response.Email,
  id: response.Id,
  isActive: response.IsActive,
  isDeleted: response.IsDeleted,
  isSelectable: response.Selectable,
  name: response.Name,
});
