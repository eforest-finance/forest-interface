import { Select, Option, SelectProps } from 'baseComponents/Select';
import useGetState from 'store/state/getState';
import ELFSVG from 'assets/images/elf.svg';

export function ChainSelect(props: SelectProps) {
  const { supportChains = [] } = useGetState();

  return (
    <Select {...props}>
      {supportChains.map((item) => {
        return (
          <Option key={item} value={item}>
            <div className="flex items-center">
              <ELFSVG width="24" height="24" className=" w-6 h-6 mr-2" />
              <span className=" text-textPrimary">{item}</span>
            </div>
          </Option>
        );
      })}
    </Select>
  );
}
