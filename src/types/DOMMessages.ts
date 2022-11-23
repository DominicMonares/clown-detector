import { Settings } from "./Settings";

export interface ReactMessageReq {
  settings?: Settings
}

export interface ResponseBody {
  settings?: Settings
}

export interface ReactMessageRes {
  status: string,
  body: ResponseBody
}

export type ReactMessageListener = (
  msg: ReactMessageReq,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: ReactMessageRes) => void
) => boolean;
