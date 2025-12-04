import { useEffect } from 'react';
import { NiceModalHandler } from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';

export function useNiceModalCommonService(modal: NiceModalHandler) {
  const path = usePathname();
  useEffect(() => {
    if (modal.visible) {
      modal.hide();
    }
  }, [path]);
}
