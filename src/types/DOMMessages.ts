import { EntryLevelSetting, BlacklistSetting, Settings } from "./Settings";

export interface ReactMessageReq {
  entryLevel?: EntryLevelSetting,
  blacklist?: BlacklistSetting,
  urlUpdated?: boolean
}

export interface ResponseBody {
  settings?: Settings
}

export interface ReactMessageRes {
  status: string,
  body: ResponseBody
}

