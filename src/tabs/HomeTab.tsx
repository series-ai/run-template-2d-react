import { useState, useEffect, useRef } from 'react';
import RundotGameAPI from '@series-inc/rundot-game-sdk/api';
import { HapticFeedbackStyle } from '@series-inc/rundot-game-sdk';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const HomeTab: React.FC = () => {
  const [counter, setCounter] = useState<number>(0);
  const [assetUrl, setAssetUrl] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);
  const hasInteractedRef = useRef(false);
  const counterRef = useRef(0);

  // Load saved counter on mount (once only, even in StrictMode)
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadCounter = async () => {
      try {
        const saved = await RundotGameAPI.appStorage.getItem('counter');
        if (saved !== null) {
          const parsed = parseInt(saved, 10);
          counterRef.current = parsed;
          setCounter(parsed);
        }
      } catch (error) {
        RundotGameAPI.error('[HomeTab] Error loading counter:', error);
      }
    };

    loadCounter();
  }, []);

  // Fetch CDN asset on mount
  useEffect(() => {
    let url: string | undefined;

    RundotGameAPI.cdn
      .fetchAsset('circle.png')
      .then((blob) => {
        url = URL.createObjectURL(blob);
        setAssetUrl(url);
      })
      .catch((err) => {
        RundotGameAPI.error('[HomeTab] Error fetching CDN asset:', err);
      });

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, []);

  // Auto-save whenever counter changes (skip the initial load)
  useEffect(() => {
    if (!hasLoadedRef.current) return;
    RundotGameAPI.appStorage.setItem('counter', counter.toString());
  }, [counter]);

  const updateCounter = async (delta: number) => {
    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true;
      RundotGameAPI.analytics.recordCustomEvent('home_interacted', { delta });
      RundotGameAPI.analytics.trackFunnelStep(2, 'home_interacted', 'session', 1);
    }

    const next = counterRef.current + delta;
    counterRef.current = next;
    if (delta > 0) {
      RundotGameAPI.analytics.recordCustomEvent('counter_incremented', { value: next });
    } else if (delta < 0) {
      RundotGameAPI.analytics.recordCustomEvent('counter_decremented', { value: next });
    }

    await RundotGameAPI.triggerHapticAsync(HapticFeedbackStyle.Light);
    setCounter(next);
  };

  return (
    <>
      <Card title="Welcome">
        <p>
          This is a Rundot-enabled React project. It includes theming, tab navigation, appStorage,
          and ad integration out of the box.
        </p>
      </Card>

      <Card title="Tap the Circle">
        {assetUrl && (
          <div
            style={{ display: 'flex', justifyContent: 'center', padding: '16px 0', cursor: 'pointer' }}
            onClick={() => updateCounter(1)}
          >
            <img
              src={assetUrl}
              alt="Tap to increment"
              style={{ width: 96, height: 96, borderRadius: '50%', userSelect: 'none' }}
              draggable={false}
            />
          </div>
        )}
        <div className="counter-display">{counter}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <Button variant="primary" onClick={() => updateCounter(-1)}>
            −
          </Button>
          <Button variant="primary" onClick={() => updateCounter(1)}>
            +
          </Button>
        </div>
      </Card>
    </>
  );
};
