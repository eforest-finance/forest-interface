function elementScrollToView(element: HTMLElement | null, block?: 'center' | 'end' | 'start') {
  if (!element) {
    return;
  }
  setTimeout(() => {
    try {
      element.scrollIntoView({
        behavior: 'smooth',
        block: block || 'center',
      });
    } catch (error) {
      console.log('scrollIntoView error', error);
    }
  }, 300);
}

export { elementScrollToView };
