import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import AuthGuard from "@/components/auth/auth-guard";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Items from "@/pages/items";
import AddItem from "@/pages/add-item";
import Scanner from "@/pages/scanner";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import Analytics from "@/pages/analytics";

// Update query client to include auth headers
import { getAuthToken } from "./lib/auth";

// Override the default fetch to include auth headers
queryClient.setDefaultOptions({
  queries: {
    ...queryClient.getDefaultOptions().queries,
    queryFn: async (context) => {
      const url = context.queryKey.join('/');
      const token = getAuthToken();
      
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        headers,
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      {/* Protected routes */}
      <Route path="/dashboard">
        <AuthGuard>
          <Dashboard />
        </AuthGuard>
      </Route>
      

    <Route path="/analytics">
  <AuthGuard>
    <Analytics />
  </AuthGuard>
</Route>

      <Route path="/items">
        <AuthGuard>
          <Items />
        </AuthGuard>
      </Route>
      
      <Route path="/add-item">
        <AuthGuard>
          <AddItem />
        </AuthGuard>
      </Route>



      <Route path="/additem">
  <AuthGuard>
    <AddItem />
  </AuthGuard>
</Route>
      
      <Route path="/scanner">
        <AuthGuard>
          <Scanner />
        </AuthGuard>
      </Route>
{/*       
      <Route path="/settings">
        <AuthGuard>
          <Settings />
        </AuthGuard>
      </Route> */}
      
      {/* Root redirect */}
      <Route path="/">
        <AuthGuard>
          <Dashboard />
        </AuthGuard>
      </Route>
      
      {/* 404 fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
