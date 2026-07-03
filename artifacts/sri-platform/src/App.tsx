import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Layout } from '@/components/layout/Layout';

import Home from '@/pages/Home';
import Architecture from '@/pages/Architecture';
import Pedagogy from '@/pages/Pedagogy';
import Blueprint from '@/pages/Blueprint';
import Pitch from '@/pages/Pitch';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/architecture" component={Architecture} />
      <Route path="/pedagogy" component={Pedagogy} />
      <Route path="/blueprint" component={Blueprint} />
      <Route path="/pitch" component={Pitch} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Layout>
            <Router />
          </Layout>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
