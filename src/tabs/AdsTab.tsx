import { useRef } from 'react';
import RundotGameAPI from '@series-inc/rundot-game-sdk/api';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const AdsTab: React.FC = () => {
  const hasCompletedAdRef = useRef(false);

  const recordAdCompleted = () => {
    if (hasCompletedAdRef.current) return;
    hasCompletedAdRef.current = true;
    RundotGameAPI.analytics.trackFunnelStep(4, 'ad_completed', 'session', 1);
  };

  const showInterstitialAd = async () => {
    RundotGameAPI.analytics.recordCustomEvent('interstitial_shown');
    try {
      const result = await RundotGameAPI.ads.showInterstitialAd();
      if (result) {
        RundotGameAPI.analytics.recordCustomEvent('interstitial_completed');
        RundotGameAPI.analytics.recordCustomEvent('ad_completed');
        recordAdCompleted();
        await RundotGameAPI.popups.showToast('Interstitial ad completed', { duration: 2000 });
      } else {
        RundotGameAPI.analytics.recordCustomEvent('interstitial_unavailable');
        await RundotGameAPI.popups.showToast('No ad available', { duration: 2000 });
      }
    } catch (error) {
      RundotGameAPI.analytics.recordCustomEvent('interstitial_error', {
        message: error instanceof Error ? error.message : String(error),
      });
      RundotGameAPI.error('[AdsTab] Error showing interstitial ad:', error);
      await RundotGameAPI.popups.showToast('Ad error', { duration: 2000, variant: 'error' });
    }
  };

  const showRewardedAd = async () => {
    RundotGameAPI.analytics.recordCustomEvent('rewarded_shown');
    try {
      const result = await RundotGameAPI.ads.showRewardedAdAsync();
      if (result) {
        RundotGameAPI.analytics.recordCustomEvent('rewarded_earned');
        RundotGameAPI.analytics.recordCustomEvent('ad_completed');
        recordAdCompleted();
        await RundotGameAPI.popups.showToast('Reward earned!', {
          duration: 2000,
          variant: 'success',
        });
      } else {
        RundotGameAPI.analytics.recordCustomEvent('rewarded_skipped');
        await RundotGameAPI.popups.showToast('No reward earned', { duration: 2000 });
      }
    } catch (error) {
      RundotGameAPI.analytics.recordCustomEvent('rewarded_error', {
        message: error instanceof Error ? error.message : String(error),
      });
      RundotGameAPI.error('[AdsTab] Error showing rewarded ad:', error);
      await RundotGameAPI.popups.showToast('Ad error', { duration: 2000, variant: 'error' });
    }
  };

  return (
    <>
      <Card title="Interstitial Ad" description="Full-screen ad shown between content">
        <Button variant="primary" size="large" className="mt-16" onClick={showInterstitialAd}>
          Show Interstitial Ad
        </Button>
      </Card>

      <Card title="Rewarded Ad" description="User watches ad to receive in-game reward">
        <Button variant="primary" size="large" className="mt-16" onClick={showRewardedAd}>
          Show Rewarded Ad
        </Button>
      </Card>
    </>
  );
};
