import Input from 'baseComponents/Input';
import { useSellItemNumber, ISetSellItemNumberProps } from '../hooks/useSellItemNumber';
import { formatTokenPrice } from 'utils/format';
import useGetState from 'store/state/getState';
import { thousandsNumber } from 'utils/unitConverter';

export function SetSellItemNumber(props: ISetSellItemNumberProps) {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const { maxNumber, inputChangeHandler, value, status } = useSellItemNumber(props);
  const renderError = () => {
    return (
      <div className="mt-2 text-xs">
        <span className="text-error">{status !== 'error' ? '' : 'Please enter a correct quantity.'}</span>
      </div>
    );
  };
  return (
    <div className={`${isSmallScreen ? 'mt-6' : 'mt-8'}`}>
      <span className="font-medium text-textPrimary text-lg rounded-lg">Quantity of Items</span>
      <div className="mt-4 relative">
        <Input
          size="large"
          allowClear={true}
          value={formatTokenPrice(value || '')}
          status={status}
          onKeyDown={(e) => {
            /\d|\.|Backspace|ArrowRight|ArrowLeft|ArrowUp|ArrowDown/.test(e.key) || e.preventDefault();
          }}
          onChange={inputChangeHandler}
          placeholder="Enter the quantity of items to list"
        />
        <span className="text-textSecondary text-xs absolute right-0 top-[-28px]">
          {thousandsNumber(maxNumber)} available
        </span>
      </div>
      {renderError()}
    </div>
  );
}
