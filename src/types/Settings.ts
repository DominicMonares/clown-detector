type RangeSetup<T extends number, R extends unknown[]> =
  R['length'] extends T ? (
    R[number]
  ) : (
    RangeSetup<T, [R['length'], ...R]>
  );

type Range<T extends number> = number extends T ? (number) : RangeSetup<T, []>;

export type EntryLevelSetting = Range<6>;

export type Years = Range<16>;

export interface ClownlistSetting {
  [key: string]: boolean
}

export interface Settings {
  entryLevel: EntryLevelSetting,
  clownlist: ClownlistSetting
}

export interface EntryLevelProps {
  updateEntryLevel: (newEntryLevel: EntryLevelSetting) => void,
  defaultSlider: EntryLevelSetting
}

export interface ClownlistProps {
  updateClownlist: (toAdd: string, toRemove: string[]) => void,
  clownlist: ClownlistSetting;
}
