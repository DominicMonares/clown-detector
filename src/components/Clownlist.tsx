import { useState, MouseEvent, KeyboardEvent } from 'react';

import { ClownlistProps } from '../types';


const Clownlist = ({ updateClownlist, clownlist }: ClownlistProps) => {
  const [newKeyword, setNewKeyword] = useState<string>('');

  const addToClownlist = () => {
    updateClownlist(newKeyword, '');
    setNewKeyword('');
  }

  const handleEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter') addToClownlist();
  }

  const removeFromClownlist = (e: MouseEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target['parentNode'] !== null) {
      const keyword = target['parentNode']['children'][0]['innerHTML'];
      updateClownlist('', keyword);
    }
  }

  return (
    <div className='clownlist'>
      <b className='title'>Clownlisted Keywords</b>
      <div className='clownlist-input'>
        <input
          className='clownlist-textfield'
          type='text'
          placeholder='NFT, unpaid, etc.'
          onChange={(e) => setNewKeyword(e.target.value)}
          onKeyUp={handleEnter}
          value={newKeyword}
        />
        <button className='cd-button' onClick={addToClownlist}>
          <b>Add</b>
        </button>
      </div>
      <div className='keywords'>
        {clownlist ? (
          Object.keys(clownlist).map(b => {
            return (
              <span className='keyword-container' key={b}>
                <span className='keyword'>{b}</span>
                <span className='x' onClick={removeFromClownlist}>X</span>
              </span>
            );
          })
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Clownlist;
