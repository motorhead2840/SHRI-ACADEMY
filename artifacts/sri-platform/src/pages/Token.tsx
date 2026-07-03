import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@/hooks/useWallet";
import { fetchTokenInfo, TOKEN_ECONOMY, SARA_CONTRACT_ADDRESS, SEPOLIA_CHAIN_ID } from "@/lib/sara";

// ─── Token stats from API ─────────────────────────────────────────────────────

interface TokenInfo {
  totalSupply: string;
  maxSupply: string;
  circulatingPct: number;
  contractAddress: string;
}

function useTokenInfo() {
  const [info, setInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTokenInfo()
      .then(setInfo)
      .catch(() => {
        // Fallback static values before contract is deployed
        setInfo({
          totalSupply: "10,000,000",
          maxSupply: "100,000,000",
          circulatingPct: 10,
          contractAddress: SARA_CONTRACT_ADDRESS || "Not yet deployed",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return { info, loading };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
      style={{ background: `${color}20`, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }} />
      {label}
    </span>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">{label}</p>
      <p className="text-2xl font-extrabold text-stone-800">{value}</p>
      {sub && <p className="text-xs text-stone-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Token() {
  const wallet = useWallet();
  const { info, loading: infoLoading } = useTokenInfo();
  const [delegateInput, setDelegateInput] = useState("");
  const [delegating, setDelegating] = useState(false);

  const isWrongNetwork = wallet.status === "wrong_network";
  const isConnected = wallet.status === "connected";

  const handleDelegate = async () => {
    if (!delegateInput) return;
    setDelegating(true);
    try {
      await wallet.delegateTo(delegateInput);
      setDelegateInput("");
    } catch (e) {
      console.error(e);
    } finally {
      setDelegating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-amber-50">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-700 pt-24 pb-16 px-6">
        {/* Decorative rings */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full border border-white/10" />
          <div className="absolute top-8 -right-8 w-48 h-48 rounded-full border border-white/10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full border border-white/5 -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl shadow">
                ⬡
              </div>
              <div>
                <StatusBadge label="Ethereum Sepolia · AWS Managed Blockchain" color="#A78BFA" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-3 tracking-tight">
              SARA Token
            </h1>
            <p className="text-violet-200 text-lg max-w-2xl leading-relaxed">
              <strong className="text-white">SRI Adaptive Response Asset</strong> — the governance and
              utility token powering the SRI Learn global homeschooling ecosystem.
            </p>

            {/* Contract address */}
            <div className="mt-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-xl px-4 py-2">
              <span className="text-violet-300 text-xs font-mono uppercase tracking-wider">Contract</span>
              <span className="text-white font-mono text-sm">
                {SARA_CONTRACT_ADDRESS
                  ? `${SARA_CONTRACT_ADDRESS.slice(0, 10)}…${SARA_CONTRACT_ADDRESS.slice(-8)}`
                  : "Not yet deployed"}
              </span>
              {SARA_CONTRACT_ADDRESS && (
                <a
                  href={`https://sepolia.etherscan.io/address/${SARA_CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-violet-300 hover:text-white transition-colors text-xs"
                >
                  ↗ Etherscan
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">

        {/* ── Wallet Connect ────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white rounded-3xl border-2 border-stone-100 shadow-sm overflow-hidden">
            <div className="px-7 py-5 border-b border-stone-100 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-stone-800">Your Wallet</h2>
              {isConnected && (
                <button
                  onClick={wallet.disconnect}
                  className="text-xs text-stone-400 hover:text-stone-600 font-semibold transition-colors"
                >
                  Disconnect
                </button>
              )}
            </div>

            <div className="p-7">
              {/* Not installed */}
              {wallet.status === "not_installed" && (
                <div className="text-center py-6">
                  <div className="text-5xl mb-4">🦊</div>
                  <p className="text-stone-700 font-bold mb-2">MetaMask not found</p>
                  <p className="text-stone-500 text-sm mb-4">
                    Install MetaMask to connect your wallet and interact with SARA tokens.
                  </p>
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl transition-colors"
                  >
                    Install MetaMask →
                  </a>
                </div>
              )}

              {/* Wrong network */}
              {isWrongNetwork && (
                <div className="rounded-2xl bg-amber-50 border-2 border-amber-200 p-5 flex items-start gap-4">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="font-bold text-amber-800 mb-1">Wrong Network</p>
                    <p className="text-amber-700 text-sm mb-3">
                      Please switch to <strong>Ethereum Sepolia</strong> (chain ID {SEPOLIA_CHAIN_ID}) to interact with SARA tokens.
                    </p>
                    <button
                      onClick={wallet.switchToSepolia}
                      className="bg-amber-400 hover:bg-amber-500 text-amber-900 font-bold px-4 py-2 rounded-xl text-sm transition-colors"
                    >
                      Switch to Sepolia →
                    </button>
                  </div>
                </div>
              )}

              {/* Idle / connecting */}
              {(wallet.status === "idle" || wallet.status === "connecting" || wallet.status === "error") && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center text-3xl mx-auto mb-4">
                    👛
                  </div>
                  <p className="text-stone-700 font-bold mb-1">Connect your wallet</p>
                  <p className="text-stone-500 text-sm mb-5">
                    Connect MetaMask to view your SARA balance and governance power.
                  </p>
                  {wallet.errorMessage && (
                    <p className="text-red-500 text-sm mb-4 bg-red-50 rounded-xl px-4 py-2">
                      {wallet.errorMessage}
                    </p>
                  )}
                  <button
                    onClick={wallet.connect}
                    disabled={wallet.status === "connecting"}
                    className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-60"
                  >
                    {wallet.status === "connecting" ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Connecting…
                      </>
                    ) : (
                      "Connect MetaMask"
                    )}
                  </button>
                </div>
              )}

              {/* Connected */}
              {isConnected && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                      {wallet.shortAddress?.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-mono text-sm font-bold text-stone-800">{wallet.shortAddress}</p>
                      <p className="text-xs text-stone-400">Sepolia Testnet</p>
                    </div>
                    <div className="ml-auto">
                      <StatusBadge label="Connected" color="#10B981" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-violet-50 rounded-2xl p-4 col-span-2 md:col-span-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-1">SARA Balance</p>
                      <p className="text-3xl font-extrabold text-violet-700">{wallet.saraBalance ?? "—"}</p>
                      <p className="text-xs text-violet-400 mt-1">SARA</p>
                    </div>
                    <div className="bg-stone-50 rounded-2xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">ETH Balance</p>
                      <p className="text-2xl font-extrabold text-stone-700">{wallet.ethBalance ?? "—"}</p>
                      <p className="text-xs text-stone-400 mt-1">ETH</p>
                    </div>
                    <div className="bg-indigo-50 rounded-2xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">Voting Power</p>
                      <p className="text-2xl font-extrabold text-indigo-700">{wallet.votingPower ?? "—"}</p>
                      <p className="text-xs text-indigo-400 mt-1">SARA votes</p>
                    </div>
                  </div>

                  {wallet.saraBalance === "—" && !SARA_CONTRACT_ADDRESS && (
                    <p className="mt-4 text-xs text-amber-600 bg-amber-50 rounded-xl px-4 py-2">
                      ⚠️ SARA contract not yet deployed. Set <code className="font-mono">VITE_SARA_CONTRACT_ADDRESS</code> after deploying.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* ── Token Economy ─────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-extrabold text-stone-800 mb-5">Token Economy</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Max Supply"
              value="100M"
              sub="SARA tokens (hard cap)"
            />
            <StatCard
              label="Total Supply"
              value={infoLoading ? "…" : `${info?.totalSupply ?? "10M"}`}
              sub="currently minted"
            />
            <StatCard
              label="Circulating"
              value={infoLoading ? "…" : `${info?.circulatingPct ?? 10}%`}
              sub="of max supply"
            />
            <StatCard
              label="Network"
              value="Sepolia"
              sub="AWS Managed Blockchain"
            />
          </div>

          {/* Allocation bar */}
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-7">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-5">Token Allocation</h3>

            {/* Stacked bar */}
            <div className="flex h-4 rounded-full overflow-hidden mb-5">
              {TOKEN_ECONOMY.tranches.map((t) => (
                <div
                  key={t.label}
                  style={{ width: `${t.pct}%`, background: t.color }}
                  title={`${t.label}: ${t.pct}%`}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {TOKEN_ECONOMY.tranches.map((t) => (
                <div key={t.label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: t.color }} />
                  <div>
                    <p className="text-xs font-bold text-stone-700">{t.label}</p>
                    <p className="text-xs text-stone-400">{t.tokens.toLocaleString()} SARA · {t.pct}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── Governance (placeholder) ──────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-extrabold text-stone-800 mb-5">DAO Governance</h2>

          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-7 text-white">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-violet-200 text-xs font-bold uppercase tracking-wider mb-2">Coming Soon</p>
                <h3 className="text-2xl font-extrabold mb-2">SRI DAO Voting</h3>
                <p className="text-violet-200 text-sm leading-relaxed max-w-lg">
                  Full governance voting, proposal creation, and treasury management will be
                  available once the DAO Governor contract is deployed. Economy and DAO voting
                  parameters are being finalized.
                </p>
              </div>
              <span className="text-5xl hidden md:block">🗳️</span>
            </div>

            {/* Delegate votes (available now if wallet connected + contract deployed) */}
            {isConnected && SARA_CONTRACT_ADDRESS && (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-5 mt-2">
                <p className="text-sm font-bold mb-3">Delegate your voting power now</p>
                <p className="text-violet-200 text-xs mb-4">
                  You can delegate your SARA votes to yourself or another address.
                  Delegation is needed to activate voting power — even if you're voting yourself.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={delegateInput}
                    onChange={(e) => setDelegateInput(e.target.value)}
                    placeholder="0x… or paste your own address"
                    className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-violet-300 text-sm focus:outline-none focus:border-white/40"
                  />
                  <button
                    onClick={() => {
                      setDelegateInput(wallet.address ?? "");
                    }}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-violet-200 text-xs font-semibold transition-colors"
                  >
                    Self
                  </button>
                  <button
                    onClick={handleDelegate}
                    disabled={!delegateInput || delegating}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-violet-50 text-violet-700 font-bold text-sm transition-colors disabled:opacity-50"
                  >
                    {delegating ? "…" : "Delegate"}
                  </button>
                </div>
                {wallet.delegate && wallet.delegate !== "0x0000000000000000000000000000000000000000" && (
                  <p className="text-violet-200 text-xs mt-3">
                    Currently delegated to: <span className="font-mono">{wallet.delegate}</span>
                  </p>
                )}
              </div>
            )}

            {/* Info chips */}
            <div className="flex flex-wrap gap-3 mt-5">
              {[
                "ERC-20 Votes",
                "Snapshot Governance",
                "DAO Treasury (40M SARA)",
                "Proposal Threshold TBD",
                "Quorum TBD",
              ].map((chip) => (
                <span
                  key={chip}
                  className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 border border-white/20 text-violet-100"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── AWS Integration info ──────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl">☁️</div>
              <div>
                <h3 className="font-extrabold text-stone-800">AWS Managed Blockchain</h3>
                <p className="text-xs text-stone-400">Enterprise Ethereum node infrastructure</p>
              </div>
            </div>
            <p className="text-stone-600 text-sm leading-relaxed mb-4">
              SARA token operations are backed by an <strong>AWS Managed Blockchain</strong> Ethereum
              Sepolia node — providing enterprise-grade availability, SigV4 security, and CloudWatch
              monitoring. All read queries are served through the SRI API server with AWS SDK authentication.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: "🔒", label: "SigV4 Auth" },
                { icon: "📊", label: "CloudWatch Metrics" },
                { icon: "🌐", label: "Sepolia Testnet" },
                { icon: "⚡", label: "Query API" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2 bg-stone-50 rounded-xl p-3">
                  <span className="text-lg">{f.icon}</span>
                  <span className="text-xs font-bold text-stone-600">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
