import React, { useEffect, useState } from 'react';

import EntryLevel from './EntryLevel';
import Blacklist from './Blacklist';
import { ReactMessageRes, EntryLevelSetting, BlacklistSetting } from '../types';
import './App.css';

function App() {
  const [entryLevel, setEntryLevel] = useState<EntryLevelSetting>(4);
  const [blacklist, setBlacklist] = useState<BlacklistSetting>(new Set<string>());

  useEffect(() => {
    chrome.tabs && chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(
        tabs[0]['id'] || 0,
        {},
        (res: ReactMessageRes) => {
          console.log('TRESRSE', res.response.entryLevel, res.response.blacklist)
          setEntryLevel(res.response.entryLevel);
          setBlacklist(res.response.blacklist);
        }
      );
    });
  }, []);

  const updateEntryLevel = (newEntryLevel: EntryLevelSetting) => {
    setEntryLevel(newEntryLevel);
  }

  const updateBlacklist = (toAdd: string, toRemove: string) => {
    const blacklistCopy = new Set(blacklist);

    if (toRemove) {
      blacklistCopy.delete(toRemove);
      return setBlacklist(blacklistCopy);
    }

    blacklistCopy.add(toAdd);
    setBlacklist(blacklistCopy);
  }

  const applySettings = () => {
    chrome.tabs && chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(
        tabs[0]['id'] || 0,
        { entryLevel, blacklist },
        (res: ReactMessageRes) => {}
      );
    });

    chrome.tabs.reload();
    window.close();
  }

  // create onClick that updates settings by:
    // sending message to post new values to storage
    // rerun page scan

  return (
    <div className="app">
      <header >
        CLOWNS!
      </header>
      {entryLevel}
      <EntryLevel updateEntryLevel={updateEntryLevel} defaultSlider={entryLevel} />
      <Blacklist updateBlacklist={updateBlacklist} blacklist={blacklist} />
      <button onClick={applySettings}>Apply settings and reload</button>
    </div>
  );
}

export default App;
