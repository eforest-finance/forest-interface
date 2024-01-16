import { memo } from 'react';
import defaultLogo from 'assets/images/defaultLogo.png';
import Image, { StaticImageData } from 'next/image';
const fallback = defaultLogo;
type LogoPropType = {
  src: string | StaticImageData;
  className?: string;
};

export type LogoProps = LogoPropType;

const Logo = (props: LogoPropType) => {
  const { className = '', src } = props;
  return <Image className={className} src={!src ? fallback : src} alt="logo" />;
};

export default memo(Logo);
