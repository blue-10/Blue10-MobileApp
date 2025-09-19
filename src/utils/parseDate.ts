import { parse, parseJSON } from 'date-fns';

// example like: 2022-10-20T06:23:51+00:00
const PARSE_DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ssxxx";

export const parseDate = (value: string, format?: string) => {
  return parse(value, format ?? PARSE_DATE_FORMAT, new Date());
};

export const parseDateWithMicro = (value: string) => {
  return parseJSON(value);
};
