import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Footer from './components/Footer';
import styles from './style.module.css';

import useTelegram from 'hooks/useTelegram';

const Home = () => {
  const { isInTelegram } = useTelegram();

  const isInTG = useMemo(() => {
    return isInTelegram();
  }, [isInTelegram]);

  console.log('isInTG----isInTG', isInTG);

  const router = useRouter();

  const goToRules = () => {
    router.push('/mini-app/rules');
  };
  return (
    <div className={styles['mini-app']}>
      <div className="w-full text-center">
        <div>home</div>
        <button className="mt-10" onClick={goToRules}>
          rules
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
