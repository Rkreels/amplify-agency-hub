
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { VoiceTrainingProvider } from '@/components/voice/VoiceTrainingProvider';
import { VoiceFloatingButton } from '@/components/voice/VoiceFloatingButton';
import { ErrorBoundary } from '@/components/ErrorBoundary';

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
import Calendar from '@/pages/Calendar';
import CreateCalendar from '@/pages/calendar/CreateCalendar';
import AutomationBuilder from '@/pages/automation/AutomationBuilder';
import Payments from '@/pages/Payments';
import AIFeatures from '@/pages/AIFeatures';
import Settings from '@/pages/Settings';

function App() {
  return (
    <ErrorBoundary>
      <VoiceTrainingProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/crm" element={<CRM />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/conversations" element={<Conversations />} />
              <Route path="/marketing" element={<Marketing />} />
              <Route path="/automation" element={<Automation />} />
              <Route path="/automation/builder" element={<AutomationBuilder />} />
              <Route path="/phone" element={<PhoneSystem />} />
              <Route path="/messaging" element={<Messaging />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/calendar/create" element={<CreateCalendar />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/ai-features" element={<AIFeatures />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
            
            <VoiceFloatingButton />
            <Toaster position="top-right" richColors />
          </div>
        </Router>
      </VoiceTrainingProvider>
    </ErrorBoundary>
  );
}

export default App;
