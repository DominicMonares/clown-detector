import React, { useEffect, useState } from 'react';

import EntryLevel from './EntryLevel/EntryLevel';
import { ReactMessageRes, EntryLevelSetting } from '../types';
import './App.css';

function App() {
  const [entryLevel, setEntryLevel] = useState<EntryLevelSetting>(4);
  const [blacklist, setBlacklist] = useState<string[]>([]);

  useEffect(() => {
    chrome.tabs && chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(
        tabs[0]['id'] || 0,
        {},
        (res: ReactMessageRes) => {
          setEntryLevel(res.response.entryLevel);
          setBlacklist(res.response.blacklist);
        }
      );
    });
  }, []);

  const updateEntryLevel = (newEntryLevel: EntryLevelSetting) => {
    setEntryLevel(newEntryLevel);
  }

  // create onClick that updates settings by:
    // sending message to post new values to storage
    // rerun page scan

  return (
    <div className="app">
      <header >
        CLOWNS!
      </header>
      <EntryLevel updateEntryLevel={updateEntryLevel} defaultSlider={entryLevel} />
      {entryLevel}
      {blacklist.map(k => k)}
    </div>
  );
}

export default App;
