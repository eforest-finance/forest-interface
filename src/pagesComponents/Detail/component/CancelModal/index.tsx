import { message } from 'antd';
import useCancelOffer from 'pagesComponents/Detail/hooks/useCancelOffer';
import useDelist from 'pagesComponents/Detail/hooks/useDelist';
import { useEffect, useState } from 'react';

import useGetState from 'store/state/getState';
import useDetailGetState from 'store/state/detailGetState';
import { FormatOffersType, FormatListingType } from 'store/types/reducer';
import Modal from 'baseComponents/Modal';
import Button from 'baseComponents/Button';
import BigNumber from 'bignumber.js';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import React from 'react';
import { usePathname } from 'next/navigation';
import moment from 'moment';

function CancelModal(options: {
  type: string | undefined;
  data: FormatOffersType | FormatListingType | undefined;
  onClose?: () => void;
}) {
  const modal = useModal();
  const pathname = usePathname();

  const { infoState } = useGetState();
  const { detailInfo } = useDetailGetState();
  const { isSmallScreen } = infoState;
  const { nftInfo } = detailInfo;
  const cancelOffer = useCancelOffer(nftInfo?.chainId);
  const delist = useDelist(nftInfo?.chainId);
  const { onClose, type, data } = options;
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    if (type === 'offer') {
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
        // if (offers) {
        //   const offersCopy: FormatOffersType[] = cloneDeep(offers?.items || []);
        //   if (curIndex !== -1) {
        //     offersCopy.splice(curIndex, 1);
        //     dispatch(setOffers(offersCopy));
        //   }
        // }
      }
      setLoading(false);
      onCancel();
    } else if (type === 'listing') {
      await delist({
        symbol: nftInfo?.nftSymbol || '',
        quantity: data?.quantity || 0,
        nftDecimals: nftInfo?.decimals || 0,
        price: {
          symbol: (data as FormatListingType)?.purchaseToken?.symbol,
          amount: data?.price as number,
        },
        startTime: {
          seconds: moment.unix(Math.floor((data as FormatListingType).startTime / 1000)).unix(),
          nanos: 0,
        },
      });
      setLoading(false);
      onCancel();
    }
  };

  const onCancel = () => {
    if (onClose) {
      onClose();
    } else {
      modal.hide();
    }
  };

  useEffect(() => {
    if (modal.visible) {
      setLoading(false);
    }
  }, [modal.visible]);

  useEffect(() => {
    modal.hide();
  }, [pathname]);

  return (
    <Modal
      title="Confirm"
      onCancel={() => !loading && onCancel()}
      open={modal.visible}
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

export default React.memo(NiceModal.create(CancelModal));
