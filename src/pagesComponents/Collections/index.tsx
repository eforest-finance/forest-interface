import CollectionTable from './components/CollectionsTable';
import Header from './components/Header';
import styles from './style.module.css';
export default function Collections() {
  return (
    <div className={styles.explore}>
      <Header />
      <CollectionTable />
    </div>
  );
}
