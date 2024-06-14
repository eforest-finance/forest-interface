import { useRouter } from 'next/navigation';
import BackIcon from 'assets/images/icons/back.svg';

export function PageTitle({ title, extra = null }: { title: string; extra?: React.ReactNode }) {
  const router = useRouter();

  const onBackHandler = () => {
    router.back();
  };

  return (
    <h1 className={`flex text-2xl mdl:text-5xl pt-10 mdTW:pt-12 pb-6 mdTW:pb-10 text-textPrimary !mb-0`}>
      <div className="flex flex-1 gap-4 font-semibold ">
        <span
          className="inline-flex items-center justify-center w-8 h-8 mdl:w-12 mdl:h-12 rounded-full bg-fillHoverBg cursor-pointer"
          onClick={onBackHandler}>
          <BackIcon className=" fill-textPrimary" />
        </span>
        {title}
      </div>
      {extra}
    </h1>
  );
}
