import {
  useState,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent
} from 'react';
import { ClownlistProps } from '../types';


const Clownlist = ({ updateClownlist, clownlist }: ClownlistProps) => {
  const clownlistKeys = Object.keys(clownlist);
  const [newKeyword, setNewKeyword] = useState<string>('');
  const [addDisabled, setAddDisabled] = useState<boolean>(true);
  const [clearDisabled, setClearDisabled] = useState<boolean>(
    clownlistKeys.length ? false : true
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setNewKeyword(input);
    input ? setAddDisabled(false) : setAddDisabled(true);
  }

  const handleEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !addDisabled) addToClownlist();
  }

  const addToClownlist = () => {
    updateClownlist(newKeyword, '');
    setNewKeyword('');
    setAddDisabled(true);
  }

  const removeFromClownlist = (e: MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLInputElement;
    if (target['parentNode'] !== null) {
      const keyword = target['parentNode']['children'][0]['innerHTML'];
      updateClownlist('', [keyword]);
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
          onChange={handleChange}
          onKeyUp={handleEnter}
          value={newKeyword}
        />
        <button
          className='cd-button'
          onClick={addToClownlist}
          disabled={addDisabled}
        >
          <b>Add</b>
        </button>
        {clownlistKeys.length ? (
          <button
            className='cd-button'
          >
            Clear
          </button>
        ) : (
          <></>
        )}
      </div>
      <div className='keywords'>
        {clownlist ? (
          clownlistKeys.map(b => {
            return (
              <span className='keyword-container' key={b}>
                <span className='keyword'>{b}</span>
                <button
                  className='x'
                  onClick={removeFromClownlist}
                >
                  X
                </button>
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
