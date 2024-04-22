import { FilterButton } from '../components/FilterButton';
import Input from 'baseComponents/Input';
import ClockCircleOutlined from 'assets/images/explore/search-icon.svg';
import Clear from 'assets/images/explore/Clear.svg';
import { Select, Option } from 'baseComponents/Select';
import clsx from 'clsx';
import useResponsive from 'hooks/useResponsive';

interface ISearchBoxProps {
  collapsed: boolean;
  toggleCollapse: () => void;
  onSearch: () => void;
}

const activitySelectItems = [
  { label: 'Issue', value: 'Issue' },
  { label: 'Burn', value: 'Burn' },
  { label: 'Transfer', value: 'Transfer' },
  { label: 'Sale', value: 'Sale' },
  { label: 'Listing', value: 'Listing' },
  { label: 'Delist', value: 'Delist' },
  { label: 'Make Offer', value: 'Make Offer' },
  { label: 'Cancel Offer', value: 'Cancel Offer' },
];

export function CollapsedControlAndSearchBox({ toggleCollapse, onSearch, collapsed }: ISearchBoxProps) {
  const { isLG } = useResponsive();
  return (
    <>
      <div className="flex items-center pt-8 pb-4">
        <div className={clsx('flex', !collapsed && !isLG ? '!w-[360px]' : 'w-auto')}>
          <FilterButton onClick={toggleCollapse} />
        </div>
        <Input
          className={clsx('flex-1', isLG ? 'ml-2' : 'ml-8')}
          onChange={onSearch}
          onPressEnter={onSearch}
          placeholder="Search by name or symbol"
          prefix={<ClockCircleOutlined />}
          allowClear={{ clearIcon: <Clear /> }}></Input>
        {!isLG ? <Select className=" !ml-8 !w-52" options={activitySelectItems} /> : null}
      </div>
      {isLG ? <Select className="w-full !mb-4" options={activitySelectItems} /> : null}
    </>
  );
}
