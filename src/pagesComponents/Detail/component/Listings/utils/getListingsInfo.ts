import { store } from 'store/store';
import { setListings as setStoreListings } from 'store/reducer/detail/detailInfo';
import getListings from 'pagesComponents/Detail/utils/getListings';
import { openModal } from 'store/reducer/errorModalInfo';
import { DEFAULT_PAGE_SIZE } from 'constants/index';

export const getListingsInfo = async (chainId: Chain, page: number, pageSize: number = DEFAULT_PAGE_SIZE) => {
  try {
    const { nftInfo } = store.getState().detailInfo;
    if (!nftInfo?.nftSymbol) {
      store.dispatch(setStoreListings(null));
      return;
    }
    const result = await getListings({
      page,
      pageSize,
      symbol: nftInfo?.nftSymbol,
      chainId,
    });
    if (!result) {
      store.dispatch(openModal());
      return;
    }

    store.dispatch(
      setStoreListings({
        items: result.list,
        totalCount: result.totalCount,
        page: page,
        pageSize: pageSize,
      }),
    );
  } catch (error) {
    /* empty */
  }
};
