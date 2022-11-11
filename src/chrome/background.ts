import { ReactMessageRes, EntryLevel, Settings } from '../types';

export const sendJobMsg = (entryLevel: EntryLevel, blacklist: string[]) => {
  chrome.tabs && chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const queryOptions = { entryLevel, blacklist };
    chrome.tabs.sendMessage(
      tabs[0]['id'] || 0,
      queryOptions as Settings,
      (response: ReactMessageRes) => {
        console.log(response.success);
        return response.success;
      }
    );
  });
}

export const sendGetStoreMsg = () => {
  chrome.tabs && chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(
      tabs[0]['id'] || 0,
      {},
      (response: Settings) => {
        console.log('STORAGE RETRIEVED ', response);
        return response;
      }
    );
  });
}
