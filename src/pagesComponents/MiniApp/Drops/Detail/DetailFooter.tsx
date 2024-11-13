import { useRouter } from 'next/navigation';

const DetailFooter = () => {
  const router = useRouter();

  const goToDrops = () => {
    router.push('/mini-app/drops');
  };

  return (
    <div className="fixed left-0 bottom-0 w-full flex items-center justify-around">
      <div className="flex flex-col items-center" onClick={goToDrops}>
        <div>CLAM</div>
      </div>
    </div>
  );
};

export default DetailFooter;
