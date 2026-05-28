export type DeviceClass = 'mobile' | 'desktop' | 'tv';

export const detectDeviceClass = (): DeviceClass => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'mobile';
  }

  const wideViewport = window.innerWidth >= 1280;
  const notTouchPrimary =
    window.matchMedia('(hover: none) and (pointer: coarse)').matches === false;
  const lowDpi = window.matchMedia('(min-resolution: 1dppx) and (max-resolution: 1.5dppx)').matches;

  if (wideViewport && notTouchPrimary && lowDpi) {
    return 'tv';
  }

  if (window.innerWidth >= 600) {
    return 'desktop';
  }

  return 'mobile';
};

export const applyDeviceClass = (): (() => void) => {
  const noop = (): void => {};
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return noop;
  }

  const update = (): void => {
    document.documentElement.dataset['device'] = detectDeviceClass();
  };

  update();

  const mediaQueries: MediaQueryList[] = [
    window.matchMedia('(hover: none) and (pointer: coarse)'),
    window.matchMedia('(min-resolution: 1dppx) and (max-resolution: 1.5dppx)'),
    window.matchMedia('(min-width: 600px)'),
    window.matchMedia('(min-width: 1280px)'),
  ];

  const onChange = (): void => update();
  mediaQueries.forEach((mq) => mq.addEventListener('change', onChange));
  window.addEventListener('resize', onChange);

  return () => {
    mediaQueries.forEach((mq) => mq.removeEventListener('change', onChange));
    window.removeEventListener('resize', onChange);
  };
};
