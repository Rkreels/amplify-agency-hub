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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Launchpad />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sites" element={<Sites />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/calendars" element={<Calendars />} />
        {/* Update the route paths to include the new calendar pages */}
        <Route path="/calendar/create" element={<CreateCalendar />} />
        <Route path="/calendar/settings" element={<CalendarSettings />} />
        <Route path="/calendar/availability" element={<CalendarAvailability />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
