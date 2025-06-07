
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Headphones, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw,
  Settings,
  Zap,
  Brain,
  MessageSquare,
  Target,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: number;
  completed: boolean;
  category: 'basics' | 'advanced' | 'workflows' | 'integrations' | 'ai';
  lessons: TrainingLesson[];
}

interface TrainingLesson {
  id: string;
  title: string;
  content: string;
  audioScript: string;
  interactions: InteractionPoint[];
  completed: boolean;
}

interface InteractionPoint {
  id: string;
  type: 'click' | 'input' | 'navigate' | 'wait';
  target: string;
  description: string;
  expectedAction: string;
}

export function EnhancedVoiceTrainer() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentModule, setCurrentModule] = useState<TrainingModule | null>(null);
  const [currentLesson, setCurrentLesson] = useState<TrainingLesson | null>(null);
  const [progress, setProgress] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [autoMode, setAutoMode] = useState(false);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const recognitionRef = useRef<any>(null);

  const trainingModules: TrainingModule[] = [
    {
      id: 'ghl-basics',
      title: 'GoHighLevel Basics',
      description: 'Master the fundamentals of CRM, contacts, and lead management',
      duration: 30,
      completed: false,
      category: 'basics',
      lessons: [
        {
          id: 'contacts-101',
          title: 'Contact Management Mastery',
          content: 'Learn to create, manage, and organize contacts effectively',
          audioScript: 'Welcome to Contact Management. This is where your customer relationships begin. Let me show you how to create a new contact.',
          interactions: [
            {
              id: 'click-contacts',
              type: 'navigate',
              target: '/contacts',
              description: 'Navigate to contacts page',
              expectedAction: 'Page navigation'
            },
            {
              id: 'add-contact',
              type: 'click',
              target: 'add-contact-button',
              description: 'Click the Add Contact button',
              expectedAction: 'Open contact form'
            }
          ],
          completed: false
        }
      ]
    },
    {
      id: 'ai-features',
      title: 'AI-Powered Features',
      description: 'Leverage artificial intelligence for automation and insights',
      duration: 45,
      completed: false,
      category: 'ai',
      lessons: [
        {
          id: 'ai-chat',
          title: 'AI Chat Assistant',
          content: 'Use AI to handle customer conversations automatically',
          audioScript: 'AI Chat Assistant can handle customer inquiries 24/7. Let me show you how to set it up.',
          interactions: [],
          completed: false
        }
      ]
    },
    {
      id: 'workflow-builder',
      title: 'Advanced Workflows',
      description: 'Build complex automation workflows like a pro',
      duration: 60,
      completed: false,
      category: 'workflows',
      lessons: [
        {
          id: 'workflow-basics',
          title: 'Workflow Fundamentals',
          content: 'Create your first automation workflow',
          audioScript: 'Workflows are the heart of automation. Let me guide you through creating your first workflow.',
          interactions: [],
          completed: false
        }
      ]
    }
  ];

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    
    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          handleVoiceCommand(lastResult[0].transcript);
        }
      };
    }
  }, []);

  const speak = (text: string, immediate = true) => {
    if (!synthRef.current || !voiceEnabled) return;
    
    if (immediate) {
      synthRef.current.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synthRef.current.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('zira')
    ) || voices[0];
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    utterance.rate = speed;
    utterance.pitch = 1.1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
    
    // Show toast for immediate feedback
    toast.success(`🎙️ Voice Guide: ${text.substring(0, 50)}...`);
  };

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('help') || lowerCommand.includes('guide')) {
      speak('I am here to help you learn GoHighLevel. What would you like to learn about?');
    } else if (lowerCommand.includes('contact')) {
      speak('Let me guide you through contact management. First, navigate to the contacts section.');
      setTimeout(() => window.location.href = '/contacts', 1000);
    } else if (lowerCommand.includes('workflow')) {
      speak('Workflows are powerful automation tools. Let me show you the workflow builder.');
      setTimeout(() => window.location.href = '/automation/builder', 1000);
    } else if (lowerCommand.includes('stop') || lowerCommand.includes('pause')) {
      synthRef.current?.cancel();
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
      speak('I am listening. How can I help you?');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const startTraining = (module: TrainingModule) => {
    setCurrentModule(module);
    setCurrentLesson(module.lessons[0]);
    setProgress(0);
    speak(`Starting ${module.title}. ${module.description}`, true);
  };

  const nextLesson = () => {
    if (!currentModule || !currentLesson) return;
    
    const currentIndex = currentModule.lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex < currentModule.lessons.length - 1) {
      const nextLesson = currentModule.lessons[currentIndex + 1];
      setCurrentLesson(nextLesson);
      speak(nextLesson.audioScript, true);
      setProgress(((currentIndex + 1) / currentModule.lessons.length) * 100);
    } else {
      speak('Congratulations! You have completed this training module.', true);
      setCurrentModule(null);
      setCurrentLesson(null);
      setProgress(100);
    }
  };

  const handleInteraction = (interaction: InteractionPoint) => {
    speak(`Now ${interaction.description}. ${interaction.expectedAction}`, true);
    
    // Simulate interaction completion after a delay
    setTimeout(() => {
      speak('Great job! Let\'s continue to the next step.', true);
      nextLesson();
    }, 3000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Voice Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            Enhanced Voice Training System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button
                onClick={isListening ? stopListening : startListening}
                variant={isListening ? "destructive" : "default"}
                size="sm"
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {isListening ? 'Stop Listening' : 'Start Voice Commands'}
              </Button>
              
              <Button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                variant="outline"
                size="sm"
              >
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                {voiceEnabled ? 'Voice On' : 'Voice Off'}
              </Button>
              
              <Button
                onClick={() => synthRef.current?.cancel()}
                variant="outline"
                size="sm"
                disabled={!isSpeaking}
              >
                <Pause className="h-4 w-4" />
                Stop Speaking
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={isListening ? "default" : "secondary"}>
                {isListening ? 'Listening' : 'Idle'}
              </Badge>
              <Badge variant={isSpeaking ? "default" : "secondary"}>
                {isSpeaking ? 'Speaking' : 'Silent'}
              </Badge>
            </div>
          </div>

          {currentModule && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{currentModule.title}</h3>
                <Badge>{Math.round(progress)}% Complete</Badge>
              </div>
              <Progress value={progress} />
              {currentLesson && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm">{currentLesson.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{currentLesson.content}</p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" onClick={nextLesson}>
                      Next Lesson
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => speak(currentLesson.audioScript, true)}
                    >
                      Repeat
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Training Modules */}
      <Tabs defaultValue="modules" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="modules">Training Modules</TabsTrigger>
          <TabsTrigger value="ai-features">AI Features</TabsTrigger>
          <TabsTrigger value="voice-commands">Voice Commands</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trainingModules.map((module) => (
              <Card key={module.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {module.category === 'ai' && <Brain className="h-5 w-5" />}
                    {module.category === 'workflows' && <Zap className="h-5 w-5" />}
                    {module.category === 'basics' && <Target className="h-5 w-5" />}
                    {module.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{module.duration} min</Badge>
                    <Button 
                      size="sm" 
                      onClick={() => startTraining(module)}
                      disabled={!!currentModule}
                    >
                      Start Training
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Training Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4" />
                    Intelligent Responses
                  </h3>
                  <p className="text-sm text-gray-600">AI adapts responses based on your learning progress and current context.</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4" />
                    Progress Analytics
                  </h3>
                  <p className="text-sm text-gray-600">Track your learning journey with detailed analytics and insights.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice-commands" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Voice Commands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Navigation Commands:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>"Show me contacts" - Navigate to contacts</li>
                    <li>"Open workflow builder" - Go to automation</li>
                    <li>"Dashboard please" - Return to dashboard</li>
                    <li>"Show calendar" - Open calendar view</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Training Commands:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>"Help me learn" - Start interactive training</li>
                    <li>"Explain this feature" - Get contextual help</li>
                    <li>"Stop training" - Pause current session</li>
                    <li>"Repeat that" - Replay last instruction</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Voice Training Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Speech Speed</label>
                <select 
                  value={speed} 
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="border rounded px-2 py-1"
                >
                  <option value={0.5}>Slow</option>
                  <option value={1}>Normal</option>
                  <option value={1.5}>Fast</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto-advance Lessons</label>
                <Button
                  variant={autoMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAutoMode(!autoMode)}
                >
                  {autoMode ? 'On' : 'Off'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
