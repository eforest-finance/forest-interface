import Banner from 'pagesComponents/DropsDetail/component/Banner';
import BasicInformation from 'pagesComponents/DropsDetail/component/BasicInformation';
import DetailCard from 'pagesComponents/DropsDetail/component/DetailCard';
import EventInformation from 'pagesComponents/DropsDetail/component/EventInformation';
import DropsMint from 'pagesComponents/DropsDetail/component/DropsMint';
import CollectionInformation from 'pagesComponents/DropsDetail/component/CollectionInformation';
import { Col, Row } from 'antd';
import useDropDetailGetState from 'store/state/dropDetailGetState';
import { useInitialization } from 'pagesComponents/DropsDetail/hooks/useInitialization';
import PageLoading from 'components/PageLoading';

export default function DropsDetailPc() {
  useInitialization();
  const { dropDetailInfo, dropQuota } = useDropDetailGetState();
  console.log('=====dropDetailInfo', dropDetailInfo);
  return dropDetailInfo ? (
    <div className="pt-[80px] px-[40px] pb-[20px] mx-auto max-w-[1360px] min-h-screen">
      <Banner img={dropDetailInfo.bannerUrl} />
      <BasicInformation
        className="mt-[32px]"
        name={dropDetailInfo.dropName}
        startTime={dropDetailInfo.startTime}
        expireTime={dropDetailInfo.expireTime}
        status={dropQuota?.state}
      />
      <Row className="my-[80px] flex">
        <Col span={15} className="flex-1">
          <div className="h-full">
            <DetailCard />
          </div>
        </Col>
        <Col span={9} className="min-w-[422px]">
          <div className="h-full pl-[61.5px]">
            <EventInformation />
            <DropsMint />
            <CollectionInformation className="mt-[80px]" />
          </div>
        </Col>
      </Row>
    </div>
  ) : (
    <div className="relative w-screen h-screen">
      <PageLoading />
    </div>
  );
}
