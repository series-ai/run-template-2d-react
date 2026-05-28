import RundotGameAPI from '@series-inc/rundot-game-sdk/api';

export type DeviceClass = 'mobile' | 'desktop' | 'tv';

// Map the SDK's free-form `deviceType` string to our literal union.
// The SDK currently emits values like 'phone', 'tablet', 'tv', 'desktop'.
const mapDeviceType = (deviceType: string): DeviceClass | null => {
  const t = deviceType.toLowerCase();
  if (t === 'tv') return 'tv';
  if (t === 'desktop') return 'desktop';
  if (t === 'phone' || t === 'mobile' || t === 'tablet') return 'mobile';
  return null;
};

// Viewport-based fallback. Only used when the SDK isn't ready (early boot,
// SSR, tests). Inside the Rundot iframe shell the viewport is capped to
// ~720×1280, so this path will almost always resolve to 'mobile' — that's
// fine for a fallback; the SDK-driven path is the source of truth.
const detectFromViewport = (): DeviceClass => {
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

export const detectDeviceClass = (): DeviceClass => {
  // Primary: ask the SDK about the *physical* device. Inside the Rundot iframe
  // shell the iframe itself is capped to ~720×1280, so window.innerWidth is
  // useless for distinguishing desktop/tv from mobile — every device would
  // look like a phone. The SDK reports the host device.
  try {
    const device = RundotGameAPI.system.getDevice();

    const fromType = mapDeviceType(device.deviceType);
    if (fromType !== null) {
      return fromType;
    }

    // Secondary: physical screen width when deviceType is unrecognized.
    const screenWidth = device.screenSize?.width ?? 0;
    if (screenWidth >= 1280) return 'tv';
    if (screenWidth >= 900) return 'desktop';
    return 'mobile';
  } catch {
    // SDK not initialized yet, or running outside the host. Fall back to the
    // viewport-based heuristic.
    return detectFromViewport();
  }
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

  // The SDK reports the physical device, which doesn't change at runtime, so
  // these listeners only matter for the viewport fallback path. They are
  // cheap to keep in place and ensure correctness if the SDK ever becomes
  // available mid-session.
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
