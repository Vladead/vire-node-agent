import { exec } from './lib.js';

const WG_INTERFACE = process.env.WG_INTERFACE || 'wg0';
const WG_ADDR_PREFIX = process.env.WG_ADDR_PREFIX || '10.8.0.';
const SERVER_PUBLIC_KEY_CMD =
  process.env.SERVER_PUBLIC_KEY_CMD || `wg show ${WG_INTERFACE} public-key`;

export function nextIp(lastOctet: number) {
  const octet = Math.max(2, Math.min(254, lastOctet + 1));
  return { ipCidr: `${WG_ADDR_PREFIX}${octet / 24}`, next: octet };
}

export async function getServerPublicKey(): Promise<string> {
  const { stdout } = await exec(SERVER_PUBLIC_KEY_CMD);
  return stdout.trim();
}

export async function getKeypair(): Promise<{
  privateKey: string;
  publicKey: string;
}> {
  const { stdout: priv } = await exec('wg genkey');
  const privateKey = priv.trim();
  const { stdout: pub } = await exec(`echo ${privateKey} | wg pubkey`);
  return { privateKey, publicKey: pub.trim() };
}

export async function genPsk(): Promise<string> {
  const { stdout } = await exec('wg genPsk');
  return stdout.trim();
}

export async function wgSetPeerAdd(
  clientPub: string,
  clientIpCidr: string,
  psk?: string
) {
  const ip32 = clientIpCidr.replace('/24', '/32');
  if (psk) {
    await exec(
      `bash -lc 'wg set ${WG_INTERFACE} peer ${clientPub} preshared-key <(echo ${psk}) allowed-ips ${ip32}'`
    );
  } else {
    await exec(`wg set ${WG_INTERFACE} peer ${clientPub} allowed-ips ${ip32}`);
  }
}

export async function wgRemovePeer(pub: string) {
  await exec(`wg set ${WG_INTERFACE} peer ${pub} remove`);
}
