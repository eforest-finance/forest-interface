import { store } from 'store/store';
import { setOffers as setStoreOffers } from 'store/reducer/detail/detailInfo';
import { openModal } from 'store/reducer/errorModalInfo';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import getOffers from 'pagesComponents/Detail/utils/getOffers';

export const getOffersInfo = async (
  nftId: string,
  chainId: Chain,
  page: number,
  pageSize: number = DEFAULT_PAGE_SIZE,
) => {
  try {
    const result = await getOffers({
      page,
      pageSize,
      nftId,
      chainId,
    });
    if (!result) {
      store.dispatch(openModal());
      return;
    }

    store.dispatch(
      setStoreOffers({
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
