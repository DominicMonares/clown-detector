import React, { useEffect, useState } from 'react';
import { DOMMessage, DOMMessageResponse } from '../types';
import './App.css';

function App() {
  const [entryLevel, setEntryLevel] = useState<Boolean>(false);

  useEffect(() => {
    chrome.tabs && chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(
        tabs[0]['id'] || 0,
        { type: 'GET_DOM' } as DOMMessage,
        (response: DOMMessageResponse) => {
          setEntryLevel(response.entryLevel);
        }
      );
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
