import { Settings, Years } from "./Settings";

export type ScanJob = (
  topCard: string,
  settings: Settings
) => void;

export type WaitForTopCard = (
  callback: ScanJob,
  settings: Settings,
  count: number
) => void;

export type WaitForTarget = (
  callback: () => void,
  count: number
) => void;

export type CreateELKeywords = (
  entryLevel: Years,
  keywords: string[]
) => string[];

export type CheckPrefixes = (
  job: string,
  keyword: string
) => string | undefined
