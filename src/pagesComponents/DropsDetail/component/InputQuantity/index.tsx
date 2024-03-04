import Input from 'baseComponents/Input';
import { InputProps } from 'baseComponents/Input/Input';
import { ReactNode } from 'react';
import { formatTokenPrice } from 'utils/format';

export default function InputQuantity(
  props: InputProps & { maxQuantity: number | string; errorTip?: string | ReactNode },
) {
  const { maxQuantity, errorTip } = props;

  return (
    <div>
      <div className="mt-[16px] text-lg text-textPrimary font-medium">Quantity of Items</div>
      <div className="mt-[16px] relative">
        <Input
          onKeyDown={(e) => {
            /\d|\.|Backspace|ArrowRight|ArrowLeft|ArrowUp|ArrowDown/.test(e.key) || e.preventDefault();
          }}
          placeholder="Enter the quantity of items to mint"
          size="large"
          {...props}
          status={errorTip ? 'error' : ''}
        />
      </div>
      <div className="flex justify-between items-center mt-[8px] text-xs font-normal">
        <span className="text-functionalDanger">{errorTip}</span>
        <span className="text-textDisable">Max: {formatTokenPrice(maxQuantity)}</span>
      </div>
    </div>
  );
}
