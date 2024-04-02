import Button from 'baseComponents/Button';
import BaseModal from 'baseComponents/Modal';
import Table from 'baseComponents/Table';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useListingService } from './hooks/useListingService';
import useGetState from 'store/state/getState';
import { INftInfo } from 'types/nftTypes';
import { ColumnsType } from 'antd/lib/table';
import Logo from 'components/Logo';
import { thousandsNumber } from 'utils/unitConverter';
import ELF from 'assets/images/ELF.png';
import useTokenData from 'hooks/useTokenData';
import { FormatListingType } from 'store/types/reducer';
import { useNiceModalCommonService } from 'hooks/useNiceModalCommonService';

function SaleListingModalConstructor(nftInfo: INftInfo) {
  const modal = useModal();
  useNiceModalCommonService(modal);
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const elfRate = useTokenData();

  const { cancelAllListings, cancelListingItem, loading, listings } = useListingService(nftInfo, elfRate, modal);

  const footer = (
    <Button type="primary" size="ultra" className="w-[256px]" onClick={cancelAllListings}>
      Cancel All Listings
    </Button>
  );

  const columns: ColumnsType<FormatListingType> = [
    {
      title: 'Price',
      key: 'price',
      width: isSmallScreen ? 120 : 140,
      dataIndex: 'price',
      render: (text: string, record: FormatListingType) => (
        <div
          className={`flex items-center font-medium text-[var(--color-secondary)] ${
            isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
          }`}>
          <Logo className={'w-[16px] h-[16px] mr-[4px]'} src={ELF} />
          &nbsp;
          <span className="text-[var(--color-primary)] font-semibold">{text}</span>
          &nbsp;
          {record.purchaseToken.symbol}
        </div>
      ),
    },
    {
      title: 'USD Price',
      key: 'usdPrice',
      width: isSmallScreen ? 120 : 170,
      dataIndex: 'usdPrice',
      render: (_, record: FormatListingType) => {
        const usdPrice = record?.price * (record?.purchaseToken?.symbol === 'ELF' ? elfRate : 1);
        return (
          <span
            className={`font-medium text-[16px] ${
              isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
            }`}>
            $ {thousandsNumber(Number(usdPrice))}
          </span>
        );
      },
    },
    {
      title: 'Quantity',
      key: 'quantity',
      dataIndex: 'quantity',
      width: isSmallScreen ? 120 : 110,
      render: (text: number | string) => (
        <span
          className={`text-[var(--color-secondary)] font-medium ${
            isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
          }`}>
          {text}
        </span>
      ),
    },
    {
      title: 'Expiration',
      key: 'expiration',
      dataIndex: 'expiration',
      width: isSmallScreen ? 120 : 140,
      render: (text: string) => (
        <span
          className={`font-medium text-[var(--color-secondary)] ${
            isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
          }`}>
          {text || '-'}
        </span>
      ),
    },
    {
      key: 'action',
      width: 92,
      render: (_text: string, record: FormatListingType) => (
        <Button
          className="!w-[68px] flex justify-center items-center !h-[28px] !text-[12px] !font-medium !rounded-[6px] !p-0"
          type="default"
          onClick={() => cancelListingItem(record)}>
          Cancel
        </Button>
      ),
    },
  ];

  return (
    <BaseModal
      title="Your Listings"
      footer={footer}
      open={modal.visible}
      onOk={modal.hide}
      onCancel={modal.hide}
      afterClose={modal.remove}
      destroyOnClose={true}>
      <Table
        loading={loading}
        columns={columns}
        scroll={{ x: 792, y: 326 }}
        emptyText="No listings yet."
        dataSource={listings || []}
      />
    </BaseModal>
  );
}

export const SaleListingModal = NiceModal.create(SaleListingModalConstructor);
