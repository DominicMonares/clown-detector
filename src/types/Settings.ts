export type EntryLevelSetting = 0 | 1 | 2 | 3 | 4 | 5;

export interface BlacklistSetting {
  [key: string]: boolean
}

export interface Settings {
  entryLevel: EntryLevelSetting,
  blacklist: BlacklistSetting,
}

export interface EntryLevelProps {
  updateEntryLevel: (newEntryLevel: EntryLevelSetting) => void,
  defaultSlider: EntryLevelSetting
}

export interface BlacklistProps {
  updateBlacklist: (toAdd: string, toRemove: string) => void,
  blacklist: BlacklistSetting;
}
