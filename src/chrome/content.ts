import { DOMMessage, DOMMessageResponse } from '../types';

// Function called when a new message is received
const messagesFromReactAppListener = (
  msg: DOMMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: DOMMessageResponse) => void
) => {
  console.log('[content.js]. Message received', msg);


  const topCards = document.getElementsByClassName(
    "jobs-unified-top-card__job-insight"
  ) as HTMLCollectionOf<HTMLElement>;

  const topCard = topCards[0]['children'][1]['innerHTML'];
  const isEntryLevel = topCard.includes('Entry level');

  // Prepare the response object with information about the site
  const response: DOMMessageResponse = {
    tbd: isEntryLevel // response tbd
  };

  sendResponse(response);
}

/**
* Fired when a message is sent from either an extension process or a content script.
*/
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
