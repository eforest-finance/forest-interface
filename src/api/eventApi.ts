import request from './request';
import { IActionDetail, IDropListParams, IDropListRes } from './types';

export const fetchRecommendAction = async (): Promise<IActionDetail[]> => {
  return request.get<IActionDetail[]>('app/drop/recommendation');
};

export const fetchDropList = async ({
  pageIndex = 1,
  pageSize = 8,
  state = 0,
}: IDropListParams): Promise<IDropListRes> => {
  const params = {
    skipCount: (pageIndex - 1) * pageSize,
    maxResultCount: pageSize,
    type: state,
  };
  return request.get<IDropListRes>('app/drop/list', {
    params,
  });
};
