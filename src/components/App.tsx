import { useEffect, useState } from 'react';
import EntryLevel from './EntryLevel';
import Clownlist from './Clownlist';
import Offsite from './Offsite';
import { applySettings } from '../chrome/background';
import { ReactMessageRes, EntryLevelSetting, ClownlistSetting } from '../types';
import './App.css';


const linkedInURL = 'linkedin.com/jobs/';
const indeedURL = 'indeed.com/jobs';

const App = () => {
  const [offsite, setOffsite] = useState<boolean>(false);
  const [entryLevel, setEntryLevel] = useState<EntryLevelSetting>(5);
  const [clownlist, setClownlist] = useState<ClownlistSetting>({});
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

  useEffect(() => {
    const getSettings = () => {
      // Fetch initial settings from chrome storage and update state
      chrome.tabs && chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const tab = tabs[0];

        // Render settings if on LinkedIn job page
        if (tab.url?.includes(linkedInURL) || tab.url?.includes(indeedURL)) {
          chrome.tabs.sendMessage(
            tab.id || 0,
            {},
            (res: ReactMessageRes) => {
              if (chrome.runtime.lastError) {
                console.log('Attempting to reach content script...');
                return setTimeout(getSettings, 1000);
              }

              if (res?.body.settings) {
                const settings = res.body.settings;
                setEntryLevel(settings.entryLevel);
                setClownlist(settings.clownlist);
                return;
              }
            }
          );
        } else {
          // Render offsite page if not on LinkedIn job page
          return setOffsite(true);
        }
      });
    }

    getSettings();
  }, []);


  const updateEntryLevel = (newEntryLevel: EntryLevelSetting) => {
    setEntryLevel(newEntryLevel);
    setButtonDisabled(false);
  }

  const updateClownlist = (toAdd: string, toRemove: string[]) => {
    const clownlistCopy = { ...clownlist };
    if (toRemove.length) {
      toRemove.forEach(k => delete clownlistCopy[k]);
      setClownlist(clownlistCopy);
      return setButtonDisabled(false);
    }

    clownlistCopy[toAdd] = true;
    setClownlist(clownlistCopy);
    setButtonDisabled(false);
  }

  const updateSettings = () => {
    applySettings({ entryLevel, clownlist });
    setButtonDisabled(true);
  }

  return (
    <div className={offsite ? "app-offsite" : "app"}>
      {offsite ? (
        <Offsite />
      ) : (
        <>
          <div>
            <EntryLevel updateEntryLevel={updateEntryLevel} entryLevel={entryLevel} />
            <Clownlist updateClownlist={updateClownlist} clownlist={clownlist} />
          </div>
          <div className="reload">
            <button
              className="cd-button"
              onClick={updateSettings}
              disabled={buttonDisabled}
            >
              <b>Apply settings and reload</b>
            </button>
          </div>
        </>
      )}
      <a
        className="report"
        href="https://github.com/DominicMonares/clown-detector/issues"
        target="_blank"
        rel="noreferrer"
      >
        Report a bug
      </a>
    </div>
  );
}

export default App;
