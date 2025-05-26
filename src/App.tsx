
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Sites from "./pages/Sites";
import Contacts from "./pages/Contacts";
import Launchpad from "./pages/Launchpad";
import CalendarAvailability from "./pages/calendar/CalendarAvailability";
import CalendarSettings from "./pages/calendar/CalendarSettings";
import Calendars from "./pages/Calendars";
import CreateCalendar from "./pages/calendar/CreateCalendar";
import CRM from "./pages/CRM";
import Marketing from "./pages/Marketing";
import SmsCampaigns from "./pages/marketing/SmsCampaigns";
import Automation from "./pages/Automation";
import SmsAutomations from "./pages/automation/SmsAutomations";
import AutomationBuilder from "./pages/automation/AutomationBuilder";
import AppointmentTypes from "./pages/calendar/AppointmentTypes";
import CalendarIntegrations from "./pages/calendar/CalendarIntegrations";
import Conversations from "./pages/Conversations";
import Opportunities from "./pages/Opportunities";
import Payments from "./pages/Payments";
import Memberships from "./pages/Memberships";
import Reputation from "./pages/Reputation";
import Reporting from "./pages/Reporting";
import AppMarketplace from "./pages/AppMarketplace";
import MobileApp from "./pages/MobileApp";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Launchpad />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/conversations" element={<Conversations />} />
        <Route path="/calendars" element={<Calendars />} />
        <Route path="/calendar/create" element={<CreateCalendar />} />
        <Route path="/calendar/settings" element={<CalendarSettings />} />
        <Route path="/calendar/availability" element={<CalendarAvailability />} />
        <Route path="/calendar/appointment-types" element={<AppointmentTypes />} />
        <Route path="/calendar/integrations" element={<CalendarIntegrations />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/crm" element={<CRM />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/marketing" element={<Marketing />} />
        <Route path="/marketing/sms-campaigns" element={<SmsCampaigns />} />
        <Route path="/automation" element={<Automation />} />
        <Route path="/automation/sms" element={<SmsAutomations />} />
        <Route path="/automation/builder" element={<AutomationBuilder />} />
        <Route path="/sites" element={<Sites />} />
        <Route path="/memberships" element={<Memberships />} />
        <Route path="/reputation" element={<Reputation />} />
        <Route path="/reporting" element={<Reporting />} />
        <Route path="/app-marketplace" element={<AppMarketplace />} />
        <Route path="/mobile-app" element={<MobileApp />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
