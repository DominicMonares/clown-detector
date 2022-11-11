export type EntryLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Settings {
  entryLevel: EntryLevel,
  blacklist: string[] | never[]
}
