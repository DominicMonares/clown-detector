import React from 'react';
import { Slider } from '@mui/material';

import { EntryLevelProps, EntryLevelSetting } from '../types';
import marks from './marks.json';


const EntryLevel = ({ updateEntryLevel, defaultSlider }: EntryLevelProps) => {

  const triggerUpdateEL = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = Number(target.value) as EntryLevelSetting;
    updateEntryLevel(value);
  }

  return (
    <div className='entry-level'>
      <b>Entry level threshold</b>
      <Slider
        size="small"
        value={defaultSlider}
        max={5}
        marks={marks}
        onChange={triggerUpdateEL}
        sx={{
          width: 500,
          height: 8,
          marginTop: '6px',
          borderRadius: 5,
          '& .MuiSlider-thumb': {
            width: 25,
            height: 25,
            backgroundColor: 'transparent',
            boxShadow: '0 0 0 0',
          },
          '& .Mui-active': {
            boxShadow: '0 0 0 0'
          },
          '& .MuiSlider-mark': {
            height: 9,
            backgroundColor: '#ffffff'
          },
          '& .MuiSlider-markActive': {
            height: 9,
            backgroundColor: '#ffffff'
          },
          '& .MuiSlider-rail': {
            backgroundColor: '#d9230c'
          },
          '& .MuiSlider-track': {
            backgroundColor: '#d9230c'
          },
        }}
      />
    </div>
  );
}

export default EntryLevel;
