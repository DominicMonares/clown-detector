import { useState, MouseEvent } from 'react';

import { ClownlistProps } from '../types';


const Clownlist = ({ updateClownlist, clownlist }: ClownlistProps) => {
  const [newKeyword, setNewKeyword] = useState<string>('');

  const addToClownlist = () => {
    updateClownlist(newKeyword, '');
    setNewKeyword('');
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
      <b>Clownlisted Keywords</b>
      <div className='clownlist-input'>
        <input
          className='clownlist-textfield'
          type='text'
          placeholder='Add to clownlist'
          onChange={(e) => setNewKeyword(e.target.value)}
          value={newKeyword}
        />
        <button className='clownlist-button' onClick={addToClownlist}>
          <b>Add</b>
        </button>
      </div>
      <div>
        {Object.keys(clownlist).map(b => {
          return (
            <div key={b}>
              <span>{b}</span>
              <span onClick={removeFromClownlist}>X</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Clownlist;
