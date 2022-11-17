export type EntryLevelSetting = 0 | 1 | 2 | 3 | 4 | 5;

export interface ClownlistSetting {
  [key: string]: boolean
}

export interface Settings {
  entryLevel: EntryLevelSetting,
  clownlist: ClownlistSetting,
}

export interface EntryLevelProps {
  updateEntryLevel: (newEntryLevel: EntryLevelSetting) => void,
  defaultSlider: EntryLevelSetting
}

export interface ClownlistProps {
  updateClownlist: (toAdd: string, toRemove: string) => void,
  clownlist: ClownlistSetting;
}
