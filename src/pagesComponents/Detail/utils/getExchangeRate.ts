import { fetchGetTokenData } from 'api/fetch';
import { openModal } from 'store/reducer/errorModalInfo';
import { store } from 'store/store';

export const getExchangeRate = async () => {
  try {
    const result = await fetchGetTokenData({ symbol: 'ELF' });
    if (!result) store.dispatch(openModal());
    return result?.price;
  } catch (error) {
    return 0;
  }
};
