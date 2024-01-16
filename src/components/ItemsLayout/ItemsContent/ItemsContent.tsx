import { Layout } from 'antd';
import TopFilterButton from '../components/TopFilterButton';
import ScrollContent from '../ScrollContent/ScrollContent';

export default function ItemsContent({ showAdd = false }: { showAdd?: boolean }) {
  return (
    <Layout.Content className={'border-l-[var(--line-box)]'}>
      <TopFilterButton showAdd={showAdd} />
      <ScrollContent />
    </Layout.Content>
  );
}
