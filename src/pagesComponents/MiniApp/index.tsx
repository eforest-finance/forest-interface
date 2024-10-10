import { useRouter } from 'next/navigation';
import Footer from './components/Footer';
import styles from './style.module.css';

const Home = () => {
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
