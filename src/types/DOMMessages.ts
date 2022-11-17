import { Settings } from "./Settings";

export interface ReactMessageReq {
  settings?: Settings
  urlUpdated?: boolean
}

export interface ResponseBody {
  settings?: Settings
}

export interface ReactMessageRes {
  status: string,
  body: ResponseBody
}

