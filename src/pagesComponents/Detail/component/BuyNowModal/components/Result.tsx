import { Divider } from 'antd';
import Button from 'baseComponents/Button';
import { Text, TotalPrice, BalanceText } from 'pagesComponents/Detail/component/BuyNowModal/components/Text';
import Jump from 'assets/images/detail/jump.svg';
import { useRouter } from 'next/navigation';

const Success = ({ subTotal, gas, elf, usd }) => {
  return (
    <>
      <div className="w-full mt-[32px]">
        <Text title="Subtotal" value={`${subTotal}`} />
        <Text className={'mt-[12px] mdTW:mt-[16px]'} title="Gas fees" value={`${gas}`} />
        <Divider className="my-[12px] mdTW:my-[16px]" />
        <TotalPrice className="mt-[16px]" title="Total" elf={`${elf} ELF`} usd={`${usd}`} />
      </div>
    </>
  );
};

const SuccessFooter = ({
  href,
  profile,
  text = 'View Purchase',
  modal,
}: {
  href: string;
  profile: string;
  text?: string;
  modal: any;
}) => {
  const nav = useRouter();
  return (
    <div className="mt-[24px] mdTW:mt-[32px] w-full mdTW:w-fit">
      <Button
        type="primary"
        className="w-full mdTW:w-[256px] !h-[56px]"
        onClick={() => {
          nav.push(profile);
          modal.hide();
        }}>
        {text}
      </Button>
      <div>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="flex justify-center items-center text-textSecondary mt-4 text-[14px] mdTW:text-[16px]">
          View on aelf Explorer <Jump className="fill-textSecondary w-4 h-4 ml-2" />
        </a>
      </div>
    </div>
  );
};

const FailBody = () => {
  return (
    <div className="mt-[32px] flex">
      <span className="text-center text-[16px]  text-textSecondary ">
        Purchase failure could be due to network issues, transaction fee increases, or someone else acquiring the item
        before you
      </span>
    </div>
  );
};

const PartialBody = ({ count }) => {
  return (
    <div className="mt-[24px] mdTW:mt-[32px] flex flex-col">
      <div className="mb-[24px] mdTW:mb-[32px] text-center text-[20px] font-semibold">
        {count} items purchased failed
      </div>
      <span className="text-center text-[16px]  text-textSecondary ">
        Purchase failure could be due to network issues, transaction fee increases, or someone else acquiring the item
        before you
      </span>
    </div>
  );
};

export { Success, SuccessFooter, FailBody, PartialBody };
