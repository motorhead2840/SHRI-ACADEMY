import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Terminal, LogOut, BarChart3, MessageSquare, RefreshCw, AlertTriangle, Users, CreditCard, Activity } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'mentoring' | 'metrics'>('mentoring');

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
      <div className="flex border-b border-mentor/20 bg-black/50 z-10">
        <button
          onClick={() => setActiveTab('mentoring')}
          className={`flex-1 py-3 px-4 uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'mentoring' 
              ? 'border-b-2 border-mentor text-mentor bg-mentor/10 text-glow-mentor' 
              : 'text-mentor/50 hover:text-mentor/80 hover:bg-mentor/5'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> AI_MENTORING
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex-1 py-3 px-4 uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'metrics' 
              ? 'border-b-2 border-system text-system bg-system/10 text-glow-system' 
              : 'text-system/50 hover:text-system/80 hover:bg-system/5'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> SCHOLARSHIP_METRICS
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
