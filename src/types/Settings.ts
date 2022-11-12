export type EntryLevelSetting = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Settings {
  entryLevel: EntryLevelSetting,
  blacklist: string[] | never[]
}

export interface EntryLevelProps {
  updateEntryLevel: (newEntryLevel: EntryLevelSetting) => void,
  defaultSlider: EntryLevelSetting
}
