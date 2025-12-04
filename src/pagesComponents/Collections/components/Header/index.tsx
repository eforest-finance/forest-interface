import { useRecommendedCollections } from 'pagesComponents/Collections/Hooks/useRecommendedCollections';
import styles from './styles.module.css';
import CollectionsSwiper from 'components/CollectionsSwiper';
export default function HeaderCarousel() {
  const { data } = useRecommendedCollections();
  return (
    <div className={styles['header-carousel']}>
      <CollectionsSwiper swiperData={data} />
    </div>
  );
}
