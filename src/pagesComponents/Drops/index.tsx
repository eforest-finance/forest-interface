import { useRequest } from 'ahooks';
import { ActivitySwiper } from './ActivitySwiper';
import { EventList } from './EventList';
import { fetchRecommendAction } from 'api/eventApi';

export default function DropsPage() {
  const { data } = useRequest(fetchRecommendAction);
  return (
    <div className="max-w-[1280px] mx-auto pt-10 sml:pt-20 px-5">
      <ActivitySwiper swiperData={data || []} />
      <EventList />
    </div>
  );
}
