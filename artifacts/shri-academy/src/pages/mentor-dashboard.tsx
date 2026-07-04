import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import {
  Terminal, LogOut, BarChart3, MessageSquare, RefreshCw, AlertTriangle,
  Users, CreditCard, Activity, ShieldCheck, Lock, Cpu, Database,
  Brain, Radio, CheckCircle, ExternalLink, Server, Zap, Eye, Key,
  GitBranch, AlertOctagon, FlaskConical, ArrowRight,
} from 'lucide-react';
import { getMentorMe, getMentorMetrics } from '@/lib/mentor-api';
import Home from '@/pages/home';

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export default function MentorDashboard() {
  const [, setLocation] = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [email, setEmail] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'mentoring' | 'metrics' | 'security'>('mentoring');

  const [metrics, setMetrics] = useState<any>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('mentor_token');
    if (!token) {
      setLocation('/mentor/login');
      return;
    }

    const payload = parseJwt(token);
    if (payload && payload.email) {
      setEmail(payload.email);
    }

    // Verify token
    getMentorMe(token)
      .then((data) => {
        if (data.email) {
          setEmail(data.email);
        }
        setIsVerifying(false);
      })
      .catch(() => {
        localStorage.removeItem('mentor_token');
        setLocation('/mentor/login');
      });
  }, [setLocation]);

  const fetchMetrics = async () => {
    const token = localStorage.getItem('mentor_token');
    if (!token) return;
    
    setMetricsLoading(true);
    setMetricsError(null);
    try {
      const data = await getMentorMetrics(token);
      setMetrics(data);
      setLastUpdated(new Date());
    } catch (err: any) {
      setMetricsError(err.message || 'FAILED_TO_FETCH_METRICS');
    } finally {
      setMetricsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'metrics' && !metrics && !metricsLoading && !metricsError) {
      fetchMetrics();
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('mentor_token');
    setLocation('/mentor/login');
  };

  if (isVerifying) {
    return (
      <div className="min-h-[100dvh] bg-black text-system font-mono flex items-center justify-center">
        <div className="flex items-center gap-3 animate-pulse text-mentor">
          <Terminal className="w-5 h-5" />
          <span className="uppercase tracking-widest text-sm">VERIFYING_CREDENTIALS...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-black text-system font-mono overflow-hidden selection:bg-system/30 selection:text-system">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center p-3 sm:p-4 border-b border-mentor/30 bg-black/80 backdrop-blur z-10 gap-3">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-mentor" />
          <h1 className="text-lg font-bold tracking-widest text-glow-mentor text-mentor uppercase leading-tight">MENTOR_PORTAL</h1>
        </div>
        
        <div className="flex items-center gap-4 text-xs uppercase tracking-wider text-mentor/80 border border-mentor/20 px-3 py-1.5 bg-mentor/5">
          <span className="hidden sm:inline">CLEARANCE: SCHOOL_MENTOR</span>
          <span className="hidden sm:inline text-mentor/30">|</span>
          <span className="text-mentor font-bold">{email || 'UNKNOWN_USER'}</span>
          <span className="text-mentor/30">|</span>
          <button 
            onClick={handleLogout}
            className="hover:text-user hover:text-glow-user transition-colors cursor-pointer flex items-center gap-1"
          >
            [ LOGOUT ] <LogOut className="w-3 h-3 inline" />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-mentor/20 bg-black/50 z-10 overflow-x-auto">
        <button
          onClick={() => setActiveTab('mentoring')}
          className={`flex-1 min-w-max py-3 px-4 uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'mentoring' 
              ? 'border-b-2 border-mentor text-mentor bg-mentor/10 text-glow-mentor' 
              : 'text-mentor/50 hover:text-mentor/80 hover:bg-mentor/5'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> AI_MENTORING
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex-1 min-w-max py-3 px-4 uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'metrics' 
              ? 'border-b-2 border-system text-system bg-system/10 text-glow-system' 
              : 'text-system/50 hover:text-system/80 hover:bg-system/5'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> SCHOLARSHIP_METRICS
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 min-w-max py-3 px-4 uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'security' 
              ? 'border-b-2 border-user text-user bg-user/10 text-glow-user' 
              : 'text-user/40 hover:text-user/70 hover:bg-user/5'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> SECURITY_INFRA
        </button>
      </div>

      {/* Content Area */}
      <main className="flex-1 relative overflow-hidden bg-black">
        {/* Background Decorative Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(139,92,246,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.2)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {activeTab === 'mentoring' ? (
          <div className="absolute inset-0 relative h-full">
            <Home isMentorObserver={true} />
          </div>
        ) : activeTab === 'security' ? (
          <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-10">
            <SecurityInfraTab />
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-10">
            <div className="max-w-6xl mx-auto space-y-8">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-system/30 pb-4">
                <div>
                  <h2 className="text-xl text-system font-bold tracking-widest uppercase text-glow-system flex items-center gap-2">
                    <Activity className="w-5 h-5" /> SYSTEM_TELEMETRY
                  </h2>
                  <div className="text-xs text-system/60 uppercase mt-1">
                    {lastUpdated ? `LAST_UPDATED: ${lastUpdated.toLocaleTimeString()}` : 'AWAITING_DATA'}
                  </div>
                </div>
                <button
                  onClick={fetchMetrics}
                  disabled={metricsLoading}
                  className="flex items-center gap-2 px-4 py-2 border border-system/50 text-system hover:bg-system/10 transition-colors uppercase cursor-pointer disabled:opacity-50 disabled:hover:bg-transparent text-sm"
                  data-testid="metrics-refresh-btn"
                >
                  <RefreshCw className={`w-4 h-4 ${metricsLoading ? 'animate-spin' : ''}`} />
                  {metricsLoading ? 'FETCHING...' : 'REFRESH_DATA'}
                </button>
              </div>

              {metricsError ? (
                <div className="p-4 border border-destructive bg-destructive/10 text-destructive flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <div>
                    <div className="font-bold uppercase tracking-widest mb-1">TELEMETRY_FAILURE</div>
                    <div className="text-sm opacity-80 uppercase">{metricsError}</div>
                  </div>
                </div>
              ) : metricsLoading && !metrics ? (
                <div className="space-y-6 animate-pulse opacity-60">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-24 border border-system/30 bg-system/5"></div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-24 border border-system/30 bg-system/5"></div>
                    ))}
                  </div>
                  <div className="text-center text-system uppercase tracking-widest py-8">
                    FETCHING_DATA...
                  </div>
                </div>
              ) : metrics ? (
                <div className="space-y-6">
                  
                  {/* ROW 1: Users */}
                  <div className="space-y-2">
                    <div className="text-xs uppercase text-system/50 flex items-center gap-2 mb-2">
                      <Users className="w-3 h-3" /> USER_DEMOGRAPHICS
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <MetricCard title="TOTAL_USERS" value={metrics.users?.total} testId="metric-total-users" />
                      <MetricCard title="ENROLLED_STUDENTS" value={metrics.users?.students} />
                      <MetricCard title="ACTIVE_MENTORS" value={metrics.users?.mentors} highlight="mentor" />
                    </div>
                  </div>

                  {/* ROW 2: Subscriptions */}
                  <div className="space-y-2">
                    <div className="text-xs uppercase text-system/50 flex items-center gap-2 mb-2">
                      <CreditCard className="w-3 h-3" /> SUBSCRIPTION_STATUS
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <MetricCard title="ACTIVE_SUBSCRIPTIONS" value={metrics.subscriptions?.active_total} testId="metric-active-subs" />
                      <MetricCard title="VIA_STRIPE" value={metrics.subscriptions?.via_stripe} />
                      <MetricCard title="VIA_CRYPTO" value={metrics.subscriptions?.via_crypto} highlight="user" />
                    </div>
                  </div>

                  {/* ROW 3: Tiers */}
                  <div className="space-y-2">
                    <div className="text-xs uppercase text-system/50 mb-2">TIER_BREAKDOWN</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <MetricCard 
                        title="STANDARD_TIER" 
                        value={metrics.subscriptions?.tiers?.standard} 
                        subValue="$29.99/mo"
                        testId="metric-tier-high" 
                      />
                      <MetricCard 
                        title="REGIONAL_TIER" 
                        value={metrics.subscriptions?.tiers?.regional} 
                        subValue="$14.99/mo"
                        testId="metric-tier-middle" 
                      />
                      <MetricCard 
                        title="ACCESS_TIER" 
                        value={metrics.subscriptions?.tiers?.access} 
                        subValue="$4.99/mo"
                        testId="metric-tier-low" 
                      />
                    </div>
                  </div>

                  {/* ROW 4: Crypto */}
                  <div className="space-y-2">
                    <div className="text-xs uppercase text-system/50 mb-2">CRYPTO_ACTIVITY_30D</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <MetricCard title="TRANSACTIONS_30D" value={metrics.crypto_payments_30d?.total_transactions} highlight="user" />
                      <MetricCard 
                        title="VOLUME_USD" 
                        value={`$${(metrics.crypto_payments_30d?.total_usd_volume || 0).toFixed(2)}`} 
                        highlight="user" 
                      />
                      <div className="border border-system/30 bg-black/40 p-4 relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute top-0 left-0 w-1 h-full bg-user/50"></div>
                        <div className="text-[10px] text-system/70 tracking-widest uppercase mb-2">CURRENCY_DISTRIBUTION</div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                          {Object.entries(metrics.crypto_payments_30d?.by_currency || {}).map(([currency, count]) => (
                            <div key={currency} className="flex justify-between items-center">
                              <span className="text-system/60 uppercase">{currency}</span>
                              <span className="text-user font-bold">{count as number}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              ) : null}

            </div>
          </div>
        )}
      </main>
      
      {/* Visual Glitch Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px]"></div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Security Infrastructure Tab
// ─────────────────────────────────────────────────────────────────────────────

const NVIDIA_CC_FEATURES = [
  {
    icon: <Lock className="w-4 h-4" />,
    title: 'HBM Memory Encryption',
    desc: 'All on-GPU High Bandwidth Memory is hardware-encrypted in CC-ON mode. Model weights and training data are never exposed in plaintext outside the TEE boundary — not to the hypervisor, not to the cloud operator.',
  },
  {
    icon: <Key className="w-4 h-4" />,
    title: 'Remote Attestation',
    desc: 'Cryptographic proof via RIM (Reference Integrity Manifest) bundles that the SageMaker instance is running genuine NVIDIA H100 silicon with unmodified firmware. OCSP-validated attestation report signed by NVIDIA.',
  },
  {
    icon: <Zap className="w-4 h-4" />,
    title: 'NVLink / PCIe Encryption',
    desc: 'CPU-to-GPU data path encrypted in transit — training features from the SecOps Feature Group are decrypted only after crossing the TEE boundary. No relay or proxy can intercept plaintext gradients.',
  },
  {
    icon: <Eye className="w-4 h-4" />,
    title: 'Operator Blind',
    desc: 'Even the AWS SageMaker control plane and cloud operator are cryptographically excluded from the training computation. RageSage\'s DistilBERT weights are provably inaccessible to infrastructure staff.',
  },
  {
    icon: <FlaskConical className="w-4 h-4" />,
    title: 'Secure Fine-Tuning',
    desc: 'Student behavioural data used to fine-tune the PMI classifier is processed exclusively inside the confidential enclave. No training sample ever leaves the GPU TEE during forward or backward passes.',
  },
  {
    icon: <GitBranch className="w-4 h-4" />,
    title: 'Agentic AI Pipeline Ready',
    desc: 'NVIDIA CC is purpose-built for agentic workloads — RageSage\'s automated weekly retraining loop (Airflow → S3 export → SageMaker pipeline) runs end-to-end inside hardware-protected compute.',
  },
];

const PIPELINE_LAYERS = [
  {
    id: 'L1',
    label: 'Layer 1 — Hardware Root of Trust',
    title: 'NVIDIA H100 Confidential Computing',
    color: 'border-green-400/40 bg-green-400/5',
    accent: 'text-green-400',
    bar: 'bg-green-400',
    icon: <Cpu className="w-5 h-5" />,
    badge: 'CC-ON · Hopper TEE',
    status: 'PLANNED',
    statusColor: 'text-yellow-400 border-yellow-400/40',
    points: [
      'H100 SXM / H100 PCIe — CC-ON mode activates hardware TEE',
      'Protects RageSage training weights + SecOps feature vectors',
      'RIM-bundle attestation verifiable by data owner (Shri Academy)',
      'Apple Private Cloud Compute reference deployment confirms production readiness',
    ],
    href: 'https://www.nvidia.com/en-us/data-center/solutions/confidential-computing/',
    hrefLabel: 'nvidia.com/confidential-computing',
  },
  {
    id: 'L2',
    label: 'Layer 2 — ML Security Pipeline',
    title: 'RageSage — SageMaker Training',
    color: 'border-user/40 bg-user/5',
    accent: 'text-user',
    bar: 'bg-user',
    icon: <Brain className="w-5 h-5" />,
    badge: 'DistilBERT · F1 ≥ 0.78 gate',
    status: 'LIVE',
    statusColor: 'text-green-400 border-green-400/40',
    points: [
      '5-step pipeline: DataPrep → Training → Evaluate → Register → Deploy',
      'Writes {"f1_macro": float} to /opt/ml/processing/evaluation/metrics.json',
      'Quality gate via Std:JsonGet on PropertyFile — MinF1Threshold = 0.78; blocks sub-par models',
      'EventBridge weekly schedule + Airflow DAG (Sunday 03:00 UTC, ≥50 labelled rows)',
    ],
    href: 'https://aws.amazon.com/sagemaker/',
    hrefLabel: 'aws.amazon.com/sagemaker',
  },
  {
    id: 'L3',
    label: 'Layer 3 — Enforcement & Dispatch',
    title: 'Cyberdemon — SecOps Outbox',
    color: 'border-mentor/40 bg-mentor/5',
    accent: 'text-mentor',
    bar: 'bg-mentor',
    icon: <AlertOctagon className="w-5 h-5" />,
    badge: 'Outbox · Poll + Ack',
    status: 'LIVE',
    statusColor: 'text-green-400 border-green-400/40',
    points: [
      'secops_cyberdemon_events table — durable outbox queue, events never deleted',
      'Composite risk score: PMI 50% · Vulgarity 20% · Profanity 30%',
      'Mentor-gated /api/secops/cyberdemon/queue poll + /flush ack',
      'Dynamic pattern cache refreshes every 10 min — no redeploy needed',
    ],
    href: null,
    hrefLabel: null,
  },
];

const SCORING_TIERS = [
  { label: 'Profanity Index', weight: 30, color: 'bg-yellow-400', textColor: 'text-yellow-400', desc: 'Compiled regex against explicit word lists; dynamic blocklist from DB.' },
  { label: 'Vulgarity Index', weight: 20, color: 'bg-orange-400', textColor: 'text-orange-400', desc: 'Pattern sets for crude language and sexually suggestive phrasing.' },
  { label: 'PMI — Perverted Mentation', weight: 50, color: 'bg-user',     textColor: 'text-user',     desc: 'Contextual threat patterns: grooming, radicalisation, boundary violations.' },
];

function SecurityInfraTab() {
  return (
    <div className="max-w-6xl mx-auto space-y-10">

      {/* Header */}
      <div className="border-b border-user/30 pb-5">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-6 h-6 text-user text-glow-user" />
          <h2 className="text-xl text-user font-bold tracking-widest uppercase text-glow-user">
            SECURITY_INFRASTRUCTURE
          </h2>
        </div>
        <p className="text-system/50 text-xs leading-relaxed max-w-3xl">
          Three-layer defence-in-depth architecture protecting student content, training data, and AI model weights.
          Hardware root of trust via NVIDIA Confidential Computing → ML quality gating via RageSage SageMaker → real-time
          enforcement via the Cyberdemon outbox.
        </p>
      </div>

      {/* NVIDIA CC Feature Grid */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Cpu className="w-4 h-4 text-green-400" />
          <h3 className="text-xs uppercase tracking-widest text-green-400 font-bold">
            NVIDIA CONFIDENTIAL COMPUTING — H100 HOPPER TEE
          </h3>
          <a
            href="https://www.nvidia.com/en-us/data-center/solutions/confidential-computing/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 text-[10px] uppercase tracking-wider text-system/40 hover:text-green-400 transition-colors border border-system/20 hover:border-green-400/40 px-2 py-1"
          >
            <ExternalLink className="w-3 h-3" /> nvidia.com
          </a>
        </div>

        {/* NVIDIA hero banner */}
        <div className="border border-green-400/30 bg-green-400/5 p-5 mb-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-400/60 via-green-400/20 to-transparent" />
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="shrink-0">
              <div className="w-14 h-14 border border-green-400/40 bg-green-400/10 flex items-center justify-center">
                <Server className="w-7 h-7 text-green-400" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <span className="text-green-400 font-bold uppercase tracking-[0.2em] text-sm text-glow-user">Confidential AI Solutions</span>
                <span className="text-[9px] border border-green-400/30 text-green-400/70 px-2 py-0.5 uppercase tracking-wider">NVIDIA PRODUCT</span>
              </div>
              <p className="text-system/70 text-xs leading-relaxed max-w-2xl">
                As organisations turn to agentic AI, a critical concern emerges: safeguarding proprietary models and sensitive data
                during inference and fine-tuning. NVIDIA Confidential Computing — shipping on H100 (Hopper) — provides hardware-based
                Trusted Execution Environments that encrypt all GPU memory, cryptographically excluding cloud operators, hypervisors,
                and infrastructure staff from the computation. The RageSage DistilBERT training pipeline is the primary target
                workload for CC integration.
              </p>
              <p className="text-green-400/50 text-[10px] mt-2 uppercase tracking-wider">
                Reference deployment: Apple Private Cloud Compute on Google Cloud — proven at production scale.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {NVIDIA_CC_FEATURES.map(f => (
            <div key={f.title} className="border border-system/20 bg-black/60 p-4 hover:border-green-400/30 transition-all">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                {f.icon}
                <span className="text-xs font-bold uppercase tracking-wider">{f.title}</span>
              </div>
              <p className="text-system/50 text-[11px] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Three-Layer Architecture */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Radio className="w-4 h-4 text-user" />
          <h3 className="text-xs uppercase tracking-widest text-user font-bold">THREE-LAYER SECURITY STACK</h3>
        </div>

        <div className="space-y-4">
          {PIPELINE_LAYERS.map((layer, i) => (
            <div key={layer.id} className={`border ${layer.color} p-5 relative overflow-hidden`}>
              <div className={`absolute top-0 left-0 w-1 h-full ${layer.bar}`} />
              <div className="pl-3">
                {/* Layer header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`${layer.accent} shrink-0`}>{layer.icon}</div>
                    <div>
                      <div className="text-[10px] text-system/40 uppercase tracking-wider">{layer.label}</div>
                      <div className={`text-sm font-bold ${layer.accent} uppercase tracking-wider`}>{layer.title}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[9px] border ${layer.statusColor} px-2 py-0.5 uppercase tracking-wider font-bold`}>
                      {layer.status}
                    </span>
                    <span className={`text-[9px] border border-system/20 text-system/50 px-2 py-0.5 uppercase tracking-wider`}>
                      {layer.badge}
                    </span>
                  </div>
                </div>

                {/* Points */}
                <ul className="space-y-1.5 mb-3">
                  {layer.points.map(pt => (
                    <li key={pt} className="flex items-start gap-2 text-[11px] text-system/60">
                      <CheckCircle className={`w-3 h-3 shrink-0 mt-0.5 ${layer.accent}`} />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                {/* External link */}
                {layer.href && (
                  <a
                    href={layer.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider ${layer.accent} opacity-60 hover:opacity-100 transition-opacity`}
                  >
                    <ExternalLink className="w-3 h-3" /> {layer.hrefLabel}
                  </a>
                )}
              </div>

              {/* Arrow to next layer */}
              {i < PIPELINE_LAYERS.length - 1 && (
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-10 text-system/20">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content Scoring Weights */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-4 h-4 text-system/60" />
          <h3 className="text-xs uppercase tracking-widest text-system/60 font-bold">COMPOSITE RISK SCORE — WEIGHTING</h3>
        </div>

        <div className="border border-system/20 p-5 space-y-4">
          {SCORING_TIERS.map(t => (
            <div key={t.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-bold uppercase tracking-wider ${t.textColor}`}>{t.label}</span>
                <span className={`text-xs font-bold ${t.textColor}`}>{t.weight}%</span>
              </div>
              <div className="h-1.5 bg-system/10 w-full mb-1.5">
                <div className={`h-full ${t.color}`} style={{ width: `${t.weight}%` }} />
              </div>
              <p className="text-system/40 text-[10px]">{t.desc}</p>
            </div>
          ))}
          <p className="text-system/30 text-[10px] pt-2 border-t border-system/10 uppercase tracking-wider">
            PMI carries the heaviest weight (50%) because contextual grooming / radicalisation patterns are more
            security-critical than explicit words. Cyberdemon events are dispatched when composite risk ≥ 0.65.
          </p>
        </div>
      </div>

      {/* Setup checklist */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-4 h-4 text-system/60" />
          <h3 className="text-xs uppercase tracking-widest text-system/60 font-bold">INTEGRATION CHECKLIST</h3>
        </div>

        <div className="border border-system/20 p-5 space-y-2">
          {[
            { done: true,  text: 'secops_cyberdemon_events + secops_training_labels tables provisioned' },
            { done: true,  text: 'Composite PMI content scorer deployed (contentIndex.ts)' },
            { done: true,  text: 'Cyberdemon queue + flush API routes live (/api/secops/cyberdemon/*)' },
            { done: true,  text: 'RageSage SageMaker Terraform stack (ragethesage.tf) authored' },
            { done: true,  text: 'Airflow DAG — ragethesage_export_and_train.py (Sunday 03:00 UTC)' },
            { done: false, text: 'terraform apply — provision SageMaker pipeline + S3 bucket + IAM role' },
            { done: false, text: 'Set RAGETHESAGE_PIPELINE_ARN + SECOPS_S3_BUCKET env vars on ECS task' },
            { done: false, text: 'Build RageSage training container — infrastructure/docker/ragethesage/' },
            { done: false, text: 'Request NVIDIA H100 Confidential Computing instance from AWS (p5.48xlarge — H100 SXM5, CC-ON capable)' },
            { done: false, text: 'Enable CC-ON mode on SageMaker training job — set --enable-network-isolation + TEE flags' },
            { done: false, text: 'Configure RIM-bundle attestation endpoint for training job verification' },
            { done: false, text: 'Validate attestation report via NVIDIA OCSP responder before each training run' },
          ].map(item => (
            <div key={item.text} className="flex items-start gap-3">
              <div className={`shrink-0 mt-0.5 ${item.done ? 'text-green-400' : 'text-system/20'}`}>
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <span className={`text-[11px] leading-relaxed ${item.done ? 'text-system/70' : 'text-system/35'}`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer source attribution */}
      <div className="border border-system/10 p-4 flex items-center justify-between">
        <div className="text-[10px] text-system/30 uppercase tracking-wider">
          Source: NVIDIA Confidential Computing — nvidia.com/en-us/data-center/solutions/confidential-computing/
        </div>
        <a
          href="https://www.nvidia.com/en-us/data-center/solutions/confidential-computing/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-system/40 hover:text-green-400 transition-colors flex items-center gap-1 uppercase tracking-wider"
        >
          <ExternalLink className="w-3 h-3" /> Open Page
        </a>
      </div>

    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  subValue,
  highlight = 'system',
  testId
}: { 
  title: string; 
  value: string | number | undefined; 
  subValue?: string;
  highlight?: 'system' | 'mentor' | 'user';
  testId?: string;
}) {
  const highlightColor = highlight === 'mentor' ? 'text-mentor bg-mentor' : highlight === 'user' ? 'text-user bg-user' : 'text-system bg-system';
  const borderColor = highlight === 'mentor' ? 'border-mentor/30' : highlight === 'user' ? 'border-user/30' : 'border-system/30';
  const bgColor = highlight === 'mentor' ? 'bg-mentor/5' : highlight === 'user' ? 'bg-user/5' : 'bg-system/5';

  return (
    <div 
      className={`border ${borderColor} ${bgColor} p-4 relative overflow-hidden group hover:border-${highlight}/60 transition-colors`}
      data-testid={testId}
    >
      <div className={`absolute top-0 left-0 w-1 h-full ${highlightColor.split(' ')[1]}`}></div>
      <div className="text-[10px] text-system/70 tracking-widest uppercase mb-1 truncate">{title}</div>
      <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${highlightColor.split(' ')[0]} ${highlightColor.split(' ')[0].replace('text', 'text-glow')}`}>
        {value !== undefined ? value : '--'}
      </div>
      {subValue && (
        <div className="text-xs text-system/50 mt-1 uppercase">{subValue}</div>
      )}
    </div>
  );
}
