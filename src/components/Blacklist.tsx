import React, { useState, MouseEvent } from 'react';

import { BlacklistProps } from '../types';

const Blacklist = ({ updateBlacklist, blacklist }: BlacklistProps) => {
  const [newKeyword, setNewKeyword] = useState<string>('');

  const addToBlacklist = () => {
    updateBlacklist(newKeyword, '');
    setNewKeyword('');
  }

  const removeFromBlacklist = (e: MouseEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target['parentNode'] !== null) {
      const keyword = target['parentNode']['children'][0]['innerHTML'];
      updateBlacklist('', keyword);
    }
  }

  return (
    <div>
      <div>
        <input
          type='text'
          placeholder='Add to blacklist'
          onChange={(e) => setNewKeyword(e.target.value)}
          value={newKeyword}
        />
        <button onClick={addToBlacklist}>
          Add to blacklist
        </button>
      </div>
      <div>
        {Object.keys(blacklist).map(b => {
          return (
            <div key={b}>
              <span>{b}</span>
              <span onClick={removeFromBlacklist}>X</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Blacklist;
