import { useEffect, useState } from 'react';
import EntryLevel from './EntryLevel';
import Clownlist from './Clownlist';
import { applySettings } from '../chrome/background';
import { ReactMessageRes, EntryLevelSetting, ClownlistSetting } from '../types';
import './App.css';


const App = () => {
  const [entryLevel, setEntryLevel] = useState<EntryLevelSetting>(5);
  const [clownlist, setClownlist] = useState<ClownlistSetting>({});
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

  useEffect(() => {
    // Fetch initial settings from chrome storage and update state
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
    setButtonDisabled(false);
  }

  const updateClownlist = (toAdd: string, toRemove: string) => {
    const clownlistCopy = { ...clownlist };
    if (toRemove) {
      delete clownlistCopy[toRemove];
      setClownlist(clownlistCopy);
      return setButtonDisabled(false);
    }

    clownlistCopy[toAdd] = true;
    setClownlist(clownlistCopy);
    setButtonDisabled(false);
  }

  const updateSettings = () => {
    applySettings({entryLevel, clownlist});
    setButtonDisabled(true);
  }

  return (
    <div className="app">
      <div>
        <EntryLevel updateEntryLevel={updateEntryLevel} defaultSlider={entryLevel} />
        <Clownlist updateClownlist={updateClownlist} clownlist={clownlist} />
      </div>
      <div className='reload'>
        <button
          className='cd-button'
          onClick={updateSettings}
          disabled={buttonDisabled}
        >
          <b>Apply settings and reload</b>
        </button>
      </div>
    </div>
  );
}

export default App;
