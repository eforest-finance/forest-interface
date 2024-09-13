import TankYou from 'assets/images/v2/thank_you.png';
import Hello from 'assets/images/v2/hello.png';
import Congratulations from 'assets/images/v2/congratulation.png';
import Image from 'next/image';
import Button from 'baseComponents/Button';
import useGetState from 'store/state/getState';
import { useRouter } from 'next/navigation';

const End = ({ collectionId }: { collectionId: string }) => {
  const navigator = useRouter();

  return (
    <div className="pt-[180px] w-full flex flex-col justify-center items-center">
      <Image className="z-10" src={TankYou} alt="" width={160} height={146} />
      <div className="w-[343px] text-center z-10 mt-[32px] text-textPrimary text-[20px] font-semibold">
        Thank you for your attention, the event has ended.
      </div>
      <Button
        className="mt-[32px] w-[180px] h-[44px]"
        type="primary"
        onClick={() => {
          navigator.push(`/explore-items/${collectionId}`);
        }}>
        View Collection
      </Button>
    </div>
  );
};

const NotStart = () => {
  return (
    <div className="pt-[180px]  w-full flex flex-col justify-center items-center">
      <Image className="z-10" src={Hello} alt="" width={160} height={146} />
      <div className="w-[343px] text-center z-10 mt-[32px] text-textPrimary text-[20px] font-semibold">
        Event not started
      </div>
    </div>
  );
};

const Created = ({ collectionId }: { collectionId: string }) => {
  const navigator = useRouter();

  return (
    <div className="w-full flex flex-col pt-[180px] items-center">
      <Image className="z-10" src={Congratulations} alt="" width={160} height={146} />
      <div className="w-[343px] text-center z-10 mt-[32px] text-textPrimary text-[20px] font-semibold">
        You have already created
      </div>
      <Button
        className="mt-[32px] w-[180px] h-[44px]"
        type="primary"
        onClick={() => {
          navigator.push(`/explore-items/${collectionId}`);
        }}>
        View Collection
      </Button>
    </div>
  );
};

export { Created, End, NotStart };
