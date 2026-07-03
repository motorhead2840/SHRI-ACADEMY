/**
 * SARA Token dashboard — cream/amber brand, all web3 logic preserved.
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@/hooks/useWallet";
import { fetchTokenInfo, TOKEN_ECONOMY, SARA_CONTRACT_ADDRESS, SEPOLIA_CHAIN_ID } from "@/lib/sara";

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
      .catch(() => setInfo({
        totalSupply: "10,000,000",
        maxSupply: "100,000,000",
        circulatingPct: 10,
        contractAddress: SARA_CONTRACT_ADDRESS || "Not yet deployed",
      }))
      .finally(() => setLoading(false));
  }, []);
  return { info, loading };
}

function Chip({ label, dot }: { label: string; dot?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider px-3 py-1.5 border border-primary/20 bg-primary/5 text-foreground">
      {dot && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: dot }} />}
      {label}
    </span>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-card border border-primary/15 p-6">
      <p className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-2">{label}</p>
      <p className="font-serif text-3xl text-foreground">{value}</p>
      {sub && <p className="font-sans text-xs text-stone-400 mt-1">{sub}</p>}
    </div>
  );
}

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
    try { await wallet.delegateTo(delegateInput); setDelegateInput(""); }
    catch (e) { console.error(e); }
    finally { setDelegating(false); }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent border border-accent/30 bg-accent/5 px-4 py-1.5 mb-8">
            Ethereum Sepolia · AWS Managed Blockchain
          </div>
          <h1 className="font-serif text-6xl text-foreground mb-4">
            <span className="text-primary">SARA</span> Token
          </h1>
          <p className="font-sans text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            <strong>SRI Adaptive Response Asset</strong> — the governance and utility token powering
            the SRI Learn global homeschooling ecosystem.
          </p>

          {/* Contract address strip */}
          <div className="mt-8 inline-flex items-center gap-3 bg-[#0B0F2E] border border-accent/20 px-5 py-2.5">
            <span className="font-mono text-xs text-stone-500 uppercase tracking-wider">Contract</span>
            <span className="font-mono text-sm text-[#E8C66A]">
              {SARA_CONTRACT_ADDRESS
                ? `${SARA_CONTRACT_ADDRESS.slice(0, 10)}…${SARA_CONTRACT_ADDRESS.slice(-8)}`
                : "Not yet deployed"}
            </span>
            {SARA_CONTRACT_ADDRESS && (
              <a href={`https://sepolia.etherscan.io/address/${SARA_CONTRACT_ADDRESS}`}
                target="_blank" rel="noreferrer"
                className="font-mono text-xs text-accent hover:text-foreground transition-colors">
                ↗ Etherscan
              </a>
            )}
          </div>
        </div>

        {/* ── Wallet Section ────────────────────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-8">
          <div className="bg-card border border-primary/15">
            <div className="px-8 py-5 border-b border-border flex items-center justify-between">
              <h2 className="font-serif text-2xl text-foreground">Your Wallet</h2>
              {isConnected && (
                <button onClick={wallet.disconnect}
                  className="font-sans text-xs text-stone-400 hover:text-stone-700 font-semibold transition-colors">
                  Disconnect
                </button>
              )}
            </div>

            <div className="p-8">
              {/* Not installed */}
              {wallet.status === "not_installed" && (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">🦊</div>
                  <p className="font-serif text-xl text-foreground mb-2">MetaMask not found</p>
                  <p className="font-sans text-sm text-muted-foreground mb-6">
                    Install MetaMask to connect your wallet and interact with SARA tokens.
                  </p>
                  <a href="https://metamask.io/download/" target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-sans font-bold uppercase tracking-[0.15em] text-sm px-6 py-3 hover:bg-[#E8C66A] transition-colors">
                    Install MetaMask →
                  </a>
                </div>
              )}

              {/* Wrong network */}
              {isWrongNetwork && (
                <div className="border-l-4 border-primary bg-primary/5 p-6 flex items-start gap-4">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="font-serif text-xl text-foreground mb-1">Wrong Network</p>
                    <p className="font-sans text-sm text-muted-foreground mb-4">
                      Please switch to <strong>Ethereum Sepolia</strong> (chain ID {SEPOLIA_CHAIN_ID}) to interact with SARA tokens.
                    </p>
                    <button onClick={wallet.switchToSepolia}
                      className="bg-primary text-primary-foreground font-sans font-bold uppercase tracking-wider text-sm px-5 py-2.5 hover:bg-[#E8C66A] transition-colors">
                      Switch to Sepolia →
                    </button>
                  </div>
                </div>
              )}

              {/* Idle / connecting / error */}
              {(wallet.status === "idle" || wallet.status === "connecting" || wallet.status === "error") && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary/10 border border-primary/20 flex items-center justify-center text-3xl mx-auto mb-5">
                    👛
                  </div>
                  <p className="font-serif text-xl text-foreground mb-1">Connect your wallet</p>
                  <p className="font-sans text-sm text-muted-foreground mb-6">
                    Connect MetaMask to view your SARA balance and governance power.
                  </p>
                  {wallet.errorMessage && (
                    <p className="font-mono text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 mb-5 inline-block">
                      {wallet.errorMessage}
                    </p>
                  )}
                  <button onClick={wallet.connect} disabled={wallet.status === "connecting"}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-sans font-bold uppercase tracking-[0.15em] text-sm px-8 py-3 hover:bg-[#E8C66A] transition-colors disabled:opacity-60">
                    {wallet.status === "connecting" ? (
                      <><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Connecting…</>
                    ) : "Connect MetaMask"}
                  </button>
                </div>
              )}

              {/* Connected */}
              {isConnected && (
                <div>
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
                    <div className="w-10 h-10 bg-primary/20 border border-primary/30 flex items-center justify-center font-mono text-sm font-bold text-primary">
                      {wallet.shortAddress?.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-mono text-sm font-bold text-foreground">{wallet.shortAddress}</p>
                      <p className="font-sans text-xs text-stone-400">Sepolia Testnet</p>
                    </div>
                    <div className="ml-auto">
                      <Chip label="Connected" dot="#10B981" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-primary/5 border border-primary/20 p-5 col-span-2 md:col-span-1">
                      <p className="font-mono text-xs uppercase tracking-widest text-primary mb-2">SARA Balance</p>
                      <p className="font-serif text-4xl text-primary">{wallet.saraBalance ?? "—"}</p>
                      <p className="font-mono text-xs text-primary/60 mt-1">SARA</p>
                    </div>
                    <div className="bg-muted/40 border border-border p-5">
                      <p className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-2">ETH Balance</p>
                      <p className="font-serif text-3xl text-foreground">{wallet.ethBalance ?? "—"}</p>
                      <p className="font-mono text-xs text-stone-400 mt-1">ETH</p>
                    </div>
                    <div className="bg-accent/5 border border-accent/20 p-5">
                      <p className="font-mono text-xs uppercase tracking-widest text-accent mb-2">Voting Power</p>
                      <p className="font-serif text-3xl text-accent">{wallet.votingPower ?? "—"}</p>
                      <p className="font-mono text-xs text-accent/60 mt-1">SARA votes</p>
                    </div>
                  </div>

                  {wallet.saraBalance === "—" && !SARA_CONTRACT_ADDRESS && (
                    <p className="mt-5 font-mono text-xs text-primary bg-primary/5 border border-primary/20 px-4 py-2.5">
                      ⚠ SARA contract not yet deployed. Set <code>VITE_SARA_CONTRACT_ADDRESS</code> after deploying.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* ── Token Economy ──────────────────────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mb-8">
          <div className="border-l-4 border-primary pl-6 mb-8">
            <h2 className="font-serif text-3xl text-foreground">Token Economy</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border mb-1">
            <StatCard label="Max Supply" value="100M" sub="SARA tokens (hard cap)" />
            <StatCard label="Total Supply" value={infoLoading ? "…" : `${info?.totalSupply ?? "10M"}`} sub="currently minted" />
            <StatCard label="Circulating" value={infoLoading ? "…" : `${info?.circulatingPct ?? 10}%`} sub="of max supply" />
            <StatCard label="Network" value="Sepolia" sub="AWS Managed Blockchain" />
          </div>

          {/* Allocation */}
          <div className="bg-card border border-primary/15 p-8">
            <p className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-5">Token Allocation</p>
            {/* Segmented bar */}
            <div className="flex h-3 mb-6 overflow-hidden border border-border">
              {TOKEN_ECONOMY.tranches.map(t => (
                <div key={t.label} style={{ width: `${t.pct}%`, background: t.color }} title={`${t.label}: ${t.pct}%`} />
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {TOKEN_ECONOMY.tranches.map(t => (
                <div key={t.label} className="flex items-start gap-3">
                  <div className="w-3 h-3 mt-0.5 shrink-0" style={{ background: t.color }} />
                  <div>
                    <p className="font-sans text-sm font-semibold text-foreground">{t.label}</p>
                    <p className="font-mono text-xs text-stone-400">{t.tokens.toLocaleString()} SARA · {t.pct}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── DAO Governance ─────────────────────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mb-8">
          <div className="border-l-4 border-accent pl-6 mb-8">
            <h2 className="font-serif text-3xl text-foreground">DAO Governance</h2>
          </div>

          <div className="bg-[#0B0F2E] border border-accent/30 p-8 relative shadow-[0_0_40px_rgba(79,172,254,0.06)]">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent" />

            <div className="flex items-start justify-between mb-6 gap-4">
              <div>
                <p className="font-mono text-xs text-stone-500 uppercase tracking-widest mb-2">Coming Soon</p>
                <h3 className="font-serif text-2xl text-[#E8C66A] mb-2">SRI DAO Voting</h3>
                <p className="font-sans text-stone-400 text-sm leading-relaxed max-w-lg">
                  Full governance voting, proposal creation, and treasury management will be
                  available once the DAO Governor contract is deployed on AWS Managed Blockchain.
                </p>
              </div>
              <span className="text-4xl hidden md:block">🗳</span>
            </div>

            {/* Delegate form — live now if wallet + contract ready */}
            {isConnected && SARA_CONTRACT_ADDRESS && (
              <div className="bg-white/5 border border-white/10 p-6 mt-2">
                <p className="font-sans text-sm font-bold text-white mb-1">Delegate your voting power</p>
                <p className="font-sans text-xs text-stone-400 mb-4">
                  Delegate your SARA votes to yourself or another address to activate governance power.
                </p>
                <div className="flex gap-2">
                  <input type="text" value={delegateInput} onChange={e => setDelegateInput(e.target.value)}
                    placeholder="0x… or paste your own address"
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-white placeholder:text-stone-500 font-mono text-sm focus:outline-none focus:border-accent/50" />
                  <button onClick={() => setDelegateInput(wallet.address ?? "")}
                    className="px-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-stone-300 font-mono text-xs transition-colors">
                    Self
                  </button>
                  <button onClick={handleDelegate} disabled={!delegateInput || delegating}
                    className="px-5 py-2 bg-primary text-primary-foreground font-sans font-bold text-sm hover:bg-[#E8C66A] transition-colors disabled:opacity-50">
                    {delegating ? "…" : "Delegate"}
                  </button>
                </div>
                {wallet.delegate && wallet.delegate !== "0x0000000000000000000000000000000000000000" && (
                  <p className="font-mono text-xs text-stone-500 mt-3">
                    Currently delegated to: <span className="text-[#E8C66A]">{wallet.delegate}</span>
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-6">
              {["ERC-20 Votes", "Snapshot Governance", "DAO Treasury (40M SARA)", "Proposal Threshold TBD", "Quorum TBD"].map(chip => (
                <span key={chip} className="font-mono text-xs px-3 py-1.5 border border-white/10 text-stone-400">{chip}</span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── AWS Infrastructure ─────────────────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="bg-card border border-primary/15 p-8">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center text-xl">☁</div>
              <div>
                <h3 className="font-serif text-xl text-foreground">AWS Managed Blockchain</h3>
                <p className="font-sans text-xs text-stone-400">Enterprise Ethereum node infrastructure</p>
              </div>
            </div>
            <p className="font-sans text-muted-foreground text-sm leading-relaxed mb-6">
              SARA token operations are backed by an <strong>AWS Managed Blockchain</strong> Ethereum
              Sepolia node — providing enterprise-grade availability, SigV4 security, and CloudWatch
              monitoring. All read queries are served through the SRI API server with AWS SDK authentication.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
              {[
                { icon: "🔒", label: "SigV4 Auth" },
                { icon: "📊", label: "CloudWatch Metrics" },
                { icon: "🌐", label: "Sepolia Testnet" },
                { icon: "⚡", label: "Query API" },
              ].map(f => (
                <div key={f.label} className="flex items-center gap-2 bg-card p-4">
                  <span className="text-lg">{f.icon}</span>
                  <span className="font-sans text-xs font-semibold text-foreground">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

      </motion.div>
    </div>
  );
}
