import isMobile from 'utils/isMobile';
export function elementScrollToView(element: HTMLElement) {
  const ua = navigator.userAgent;
  const mobileType = isMobile(ua);

  console.log('mobileType', mobileType);
  if (mobileType.apple.device || !mobileType.phone) return;

  setTimeout(() => {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, 300);
}
