import { StrictMode } from 'react';
import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import RundotGameAPI from '@series-inc/rundot-game-sdk/api';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { theme, applyTheme, applyDeviceClass } from './theme';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('[run-template-2d-react] Root element not found');
}

const root = createRoot(rootElement);

const render = (node: ReactNode) => {
  root.render(<StrictMode>{node}</StrictMode>);
};

applyTheme(theme);
let cleanupDeviceClass = applyDeviceClass();

// SDK auto-initializes on import but completion is async. getDevice()
// throws pre-init, so the sync applyTheme above silently falls back to
// fontScale=1 and the viewport-based deviceClass heuristic. Re-apply
// once init resolves to pick up the real fontScale and deviceType.
// Tear down the boot-time listeners before re-registering to avoid leaks.
RundotGameAPI.initializeAsync()
  .then(() => {
    applyTheme(theme);
    cleanupDeviceClass();
    cleanupDeviceClass = applyDeviceClass();
  })
  .catch(() => {
    // Init failed; boot-time fallback values stand.
  });

RundotGameAPI.lifecycles.onPause(() => {
  RundotGameAPI.analytics.recordCustomEvent('game_paused');
});
RundotGameAPI.lifecycles.onResume(() => {
  RundotGameAPI.analytics.recordCustomEvent('game_resumed');
});
RundotGameAPI.lifecycles.onSleep(() => {
  RundotGameAPI.analytics.recordCustomEvent('game_sleep');
});
RundotGameAPI.lifecycles.onQuit(() => {
  RundotGameAPI.analytics.recordCustomEvent('game_quit');
});

render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);

RundotGameAPI.analytics.recordCustomEvent('app_loaded');
RundotGameAPI.analytics.trackFunnelStep(1, 'app_loaded', 'session', 1);
