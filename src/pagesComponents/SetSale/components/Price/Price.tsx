import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';
import Logo from 'components/Logo';
import ELF from 'assets/images/ELF.png';
import styles from './Price.module.css';
import useGetState from 'store/state/getState';
import { AMOUNT_LENGTH } from 'constants/common';
import { Select, Option } from 'baseComponents/Select';
import Input from 'baseComponents/Input';

const fixedPrice = {
  ELF: {
    symbol: 'ELF',
    tokenId: 'ELF',
    decimals: 8,
    icon: 'ELF',
  },
};
type FixedPriceKey = keyof typeof fixedPrice;

export default function Price({ onChange, className = '' }: { onChange?: (val: any) => void; className?: string }) {
  const [sel, setSel] = useState<FixedPriceKey>('ELF');
  const [val, setVal] = useState<number | string>();
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const selectChange = useCallback((val: FixedPriceKey) => {
    setSel(val);
  }, []);

  const inputChange = useCallback((target: HTMLInputElement) => {
    const pivot = new BigNumber(target.value);
    if ((pivot.e || 0) > AMOUNT_LENGTH - 1) return target.value.slice(0, AMOUNT_LENGTH);
    const [, dec] = target.value.split('.');
    const decimals = 2;
    if (pivot.gte(0)) {
      setVal((dec?.length || 0) >= +decimals ? pivot.toFixed(+decimals, BigNumber.ROUND_DOWN) : target.value);
    } else {
      setVal('');
    }
  }, []);

  useEffect(() => {
    const obj = {
      token: fixedPrice[sel],
      price: val,
    };
    onChange?.(obj);
  }, [onChange, sel, val]);

  return (
    <div
      className={`${styles['price-input-wrapper']} ${
        isSmallScreen && styles['price-input-wrapper-mobile']
      } flex items-center justify-center ${className}`}>
      <Select className="!flex-1" value={sel} onChange={selectChange} getPopupContainer={(v) => v}>
        {Object.values(fixedPrice).map((item) => (
          <Option key={item.tokenId} value={item.tokenId} className={styles['select-option-wrapper']}>
            <span className="flex items-center">
              {item.icon ? <Logo className={`price-logo flex w-[24px] mr-[8px] h-[24px]`} src={ELF} /> : null}
              {item.symbol}
            </span>
          </Option>
        ))}
      </Select>
      <Input
        className={`!flex-1 !ml-[16px]`}
        onKeyDown={(e) => {
          /\d|\.|Backspace|ArrowRight|ArrowLeft|ArrowUp|ArrowDown/.test(e.key) || e.preventDefault();
        }}
        onChange={(e) => inputChange(e.target)}
        value={val}
        placeholder="Amount"
      />
      <span className={styles.tip}>Please enter a maximum of 10 digits.</span>
    </div>
  );
}
