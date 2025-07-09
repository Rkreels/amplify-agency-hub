
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, 
  Pause, 
  Volume2, 
  Settings, 
  Book, 
  Mic,
  Users,
  BarChart3,
  MessageSquare,
  Calendar,
  Target,
  Phone,
  Mail,
  Bot,
  Brain,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface VoiceModule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  lessons: VoiceLesson[];
  progress: number;
  isCompleted: boolean;
}

interface VoiceLesson {
  id: string;
  title: string;
  content: string;
  duration: number;
  isCompleted: boolean;
}

export function ComprehensiveVoiceTraining() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentModule, setCurrentModule] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechRate, setSpeechRate] = useState([1]);
  const [speechVolume, setSpeechVolume] = useState([0.8]);
  const [selectedVoice, setSelectedVoice] = useState('female-1');
  const [autoPlay, setAutoPlay] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const modules: VoiceModule[] = [
    {
      id: 'dashboard',
      name: 'Dashboard Overview',
      description: 'Learn to navigate and use the dashboard effectively',
      icon: <BarChart3 className="h-5 w-5" />,
      category: 'Core Features',
      progress: 100,
      isCompleted: true,
      lessons: [
        {
          id: 'dashboard-1',
          title: 'Dashboard Navigation',
          content: 'Welcome to your dashboard! This is your central hub where you can monitor key metrics, track revenue, view recent activities, and access quick actions. The dashboard provides real-time insights into your business performance.',
          duration: 15,
          isCompleted: true
        },
        {
          id: 'dashboard-2',
          title: 'Key Metrics Cards',
          content: 'The metric cards at the top show your most important KPIs: total revenue, contacts, active campaigns, and appointments. Click on any card to drill down into detailed analytics.',
          duration: 12,
          isCompleted: true
        }
      ]
    },
    {
      id: 'contacts',
      name: 'Contact Management',
      description: 'Master contact creation, editing, and organization',
      icon: <Users className="h-5 w-5" />,
      category: 'CRM',
      progress: 75,
      isCompleted: false,
      lessons: [
        {
          id: 'contacts-1',
          title: 'Adding New Contacts',
          content: 'To add a new contact, click the Add Contact button in the top right. Fill in the required fields: first name, last name, email, and phone. You can also add company information, tags, and custom fields.',
          duration: 18,
          isCompleted: true
        },
        {
          id: 'contacts-2',
          title: 'Contact Organization',
          content: 'Organize your contacts using tags, custom fields, and status categories. Use the search and filter options to quickly find specific contacts. The lead scoring system helps prioritize your outreach efforts.',
          duration: 16,
          isCompleted: false
        }
      ]
    },
    {
      id: 'conversations',
      name: 'Conversation Center',
      description: 'Handle multi-channel communications effectively',
      icon: <MessageSquare className="h-5 w-5" />,
      category: 'Communication',
      progress: 60,
      isCompleted: false,
      lessons: [
        {
          id: 'conversations-1',
          title: 'Message Management',
          content: 'The conversation center unifies all your communications across SMS, email, and social media. Select a conversation from the left panel to view the complete message history and respond directly.',
          duration: 20,
          isCompleted: true
        },
        {
          id: 'conversations-2',
          title: 'Quick Responses',
          content: 'Use quick response templates to speed up your communication. You can create custom templates for common inquiries and access them with keyboard shortcuts.',
          duration: 14,
          isCompleted: false
        }
      ]
    },
    {
      id: 'calendar',
      name: 'Calendar & Scheduling',
      description: 'Schedule and manage appointments efficiently',
      icon: <Calendar className="h-5 w-5" />,
      category: 'Organization',
      progress: 80,
      isCompleted: false,
      lessons: [
        {
          id: 'calendar-1',
          title: 'Creating Events',
          content: 'Create new events by clicking on any date in the calendar. Fill in the event details including title, time, location, and attendees. Set reminders to ensure you never miss important appointments.',
          duration: 17,
          isCompleted: true
        },
        {
          id: 'calendar-2',
          title: 'Calendar Views',
          content: 'Switch between month, week, and day views to get different perspectives on your schedule. Use the agenda view to see a chronological list of upcoming events.',
          duration: 13,
          isCompleted: true
        }
      ]
    },
    {
      id: 'opportunities',
      name: 'Sales Pipeline',
      description: 'Track and manage sales opportunities',
      icon: <Target className="h-5 w-5" />,
      category: 'Sales',
      progress: 40,
      isCompleted: false,
      lessons: [
        {
          id: 'opportunities-1',
          title: 'Pipeline Management',
          content: 'The sales pipeline shows your opportunities across different stages. Drag and drop opportunities between stages to update their status. Each stage represents a step in your sales process.',
          duration: 22,
          isCompleted: true
        },
        {
          id: 'opportunities-2',
          title: 'Opportunity Details',
          content: 'Click on any opportunity to view detailed information including contact details, deal value, probability, and activity history. Add notes and schedule follow-up activities.',
          duration: 19,
          isCompleted: false
        }
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing Campaigns',
      description: 'Create and manage marketing campaigns',
      icon: <Mail className="h-5 w-5" />,
      category: 'Marketing',
      progress: 30,
      isCompleted: false,
      lessons: [
        {
          id: 'marketing-1',
          title: 'Campaign Creation',
          content: 'Create email and SMS campaigns using our drag-and-drop builder. Choose from professional templates or design your own. Set up audience targeting and scheduling options.',
          duration: 25,
          isCompleted: false
        },
        {
          id: 'marketing-2',
          title: 'Campaign Analytics',
          content: 'Monitor campaign performance with detailed analytics including open rates, click-through rates, and conversions. Use these insights to optimize future campaigns.',
          duration: 18,
          isCompleted: false
        }
      ]
    },
    {
      id: 'automation',
      name: 'Workflow Automation',
      description: 'Automate repetitive tasks and processes',
      icon: <Zap className="h-5 w-5" />,
      category: 'Automation',
      progress: 50,
      isCompleted: false,
      lessons: [
        {
          id: 'automation-1',
          title: 'Creating Workflows',
          content: 'Build automated workflows using our visual builder. Start with a trigger event, add conditions, and define actions. Common workflows include welcome sequences and follow-up campaigns.',
          duration: 28,
          isCompleted: true
        },
        {
          id: 'automation-2',
          title: 'Workflow Testing',
          content: 'Test your workflows before activation to ensure they work correctly. Use the test mode to simulate different scenarios and verify the automation logic.',
          duration: 15,
          isCompleted: false
        }
      ]
    },
    {
      id: 'phone',
      name: 'Phone System',
      description: 'Handle calls and manage phone communications',
      icon: <Phone className="h-5 w-5" />,
      category: 'Communication',
      progress: 35,
      isCompleted: false,
      lessons: [
        {
          id: 'phone-1',
          title: 'Making Calls',
          content: 'Use the built-in dialer to make calls directly from the platform. Your call history is automatically logged and linked to contact records. Add call notes and schedule follow-ups.',
          duration: 20,
          isCompleted: false
        },
        {
          id: 'phone-2',
          title: 'Call Management',
          content: 'Manage incoming calls with features like call forwarding, voicemail, and call recording. Set up business hours and automatic responses for after-hours calls.',
          duration: 23,
          isCompleted: false
        }
      ]
    },
    {
      id: 'ai-features',
      name: 'AI Assistant',
      description: 'Leverage AI for enhanced productivity',
      icon: <Brain className="h-5 w-5" />,
      category: 'AI Tools',
      progress: 25,
      isCompleted: false,
      lessons: [
        {
          id: 'ai-1',
          title: 'AI Content Generation',
          content: 'Use AI to generate email content, social media posts, and marketing copy. Provide a brief description or topic, and the AI will create professional content for you.',
          duration: 24,
          isCompleted: false
        },
        {
          id: 'ai-2',
          title: 'Smart Recommendations',
          content: 'The AI analyzes your data to provide smart recommendations for lead scoring, optimal send times, and content suggestions based on your audience preferences.',
          duration: 21,
          isCompleted: false
        }
      ]
    }
  ];

  useEffect(() => {
    // Load available voices
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const speak = (text: string) => {
    if (!voiceEnabled || !text) return;

    // Stop any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find the selected voice
    const voice = voices.find(v => v.name.includes('female') || v.name.includes('Female')) || voices[0];
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = speechRate[0];
    utterance.volume = speechVolume[0];
    utterance.pitch = 1;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setIsPlaying(false);
      toast.error('Speech synthesis error');
    };

    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const handleModuleSelect = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    setCurrentModule(moduleId);
    setCurrentLesson(null);
    
    if (autoPlay) {
      speak(`Starting ${module.name} training module. ${module.description}`);
    }
  };

  const handleLessonSelect = (lessonId: string) => {
    const module = modules.find(m => m.id === currentModule);
    const lesson = module?.lessons.find(l => l.id === lessonId);
    
    if (!lesson) return;

    setCurrentLesson(lessonId);
    
    if (autoPlay) {
      speak(lesson.content);
    }
  };

  const playCurrentLesson = () => {
    const module = modules.find(m => m.id === currentModule);
    const lesson = module?.lessons.find(l => l.id === currentLesson);
    
    if (lesson) {
      speak(lesson.content);
    }
  };

  const getOverallProgress = () => {
    const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0);
    const completedLessons = modules.reduce((sum, module) => 
      sum + module.lessons.filter(lesson => lesson.isCompleted).length, 0);
    return (completedLessons / totalLessons) * 100;
  };

  const currentModuleData = modules.find(m => m.id === currentModule);
  const currentLessonData = currentModuleData?.lessons.find(l => l.id === currentLesson);

  const categories = Array.from(new Set(modules.map(m => m.category)));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Voice Training Center</h1>
          <p className="text-gray-600 mt-1">
            Learn to use the platform with interactive voice guidance
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="px-3 py-1">
            {Math.round(getOverallProgress())}% Complete
          </Badge>
          <Button
            variant={isPlaying ? "destructive" : "default"}
            onClick={isPlaying ? stopSpeaking : playCurrentLesson}
            disabled={!currentLesson}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Play Lesson
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Book className="h-5 w-5" />
            <span>Training Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={getOverallProgress()} className="h-2" />
            <p className="text-sm text-gray-600">
              {modules.filter(m => m.isCompleted).length} of {modules.length} modules completed
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Voice Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Voice Enabled</span>
              <Switch
                checked={voiceEnabled}
                onCheckedChange={setVoiceEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Auto Play</span>
              <Switch
                checked={autoPlay}
                onCheckedChange={setAutoPlay}
              />
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium flex items-center">
                <Volume2 className="h-4 w-4 mr-2" />
                Speech Rate
              </span>
              <Slider
                value={speechRate}
                onValueChange={setSpeechRate}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-gray-600">{speechRate[0]}x</p>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium flex items-center">
                <Volume2 className="h-4 w-4 mr-2" />
                Volume
              </span>
              <Slider
                value={speechVolume}
                onValueChange={setSpeechVolume}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-gray-600">{Math.round(speechVolume[0] * 100)}%</p>
            </div>

            {voices.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-medium flex items-center">
                  <Mic className="h-4 w-4 mr-2" />
                  Voice Selection
                </span>
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice, index) => (
                      <SelectItem key={index} value={voice.name}>
                        {voice.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modules List */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Training Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={categories[0]} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="text-xs">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map((category) => (
                <TabsContent key={category} value={category} className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {modules
                      .filter(m => m.category === category)
                      .map((module) => (
                        <Card 
                          key={module.id}
                          className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                            currentModule === module.id ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => handleModuleSelect(module.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className="mt-1">{module.icon}</div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="font-medium">{module.name}</h3>
                                  {module.isCompleted && (
                                    <Badge variant="default" className="bg-green-500">
                                      Complete
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                  {module.description}
                                </p>
                                <div className="space-y-2">
                                  <Progress value={module.progress} className="h-1" />
                                  <p className="text-xs text-gray-500">
                                    {module.lessons.filter(l => l.isCompleted).length} of {module.lessons.length} lessons
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Current Module Details */}
      {currentModuleData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {currentModuleData.icon}
              <span>{currentModuleData.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Lessons</h4>
                <div className="space-y-2">
                  {currentModuleData.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                        currentLesson === lesson.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleLessonSelect(lesson.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-sm">{lesson.title}</h5>
                          <p className="text-xs text-gray-500">{lesson.duration} seconds</p>
                        </div>
                        {lesson.isCompleted && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            ✓
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {currentLessonData && (
                <div>
                  <h4 className="font-medium mb-3">Current Lesson</h4>
                  <Card>
                    <CardContent className="p-4">
                      <h5 className="font-medium mb-2">{currentLessonData.title}</h5>
                      <p className="text-sm text-gray-700 leading-relaxed mb-4">
                        {currentLessonData.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Duration: {currentLessonData.duration} seconds
                        </span>
                        <Button
                          size="sm"
                          variant={isPlaying ? "destructive" : "default"}
                          onClick={isPlaying ? stopSpeaking : playCurrentLesson}
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="h-3 w-3 mr-1" />
                              Stop
                            </>
                          ) : (
                            <>
                              <Play className="h-3 w-3 mr-1" />
                              Play
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
