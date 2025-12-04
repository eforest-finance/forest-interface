/* eslint-disable no-inline-styles/no-inline-styles */
import { InputNumber } from 'antd';
import Minus from 'assets/images/v2/minus.svg';
import Add from 'assets/images/v2/add.svg';
import styles from './style.module.css';

interface InputQuantityProps {
  max: number;
  quantity: number;
  width?: number | string;
  onChange: (quantity: number) => void;
}

export default function InputQuantity(props: InputQuantityProps) {
  const { onChange, quantity, max, width } = props;
  const handleInputChange = (input: number | null) => {
    if (input) {
      onChange(input);
    }
  };

  const handleMinus = () => {
    onChange(quantity - 1);
  };
  const handleAdd = () => {
    if (quantity >= max) {
      return;
    }
    onChange(quantity + 1);
  };

  console.log('quantity:', quantity);

  return (
    <div className={styles.wrapper}>
      <div
        className={`flex justify-center items-center text-[16px] font-semibold w-[${
          width || '240px'
        }] h-[56px] border-solid border-lineBorder border rounded-lg`}>
        <Minus
          className={`!w-[24px] h-[24px] ml-[12px] cursor-pointer ${quantity <= 1 ? styles.iconDisable : ''}`}
          onClick={handleMinus}
        />
        <InputNumber
          max={max}
          min={0}
          className="text-[18px] mdl:text-[16px]"
          style={{ height: 'auto', fontSize: '16px', fontWeight: 600, textAlign: 'center' }}
          controls={false}
          value={quantity}
          bordered={false}
          formatter={(value) => Math.floor(value || 0)}
          onChange={handleInputChange}
        />
        <Add
          className={`!w-[24px] h-[24px] mr-[12px]  cursor-pointer ${quantity >= max ? styles.iconDisable : ''}`}
          onClick={handleAdd}
        />
      </div>
    </div>
  );
}
