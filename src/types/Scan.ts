import { Settings, Years } from "./Settings";

export type ScanJob = (
  topCard: string,
  settings: Settings
) => void

export type WaitForTopCard = (
  callback: ScanJob,
  settings: Settings,
  count: number
) => void

export type CreateELKeywords = (
  entryLevel: Years,
  keywords: string[]
) => string[];
