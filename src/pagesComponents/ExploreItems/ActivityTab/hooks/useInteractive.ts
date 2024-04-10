import { useToggle } from 'ahooks';

export function useInteractive() {
  const [isFilterCollapsed, { toggle: toggleFitlerCollapse }] = useToggle(false);

  return {
    isFilterCollapsed,
    toggleFitlerCollapse,
  };
}
