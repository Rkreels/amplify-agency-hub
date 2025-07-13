
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { VoiceTrainingProvider } from '@/components/voice/VoiceTrainingProvider';
import { VoiceFloatingButton } from '@/components/voice/VoiceFloatingButton';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SubAccountProvider } from '@/contexts/SubAccountContext';

// Import all pages
import Dashboard from '@/pages/Dashboard';
import CRM from '@/pages/CRM';
import Contacts from '@/pages/Contacts';
import Opportunities from '@/pages/Opportunities';
import Conversations from '@/pages/Conversations';
import Marketing from '@/pages/Marketing';
import Automation from '@/pages/Automation';
import PhoneSystem from '@/pages/PhoneSystem';
import Messaging from '@/pages/Messaging';
import Calendars from '@/pages/Calendars';
import CreateCalendar from '@/pages/calendar/CreateCalendar';
import CalendarSettings from '@/pages/calendar/CalendarSettings';
import CalendarAvailability from '@/pages/calendar/CalendarAvailability';
import CalendarIntegrations from '@/pages/calendar/CalendarIntegrations';
import AppointmentTypes from '@/pages/calendar/AppointmentTypes';
import AutomationBuilder from '@/pages/automation/AutomationBuilder';
import SmsAutomations from '@/pages/automation/SmsAutomations';
import SmsCampaigns from '@/pages/marketing/SmsCampaigns';
import EmailMarketing from '@/pages/EmailMarketing';
import SocialMedia from '@/pages/SocialMedia';
import Sites from '@/pages/Sites';
import ReputationManagement from '@/pages/ReputationManagement';
import Memberships from '@/pages/Memberships';
import Reporting from '@/pages/Reporting';
import Integrations from '@/pages/Integrations';
import AppMarketplace from '@/pages/AppMarketplace';
import MobileApp from '@/pages/MobileApp';
import Payments from '@/pages/Payments';
import AIFeatures from '@/pages/AIFeatures';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <ErrorBoundary>
      <SubAccountProvider>
        <VoiceTrainingProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ai-features" element={<AIFeatures />} />
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
                <Route path="/email-marketing" element={<EmailMarketing />} />
                <Route path="/social-media" element={<SocialMedia />} />
                <Route path="/automation" element={<Automation />} />
                <Route path="/automation/sms" element={<SmsAutomations />} />
                <Route path="/automation/builder" element={<AutomationBuilder />} />
                <Route path="/phone-system" element={<PhoneSystem />} />
                <Route path="/messaging" element={<Messaging />} />
                <Route path="/sites" element={<Sites />} />
                <Route path="/reputation-management" element={<ReputationManagement />} />
                <Route path="/memberships" element={<Memberships />} />
                <Route path="/reporting" element={<Reporting />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/app-marketplace" element={<AppMarketplace />} />
                <Route path="/mobile-app" element={<MobileApp />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              <VoiceFloatingButton />
              <Toaster position="top-right" richColors />
            </div>
          </Router>
        </VoiceTrainingProvider>
      </SubAccountProvider>
    </ErrorBoundary>
  );
}

export default App;
