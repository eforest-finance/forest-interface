export function getSkipCount(maxResultCount: number, page?: number) {
  return page && page > 0 ? page * maxResultCount : 0;
}

export function getUpdateList<T>({ isUpdate, total, cList = [] }: { isUpdate: boolean; total: number; cList: T[] }) {
  let list;
  if (isUpdate) {
    list = new Array(total);
  } else if (total === cList.length) {
    list = [...cList];
  } else {
    list = new Array(total);
    list.splice(0, cList.length, ...cList);
  }
  return list;
}

export function formatObjEmpty(obj: any) {
  Object.keys(obj).forEach((key) => {
    if (!obj[key] && typeof obj[key] !== 'number') {
      delete obj[key];
    } else {
      if (typeof obj[key] === 'object') formatObjEmpty(obj[key]);
    }
  });
  return obj;
}

export const jsonToBase64 = (json: any) => {
  try {
    return Buffer.from(JSON.stringify(json ?? {})).toString('base64');
  } catch (error) {
    return '';
  }
};
