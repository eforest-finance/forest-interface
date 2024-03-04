import { FilterKeyEnum, FilterType } from './type';

export function getFilterFromSearchParams(filterParamStr: string | null) {
  if (!filterParamStr) return {};

  const filterParamsObj = JSON.parse(decodeURI(filterParamStr)) as {
    [FilterKeyEnum.Traits]?: {
      key: string;
      values: string[];
    }[];
  };

  const res: {
    [key: string]: {
      type: FilterType;
      data: Array<{
        label: string;
        value: string;
      }>;
    };
  } = {};

  filterParamsObj?.[FilterKeyEnum.Traits]?.forEach?.((item) => {
    let tmpObj = {
      type: FilterType.Checkbox,
      data: (item.values || []).map((itm) => ({
        label: itm,
        value: itm,
      })),
    };
    res[`${FilterKeyEnum.Traits}-${item.key}`] = tmpObj;
  });

  return res;
}
