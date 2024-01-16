import { urlReg } from 'constants/common';

export function isUrl(url: string) {
  return urlReg.test(url);
}

export const isBase64Url = (url: string) => {
  const base64UrlRegex = /^data:image\/[a-z]+;base64,/;
  return base64UrlRegex.test(url);
};
