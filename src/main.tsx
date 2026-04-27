import { StrictMode } from 'react';
import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import RundotGameAPI from '@series-inc/rundot-game-sdk/api';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { theme, applyTheme } from './theme';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('[run-template-2d-react] Root element not found');
}

const root = createRoot(rootElement);

const render = (node: ReactNode) => {
  root.render(<StrictMode>{node}</StrictMode>);
};

applyTheme(theme);

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
