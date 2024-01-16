import { Button, Input, Modal, Select } from 'antd';
import ELF from 'assets/images/ELF.png';
import BigNumber from 'bignumber.js';
import Logo from 'components/Logo';
import useTokenData from 'hooks/useTokenData';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { unitConverter } from 'utils/unitConverter';
import { RankType } from '../../SetItems';
import AddressError from '../AddressError/AddressError';
import AddressMigrate from '../AddressMigrate/AddressMigrate';
import LimitModal from '../Limit/Limit';
import useGetState from 'store/state/getState';

import styles from './AddRankModal.module.css';
import './saleGlobal.css';
import RankFailed from '../RankFailed';
import { ADDRESS_MAX_LENGTH, AMOUNT_LENGTH, DANGEROUS_CHARACTERS_REG } from 'constants/common';
import { decodeAddress } from 'utils/aelfUtils';
import { checkRepeat } from '../utils';
import { MAX_ADDRESS_ERROR } from 'constants/errorMessage';

export type RepeatAddressType = { rank: string; address: string };

function AddRankModal({
  visible,
  rank,
  onSave,
  onCancel,
  getContainer,
}: {
  visible?: boolean;
  rank?: RankType;
  onSave?: (newRank: RankType) => void;
  onCancel?: () => void;
  getContainer?: () => HTMLElement;
}) {
  const [limitVisible, setLimitVisible] = useState(false);
  const [addressErrorModalVisible, setAddressErrorModalVisible] = useState(false);
  const [rankWarningModalVisible, setRankWarningModalVisible] = useState(false);
  const [migrationVisible, setMigrationVisible] = useState(false);
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const elfRate = useTokenData();
  const [newRank, setNewRank] = useState<{
    name: string;
    price?: {
      symbol?: string;
      amount?: string;
    };
    address?: string[];
  }>();
  const numberFormat = (value: number) => {
    return unitConverter(value.toFixed(2)).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
  };

  const tempAddresses = useMemo(
    () =>
      Array.from(
        new Set(newRank?.address?.filter((item) => item !== '').concat(rank?.[newRank?.name || '']?.address || [])),
      ),
    [newRank?.address, newRank?.name, rank],
  );

  const tempRank = useMemo(
    () => ({
      ...rank,
      [newRank?.name || '']: {
        price: newRank?.price,
        address: tempAddresses,
      },
    }),
    [rank, newRank?.name, newRank?.price, tempAddresses],
  );

  const amount = useMemo(
    () =>
      Object.values(tempRank)
        .map((item) => item.address?.length)
        .reduce((pre, val) => (pre || 0) + (val || 0)),
    [tempRank],
  );

  const checkTagNameRepeat = useCallback(
    (rankName: string) => {
      const isRepeat = Object.keys(rank || {})?.findIndex((i) => i === rankName) >= 0;
      if (isRepeat) {
        setRankWarningModalVisible(true);
      }
      return isRepeat;
    },
    [rank],
  );

  const repeatAddress = useMemo(
    () =>
      newRank?.address
        ?.filter((item) => item !== '')
        .flatMap((item) =>
          checkRepeat({
            address: item,
            rankName: newRank?.name,
            rank,
          }),
        ),
    [newRank?.address, newRank?.name, rank],
  );

  const handleSave = useCallback(() => {
    try {
      if (tempAddresses.filter((item) => !decodeAddress(item)).length) {
        return setAddressErrorModalVisible(true);
      }
      if (!checkTagNameRepeat(newRank?.name || '')) {
        if ((amount || 0) > ADDRESS_MAX_LENGTH) {
          return setLimitVisible(true);
        }
        if ((repeatAddress || []).length > 0) {
          setMigrationVisible(true);
        } else {
          onSave?.(tempRank);
          setNewRank({ name: '' });
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, [amount, checkTagNameRepeat, newRank?.name, onSave, repeatAddress, tempAddresses, tempRank]);

  const onAmountChange = (value: string) => {
    const pivot = new BigNumber(value);
    if ((pivot.e || 0) > AMOUNT_LENGTH - 1) return value.slice(0, AMOUNT_LENGTH);
    const [, dec] = value.split('.');
    const decimals = 2;
    if (pivot.gte(0)) {
      setNewRank((v) => ({
        ...v,
        price: {
          symbol: v?.price?.symbol,
          amount: (dec?.length || 0) >= +decimals ? pivot.toFixed(+decimals, BigNumber.ROUND_DOWN) : value,
        },
      }));
    } else {
      setNewRank((v) => ({ ...v, price: { symbol: v?.price?.symbol, amount: '' } }));
    }
  };

  const onLimitModalClick = () => {
    setNewRank((v) => {
      const list = [...(v?.address || [])];
      list.splice(list.length - Number(amount) + 100);
      return { ...v, address: list };
    });
    setLimitVisible(false);
  };

  const onAddressMigrateClick = (rank: RankType) => {
    onSave?.(rank);
    setMigrationVisible(false);
    setNewRank({ name: '' });
  };

  const onRankNameChange = (name: string) => {
    if (DANGEROUS_CHARACTERS_REG.test(name)) {
      setNewRank((v) => ({ ...v, name }));
    }
  };

  const onReturn = () => {
    setNewRank({ name: '' });
    onCancel?.();
  };
  useEffect(() => {
    setNewRank({ name: '', price: { symbol: 'ELF' } });
  }, [visible]);

  return (
    <>
      <RankFailed
        visible={rankWarningModalVisible}
        confirm={() => setRankWarningModalVisible(false)}
        getContainer={getContainer}
      />
      <AddressError
        visible={addressErrorModalVisible}
        getContainer={getContainer}
        addresses={newRank?.address}
        errorAddresses={tempAddresses.filter((item) => !decodeAddress(item))}
        onCancel={() => setAddressErrorModalVisible(false)}
        onConfirm={(addresses) => {
          setNewRank((v) => ({ ...v, address: addresses }));
          setAddressErrorModalVisible(false);
        }}
      />
      <LimitModal
        getContainer={getContainer}
        onConfirm={onLimitModalClick}
        onCancel={() => setLimitVisible(false)}
        count={(newRank?.address || []).length - Number(amount) + 100}
        visible={limitVisible}
      />
      <AddressMigrate
        visible={migrationVisible}
        getContainer={getContainer}
        dataSource={repeatAddress}
        rank={tempRank}
        targetRank={newRank?.name}
        confirm={(rank: RankType) => onAddressMigrateClick(rank)}
        cancel={() => setMigrationVisible(false)}
      />
      <Modal
        className={`forest-marketplace forest-sale-modal-footer ${styles['add-white-list-modal']} ${
          isSmallScreen && `forest-sale-modal-mobile forest-sale-modal-footer-mobile`
        }`}
        open={visible}
        title="Add whitelist rank"
        onCancel={onCancel}
        getContainer={getContainer}
        footer={
          <>
            <Button
              disabled={!newRank?.name || !newRank.price?.symbol || !newRank.price.amount}
              className="flex items-center justify-center"
              type="primary"
              onClick={handleSave}>
              Save
            </Button>
            <Button className="flex items-center justify-center" onClick={onReturn}>
              Return
            </Button>
          </>
        }>
        <div className="rank-name">
          <p className="title pb-[16px]">Whitelist rank name</p>
          <Input
            className="hover-color rounded-[12px]"
            placeholder="Rank name"
            value={newRank?.name}
            maxLength={30}
            onChange={(e) => onRankNameChange(e.target.value)}
          />
        </div>
        <div className="price">
          <p className="title pb-[16px]">Price</p>
          <div className="flex">
            <Select
              className="token-select hover-color rounded-[12px]"
              value={newRank?.price?.symbol}
              onChange={(e) => {
                return setNewRank((v) => ({ ...v, price: { symbol: e, amount: '' } }));
              }}
              getPopupContainer={() => document.querySelector('.token-select') as HTMLElement}>
              <Select.Option key="ELF">
                <Logo className="w-[24px] h-[24px] mr-[8px]" src={ELF} />
                ELF
              </Select.Option>
            </Select>
            <div className="right-part flex">
              <Input
                value={newRank?.price?.amount}
                className={`hover-color rounded-[12px] ${
                  isSmallScreen ? '' : 'border-r-0 !rounded-tr-none !rounded-br-none'
                }`}
                onKeyDown={(e) => {
                  /\d|\.|Backspace|ArrowRight|ArrowLeft|ArrowUp|ArrowDown/.test(e.key) || e.preventDefault();
                }}
                placeholder="Amount"
                type="number"
                onChange={(e) => onAmountChange(e.target.value)}
              />
              {!isSmallScreen ? (
                <p className="convert-price">
                  ${numberFormat(new BigNumber(newRank?.price?.amount || 0).times(elfRate).toNumber())}
                </p>
              ) : null}
            </div>
          </div>
        </div>
        <div className="address">
          <p className="title pb-[16px]">Wallet address</p>
          <Input.TextArea
            className="address-text-area resize-none hover-color rounded-[12px]"
            value={newRank?.address?.join(',')}
            placeholder={MAX_ADDRESS_ERROR}
            onChange={(e) => setNewRank((v) => ({ ...v, address: e.target.value.split(',') }))}
          />
        </div>
      </Modal>
    </>
  );
}

export default React.memo(AddRankModal);
