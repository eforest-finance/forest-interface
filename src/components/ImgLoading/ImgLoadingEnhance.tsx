import { ImgHTMLAttributes, ReactEventHandler, useCallback, useMemo, useState } from 'react';
import useGetState from 'store/state/getState';
import { ipfsURLToS3AndIpfsURL } from 'utils/reg';
export function ImageEnhance({
  src = '',
  alt,
  onError,
  ...props
}: {
  src?: string;
} & ImgHTMLAttributes<HTMLImageElement>) {
  const [srcIndex, setSrcIndex] = useState<number>(0);
  const { aelfInfo } = useGetState();
  const srcs = useMemo(
    () => ipfsURLToS3AndIpfsURL(src, aelfInfo.ipfsToS3ImageURL, aelfInfo.ipfsToSchrodingerURL),
    [src, aelfInfo.ipfsToS3ImageURL],
  );
  const imageUrl = useMemo(() => srcs[srcIndex], [srcIndex, srcs]);
  const nextSrc: ReactEventHandler<HTMLImageElement> = useCallback(
    (e) => {
      const _index = srcIndex + 1;
      if (!srcs[_index]) {
        onError?.(e);
        return;
      }
      setSrcIndex(_index);
    },
    [srcIndex, srcs, onError],
  );
  return <img {...props} src={imageUrl} alt={alt} onError={nextSrc} />;
}
