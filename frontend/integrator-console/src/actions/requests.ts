'use server';

import { DateTime } from 'luxon';
import { ulid } from 'ulid';
import type { AppItem, RequestItem, ShellItem } from '../types';
import { isNotNull } from '../utils/filter';
import { getAppList } from './apps';
import { defaultRequestList } from './data';
import { getShellList } from './shells';

const list = defaultRequestList;

export type MergedRequestItem = Omit<RequestItem, 'shellId' | 'appIds'> & {
  shell: ShellItem;
  apps: AppItem[];
};

export async function getRequestList(): Promise<RequestItem[]> {
  return Promise.resolve(list);
}

export async function getMergedRequestList(): Promise<MergedRequestItem[]> {
  const requestList = await getRequestList();
  const shellList = await getShellList();
  const appList = await getAppList();

  return requestList.map((request) => ({
    ...request,
    shell: shellList.find((shell) => shell.id === request.shellId)!,
    apps: request.appIds
      .map((appId) => appList.find((app) => app.appId === appId))
      .filter(isNotNull),
  }));
}

export async function postBuildRequest(
  shellId: string,
  appIds: string[],
): Promise<RequestItem> {
  const request: RequestItem = {
    id: ulid(),
    status: 'Accepted',
    created: DateTime.local(),
    lastUpdated: DateTime.local(),
    shellId,
    appIds,
  };

  list.unshift(request);
  return Promise.resolve(request);
}
