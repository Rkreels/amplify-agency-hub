
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Mic, 
  BookOpen, 
  Users, 
  Calendar,
  MessageSquare,
  DollarSign,
  Settings,
  BarChart3,
  Zap,
  Phone,
  Mail,
  Globe,
  Star
} from 'lucide-react';
import { useTTS } from '@/hooks/useTTS';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  icon: any;
  lessons: Array<{
    id: string;
    title: string;
    content: string;
    duration: number;
  }>;
  completed: boolean;
}

export function ComprehensiveVoiceTraining() {
  const { speak, stop, isSpeaking, voices, selectedVoice, setSelectedVoice } = useTTS();
  const { addNotification } = useAppStore();
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  const trainingModules: TrainingModule[] = [
    {
      id: 'dashboard',
      title: 'Dashboard Overview',
      description: 'Learn how to navigate and use the main dashboard',
      icon: BarChart3,
      completed: false,
      lessons: [
        {
          id: 'dash-1',
          title: 'Dashboard Navigation',
          content: 'Welcome to your GHL dashboard. Here you can see all your key metrics, recent activities, and quick access to important features. The dashboard provides real-time insights into your business performance.',
          duration: 30
        },
        {
          id: 'dash-2',
          title: 'Key Metrics',
          content: 'The metrics section shows your total revenue, contact count, active campaigns, and appointments. These numbers update in real-time to give you an accurate picture of your business health.',
          duration: 25
        }
      ]
    },
    {
      id: 'contacts',
      title: 'Contact Management',
      description: 'Master contact creation, editing, and organization',
      icon: Users,
      completed: false,
      lessons: [
        {
          id: 'contact-1',
          title: 'Adding Contacts',
          content: 'To add a new contact, click the "Add Contact" button. Fill in the required information including name, email, phone number, and any custom fields. You can also assign tags and set the contact status.',
          duration: 45
        },
        {
          id: 'contact-2',
          title: 'Contact Organization',
          content: 'Use tags and custom fields to organize your contacts effectively. You can filter and search contacts using various criteria. The contact details view shows complete interaction history.',
          duration: 35
        }
      ]
    },
    {
      id: 'calendar',
      title: 'Calendar & Appointments',
      description: 'Schedule and manage appointments efficiently',
      icon: Calendar,
      completed: false,
      lessons: [
        {
          id: 'cal-1',
          title: 'Creating Appointments',
          content: 'Schedule appointments by selecting a date and time on the calendar. You can set appointment types, add descriptions, and invite participants. Automated reminders can be configured.',
          duration: 40
        },
        {
          id: 'cal-2',
          title: 'Calendar Management',
          content: 'Manage multiple calendars, set availability, and handle recurring appointments. The calendar integrates with your contact database for seamless scheduling.',
          duration: 30
        }
      ]
    },
    {
      id: 'conversations',
      title: 'Conversation Management',
      description: 'Handle customer communications effectively',
      icon: MessageSquare,
      completed: false,
      lessons: [
        {
          id: 'conv-1',
          title: 'Managing Conversations',
          content: 'The conversation center consolidates all customer communications from email, SMS, and social media. You can assign conversations to team members and track response times.',
          duration: 35
        },
        {
          id: 'conv-2',
          title: 'Automated Responses',
          content: 'Set up automated responses and templates to handle common inquiries. AI-powered suggestions help you respond faster and more effectively.',
          duration: 30
        }
      ]
    },
    {
      id: 'automation',
      title: 'Marketing Automation',
      description: 'Create powerful automated workflows',
      icon: Zap,
      completed: false,
      lessons: [
        {
          id: 'auto-1',
          title: 'Workflow Builder Introduction',
          content: 'Welcome to the automation workflow builder. This powerful tool lets you create sophisticated marketing sequences using a drag-and-drop interface. You can see workflow elements on the right sidebar, organized into triggers, actions, and logic components.',
          duration: 45
        },
        {
          id: 'auto-2',
          title: 'Adding Triggers',
          content: 'Triggers start your workflows. From the right sidebar, click on the Triggers tab to see available options like form submissions, email opens, or contact creation. Simply drag any trigger onto the canvas to begin building your workflow.',
          duration: 35
        },
        {
          id: 'auto-3',
          title: 'Configuring Actions',
          content: 'Actions are what happen when your workflow runs. Click on any node to open the settings panel. Here you can configure details like email templates, SMS messages, tags to add, or tasks to create. Fill in all required fields marked with red asterisks.',
          duration: 50
        },
        {
          id: 'auto-4',
          title: 'Connecting Workflow Steps',
          content: 'Connect workflow elements by dragging from the connection points on each node. The small circles at the bottom of triggers and actions are connection handles. Drag from one to another to create the workflow flow.',
          duration: 40
        },
        {
          id: 'auto-5',
          title: 'Testing and Activation',
          content: 'Before activating your workflow, use the Test button in the header to ensure everything works correctly. Once tested, click Activate to make your workflow live. You can always deactivate or modify workflows later.',
          duration: 45
        },
        {
          id: 'auto-6',
          title: 'Advanced Features',
          content: 'Use conditions for if-then logic, wait steps for timing delays, and the advanced tab in node settings for error handling and execution options. The minimap helps navigate large workflows, and you can save progress at any time.',
          duration: 40
        }
      ]
    },
    {
      id: 'workflow-settings',
      title: 'Workflow Configuration',
      description: 'Master node settings and advanced features',
      icon: Settings,
      completed: false,
      lessons: [
        {
          id: 'settings-1',
          title: 'Node Settings Panel',
          content: 'Click on any workflow node to open the comprehensive settings panel. This panel has three tabs: Settings for basic configuration, Advanced for error handling and timeouts, and Testing for validating your setup.',
          duration: 40
        },
        {
          id: 'settings-2',
          title: 'Email Action Configuration',
          content: 'For email actions, configure the template, subject line, sender information, and delivery timing. Enable tracking for opens and clicks to measure engagement. Use the test feature to send sample emails.',
          duration: 45
        },
        {
          id: 'settings-3',
          title: 'SMS and Notifications',
          content: 'SMS actions require message content, sender number, and timing. Keep messages under 160 characters for best delivery. Enable opt-out compliance to respect unsubscribe requests automatically.',
          duration: 35
        },
        {
          id: 'settings-4',
          title: 'Conditional Logic',
          content: 'Condition nodes create branching workflows. Configure the field to check, comparison operator, and value. This creates Yes and No paths for different outcomes based on contact data.',
          duration: 50
        }
      ]
    }
  ];

  const startTraining = (moduleId: string) => {
    const module = trainingModules.find(m => m.id === moduleId);
    if (!module) return;

    setActiveModule(moduleId);
    setCurrentLesson(0);
    setProgress(0);
    
    toast.success(`Starting training: ${module.title}`);
    addNotification({
      type: 'info',
      title: 'Training Started',
      message: `Beginning ${module.title} training module`
    });
  };

  const playLesson = () => {
    if (!activeModule) return;
    
    const module = trainingModules.find(m => m.id === activeModule);
    if (!module || !module.lessons[currentLesson]) return;

    const lesson = module.lessons[currentLesson];
    speak(lesson.content);
    
    // Simulate progress
    const duration = lesson.duration * 1000;
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration / 1000));
        if (newProgress >= 100) {
          clearInterval(interval);
          completeLesson();
          return 100;
        }
        return newProgress;
      });
    }, 1000);
  };

  const completeLesson = () => {
    const module = trainingModules.find(m => m.id === activeModule);
    if (!module) return;

    if (currentLesson < module.lessons.length - 1) {
      setCurrentLesson(prev => prev + 1);
      setProgress(0);
      toast.success('Lesson completed! Moving to next lesson.');
    } else {
      // Module completed
      setCompletedModules(prev => [...prev, activeModule!]);
      setActiveModule(null);
      setProgress(0);
      toast.success('Training module completed!');
      addNotification({
        type: 'success',
        title: 'Training Completed',
        message: `Successfully completed ${module.title} module`
      });
    }
  };

  const stopTraining = () => {
    stop();
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Voice Training Center</h2>
          <p className="text-muted-foreground">
            Learn how to use the platform with interactive voice guidance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            className="px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground focus:ring-2 focus:ring-ring"
            value={selectedVoice?.name || ''}
            onChange={(e) => {
              const voice = voices.find(v => v.name === e.target.value);
              setSelectedVoice(voice || null);
            }}
          >
            <option value="">Select Voice</option>
            {voices.filter(v => v.lang.startsWith('en')).map(voice => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
          {isSpeaking ? (
            <Button onClick={stopTraining} variant="outline" size="sm">
              <VolumeX className="h-4 w-4 mr-2" />
              Stop
            </Button>
          ) : (
            <Button onClick={() => speak('Voice training system is ready')} variant="outline" size="sm">
              <Volume2 className="h-4 w-4 mr-2" />
              Test Voice
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="modules">
        <TabsList>
          <TabsTrigger value="modules">Training Modules</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trainingModules.map((module) => {
              const Icon = module.icon;
              const isCompleted = completedModules.includes(module.id);
              const isActive = activeModule === module.id;
              
              return (
                <Card key={module.id} className={`cursor-pointer transition-all hover:shadow-md ${isActive ? 'ring-2 ring-primary' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </div>
                      </div>
                      {isCompleted && (
                        <Badge variant="default">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        {module.lessons.length} lessons
                      </div>
                      
                      {isActive && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Lesson {currentLesson + 1}: {module.lessons[currentLesson]?.title}</span>
                          </div>
                          <Progress value={progress} />
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={playLesson}
                              disabled={isSpeaking}
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Play
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={stopTraining}
                            >
                              <Square className="h-3 w-3 mr-1" />
                              Stop
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {!isActive && !isCompleted && (
                        <Button 
                          className="w-full" 
                          onClick={() => startTraining(module.id)}
                        >
                          Start Training
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Progress</CardTitle>
              <CardDescription>Track your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Overall Progress</span>
                  <span className="font-medium">
                    {completedModules.length} / {trainingModules.length} modules
                  </span>
                </div>
                <Progress value={(completedModules.length / trainingModules.length) * 100} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {trainingModules.map((module) => {
                    const Icon = module.icon;
                    const isCompleted = completedModules.includes(module.id);
                    
                    return (
                      <div key={module.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                        <Icon className="h-5 w-5" />
                        <div className="flex-1">
                          <div className="font-medium">{module.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {module.lessons.length} lessons
                          </div>
                        </div>
                        {isCompleted ? (
                          <Badge variant="default">✓</Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
