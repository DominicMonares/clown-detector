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
    <Slider
      size="small"
      value={defaultSlider}
      max={7}
      marks={marks}
      onChange={triggerUpdateEL}

      sx={{
        width: 500,
        height: 10,
        borderRadius: 0,
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
          height: 10,
          backgroundColor: '#ffffff'
        },
        '& .MuiSlider-markActive': {
          height: 10,
          backgroundColor: '#d9230c'
        },
        '& .MuiSlider-rail': {
          backgroundColor: '#d9230c'
        },
        '& .MuiSlider-track': {
          backgroundColor: '#d9230c'
        },
      }}
    />
  );
}

export default EntryLevel;
