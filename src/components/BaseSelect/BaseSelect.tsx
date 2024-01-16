import { SingleItemType } from 'components/ItemsLayout/types';
import { useSelector } from 'store/store';
import { Select, Option, SelectProps } from 'baseComponents/Select';
interface BaseSelectProps {
  dataSource: SingleItemType;
}
export default function BaseSelect({ dataSource, onChange, defaultValue }: SelectProps & BaseSelectProps) {
  const {
    info: { isSmallScreen },
  } = useSelector((store) => store);
  return (
    <Select
      className={`${isSmallScreen ? '!w-[343px]' : '!w-[260px]'}`}
      getPopupContainer={(v) => v}
      value={defaultValue?.data?.[0]?.value ?? dataSource?.data?.[0]}
      onChange={onChange}>
      {dataSource?.data?.map((item) => (
        <Option key={item.value} value={item.value}>
          {item.label}
        </Option>
      ))}
    </Select>
  );
}
