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
      <div className="mt-2 text-xs flex justify-between">
        <span className="text-error">{status !== 'error' ? '' : 'Please enter a correct quantity.'}</span>
        <span className="text-textSecondary">{thousandsNumber(maxNumber)} available</span>
      </div>
    );
  };
  return (
    <div className={`${isSmallScreen ? 'mt-6' : 'mt-8'}`}>
      <span className="font-medium text-textPrimary text-lg rounded-lg">Quantity of Items</span>
      <Input
        size="large"
        className="mt-4"
        allowClear={true}
        value={formatTokenPrice(value || '')}
        status={status}
        onKeyDown={(e) => {
          /\d|\.|Backspace|ArrowRight|ArrowLeft|ArrowUp|ArrowDown/.test(e.key) || e.preventDefault();
        }}
        onChange={inputChangeHandler}
        placeholder="Enter the quantity of items to list"
      />
      {renderError()}
    </div>
  );
}
