import { useState } from 'react';

export interface ISetSellItemNumberProps {
  onChange?: (value: number | string) => void;
  maxNumber?: number;
}

export function useSellItemNumber({ onChange, maxNumber }: ISetSellItemNumberProps) {
  const [value, setValue] = useState<number | string | undefined>();
  const [status, setStatus] = useState<'' | 'error'>();

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('inputChange', event.target.value);
    const { target } = event;

    let deFormateValue = String(target.value || '').replaceAll(',', '');
    deFormateValue = deFormateValue.replaceAll('.', '').slice(0, 6);
    onChange && onChange(deFormateValue);
    setValue(deFormateValue);
    checkStatus(deFormateValue);
  };

  const checkStatus = (inputValue: string | number) => {
    const status = !Number(inputValue) ? 'error' : Number(inputValue) > Number(maxNumber) ? 'error' : '';
    console.log('inputChange status', value);
    setStatus(status);
  };

  return {
    maxNumber,
    inputChangeHandler,
    value,
    status,
  };
}
