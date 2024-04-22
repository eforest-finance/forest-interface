import { Layout } from 'antd';
import { CollapsedControlAndSearchBox } from './CollapsedControlAndSearchBox';
import { Filter } from './Filter';
import { FilterTagList } from './FilterTagList';
import clsx from 'clsx';
import { ActivityListTable } from '../components/ActivityListTable';
import { LoadingMore } from 'baseComponents/LoadingMore';
import { useActivityTabService } from './hooks/useActivityTabService';
import { useFilterService } from '../hooks/useFilterService';

export function ActivityTab() {
  const { filterList, generationInfos, filterSelect, traitsInfo, filterChange } = useFilterService();
  const { isFilterCollapsed, toggleFitlerCollapse, activities, loading, hasMore, loadingMore } = useActivityTabService({
    scrollableTarget: document.getElementById('explore__container') || document.body,
  });

  return (
    <>
      <CollapsedControlAndSearchBox
        collapsed={isFilterCollapsed}
        toggleCollapse={toggleFitlerCollapse}
        onSearch={() => {
          console.log('onSearch');
        }}
      />
      <Layout className="!bg-fillPageBg">
        <Layout.Sider
          className={clsx(!isFilterCollapsed && 'mr-8', '!bg-transparent')}
          collapsedWidth={0}
          width={!isFilterCollapsed ? 360 : 0}
          trigger={null}>
          <Filter filterChange={filterChange} />
        </Layout.Sider>
        <Layout className="!bg-transparent">
          <div className="flex items-center">
            <FilterTagList
              tagList={[
                {
                  label: '124',
                  type: '124',
                },
                {
                  label: '124',
                  type: '124',
                },
                {
                  label: '124',
                  type: '124',
                },
                {
                  label: '124',
                  type: '124',
                },
                {
                  label: '124',
                  type: '124',
                },
                {
                  label: '124',
                  type: '124',
                },
                {
                  label: '124',
                  type: '124',
                },
                {
                  label: '124',
                  type: '124',
                },
                {
                  label: '124',
                  type: '124',
                },
                {
                  label: '124lore msalg kjagag jkd adgljd agadj a sgadg aga',
                  type: 'search',
                },
                {
                  label: '124',
                  type: '124',
                },
                {
                  label: '124',
                  type: '124',
                },
                {
                  label: '124',
                  type: '124',
                },
                {
                  label: '124',
                  type: '124',
                },
              ]}
            />
            <span className=" text-base font-medium text-textPrimary">6,124,781 results</span>
          </div>
          <ActivityListTable dataSource={activities} loading={loading} />
          {loadingMore && !loading ? <LoadingMore /> : null}
          {!hasMore && !loading && !loadingMore ? (
            <div className="text-center w-full text-textDisable font-medium text-base pb-[20px]">No more data</div>
          ) : null}
        </Layout>
      </Layout>
    </>
  );
}
