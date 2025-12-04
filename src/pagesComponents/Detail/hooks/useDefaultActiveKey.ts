import { useEffect, useMemo, useState } from 'react';

const useDefaultActiveKey = (arr: Array<any> | null | undefined, keyString: string) => {
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);

  useEffect(() => {
    const activeKey = arr && arr?.length > 0 ? keyString : undefined;
    setActiveKey(activeKey);
  }, [arr, keyString]);

  return useMemo(() => {
    return {
      activeKey,
      setActiveKey,
    };
  }, [activeKey]);
};

export default useDefaultActiveKey;
