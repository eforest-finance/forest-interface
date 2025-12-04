import { fetchNftInfo } from 'api/fetch';
import { setNftInfo, setUpdateDetailLoading } from 'store/reducer/detail/detailInfo';
import { openModal } from 'store/reducer/errorModalInfo';
import { store } from 'store/store';

interface IProps {
  nftId: string;
  address: string;
}

const getNftInfo = async ({ nftId, address }: IProps) => {
  try {
    const result = await fetchNftInfo({
      id: nftId,
      address,
    });

    if (!result) {
      return false;
    }

    return result;
  } catch (error) {
    return false;
  }
};

export default getNftInfo;

export const updateDetail = async ({ nftId, address }: { nftId: string; address: string }) => {
  store.dispatch(setUpdateDetailLoading(true));
  try {
    const result = await getNftInfo({
      nftId,
      address,
    });
    store.dispatch(setUpdateDetailLoading(false));
    if (!result) return store.dispatch(openModal());
    store.dispatch(setNftInfo({ ...result, file: result.file }));

    if (!result?.nftSymbol) return;
    return true;
  } catch (error) {
    store.dispatch(setUpdateDetailLoading(false));
    store.dispatch(setNftInfo(null));
    return store.dispatch(openModal());
  }
};
