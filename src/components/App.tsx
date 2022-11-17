import React, { useEffect, useState } from 'react';

import EntryLevel from './EntryLevel';
import Blacklist from './Blacklist';
import { ReactMessageRes, EntryLevelSetting, BlacklistSetting } from '../types';
import './App.css';

function App() {
  const [entryLevel, setEntryLevel] = useState<EntryLevelSetting>(5);
  const [blacklist, setBlacklist] = useState<BlacklistSetting>({});

  useEffect(() => {
    chrome.tabs && chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(
        tabs[0]['id'] || 0,
        {},
        (res: ReactMessageRes) => {
          if (res.body.settings) {
            const settings = res.body.settings;
            setEntryLevel(settings.entryLevel);
            setBlacklist(settings.blacklist);
          }
        }
      );
    });
  }, []);

  const updateEntryLevel = (newEntryLevel: EntryLevelSetting) => {
    setEntryLevel(newEntryLevel);
  }

  const updateBlacklist = (toAdd: string, toRemove: string) => {
    const blacklistCopy = { ...blacklist };

    if (toRemove) {
      delete blacklistCopy[toRemove];
      return setBlacklist(blacklistCopy);
    }

    blacklistCopy[toAdd] = true;
    setBlacklist(blacklistCopy);
  }

  const applySettings = () => {
    chrome.tabs && chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(
        tabs[0]['id'] || 0,
        { settings: { entryLevel, blacklist } },
        (res: ReactMessageRes) => {}
      );
    });

    chrome.tabs.reload();
    window.close();
  }

  return (
    <div className="app">
      <header >
        CLOWNS!
      </header>
      <EntryLevel updateEntryLevel={updateEntryLevel} defaultSlider={entryLevel} />
      <Blacklist updateBlacklist={updateBlacklist} blacklist={blacklist} />
      <button onClick={applySettings}>Apply settings and reload</button>
    </div>
  );
}

export default App;
