import { Image, Skeleton } from 'antd5/';

interface IProps {
  src?: string;
  nftName?: string;
  collectionName?: string;
  id?: string;
}

export default (props: IProps) => {
  const { collectionName, id, src, nftName } = props;
  const placeholder = <Skeleton.Image active={true} className={'!w-full !h-full'}></Skeleton.Image>;

  return (
    <div
      className=" w-[343px] mdl:w-[480px] h-[126px] px-[30px] py-[24px]  border-[1px] border-t-0  border-dashed	border-[var(--line-border)] rounded-[15.6px] rounded-t-none
 ">
      <div className="flex items-center mb-[8px]">
        <Image
          wrapperClassName="w-[32px] h-[32px] rounded-[6px] overflow-hidden flex items-center"
          className="object-contain"
          preview={false}
          placeholder={placeholder}
          src={src}
        />
        <span className="ml-[8px] text-[16px] font-medium text-[var(--text-secondary)]">{collectionName}</span>
      </div>
      <div className="text-[18px] font-medium">
        <span>{nftName}</span>
        <span className="pl-[8px]">{id ? `#${id}` : ''}</span>
      </div>
    </div>
  );
};
