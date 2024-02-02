import Banner from 'pagesComponents/DropsDetail/component/Banner';
import BasicInformation from 'pagesComponents/DropsDetail/component/BasicInformation';
import DetailCard from 'pagesComponents/DropsDetail/component/DetailCard';
import EventInformation from 'pagesComponents/DropsDetail/component/EventInformation';
import DropsMint from 'pagesComponents/DropsDetail/component/DropsMint';
import CollectionInformation from 'pagesComponents/DropsDetail/component/CollectionInformation';
import useDropDetailGetState from 'store/state/dropDetailGetState';
import { useInitialization } from 'pagesComponents/DropsDetail/hooks/useInitialization';
import PageLoading from 'components/PageLoading';

export default function DropsDetailMobile() {
  const { loading } = useInitialization();
  const { dropDetailInfo, dropQuota } = useDropDetailGetState();

  return !loading ? (
    <div className="!block !pt-[40px] !pb-[16px]">
      <div className="px-[16px]">
        <Banner img={dropDetailInfo?.bannerUrl} />
      </div>

      <BasicInformation
        className="mt-[16px] px-[16px]"
        name={dropDetailInfo?.dropName}
        startTime={dropDetailInfo?.startTime}
        expireTime={dropDetailInfo?.expireTime}
        status={dropQuota?.state}
      />
      <DetailCard className="mt-[32px] !px-[16px]" />
      <EventInformation className="px-[16px]" />
      <DropsMint className="px-[16px]" />
      <CollectionInformation className="mt-[32px] px-[16px]" />
    </div>
  ) : (
    <div className="relative w-screen h-screen">
      <PageLoading />
    </div>
  );
}
