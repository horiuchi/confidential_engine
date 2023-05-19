import type { DateTime } from 'luxon';

export interface RequestItem {
  id: string;
  status: RequestStatus;
  lastUpdated: DateTime;
  created: DateTime;
  shellId: string;
  appIds: string[];
  url?: string;
}

export type RequestStatus =
  | 'Accepted'
  | 'Building'
  | 'Finished'
  | 'Rejected'
  | 'Failed';

export interface ShellItem {
  id: string;
  name: string;
  iconUrl: string;
}

export interface AppItem {
  appId: string;
  name: string;
  version: string;
  iconUrl: string;
  description: string;
  lastUpdated: DateTime;
  developer: string;
}
