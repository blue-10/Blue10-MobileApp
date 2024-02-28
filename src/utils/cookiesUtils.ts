export type CookieItem = {
  name: string;
  value: string;
};

export const parseCookies = (cookieValue: string): Record<string, string> => {
  const cookies: Record<string, string> = {};
  if (cookieValue === '') {
    return cookies;
  }
  for (const cookie of cookieValue.split(';')) {
    const [key, value] = cookie.split('=');
    cookies[key.trim()] = value;
  }

  return cookies;
};

export const makeCookies = (items: CookieItem[]): string => {
  return items
    .reduce((values: string[], item: CookieItem) => {
      const retValue = [`${item.name}=${item.value}`].join(':');
      values.push(retValue);

      return values;
    }, [])
    .join('; ');
};
