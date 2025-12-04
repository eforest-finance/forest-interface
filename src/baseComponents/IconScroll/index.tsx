import scroll from 'assets/images/scroll.svg';
import Image from 'next/image';
import { memo } from 'react';
const IconScroll = memo(() => {
  return (
    <div className="relative mt-[151px] w-7 h-[59px] hidden pcMin:inline-block animate-bounce z-10">
      <Image className="object-contain" fill src={scroll} alt="" />
    </div>
  );
});

export default IconScroll;
