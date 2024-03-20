import { urlReg } from 'constants/common';

export function isUrl(url: string) {
  return urlReg.test(url);
}

export const isBase64Url = (url: string) => {
  const base64UrlRegex = /^data:image\/[a-z]+;base64,/;
  return base64UrlRegex.test(url);
};

export function ipfsURLToS3AndIpfsURL(url: string, s3ImagePrefixUri: string, ipfsToSchrodingerURL: string): string[] {
  const URLObj = new URL(url);
  const host = URLObj.host.toLowerCase();
  if (host === 'ipfs.io') {
    const hash = URLObj.pathname.replace('/ipfs/', '');
    return [`${s3ImagePrefixUri}/${hash}`, `${ipfsToSchrodingerURL}/${hash}`, url];
  }
  if (URLObj.protocol.toLowerCase() === 'ipfs:') {
    const hash = url.match(/^ipfs:(\/\/)?(.*)$/i)?.[2];
    return [`${s3ImagePrefixUri}/${hash}`, `https://ipfs.io/ipfs/${hash}`];
  }
  return [url];
}
