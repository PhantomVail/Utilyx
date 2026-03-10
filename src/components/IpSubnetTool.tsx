import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./ToolSidebar";

function ipToInt(ip: string): number {
  const parts = ip.split(".").map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function intToIp(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}

function isValidIp(ip: string): boolean {
  const parts = ip.split(".");
  if (parts.length !== 4) return false;
  return parts.every((p) => { const n = Number(p); return !isNaN(n) && n >= 0 && n <= 255 && String(n) === p; });
}

interface SubnetInfo {
  network: string; broadcast: string; firstHost: string; lastHost: string;
  mask: string; wildcard: string; totalHosts: number; usableHosts: number;
  cidr: number; ipClass: string; isPrivate: boolean; binary: string;
}

function calcSubnet(ip: string, cidr: number): SubnetInfo | null {
  if (!isValidIp(ip) || cidr < 0 || cidr > 32) return null;
  const ipInt = ipToInt(ip);
  const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | ~maskInt) >>> 0;
  const total = Math.pow(2, 32 - cidr);

  const first = networkInt & 255;
  const cls = first < 128 ? "A" : first < 192 ? "B" : first < 224 ? "C" : first < 240 ? "D" : "E";
  const priv = (first === 10) || (first === 172 && ((networkInt >>> 16) & 255) >= 16 && ((networkInt >>> 16) & 255) <= 31) || (first === 192 && ((networkInt >>> 16) & 255) === 168);

  const bin = ipInt.toString(2).padStart(32, "0");

  return {
    network: intToIp(networkInt), broadcast: intToIp(broadcastInt),
    firstHost: cidr >= 31 ? intToIp(networkInt) : intToIp(networkInt + 1),
    lastHost: cidr >= 31 ? intToIp(broadcastInt) : intToIp(broadcastInt - 1),
    mask: intToIp(maskInt), wildcard: intToIp(~maskInt >>> 0),
    totalHosts: total, usableHosts: cidr >= 31 ? total : Math.max(total - 2, 0),
    cidr, ipClass: cls, isPrivate: priv,
    binary: `${bin.slice(0, 8)}.${bin.slice(8, 16)}.${bin.slice(16, 24)}.${bin.slice(24)}`,
  };
}

export function IpSubnetTool() {
  const [ip, setIp] = useState("192.168.1.100");
  const [cidr, setCidr] = useState(24);
  const { CopyButton } = useCopyToClipboard();

  const info = useMemo(() => calcSubnet(ip, cidr), [ip, cidr]);

  const rows: [string, string][] = info ? [
    ["Network", `${info.network}/${info.cidr}`],
    ["Broadcast", info.broadcast],
    ["First Host", info.firstHost],
    ["Last Host", info.lastHost],
    ["Subnet Mask", info.mask],
    ["Wildcard", info.wildcard],
    ["Total Hosts", info.totalHosts.toLocaleString()],
    ["Usable Hosts", info.usableHosts.toLocaleString()],
    ["IP Class", info.ipClass],
    ["Private", info.isPrivate ? "Yes" : "No"],
    ["Binary", info.binary],
  ] : [];

  const summaryText = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex gap-3 flex-wrap items-end">
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">IP Address</label>
          <input type="text" value={ip} onChange={(e) => setIp(e.target.value)}
            className="w-44 bg-surface border border-border rounded-lg px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">CIDR (/{cidr})</label>
          <div className="flex items-center bg-secondary rounded-lg overflow-hidden">
            <button onClick={() => setCidr(Math.max(0, cidr - 1))} disabled={cidr <= 0}
              className="px-2 py-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm disabled:opacity-30">−</button>
            <input type="text" inputMode="numeric" value={cidr}
              onChange={(e) => { const n = parseInt(e.target.value); if (!isNaN(n)) setCidr(Math.min(32, Math.max(0, n))); }}
              className="w-12 text-center bg-transparent font-mono text-xs text-foreground focus:outline-none border-x border-border py-1.5" />
            <button onClick={() => setCidr(Math.min(32, cidr + 1))} disabled={cidr >= 32}
              className="px-2 py-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm disabled:opacity-30">+</button>
          </div>
        </div>
      </div>

      {/* Quick CIDR buttons */}
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Common Subnets</label>
        <div className="flex flex-wrap gap-1.5">
          {[8, 16, 20, 22, 24, 25, 26, 27, 28, 29, 30, 32].map((c) => (
            <button key={c} onClick={() => setCidr(c)}
              className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${cidr === c ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
              /{c}
            </button>
          ))}
        </div>
      </div>

      {info ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Subnet Details</label>
            <CopyButton text={summaryText} />
          </div>
          <div className="bg-surface border border-border rounded-lg overflow-hidden divide-y divide-border">
            {rows.map(([k, v]) => (
              <div key={k} className="flex items-center px-4 py-2">
                <span className="text-xs text-muted-foreground w-28 shrink-0">{k}</span>
                <span className="font-mono text-xs text-foreground break-all">{v}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-lg px-4 py-8 text-center text-sm text-muted-foreground">
          Enter a valid IP address
        </div>
      )}
    </div>
  );
}
