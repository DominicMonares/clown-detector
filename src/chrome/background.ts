import { DOMMessage, DOMMessageResponse, EntryLevel } from '../types';

export const checkJob = (entryLevel: EntryLevel, blacklist: string[]) => {
  chrome.tabs && chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const queryOptions = { entryLevel, blacklist };

    chrome.tabs.sendMessage(
      tabs[0]['id'] || 0,
      queryOptions as DOMMessage,
      (response: DOMMessageResponse) => {
        // setEntryLevel(response.entryLevel);
        console.log(response.tbd);
      }
    );
  });
}
