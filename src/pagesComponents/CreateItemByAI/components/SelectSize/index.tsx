import { Radio } from 'antd5/';
import SizeSquarePng from 'assets/images/nftAi/size_square.png';

import clsx from 'clsx';
import { ImageEnhance } from 'components/ImgLoading';

const sizeListArr = [
  {
    value: '256x256',
    label: '256x256',
    icon: SizeSquarePng,
  },
  {
    value: '512x512',
    label: '512x512',
    icon: SizeSquarePng,
  },
  {
    value: '1024x1024',
    label: '1024x1024',
    icon: SizeSquarePng,
  },
];

export function SelectSize(props: any) {
  return (
    <Radio.Group value={props.value}>
      <div className=" grid  grid-cols-3 gap-x-5 mdl:gap-x-12 gap-y-4 ">
        {sizeListArr.map((item) => {
          return (
            <div
              key={item.value}
              className="inline-flex flex-col gap-y-2 items-center justify-center cursor-pointer"
              onClick={() => {
                props.onChange?.(item.value);
              }}>
              <ImageEnhance
                src={item.icon.src}
                wrapperClassName={clsx(
                  '!rounded-lg overflow-hidden box-border max-w-44 !h-0 !opacity-0',
                  props.value === item.value && ' border-2 border-solid border-brandNormal',
                )}
                className={' max-w-44 max-h-44 '}
              />
              <Radio value={item.value} className="mt-2" />
              <span className=" text-base font-medium text-textPrimary">{item.label}</span>
            </div>
          );
        })}
      </div>
    </Radio.Group>
  );
}
