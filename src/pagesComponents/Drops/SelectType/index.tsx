import clsx from 'clsx';
import st from './style.module.css';
import useResponsive from 'hooks/useResponsive';
import { Drawer } from 'antd';
import ArrowDown from 'assets/images/events/arrow-down.svg';
import { useState } from 'react';

const TypeList = [
  {
    label: 'All',
    value: 0,
  },
  {
    label: 'Live',
    value: 1,
  },
  {
    label: 'Upcoming',
    value: 2,
  },
  {
    label: 'Ended',
    value: 3,
  },
];

interface ISelectTypeProps {
  value?: number;
  onSelect?: (value: number) => void;
}

export function SelectType({ value, onSelect }: ISelectTypeProps) {
  const { isXS } = useResponsive();

  const [isShowSelectDropdown, setIsShowSelectDropdown] = useState<boolean>(false);
  // const [] = ;

  const handleSelect = (value: number) => {
    onSelect && onSelect(value);
    setIsShowSelectDropdown(false);
  };

  const renderItems = () => {
    return TypeList.map((item) => {
      return (
        <span
          key={item.value}
          className={clsx(st['item'], value === item.value ? st['active'] : '')}
          onClick={() => handleSelect(item.value)}>
          {item.label}
        </span>
      );
    });
  };

  const label = TypeList.find((item) => item.value === value)?.label;

  if (isXS) {
    return (
      <>
        <div className={st['select-type-mobile']} onClick={() => setIsShowSelectDropdown(true)}>
          <span className="text-textPrimary text-base font-semibold mr-2">{label}</span>
          <ArrowDown />
        </div>

        <Drawer
          closable={false}
          destroyOnClose
          placement="bottom"
          height={'auto'}
          open={isShowSelectDropdown}
          className={st['select-drawer']}
          onClose={() => setIsShowSelectDropdown(false)}>
          <div className={st['select-list-mobile']}>{renderItems()}</div>
        </Drawer>
      </>
    );
  }

  return <div className={st['select-type']}>{renderItems()}</div>;
}
