type Ran<T extends number> = number extends T ? (number) : _Range<T, []>;

type _Range<T extends number, R extends unknown[]> = R['length'] extends T ? (
  R[number]
) : (
  _Range<T, [R['length'], ...R]>
);

export type EntryLevelSetting = Ran<6>;

export type EntryLevel = Ran<16>;

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
