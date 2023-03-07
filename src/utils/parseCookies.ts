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
