
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Headphones } from 'lucide-react';
import { VoiceTrainer } from './VoiceTrainer';
import { useVoiceTraining } from './VoiceTrainingProvider';

export function VoiceFloatingButton() {
  const [showTrainer, setShowTrainer] = useState(false);
  const { isTrainingMode, startContextualTraining } = useVoiceTraining();

  const handleQuickTraining = () => {
    const currentPath = window.location.pathname;
    const context = currentPath.split('/')[1] || 'dashboard';
    startContextualTraining(context);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
        <Button
          onClick={handleQuickTraining}
          className="rounded-full h-12 w-12 bg-blue-600 hover:bg-blue-700 shadow-lg"
          title="Quick Voice Training"
        >
          <Headphones className="h-5 w-5" />
        </Button>
        
        <Button
          onClick={() => setShowTrainer(true)}
          variant="outline"
          className="rounded-full h-10 w-10 shadow-lg"
          title="Full Voice Training"
        >
          <span className="text-xs">📚</span>
        </Button>
      </div>

      <Dialog open={showTrainer} onOpenChange={setShowTrainer}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Voice Training Center</DialogTitle>
          </DialogHeader>
          <VoiceTrainer />
        </DialogContent>
      </Dialog>
    </>
  );
}
