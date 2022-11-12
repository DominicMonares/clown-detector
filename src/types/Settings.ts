export type EntryLevelSetting = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type BlacklistSetting = Set<string> | Set<never>;

export interface Settings {
  entryLevel: EntryLevelSetting,
  blacklist: BlacklistSetting
}

export interface EntryLevelProps {
  updateEntryLevel: (newEntryLevel: EntryLevelSetting) => void,
  defaultSlider: EntryLevelSetting
}

export interface BlacklistProps {
  updateBlacklist: (toAdd: string, toRemove: string) => void,
  blacklist: BlacklistSetting;
}
