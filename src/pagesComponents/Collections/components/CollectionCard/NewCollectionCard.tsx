import { Card } from 'antd';
import { useRouter } from 'next/navigation';
import ImageLoading from 'components/ImgLoading';

import CollectionBadge from 'assets/images/collectionBadge.svg';
import { COLLECTION_DEFAULT_IMG } from 'constants/FileConfig';

import styles from './newCollectionCard.module.css';
import { Item } from 'pagesComponents/Collections/Hooks/useCollections';
import { useSelector } from 'store/store';

export type CollectionType = {
  options: Item;
};

const TitlePanel = ({ tokenName, hasBadge }: { tokenName: string; hasBadge?: boolean }) => {
  return (
    <div className={styles['protocol-title']}>
      <p className="flex items-center">
        <span className="truncate">{tokenName}</span>
        {hasBadge && (
          <span className={styles['badge']}>
            <CollectionBadge />
          </span>
        )}
      </p>
    </div>
  );
};

export default function CollectionCardNew(data: CollectionType) {
  const navigate = useRouter();

  const {
    info: { isSmallScreen },
  } = useSelector((store) => store);

  const { id, metadata = [], tokenName, isOfficial } = data?.options || {};

  const onClick = () => navigate.push(`/explore-items/${id}`);

  const metaLogoImage = metadata?.find?.((meta: { key: string; value: string }) => meta.key === '__nft_image_url');

  if (!data?.options) {
    return null;
  }
  return (
    <>
      <div onClick={onClick} className="relative">
        <Card
          className={`${isSmallScreen ? styles['protocol-card-m'] : styles['protocol-card']}`}
          cover={
            <div>
              <ImageLoading
                nextImageProps={{ width: 500, height: 500 }}
                src={`${metaLogoImage?.value || COLLECTION_DEFAULT_IMG}`}
              />
            </div>
          }></Card>
        <TitlePanel tokenName={tokenName || ''} hasBadge={!!isOfficial} />
      </div>
    </>
  );
}
