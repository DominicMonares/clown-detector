import { useEffect, useState } from 'react';

import EntryLevel from './EntryLevel';
import Clownlist from './Clownlist';
import { applySettings } from '../chrome/background';
import { ReactMessageRes, EntryLevelSetting, ClownlistSetting } from '../types';
import './App.css';


function App() {
  const [entryLevel, setEntryLevel] = useState<EntryLevelSetting>(5);
  const [clownlist, setClownlist] = useState<ClownlistSetting>({});

  useEffect(() => {
    chrome.tabs && chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(
        tabs[0]['id'] || 0,
        {},
        (res: ReactMessageRes) => {
          if (res.body.settings) {
            const settings = res.body.settings;
            setEntryLevel(settings.entryLevel);
            setClownlist(settings.clownlist);
          }
        }
      );
    });
  }, []);

  const updateEntryLevel = (newEntryLevel: EntryLevelSetting) => {
    setEntryLevel(newEntryLevel);
  }

  const updateClownlist = (toAdd: string, toRemove: string) => {
    const clownlistCopy = { ...clownlist };

    if (toRemove) {
      delete clownlistCopy[toRemove];
      return setClownlist(clownlistCopy);
    }

    clownlistCopy[toAdd] = true;
    setClownlist(clownlistCopy);
  }

  return (
    <div className="app">
      <div>
        <EntryLevel updateEntryLevel={updateEntryLevel} defaultSlider={entryLevel} />
        <Clownlist updateClownlist={updateClownlist} clownlist={clownlist} />
      </div>
      <div className='reload'>
        <button className='cd-button' onClick={() => applySettings({entryLevel, clownlist})}>
          <b>Apply settings and reload</b>
        </button>
      </div>
    </div>
  );
}

export default App;
