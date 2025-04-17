
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CRM from "./pages/CRM";
import Pipeline from "./pages/Pipeline";
import Marketing from "./pages/Marketing";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Launchpad from "./pages/Launchpad";
import Conversations from "./pages/Conversations";
import Calendars from "./pages/Calendars";
import Contacts from "./pages/Contacts";
import Payments from "./pages/Payments";
import Automation from "./pages/Automation";
import Sites from "./pages/Sites";
import Memberships from "./pages/Memberships";
import Reputation from "./pages/Reputation";
import Reporting from "./pages/Reporting";
import Marketplace from "./pages/Marketplace";
import Mobile from "./pages/Mobile";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/launchpad" element={<Launchpad />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/calendars" element={<Calendars />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/pipelines" element={<Pipeline />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/automation" element={<Automation />} />
          <Route path="/sites" element={<Sites />} />
          <Route path="/memberships" element={<Memberships />} />
          <Route path="/reputation" element={<Reputation />} />
          <Route path="/reporting" element={<Reporting />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/mobile" element={<Mobile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
