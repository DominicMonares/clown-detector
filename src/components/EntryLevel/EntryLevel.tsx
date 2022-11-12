import React from 'react';
import { Slider } from '@mui/material';

import { EntryLevelProps, EntryLevelSetting } from '../../types';
import marks from './marks.json';

const EntryLevel = ({ updateEntryLevel, defaultSlider }: EntryLevelProps) => {

  const updateSlider = (e: Event) => {
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
      onChange={updateSlider}
    />
  );
}

export default EntryLevel;
