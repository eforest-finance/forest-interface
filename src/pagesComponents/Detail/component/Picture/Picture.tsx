import FileView from 'components/FileView/FileView';
import { ImageEnhance } from 'components/ImgLoading';

import { useEffect, useMemo, useRef, useState } from 'react';
import Preview from 'assets/images/icons/preview.svg';

import styles from './style.module.css';
import { useSelector } from 'react-redux';
import { selectInfo } from 'store/reducer/info';
import useDetailGetState from 'store/state/detailGetState';
import HonourLabel from 'baseComponents/HonourLabel';
import useTraits from '../DetailCard/Traits/useTraits';

export default function Picture() {
  const { isSmallScreen } = useSelector(selectInfo);
  const [visible, setVisible] = useState(false);
  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;
  const convertType = useMemo(() => {
    if (nftInfo?.fileExtension === 'mp3') return 'audio';
    if (nftInfo?.fileExtension === 'mp4') return 'video';
    return 'image';
  }, [nftInfo?.fileExtension]);

  const { noTraits } = useTraits();
  const [scrollStyle, setScrollStyle] = useState<any>();
  const defaultPosition = useRef('relative');

  useEffect(() => {
    if (nftInfo && noTraits && !isSmallScreen) {
      setScrollStyle({
        position: 'fixed',
      });
      defaultPosition.current = 'fixed';
    }
  }, [noTraits]);

  // useEffect(() => {
  //   if (noTraits) {
  //     const activityDom = document.getElementById('activity-ref');

  //     const checkVisibility = () => {
  //       ;
  //       const rect = activityDom!.getBoundingClientRect();
  //       console.log('111111111111111111:', rect.top);
  //     };

  //     ;

  //     window.addEventListener('scroll', checkVisibility);
  //     window.addEventListener('resize', checkVisibility);
  //   }
  // }, [noTraits]);

  useEffect(() => {
    const scrollFun = () => {
      const activityDom = document.getElementById('activity-ref');
      if (activityDom) {
        const top = activityDom!.getBoundingClientRect().top;
        console.log('----------rect', top);

        if (noTraits) {
          if (top < 743) {
            setScrollStyle({
              position: 'absolute',
              top: 618,
            });
          } else {
            setScrollStyle({
              position: defaultPosition.current,
            });
          }
        }

        // setHeaderTheme(isWhite);
      }
    };

    if (!isSmallScreen) {
      window.addEventListener('scroll', scrollFun, true);
    }

    return () => {
      window.removeEventListener('scroll', scrollFun);
    };
  }, [noTraits]);

  return (
    <>
      <div
        className={`${styles['detail-cover']} ${isSmallScreen && styles['mobile-detail-cover']}`}
        style={scrollStyle}
        // style={{ position: 'absolute' }}
        onClick={() => isSmallScreen && setVisible(true)}>
        <ImageEnhance
          width={'100%'}
          height={'100%'}
          className=" w-full h-full aspect-square rounded-2xl object-contain"
          src={nftInfo?.previewImage || ''}
        />
        {nftInfo?.file &&
          (!isSmallScreen ? (
            <div className={`${styles.mask} flex items-center justify-center`} onClick={() => setVisible(true)}>
              <Preview />
            </div>
          ) : null)}
        {nftInfo?.describe ? (
          <div className="absolute top-3 right-3">
            <HonourLabel text={nftInfo?.describe} />
          </div>
        ) : null}
      </div>
      <FileView
        visible={visible}
        type={convertType}
        src={nftInfo?.file || nftInfo?.previewImage || ''}
        onClose={() => setVisible(false)}
      />
    </>
  );
}
