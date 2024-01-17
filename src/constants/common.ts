export const RECOMMEND_LIST_WIDTH_COLUMN = 1328;
export const WIDTH_NO_PADDING = 1238;

export enum DEVICE_TYPE {
  'PC',
  'MOBILE',
}

export const MAX_RESULT_COUNT = 999;
export const MAX_RESULT_COUNT_10 = 10;
export const MAX_RESULT_COUNT_100 = 100;
export const MAX_RESULT_COUNT_5 = 5;
export const PAGE_SIZE = 18;

export const SERVICE_FEE = '2.5%';
export const CREATOR_ROYALTY = '5.0%';

export const AMOUNT_LENGTH = 11;
export const ADDRESS_MAX_LENGTH = 100;

export const CONTRACT_AMOUNT = '1000000000000000000';

export const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
export const twitterReg = /https?:\/\/(?:www\.)?twitter\.com\/(?:\w+\/status\/)?\w+/;
export const instagramReg = /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9-_]+\/?$/;

/* eslint-disable no-useless-escape */
export const urlReg = /(https?:\/\/)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/i;
export const DANGEROUS_CHARACTERS_REG = /^(?!.*[<>\\"'%&+\\\\\\']).*$/;
export const externalLinkReg = /((https?|ftp):\/\/)([a-z0-9-]+\.)+[a-z]{2,}(:\d{1,5})?(\/[^\s]*)?/;

export const hideHeaderPage = ['asset'];
export const hideFooterPage = ['asset', 'explore-items', 'account', 'collections', 'my-collections'];
