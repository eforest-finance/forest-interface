import clsx from 'clsx';
import { TagItemType } from '../type';
import CloseBtn from 'assets/images/explore/tag-close.svg';
import { OmittedType, getOmittedStr } from 'utils';

interface IFilterTagListProps {
  tagList: TagItemType[];
}
interface IFitlerTagProps {
  data: TagItemType;
  onClose?: (data: TagItemType) => void;
}

function FilterTag({ data, onClose }: IFitlerTagProps) {
  const showLabel =
    data.type === 'search'
      ? getOmittedStr(data.label, OmittedType.CUSTOM, {
          prevLen: 7,
          endLen: 6,
          limitLen: 13,
        })
      : data.label;

  return (
    <div className=" flex items-center p-3 bg-fillHoverBg rounded-lg mr-2 mb-2">
      <span className=" text-base font-medium text-textPrimary">{showLabel}</span>
      <CloseBtn
        className={clsx(data.disabled ? 'cursor-not-allowed' : 'cursor-pointer', 'ml-4')}
        onClick={() => {
          onClose?.(data);
        }}
        width={16}
        height={16}
      />
    </div>
  );
}

export function FilterTagList({ tagList }: IFilterTagListProps) {
  if (!tagList?.length) return null;

  return (
    <div className=" flex items-center flex-wrap flex-1">
      {tagList.map((tagData) => (
        <FilterTag
          key={tagData.label}
          data={tagData}
          onClose={(tag) => {
            console.log('tag', tag);
          }}
        />
      ))}
      <div className="p-3 cursor-pointer text-base font-medium text-textPrimary hover:text-brandHover ">Clear All</div>
    </div>
  );
}
