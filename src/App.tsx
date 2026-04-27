import { useRef, useState } from 'react';
import RundotGameAPI from '@series-inc/rundot-game-sdk/api';
import { TabBar } from './components/TabBar';
import { TAB_CONFIG, DEFAULT_TAB_ID, type TabId } from './tabs/tabConfig';
import './style.css';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>(DEFAULT_TAB_ID);
  const visitedTabsRef = useRef<Set<TabId>>(new Set([DEFAULT_TAB_ID]));

  const handleTabChange = (nextTab: TabId) => {
    RundotGameAPI.analytics.recordCustomEvent('tab_changed', { tab_id: nextTab });

    if (nextTab === 'ads' && !visitedTabsRef.current.has('ads')) {
      RundotGameAPI.analytics.recordCustomEvent('ads_visited');
      RundotGameAPI.analytics.trackFunnelStep(3, 'ads_visited', 'session', 1);
    }
    if (nextTab === 'settings' && !visitedTabsRef.current.has('settings')) {
      RundotGameAPI.analytics.recordCustomEvent('settings_viewed');
    }

    visitedTabsRef.current.add(nextTab);
    setActiveTab(nextTab);
  };

  const activeTabDefinition = TAB_CONFIG.find((tab) => tab.id === activeTab) ?? TAB_CONFIG[0];
  const tabContent = activeTabDefinition.render();

  return (
    <>
      {/* Landscape Warning */}
      <div className="landscape-warning">
        <div className="landscape-warning-icon">📱</div>
        <h2>Portrait Mode Only</h2>
        <p>Please rotate your device to portrait orientation</p>
      </div>

      {/* Main App */}
      <div className="app-container">
        <div className="content-area">
          <div className="tab-content tab-fade-in" key={activeTab}>
            {tabContent}
          </div>
        </div>

        <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </>
  );
}

export default App;
