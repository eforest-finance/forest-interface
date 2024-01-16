function elementScrollToView(element: HTMLElement | null) {
  if (!element) {
    return;
  }
  setTimeout(() => {
    try {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    } catch (error) {
      console.log('scrollIntoView error', error);
    }
  }, 300);
}

export { elementScrollToView };
