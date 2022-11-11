import React, { useEffect, useState } from 'react';
import { DOMMessage, DOMMessageResponse } from '../types';
import './App.css';

function App() {
  const [entryLevel, setEntryLevel] = useState<Boolean>(false);

  useEffect(() => {
    /**
     * We can't use "chrome.runtime.sendMessage" for sending messages from React.
     * For sending messages from React we need to specify which tab to send it to.
     */
    chrome.tabs && chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      /**
       * Sends a single message to the content script(s) in the specified tab,
       * with an optional callback to run when a response is sent back.
       *
       * The runtime.onMessage event is fired in each content script running
       * in the specified tab for the current extension.
       */

      chrome.tabs.sendMessage(
        tabs[0]['id'] || 0,
        { type: 'GET_DOM' } as DOMMessage,
        (response: DOMMessageResponse) => {
          setEntryLevel(response.entryLevel);
        });
    });
  }, []);

  return (
    <div className="app">
      <header >
        CLOWNS!
      </header>
    </div>
  );
}

export default App;
