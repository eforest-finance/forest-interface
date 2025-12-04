import { ValidateStatus } from 'antd/lib/form/FormItem';
import { useCallback, useState } from 'react';
import { useDebounce } from 'react-use';
import { getTagInfoFromWhitelist } from './whiteListView';
import useDetailGetState from 'store/state/detailGetState';
import { IContractError } from 'contract/type';
import { DEFAULT_ERROR } from 'constants/errorMessage';

export type TagNameItemType = {
  validateStatus?: ValidateStatus;
  errorMsg?: string | null;
};
export const useHaveTagName = (tagName?: string) => {
  const [isHas, setHas] = useState<TagNameItemType>({
    validateStatus: 'success',
  });

  const { whiteListInfo: whiteListInfoStore } = useDetailGetState();
  const { whitelistInfo } = whiteListInfoStore;

  const fetchHave = useCallback(async () => {
    if (!whitelistInfo?.whitelistHash || !whitelistInfo?.projectId || !tagName) return;
    setHas({
      validateStatus: 'validating',
      errorMsg: '',
    });

    try {
      const res = await getTagInfoFromWhitelist({
        whitelistId: whitelistInfo?.whitelistHash,
        projectId: whitelistInfo?.projectId,
        tagInfo: {
          tagName,
        },
      });

      if (res?.error) {
        setHas({
          validateStatus: 'error',
          errorMsg: res?.errorMessage?.message || DEFAULT_ERROR,
        });
        return;
      }
      if (res?.value) {
        return setHas({
          validateStatus: 'error',
          errorMsg: 'Rank name already exists',
        });
      }

      setHas({
        validateStatus: 'success',
      });
    } catch (error) {
      const resError = error as IContractError;
      setHas({
        validateStatus: 'error',
        errorMsg: resError?.errorMessage?.message || DEFAULT_ERROR,
      });
    }
  }, [tagName, whitelistInfo]);
  useDebounce(fetchHave, 500, [tagName]);

  return isHas;
};
