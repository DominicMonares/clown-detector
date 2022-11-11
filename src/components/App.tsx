import React, { useEffect, useState } from 'react';

import { checkJob } from '../chrome/background';
import { EntryLevel } from '../types';
import './App.css';

function App() {
  const [entryLevel, setEntryLevel] = useState<EntryLevel>(4);
  const [blacklist, setBlacklist] = useState<string[]>([]);

  useEffect(() => {
    checkJob(entryLevel, blacklist);
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
