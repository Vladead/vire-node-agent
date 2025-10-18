import { promisify } from 'util';
import { exec as _exec } from 'child_process';
import { readFile, writeFile } from 'fs/promises';

export const exec = promisify(_exec);

export type PeerState = {
  publicKey: string;
  ip: string;
  comment?: string;
  createdAt: string;
  psk?: string | null;
};

export type State = {
  peers: Record<string, PeerState>; // by publicKey
  lastIpOctet: number;
};

const STATE_FILE = process.env.STATE_FILE || '/etc/wireguard/peers.json';

export async function loadState(): Promise<State> {
  try {
    const buf = await readFile(STATE_FILE, 'utf8');
    return JSON.parse(buf);
  } catch {
    return { peers: {}, lastIpOctet: 1 };
  }
}

export async function saveState(s: State) {
  await writeFile(STATE_FILE, JSON.stringify(s, null, 2), { mode: 0o600 })
}

