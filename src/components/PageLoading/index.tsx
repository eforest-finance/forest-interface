import Loading from 'assets/images/loading.png';
import Image from 'next/image';

export default function PageLoading() {
  return (
    <div className="page-loading w-full	h-screen fixed flex top-0	bottom-0 right-0	left-0 items-center	z-[999] justify-center	bg-[rgba(0,0,0,0.1)]">
      <Image className="loading-image-default animate-loading" src={Loading} alt="loading" />
    </div>
  );
}
