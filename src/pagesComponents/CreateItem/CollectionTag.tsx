import { Image, Skeleton } from 'antd5/';

interface IProps {
  src?: string;
  collectionName?: string;
  id?: string;
}

export default (props: IProps) => {
  const {
    collectionName = 'Elephant',
    id = '90908',
    src = 'https://schrodinger-testnet.s3.amazonaws.com/watermarkimage/QmaT8NNadFqh3kioM54ZQZx7CkiEBZYc5uGNbZh836HNEz',
  } = props;
  const placeholder = <Skeleton.Image active={true} className={'!w-full !h-full'}></Skeleton.Image>;

  return (
    <div
      className=" w-[343px] h-[343px] mdl:w-[480px] mdl:h-[126px] px-[30px] py-[24px]  border-[1px] border-t-0  border-dashed	border-[var(--line-border)] rounded-[15.6px] rounded-t-none
 ">
      <div className="flex items-center mb-[8px]">
        <Image
          wrapperClassName="w-[32px] h-[32px] rounded-[6px] overflow-hidden"
          className="object-contain"
          preview={false}
          placeholder={placeholder}
          src={src}
        />
        <span className="ml-[8px] text-[16px] font-medium text-[var(--text-secondary)]">Collection Name</span>
      </div>
      <div className="text-[18px] font-medium">
        <span>{collectionName}</span>
        <span className="pl-[8px]">{id ? `#${id}` : ''}</span>
      </div>
    </div>
  );
};
