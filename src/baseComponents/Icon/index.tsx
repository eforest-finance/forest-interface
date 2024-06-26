import Image from 'next/image';
import style from './index.module.css';
import { useRef } from 'react';
import { useMount } from 'react-use';

interface IconProps {
  fill?: string;
  className?: string;
  name?: string;
  src?: string;
  hoverColor?: string;
  defaultColor?: string;
  node?: React.FC<React.SVGProps<SVGSVGElement>>;
}

const Icon = ({ src, className, defaultColor, fill, hoverColor, node, ...rest }: IconProps) => {
  const rootRef = useRef<any>(null);
  useMount(() => {
    if (rootRef.current) {
      const rootNode = rootRef.current;
      const path = rootRef.current.querySelector('path');

      if (fill?.length) {
        path.style.fill = fill;
      } else {
        rootNode.addEventListener('mouseenter', function () {
          if (hoverColor?.length) {
            path.style.fill = hoverColor;
          }
        });
        rootNode.addEventListener('mouseleave', function () {
          if (defaultColor?.length) {
            path.style.fill = defaultColor;
          }
        });
      }
    }
  });

  const SVG = node;

  return (
    <div ref={rootRef} className={`${style.IconWrapper} cursor-pointer flex items-center`}>
      {SVG ? (
        <SVG className={`${style.Icon} ${className || ''}`} {...rest}></SVG>
      ) : (
        <Image ref={rootRef} className={`${style.Icon} ${className || ''}`} {...rest} fill src={src || ''} alt="" />
      )}
    </div>
  );
};
export default Icon;
