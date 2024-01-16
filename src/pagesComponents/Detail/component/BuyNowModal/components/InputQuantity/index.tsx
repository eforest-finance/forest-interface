import Input from 'baseComponents/Input';
import { InputProps } from 'baseComponents/Input/Input';
import FormItem from 'components/FormItem';
import { formatTokenPrice } from 'utils/format';

export default function InputQuantity(props: InputProps & { availableMount: number | string; errorTip?: string }) {
  const { availableMount, errorTip } = props;

  return (
    <FormItem title="Quantity" error={{ msg: errorTip || '' }}>
      <div className="mt-[16px] relative">
        <Input
          onKeyDown={(e) => {
            /\d|\.|Backspace|ArrowRight|ArrowLeft|ArrowUp|ArrowDown/.test(e.key) || e.preventDefault();
          }}
          placeholder="Please enter the quantity"
          size="large"
          {...props}
          status={errorTip && 'error'}
        />
        <span className="leading-[20px] font-normal text-[var(--text-disable)] absolute right-0 bottom-[-28px]">
          {formatTokenPrice(availableMount)} available
        </span>
      </div>
    </FormItem>
  );
}
