import { Settings, Years } from "./Settings";

export type ScanJob = (
  topCard: string,
  settings: Settings
) => void;

export type Site = 'linkedIn' | 'indeed';

export type WaitForTarget = (
  callback: (site: Site) => void,
  count: number
) => void;

export type WaitForPill = (
  callback: ScanJob,
  settings: Settings,
  count: number
) => void;

export type WaitForTopCard = WaitForPill;

export type CreateELKeywords = (
  entryLevel: Years,
  keywords: string[]
) => string[];

export type CheckPrefixes = (
  job: string,
  keyword: string
) => string | undefined
