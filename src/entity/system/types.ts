export type User = {
  id: string;
  name: string;
  email: string;
  abbreviation: string;
  isSelectable: boolean;
  isDeleted: boolean;
  isActive: boolean;
}

export type Paging = {
  current: number;
  total: number;
  previous?: number;
  next?: number;
  totalResults: number;
}

export type PagedResults<T> = {
  data: T;
  paging: Paging;
}

export type PagedItem = {
  Count: number;
}
