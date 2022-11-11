import React, { useEffect, useState } from 'react';

import { sendGetStoreMsg } from '../chrome/background';
import { EntryLevel } from '../types';
import './App.css';

function App() {
  const [entryLevel, setEntryLevel] = useState<EntryLevel>(4);
  const [blacklist, setBlacklist] = useState<string[]>([]);

  useEffect(() => {
    const settings = sendGetStoreMsg();
    console.log('SETTINGS REACT ', settings);
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
