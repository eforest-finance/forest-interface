import { Radio } from 'antd5/';

export function SelectStandard(props: any) {
  const sizeListArr = [
    {
      value: 'standard',
      label: 'Standard',
    },
    {
      value: 'hd',
      label: 'HD',
    },
  ];

  return (
    <Radio.Group value={props.value}>
      <div className=" px-6 grid grid-cols-4 gap-x-12 gap-y-4 ">
        {sizeListArr.map((item) => {
          return (
            <div
              key={item.value}
              className="inline-flex flex-col gap-y-2 items-center justify-center cursor-pointer"
              onClick={() => {
                props.onChange?.(item.value);
              }}>
              <Radio value={item.value} />
              <span className=" text-base font-medium text-textPrimary">{item.label}</span>
            </div>
          );
        })}
      </div>
    </Radio.Group>
  );
}
