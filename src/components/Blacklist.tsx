import React, { useState } from 'react';

import { BlacklistSetting, BlacklistProps } from '../types';

const Blacklist = ({ updateBlacklist, blacklist }: BlacklistProps) => {
  const [newKeyword, setNewKeyword] = useState<string>('');

  const triggerUpdateBl = (toAdd: string, toRemove: string) => {
    updateBlacklist(newKeyword, toRemove);
    if (!toRemove) setNewKeyword('');
  }

  return (
    <div>
      <input
        type='text'
        placeholder='Add to blacklist'
        onChange={(e) => setNewKeyword(e.target.value)}
        value={newKeyword}
      />
      <button onClick={() => triggerUpdateBl(newKeyword, '')}>
        Add to blacklist
      </button>
      {Array.from(blacklist).map(b => b)}
    </div>
  );
}

export default Blacklist;
