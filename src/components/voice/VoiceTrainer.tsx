
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Headphones,
  Brain,
  BookOpen,
  Navigation
} from 'lucide-react';
import { toast } from 'sonner';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: number;
  steps: TrainingStep[];
  category: 'navigation' | 'contacts' | 'automation' | 'marketing' | 'calendars' | 'messaging' | 'sites' | 'crm';
}

interface TrainingStep {
  id: string;
  instruction: string;
  action?: string;
  target?: string;
  audioText: string;
  duration: number;
}

export function VoiceTrainer() {
  const [isTraining, setIsTraining] = useState(false);
  const [currentModule, setCurrentModule] = useState<TrainingModule | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState(1);
  const [voicePitch, setVoicePitch] = useState(1);
  const [autoPlay, setAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);
  
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const trainingModules: TrainingModule[] = [
    {
      id: 'navigation',
      title: 'Application Navigation',
      description: 'Learn how to navigate through the entire GHL application',
      duration: 300,
      category: 'navigation',
      steps: [
        {
          id: 'nav-1',
          instruction: 'Welcome to GoHighLevel voice training. Let me guide you through the navigation.',
          audioText: 'Welcome to GoHighLevel voice training. I am Sarah, your personal AI assistant. I will guide you through every feature of this powerful CRM and marketing platform. Let us start with navigation.',
          duration: 10,
          target: '.sidebar'
        },
        {
          id: 'nav-2',
          instruction: 'The sidebar contains all main sections: Dashboard, Contacts, CRM, Marketing, and more.',
          audioText: 'On the left side, you will see the main navigation sidebar. This contains all the primary sections like Dashboard for overview, Contacts for managing leads, CRM for sales pipeline, Marketing for campaigns, and many more powerful features.',
          duration: 15,
          target: '.sidebar'
        }
      ]
    },
    {
      id: 'contacts',
      title: 'Contact Management',
      description: 'Master contact creation, management, and advanced custom fields',
      duration: 600,
      category: 'contacts',
      steps: [
        {
          id: 'contact-1',
          instruction: 'Navigate to Contacts section to manage your leads and customers.',
          audioText: 'Now let us explore the Contacts section. This is where you manage all your leads, prospects, and customers. Click on Contacts in the sidebar to begin.',
          duration: 8,
          target: '[href="/contacts"]'
        },
        {
          id: 'contact-2',
          instruction: 'Click Add Contact to create a new contact with custom fields.',
          audioText: 'To add a new contact, click the Add Contact button. You can capture detailed information including custom fields specific to your business needs.',
          duration: 10,
          target: 'button:contains("Add Contact")'
        }
      ]
    },
    {
      id: 'automation',
      title: 'Automation Workflows',
      description: 'Build powerful automation workflows with triggers and actions',
      duration: 900,
      category: 'automation',
      steps: [
        {
          id: 'auto-1',
          instruction: 'Access the Automation section to create powerful workflows.',
          audioText: 'Automation is the heart of GoHighLevel. Here you can create sophisticated workflows that automatically handle lead nurturing, follow-ups, and customer communications.',
          duration: 12,
          target: '[href="/automation"]'
        }
      ]
    },
    {
      id: 'messaging',
      title: 'SMS & A2P Compliance',
      description: 'Learn SMS campaigns and A2P 10DLC compliance setup',
      duration: 450,
      category: 'messaging',
      steps: [
        {
          id: 'msg-1',
          instruction: 'Navigate to Messaging for SMS campaigns and compliance.',
          audioText: 'The Messaging section handles all your SMS communications. This includes campaign creation, automation, and importantly, A2P 10DLC compliance to ensure your messages are delivered.',
          duration: 15,
          target: '[href="/messaging"]'
        }
      ]
    }
  ];

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    
    const loadVoices = () => {
      const availableVoices = synthRef.current?.getVoices() || [];
      setVoices(availableVoices);
      
      // Prefer female voices
      const femaleVoice = availableVoices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('sarah') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen')
      ) || availableVoices.find(voice => voice.gender === 'female') || availableVoices[0];
      
      setSelectedVoice(femaleVoice);
    };

    loadVoices();
    if (synthRef.current) {
      synthRef.current.onvoiceschanged = loadVoices;
    }

    return () => {
      if (utteranceRef.current && synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speak = (text: string) => {
    if (!synthRef.current || !selectedVoice || isMuted) return;

    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = voiceSpeed;
    utterance.pitch = voicePitch;
    utterance.volume = 1;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      if (autoPlay && currentModule && currentStep < currentModule.steps.length - 1) {
        setTimeout(() => nextStep(), 2000);
      }
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const startTraining = (module: TrainingModule) => {
    setCurrentModule(module);
    setCurrentStep(0);
    setIsTraining(true);
    setProgress(0);
    
    setTimeout(() => {
      speak(module.steps[0].audioText);
    }, 500);
    
    toast.success(`Started training: ${module.title}`);
  };

  const nextStep = () => {
    if (!currentModule) return;
    
    if (currentStep < currentModule.steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      setProgress((newStep / currentModule.steps.length) * 100);
      
      setTimeout(() => {
        speak(currentModule.steps[newStep].audioText);
      }, 500);
    } else {
      completeTraining();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      setProgress((newStep / currentModule.steps.length) * 100);
      
      setTimeout(() => {
        speak(currentModule.steps[newStep].audioText);
      }, 500);
    }
  };

  const completeTraining = () => {
    setIsTraining(false);
    setCurrentModule(null);
    setCurrentStep(0);
    setProgress(100);
    
    speak('Congratulations! You have completed this training module. You are now ready to use this feature effectively.');
    toast.success('Training completed successfully!');
  };

  const stopTraining = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsTraining(false);
    setIsPlaying(false);
    setCurrentModule(null);
    setCurrentStep(0);
    setProgress(0);
  };

  const pauseResume = () => {
    if (!synthRef.current) return;
    
    if (isPlaying) {
      synthRef.current.pause();
      setIsPlaying(false);
    } else if (currentModule) {
      synthRef.current.resume();
      setIsPlaying(true);
    }
  };

  const repeatStep = () => {
    if (currentModule && currentModule.steps[currentStep]) {
      speak(currentModule.steps[currentStep].audioText);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Headphones className="h-6 w-6" />
            Voice Training Assistant
          </h2>
          <p className="text-muted-foreground">
            AI-powered voice training for every feature in the application
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Voice Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Voice Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Voice</label>
              <Select
                value={selectedVoice?.name || ''}
                onValueChange={(value) => {
                  const voice = voices.find(v => v.name === value);
                  if (voice) setSelectedVoice(voice);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.filter(voice => voice.lang.startsWith('en')).map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Speed: {voiceSpeed}x</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={voiceSpeed}
                onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Pitch: {voicePitch}</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={voicePitch}
                onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Auto-play next step</label>
            <Switch checked={autoPlay} onCheckedChange={setAutoPlay} />
          </div>
        </CardContent>
      </Card>

      {/* Current Training Session */}
      {isTraining && currentModule && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Current Training: {currentModule.title}</span>
              <Badge variant="outline">
                Step {currentStep + 1} of {currentModule.steps.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} className="w-full" />
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">
                {currentModule.steps[currentStep]?.instruction}
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" onClick={previousStep} disabled={currentStep === 0}>
                Previous
              </Button>
              <Button variant="outline" onClick={pauseResume}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="outline" onClick={repeatStep}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button onClick={nextStep} disabled={currentStep === currentModule.steps.length - 1}>
                Next Step
              </Button>
              <Button variant="destructive" onClick={stopTraining}>
                Stop Training
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Training Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainingModules.map((module) => (
          <Card key={module.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {module.category === 'navigation' && <Navigation className="h-5 w-5" />}
                {module.category === 'contacts' && <Brain className="h-5 w-5" />}
                {module.category === 'automation' && <BookOpen className="h-5 w-5" />}
                {module.category === 'messaging' && <Mic className="h-5 w-5" />}
                {module.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{module.description}</p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{Math.ceil(module.duration / 60)} min</Badge>
                <Badge variant="outline">{module.steps.length} steps</Badge>
              </div>
              <Button 
                onClick={() => startTraining(module)}
                disabled={isTraining}
                className="w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Training
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
