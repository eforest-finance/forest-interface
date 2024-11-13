import Bling from 'assets/images/miniApp/home/bling.svg';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useStatus } from '../../Drops/hooks/useGetStatus';

const ActivityCard = (props: { list: any; index: any; activeList: any }) => {
  const { list, index, activeList } = props;
  const router = useRouter();

  const status = useStatus(list);

  return (
    <>
      {(status == 1 || status == 2) && (
        <div
          className={`flex items-center justify-center relative pointer-events-auto  ${
            activeList.length == 3 && index == 1 && 'mt-[120px]'
          }`}
          onClick={() => router.push(`mini-app/drops/detail/${list.id}`)}>
          <Image src={list.rewardLogo} width={32} height={32} alt={''} />
          <Bling className="animate-pulse absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      )}
    </>
  );
};

export default ActivityCard;
