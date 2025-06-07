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
  Navigation,
  Phone,
  Star,
  Mail,
  Users,
  BarChart3,
  Settings,
  Building
} from 'lucide-react';
import { toast } from 'sonner';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: number;
  steps: TrainingStep[];
  category: 'navigation' | 'contacts' | 'automation' | 'marketing' | 'calendars' | 'messaging' | 'sites' | 'crm' | 'phone' | 'reputation' | 'email' | 'social' | 'reporting' | 'memberships' | 'agency' | 'integrations';
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
      id: 'phone-system',
      title: 'Phone System & Call Management',
      description: 'Master inbound/outbound calls, voicemail, call routing, and IVR systems',
      duration: 900,
      category: 'phone',
      steps: [
        {
          id: 'phone-1',
          instruction: 'Access the Phone System for complete call management.',
          audioText: 'The Phone System is your communication headquarters. Here you can make calls, manage voicemails, set up call routing, and track all call analytics. This system handles both inbound and outbound calls with advanced features like call recording and transcription.',
          duration: 12,
          target: '[href="/phone"]'
        },
        {
          id: 'phone-2',
          instruction: 'Use the Quick Dialer to make outbound calls.',
          audioText: 'The Quick Dialer allows you to make calls instantly. Select your business phone number, enter the contact number, and click Call Now. All calls are automatically recorded and logged for future reference.',
          duration: 10,
          target: '.quick-dialer'
        },
        {
          id: 'phone-3',
          instruction: 'Manage voicemails and voicemail drops.',
          audioText: 'Voicemail management includes both received voicemails and voicemail drops. Voicemail drops are pre-recorded messages you can leave instantly without waiting for voicemail prompts.',
          duration: 12,
          target: '.voicemail-section'
        }
      ]
    },
    {
      id: 'reputation',
      title: 'Review & Reputation Management',
      description: 'Monitor reviews, respond to customers, and manage your online reputation',
      duration: 720,
      category: 'reputation',
      steps: [
        {
          id: 'rep-1',
          instruction: 'Navigate to Reputation Management to monitor your online reviews.',
          audioText: 'Reputation Management helps you monitor and respond to reviews across Google, Facebook, Yelp, and other platforms. Maintaining a good online reputation is crucial for business success.',
          duration: 10,
          target: '[href="/reputation"]'
        },
        {
          id: 'rep-2',
          instruction: 'Respond to customer reviews professionally.',
          audioText: 'When responding to reviews, always be professional and grateful. For positive reviews, thank the customer. For negative reviews, apologize, address concerns, and offer to resolve issues offline.',
          duration: 15,
          target: '.review-response'
        },
        {
          id: 'rep-3',
          instruction: 'Set up automated review request campaigns.',
          audioText: 'Automated review requests help you consistently gather feedback from satisfied customers. Set up triggers based on completed services or positive interactions.',
          duration: 12,
          target: '.review-campaigns'
        }
      ]
    },
    {
      id: 'email-marketing',
      title: 'Advanced Email Marketing',
      description: 'Create email campaigns, build templates, and track performance with A/B testing',
      duration: 1200,
      category: 'email',
      steps: [
        {
          id: 'email-1',
          instruction: 'Access Email Marketing for advanced campaign management.',
          audioText: 'Email Marketing provides comprehensive tools for creating, sending, and analyzing email campaigns. You can build custom templates, set up automated sequences, and track detailed analytics.',
          duration: 10,
          target: '[href="/email-marketing"]'
        },
        {
          id: 'email-2',
          instruction: 'Use the drag-and-drop email builder.',
          audioText: 'The email builder offers drag-and-drop functionality to create professional emails. Add headers, text blocks, images, and buttons. Customize colors, fonts, and spacing to match your brand.',
          duration: 15,
          target: '.email-builder'
        },
        {
          id: 'email-3',
          instruction: 'Set up A/B testing for optimization.',
          audioText: 'A/B testing allows you to test different subject lines, content, and send times. Split your audience and compare performance metrics to optimize your campaigns.',
          duration: 12,
          target: '.ab-testing'
        }
      ]
    },
    {
      id: 'social-media',
      title: 'Social Media Management',
      description: 'Schedule posts, monitor engagement, and manage multiple social platforms',
      duration: 840,
      category: 'social',
      steps: [
        {
          id: 'social-1',
          instruction: 'Navigate to Social Media Management.',
          audioText: 'Social Media Management lets you schedule posts across Facebook, Instagram, Twitter, and LinkedIn from one dashboard. Monitor engagement, track analytics, and respond to comments.',
          duration: 12,
          target: '[href="/social-media"]'
        },
        {
          id: 'social-2',
          instruction: 'Create and schedule multi-platform posts.',
          audioText: 'The post composer allows you to create content for multiple platforms simultaneously. Customize content for each platform, add images or videos, and schedule for optimal posting times.',
          duration: 15,
          target: '.post-composer'
        },
        {
          id: 'social-3',
          instruction: 'Monitor brand mentions and engagement.',
          audioText: 'Brand monitoring tracks mentions of your business across social platforms. Respond promptly to comments and messages to maintain good customer relationships.',
          duration: 10,
          target: '.social-monitoring'
        }
      ]
    },
    {
      id: 'advanced-reporting',
      title: 'Advanced Reporting & Analytics',
      description: 'Build custom reports, track ROI, and analyze business performance',
      duration: 960,
      category: 'reporting',
      steps: [
        {
          id: 'report-1',
          instruction: 'Access Advanced Reporting for detailed analytics.',
          audioText: 'Advanced Reporting provides comprehensive analytics across all business activities. Create custom reports, track ROI, monitor conversion funnels, and analyze customer behavior.',
          duration: 12,
          target: '[href="/advanced-reporting"]'
        },
        {
          id: 'report-2',
          instruction: 'Build custom reports with drag-and-drop builder.',
          audioText: 'The custom report builder lets you select specific metrics, date ranges, and visualization types. Drag and drop elements to create reports tailored to your business needs.',
          duration: 15,
          target: '.report-builder'
        }
      ]
    },
    {
      id: 'memberships',
      title: 'Membership & Course Management',
      description: 'Create courses, manage memberships, and track student progress',
      duration: 1080,
      category: 'memberships',
      steps: [
        {
          id: 'member-1',
          instruction: 'Navigate to Membership Management.',
          audioText: 'Membership Management allows you to create online courses, manage member access, set up content dripping, and track student progress through your educational content.',
          duration: 12,
          target: '[href="/memberships"]'
        },
        {
          id: 'member-2',
          instruction: 'Create course content with dripping.',
          audioText: 'Content dripping releases course materials gradually over time. This keeps students engaged and prevents them from rushing through content. Set up lessons, modules, and assignments.',
          duration: 15,
          target: '.course-builder'
        }
      ]
    },
    {
      id: 'agency',
      title: 'Agency Management',
      description: 'Manage sub-accounts, white-label features, and client billing',
      duration: 1200,
      category: 'agency',
      steps: [
        {
          id: 'agency-1',
          instruction: 'Access Agency Management for multi-client operations.',
          audioText: 'Agency Management provides tools for managing multiple client accounts. Create sub-accounts, customize white-label branding, manage client billing, and provide client access to their data.',
          duration: 15,
          target: '[href="/agency"]'
        },
        {
          id: 'agency-2',
          instruction: 'Set up white-label branding.',
          audioText: 'White-label branding allows you to customize the platform with your agency branding. Upload your logo, set brand colors, and customize the domain to match your agency identity.',
          duration: 12,
          target: '.white-label'
        }
      ]
    },
    {
      id: 'integrations',
      title: 'Advanced Integrations',
      description: 'Set up webhooks, API connections, and third-party integrations',
      duration: 900,
      category: 'integrations',
      steps: [
        {
          id: 'int-1',
          instruction: 'Navigate to Advanced Integrations.',
          audioText: 'Advanced Integrations connect your business with external tools and services. Set up webhooks, manage API connections, configure Zapier automations, and create custom integrations.',
          duration: 12,
          target: '[href="/integrations"]'
        },
        {
          id: 'int-2',
          instruction: 'Configure webhook endpoints.',
          audioText: 'Webhooks send real-time data to external systems when specific events occur. Configure endpoints for form submissions, contact updates, payment processing, and other triggers.',
          duration: 15,
          target: '.webhook-config'
        }
      ]
    }
  ];

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    
    const loadVoices = () => {
      const availableVoices = synthRef.current?.getVoices() || [];
      setVoices(availableVoices);
      
      // Prefer female voices by name patterns
      const femaleVoice = availableVoices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('sarah') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen')
      ) || availableVoices[0];
      
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'navigation': return <Navigation className="h-5 w-5" />;
      case 'phone': return <Phone className="h-5 w-5" />;
      case 'reputation': return <Star className="h-5 w-5" />;
      case 'email': return <Mail className="h-5 w-5" />;
      case 'social': return <Users className="h-5 w-5" />;
      case 'reporting': return <BarChart3 className="h-5 w-5" />;
      case 'memberships': return <BookOpen className="h-5 w-5" />;
      case 'agency': return <Building className="h-5 w-5" />;
      case 'integrations': return <Settings className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
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
                {getCategoryIcon(module.category)}
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
