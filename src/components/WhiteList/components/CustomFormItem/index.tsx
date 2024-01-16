/* eslint-disable no-inline-styles/no-inline-styles */

import React, { useCallback } from 'react';
import { Form, Input, Select } from 'antd';
import { parseInputChange } from '../../utils/reg';
import BigNumber from 'bignumber.js';
import Logo from 'components/Logo';
import ELF from 'assets/images/ELF.png';
import { unitConverter } from 'utils/unitConverter';
import useTokenData from 'hooks/useTokenData';
import useGetState from 'store/state/getState';
const { Item: FormItem } = Form;
const { Option } = Select;

interface CustomFormItemValue {
  amount?: string;
  symbol?: string;
}

interface CustomFormItemProps {
  value?: CustomFormItemValue;
  onChange?: (value: CustomFormItemValue) => void;
  symbolList?: {
    decimals: number;
    symbol: string;
  }[];
}

const CustomFormItem: React.FC<CustomFormItemProps> = ({ value = {}, onChange, symbolList }) => {
  const elfRate = useTokenData();
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const numberFormat = (value: number) => {
    return unitConverter(value.toFixed(2)).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
  };
  const triggerChange = useCallback(
    (changedValue: { amount?: string; symbol?: string }) => {
      onChange?.({ symbol: symbolList?.[0]?.symbol ?? undefined, ...value, ...changedValue });
    },
    [onChange, symbolList, value],
  );
  const onAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newAmount = parseInputChange(
        e.target.value,
        new BigNumber(0),
        symbolList?.find((item) => item?.symbol === value?.symbol)?.decimals ?? 8,
      );
      triggerChange({ amount: newAmount });
    },
    [symbolList, triggerChange, value?.symbol],
  );

  const onSymbolChange = useCallback(
    (newSymbol: string) => {
      triggerChange({ symbol: newSymbol });
    },
    [triggerChange],
  );

  return (
    <>
      <FormItem>
        {symbolList && (
          <Select
            defaultValue={symbolList?.[0]?.symbol}
            value={value.symbol}
            style={{ width: 80, margin: '0 8px' }}
            getPopupContainer={(v) => v}
            onChange={onSymbolChange}>
            {symbolList?.map((token, index) => (
              <Option key={token?.symbol ?? index} value={token?.symbol}>
                <Logo src={ELF} className="w-[24px] h-[24px] mr-[8px]" />
                {token?.symbol ?? ''}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>
      <FormItem>
        <Input
          type="text"
          value={value.amount}
          onChange={onAmountChange}
          style={{
            flex: 303,
            borderTopRightRadius: isSmallScreen ? undefined : '0px',
            borderBottomRightRadius: isSmallScreen ? undefined : '0px',
          }}
        />
        {isSmallScreen || (
          <p className="convert-price border border-solid border-[var(--line-box)] p-[16px] text-[16px] leading-[24px] font-medium text-[var(--color-secondary)] flex-[200] rounded-tr-[12px] rounded-br-[12px] rounded-tl-0 border-l-0 h-[56px]">
            $
            {numberFormat(
              value.symbol?.toLowerCase() === 'usdt'
                ? new BigNumber(value.amount || 0).toNumber()
                : new BigNumber(value.amount || 0).times(elfRate).toNumber(),
            )}
          </p>
        )}
      </FormItem>
    </>
  );
};

export default CustomFormItem;
