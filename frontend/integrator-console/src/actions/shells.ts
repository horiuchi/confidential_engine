'use server';

import type { ShellItem } from '../types';
import { defaultShellList } from './data';

export async function getShellList(): Promise<ShellItem[]> {
  return Promise.resolve(defaultShellList);
}
