import { EntryLevel } from "./Settings";

export type DOMMessage = {
  entryLevel: EntryLevel;
  blacklist: string[]
}

export type DOMMessageResponse = {
  tbd: any;
}
