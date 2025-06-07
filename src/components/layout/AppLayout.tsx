
import { MainNav } from "./MainNav";
import { Sidebar } from "./Sidebar";
import { useVoiceTraining } from "@/components/voice/VoiceTrainingProvider";
import { useEffect } from "react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { startContextualTraining } = useVoiceTraining();

  useEffect(() => {
    // Auto-start contextual training when entering a new section
    const currentPath = window.location.pathname;
    const context = currentPath.split('/')[1] || 'dashboard';
    
    // Optional: Auto-start training for new users (you can add user preference logic here)
    const hasSeenTraining = localStorage.getItem(`voice-training-${context}`);
    if (!hasSeenTraining) {
      setTimeout(() => {
        startContextualTraining(context);
        localStorage.setItem(`voice-training-${context}`, 'true');
      }, 2000);
    }
  }, [startContextualTraining]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <div className="hidden md:block w-64 bg-[#1A1F2C] text-white">
          <Sidebar />
        </div>
        <div className="flex flex-1 flex-col">
          <MainNav />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
