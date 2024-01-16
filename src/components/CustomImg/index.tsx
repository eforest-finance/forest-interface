import { Image, ImageProps } from 'antd';
import defaultImage from 'pagesComponents/Detail/component/BidModal/defautlmage';
export default function CustomImg(props: ImageProps) {
  return (
    <Image preview={false} alt="img" fallback={defaultImage} {...props} className={`${props.className} object-cover`} />
  );
}
