import { Card, message, Avatar } from 'antd';
import { Creator } from 'pagesComponents/Collections/Hooks/useCollections';
import { useRouter } from 'next/navigation';
import { useCopyToClipboard } from 'react-use';
import { useSelector } from 'store/store';
import ImageLoading from 'components/ImgLoading';

import CollectionBadge from 'assets/images/collectionBadge.svg';
import Email from 'assets/images/icons/email.svg';
import Instagram from 'assets/images/icons/instagram.svg';
import Twitter from 'assets/images/icons/twitter.svg';
import { COLLECTION_DEFAULT_IMG } from 'constants/FileConfig';

import styles from './collectionCard.module.css';
import { Item } from 'pagesComponents/Collections/Hooks/useCollections';

export type CollectionType = {
  options: Item;
};

const TitlePanel = ({ tokenName, hasBadge, creator }: { tokenName: string; hasBadge?: boolean; creator: Creator }) => {
  const router = useRouter();
  return (
    <div>
      <p className={styles['protocol-title']}>
        {tokenName}
        {hasBadge && (
          <span className={styles['badge']}>
            <CollectionBadge />
          </span>
        )}
      </p>
      <p className={styles['protocol-creator']}>
        by
        <span className={styles['creator']}>{creator.name}</span>
      </p>
    </div>
  );
};

const { Meta } = Card;

export default function CollectionCard(data: CollectionType) {
  const {
    info: { isSmallScreen },
  } = useSelector((store) => store);
  const [, setCopied] = useCopyToClipboard();
  const navigate = useRouter();

  const {
    logoImage,
    featuredImage,
    tokenName,
    isOfficial,
    creator,
    description,
    id,
    metadata = [],
  } = data?.options || {};

  const renderDescription = description ?? ' ';

  const onClick = () => navigate.push(`/explore-items/${id}`);

  const metaLogoImage = metadata?.find?.((meta: { key: string; value: string }) => meta.key === '__nft_image_url');
  const metaFeatureImage = metadata?.find?.(
    (meta: { key: string; value: string }) => meta.key === '__nft_featured_url',
  );

  if (!data?.options) {
    return null;
  }
  return (
    <>
      <div
        className={`${styles['protocol-card']} ${isSmallScreen ? styles['mobile-protocol-card'] : ''}`}
        onClick={onClick}>
        <Card
          className={styles['card']}
          cover={
            <div className={styles['card-cover']}>
              <ImageLoading
                className="w-[414px] !h-[208px]"
                nextImageProps={{ width: 200, height: 200 }}
                src={`${featuredImage || metaFeatureImage?.value || COLLECTION_DEFAULT_IMG}`}
              />
            </div>
          }>
          <Meta
            className={styles['card-meta']}
            avatar={
              logoImage || metaLogoImage?.value ? (
                <ImageLoading src={logoImage || metaLogoImage?.value || ''} className="!rounded-full" />
              ) : (
                <Avatar className="!w-full !h-full" />
              )
            }
            title={<TitlePanel tokenName={tokenName || ''} hasBadge={!!isOfficial} creator={creator} />}
            description={
              <>
                <div className={`${styles['card-description']}`}>{renderDescription}</div>
                <div className={styles['connect-info']}>
                  {!!creator?.email && (
                    <span
                      onClick={(e: any) => {
                        e.stopPropagation();
                        setCopied(creator?.email || '');
                        message.success('Copied');
                      }}>
                      <Email />
                    </span>
                  )}
                  {!!creator?.twitter &&
                    (isSmallScreen ? (
                      <a
                        onClick={(e) => {
                          e.stopPropagation();
                          setCopied(
                            creator?.twitter.includes('http') ? creator?.twitter : `https://${creator?.twitter}`,
                          );
                          message.success('Copied');
                        }}>
                        <Twitter />
                      </a>
                    ) : (
                      <a
                        href={creator?.twitter.includes('http') ? creator?.twitter : `https://${creator?.twitter}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}>
                        <Twitter />
                      </a>
                    ))}
                  {!!creator?.instagram &&
                    (isSmallScreen ? (
                      <a
                        onClick={(e) => {
                          e.stopPropagation();
                          setCopied(
                            creator?.instagram.includes('http') ? creator?.instagram : `https://${creator?.instagram}`,
                          );
                          message.success('Copied');
                        }}>
                        <Instagram />
                      </a>
                    ) : (
                      <a
                        href={
                          creator?.instagram.includes('http') ? creator?.instagram : `https://${creator?.instagram}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}>
                        <Instagram />
                      </a>
                    ))}
                </div>
              </>
            }
          />
        </Card>
      </div>
    </>
  );
}
