import { useInteractive } from './useInteractive';
import { useLogicService } from './useLogicService';

interface IActivitiesServerProps {
  scrollableTarget: Element | HTMLElement;
}

export function useActivityTabService({ scrollableTarget }: IActivitiesServerProps) {
  const { isFilterCollapsed, toggleFitlerCollapse } = useInteractive();
  const { activities, totalCount, hasMore, loading, loadingMore } = useLogicService({
    scrollableTarget,
  });

  return {
    isFilterCollapsed,
    toggleFitlerCollapse,
    activities,
    totalCount,
    hasMore,
    loading,
    loadingMore,
  };
}
