import { message } from 'antd';
import useCancelOffer from 'pagesComponents/Detail/hooks/useCancelOffer';
import useDelist from 'pagesComponents/Detail/hooks/useDelist';
import { useEffect, useState } from 'react';

import useGetState from 'store/state/getState';
import useDetailGetState from 'store/state/detailGetState';
import { FormatOffersType, FormatListingType } from 'store/types/reducer';
import { dispatch } from 'store/store';
import { setOffers } from 'store/reducer/detail/detailInfo';
import { cloneDeep } from 'lodash-es';
import { refreshDetailPage } from 'pagesComponents/Detail/util';
import Modal from 'baseComponents/Modal';
import Button from 'baseComponents/Button';
import BigNumber from 'bignumber.js';

export default function CancelModal(options: {
  visible: boolean;
  type: string | undefined;
  data: FormatOffersType | FormatListingType | undefined;
  onClose: () => void;
}) {
  const { infoState, walletInfo } = useGetState();
  const { detailInfo } = useDetailGetState();
  const { isSmallScreen } = infoState;
  const { nftInfo, offers } = detailInfo;
  const account = walletInfo.address;
  const cancelOffer = useCancelOffer(nftInfo?.chainId);
  const delist = useDelist(nftInfo?.chainId);
  const { visible, onClose, type, data } = options;
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    if (type === 'offer') {
      let curKey = '';
      const index =
        offers
          ?.filter((item) => item?.from?.address === account)
          ?.findIndex((item) => {
            const { from, quantity, price, expireTime, key } = item;
            curKey = key;
            return (
              from?.address === account &&
              quantity === data?.quantity &&
              price === data?.price &&
              expireTime === (data as FormatOffersType)?.expireTime
            );
          }) ?? 0;
      const curIndex =
        offers?.findIndex((item) => {
          return curKey === item.key;
        }) ?? 0;

      const result = await cancelOffer({
        symbol: nftInfo?.nftSymbol || '',
        tokenId: nftInfo?.nftTokenId || 0,
        offerFrom: (data as FormatOffersType)?.from?.address || '',
        cancelOfferList: [
          {
            expireTime: {
              nanos: 0,
              seconds: `${((data as FormatOffersType)?.expireTime || 0) / 1000}`,
            },
            offerTo: (data as FormatOffersType)?.to?.address,
            price: {
              symbol: 'ELF',
              amount: new BigNumber(data?.price || 0).times(10 ** 8).toNumber(),
            },
          },
        ],
      });
      if (result !== 'error') {
        message.destroy();
        if (offers) {
          const offersCopy: FormatOffersType[] = cloneDeep(offers);
          if (curIndex !== -1) {
            offersCopy.splice(curIndex, 1);
            dispatch(setOffers(offersCopy));
          }
        }
      }
      setLoading(false);
      onClose();
    } else if (type === 'listing') {
      await delist({
        symbol: nftInfo?.nftSymbol || '',
        quantity: data?.quantity || 0,
        price: {
          symbol: (data as FormatListingType)?.purchaseToken?.symbol,
          amount: data?.price as number,
        },
      });
      setLoading(false);
      onClose();
      refreshDetailPage();
    }
  };

  useEffect(() => {
    if (visible) {
      setLoading(false);
    }
  }, [visible]);

  return (
    <Modal
      title="Confirm"
      onCancel={() => !loading && onClose()}
      open={visible}
      footer={
        <Button type="primary" loading={loading} size="ultra" onClick={handleConfirm}>
          Confirm
        </Button>
      }>
      <div className="w-full h-full flex justify-center items-center">
        <p
          className={`text-center w-full font-medium text-[var(--color-primary)] ${
            isSmallScreen ? 'text-[16px] leading-[24px]' : 'text-[20px]'
          }`}>
          Are you sure you want to cancel your {type}?
        </p>
      </div>
    </Modal>
  );
}
