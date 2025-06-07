
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle,
  Clock,
  Users,
  MessageSquare,
  Calendar,
  Target,
  Zap,
  BarChart3,
  Settings,
  Globe,
  Star,
  CreditCard,
  Phone,
  Smartphone,
  Building
} from 'lucide-react';
import { useVoiceTraining } from './VoiceTrainingProvider';

interface VoiceTrainingModule {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  estimatedTime: number;
  steps: VoiceTrainingStep[];
  status: 'pending' | 'active' | 'completed';
  progress: number;
}

interface VoiceTrainingStep {
  id: string;
  title: string;
  instruction: string;
  voiceScript: string;
  action?: string;
  expectedResult?: string;
}

const voiceTrainingModules: VoiceTrainingModule[] = [
  {
    id: 'dashboard-navigation',
    title: 'Dashboard Navigation',
    description: 'Learn to navigate the main dashboard and understand key metrics',
    icon: BarChart3,
    category: 'Core Navigation',
    estimatedTime: 300,
    status: 'pending',
    progress: 0,
    steps: [
      {
        id: 'dashboard-overview',
        title: 'Dashboard Overview',
        instruction: 'Navigate to the dashboard and explore key widgets',
        voiceScript: 'Welcome to your GoHighLevel dashboard! This is your command center where you can see all important business metrics at a glance. The dashboard shows your lead statistics, recent activities, sales pipeline progress, and upcoming tasks. You can customize these widgets by clicking the widget manager in the top right corner.',
        action: 'navigate_dashboard',
        expectedResult: 'User should see dashboard widgets and understand their purpose'
      },
      {
        id: 'dashboard-widgets',
        title: 'Understanding Widgets',
        instruction: 'Learn about each dashboard widget',
        voiceScript: 'Each widget on your dashboard serves a specific purpose. The stat cards at the top show your key performance indicators like total leads, conversion rates, and revenue. The sales pipeline widget shows your deals in different stages. The recent activities feed keeps you updated on all customer interactions. The upcoming tasks widget helps you stay on top of your to-do list.',
        action: 'explain_widgets'
      }
    ]
  },
  {
    id: 'contacts-management',
    title: 'Contact Management',
    description: 'Master creating, editing, and organizing contacts',
    icon: Users,
    category: 'Customer Management',
    estimatedTime: 450,
    status: 'pending',
    progress: 0,
    steps: [
      {
        id: 'create-contact',
        title: 'Creating Contacts',
        instruction: 'Learn to add new contacts to your system',
        voiceScript: 'To create a new contact, navigate to the Contacts section and click the "Add Contact" button. Fill in the basic information like name, email, and phone number. You can also add custom fields, tags, and assign the contact to specific campaigns. Tags help you organize contacts into groups for targeted marketing.',
        action: 'create_contact_demo'
      },
      {
        id: 'contact-organization',
        title: 'Contact Organization',
        instruction: 'Learn to use tags, custom fields, and contact segmentation',
        voiceScript: 'Effective contact organization is key to successful marketing. Use tags to categorize contacts by interests, lead source, or status. Custom fields allow you to store additional information specific to your business. You can create smart lists based on contact attributes to automatically segment your audience for targeted campaigns.',
        action: 'organize_contacts_demo'
      },
      {
        id: 'contact-communication',
        title: 'Contact Communication',
        instruction: 'Learn to communicate with contacts through various channels',
        voiceScript: 'GoHighLevel offers multiple ways to communicate with your contacts. You can send individual emails or SMS messages, add contacts to automated sequences, or schedule appointments. The conversation history shows all interactions with each contact across all channels, giving you a complete view of your relationship.',
        action: 'communication_demo'
      }
    ]
  },
  {
    id: 'automation-workflows',
    title: 'Automation Workflows',
    description: 'Build powerful automation workflows',
    icon: Zap,
    category: 'Automation',
    estimatedTime: 600,
    status: 'pending',
    progress: 0,
    steps: [
      {
        id: 'workflow-basics',
        title: 'Workflow Fundamentals',
        instruction: 'Understand triggers, actions, and workflow logic',
        voiceScript: 'Workflows are the heart of automation in GoHighLevel. Every workflow starts with a trigger - an event that starts the automation, like a form submission or tag addition. Actions are what happens next - sending emails, adding tags, creating tasks. You can add conditions to create smart workflows that respond differently based on contact attributes.',
        action: 'workflow_basics_demo'
      },
      {
        id: 'build-workflow',
        title: 'Building Your First Workflow',
        instruction: 'Create a complete automation workflow',
        voiceScript: 'Let\'s build a welcome workflow together. Start by adding a "Form Submitted" trigger from the triggers panel. Then drag an "Send Email" action and connect them. Configure the email with a welcome message. Add a delay action, then another email for follow-up. This creates a simple but effective welcome sequence for new leads.',
        action: 'build_workflow_demo'
      },
      {
        id: 'advanced-workflows',
        title: 'Advanced Workflow Features',
        instruction: 'Learn conditions, goals, and complex automations',
        voiceScript: 'Advanced workflows use conditions to create smart automations. Add an "If/Else" condition to check if a contact has a specific tag or custom field value. Use goals to track when contacts complete desired actions like making a purchase. You can also use wait steps to control timing and create sophisticated nurture sequences.',
        action: 'advanced_workflow_demo'
      }
    ]
  },
  {
    id: 'calendar-management',
    title: 'Calendar & Appointments',
    description: 'Manage appointments and calendar integrations',
    icon: Calendar,
    category: 'Scheduling',
    estimatedTime: 420,
    status: 'pending',
    progress: 0,
    steps: [
      {
        id: 'calendar-setup',
        title: 'Calendar Setup',
        instruction: 'Configure your calendar and availability',
        voiceScript: 'Setting up your calendar correctly is crucial for appointment booking. Start by creating appointment types for different services you offer. Set your availability for each day of the week, including buffer times between appointments. You can create multiple calendars for different team members or service types.',
        action: 'calendar_setup_demo'
      },
      {
        id: 'appointment-types',
        title: 'Appointment Types',
        instruction: 'Create and configure different appointment types',
        voiceScript: 'Appointment types define the services you offer and their booking parameters. Set the duration, price, and description for each service. You can require certain information from clients during booking, send automatic confirmation emails, and set up reminder sequences. Each appointment type can have different availability rules.',
        action: 'appointment_types_demo'
      }
    ]
  },
  {
    id: 'marketing-campaigns',
    title: 'Marketing Campaigns',
    description: 'Create and manage marketing campaigns',
    icon: Target,
    category: 'Marketing',
    estimatedTime: 480,
    status: 'pending',
    progress: 0,
    steps: [
      {
        id: 'email-campaigns',
        title: 'Email Marketing',
        instruction: 'Create effective email campaigns',
        voiceScript: 'Email marketing in GoHighLevel starts with creating compelling email templates. Use the drag-and-drop editor to design professional emails. You can send one-time broadcasts to specific contact segments or create automated email sequences. Track open rates, click rates, and conversions to optimize your campaigns.',
        action: 'email_campaigns_demo'
      },
      {
        id: 'sms-campaigns',
        title: 'SMS Marketing',
        instruction: 'Set up SMS campaigns and automation',
        voiceScript: 'SMS marketing has high open rates and immediate impact. Create SMS templates for different purposes like appointment reminders, promotional offers, or follow-ups. You can send bulk SMS campaigns to contact segments or include SMS actions in your automation workflows. Always comply with SMS regulations and provide opt-out options.',
        action: 'sms_campaigns_demo'
      }
    ]
  },
  {
    id: 'crm-pipeline',
    title: 'CRM & Pipeline Management',
    description: 'Manage your sales pipeline effectively',
    icon: Target,
    category: 'Sales',
    estimatedTime: 390,
    status: 'pending',
    progress: 0,
    steps: [
      {
        id: 'pipeline-setup',
        title: 'Pipeline Configuration',
        instruction: 'Set up your sales pipeline stages',
        voiceScript: 'Your sales pipeline is a visual representation of your sales process. Create stages that match your sales methodology, such as Lead, Qualified, Proposal, Negotiation, and Closed. Each stage should represent a clear step in your sales process. You can customize the pipeline for different products or services.',
        action: 'pipeline_setup_demo'
      },
      {
        id: 'opportunity-management',
        title: 'Managing Opportunities',
        instruction: 'Create and track sales opportunities',
        voiceScript: 'Opportunities represent potential sales in your pipeline. Create opportunities for qualified leads, set the deal value and expected close date. Move opportunities through pipeline stages as they progress. Add notes, tasks, and files to track all sales activities. Use the pipeline view to get a visual overview of your sales progress.',
        action: 'opportunity_management_demo'
      }
    ]
  },
  {
    id: 'conversations-messaging',
    title: 'Conversations & Messaging',
    description: 'Manage all customer communications',
    icon: MessageSquare,
    category: 'Communication',
    estimatedTime: 360,
    status: 'pending',
    progress: 0,
    steps: [
      {
        id: 'unified-inbox',
        title: 'Unified Inbox',
        instruction: 'Manage all conversations in one place',
        voiceScript: 'The conversations section is your unified inbox for all customer communications. Here you can see emails, SMS messages, Facebook messages, and other communications in one place. Each conversation shows the complete history with a contact across all channels. You can respond directly from the inbox and set up automated responses.',
        action: 'unified_inbox_demo'
      },
      {
        id: 'conversation-management',
        title: 'Conversation Management',
        instruction: 'Organize and respond to conversations effectively',
        voiceScript: 'Effective conversation management keeps your customer communications organized. Use filters to find specific conversations quickly. Assign conversations to team members for proper follow-up. Set conversation status to track which ones need attention. You can also create templates for common responses to save time.',
        action: 'conversation_management_demo'
      }
    ]
  },
  {
    id: 'sites-funnels',
    title: 'Sites & Funnels',
    description: 'Build high-converting websites and funnels',
    icon: Globe,
    category: 'Website Building',
    estimatedTime: 540,
    status: 'pending',
    progress: 0,
    steps: [
      {
        id: 'funnel-builder',
        title: 'Funnel Builder Basics',
        instruction: 'Create your first sales funnel',
        voiceScript: 'Sales funnels guide visitors through a specific journey to convert them into customers. Start by choosing a funnel template that matches your goal - lead generation, sales, webinar registration, etc. Customize the pages with your branding, content, and offers. Each page should have a clear call-to-action that moves visitors to the next step.',
        action: 'funnel_builder_demo'
      },
      {
        id: 'page-optimization',
        title: 'Page Optimization',
        instruction: 'Optimize pages for better conversions',
        voiceScript: 'Page optimization is crucial for funnel success. Use compelling headlines that grab attention, clear value propositions that explain benefits, and strong call-to-action buttons. Add testimonials and social proof to build trust. Test different versions of your pages to see what converts better. Mobile optimization is essential as many visitors use smartphones.',
        action: 'page_optimization_demo'
      }
    ]
  },
  {
    id: 'reputation-management',
    title: 'Reputation Management',
    description: 'Monitor and manage your online reputation',
    icon: Star,
    category: 'Reputation',
    estimatedTime: 300,
    status: 'pending',
    progress: 0,
    steps: [
      {
        id: 'review-monitoring',
        title: 'Review Monitoring',
        instruction: 'Track reviews across platforms',
        voiceScript: 'Reputation management starts with monitoring reviews across all platforms where your business is listed. Connect your Google My Business, Facebook, and other review platforms to track new reviews automatically. Set up notifications to respond quickly to new reviews, especially negative ones that need immediate attention.',
        action: 'review_monitoring_demo'
      },
      {
        id: 'review-generation',
        title: 'Review Generation',
        instruction: 'Generate more positive reviews',
        voiceScript: 'Proactively generating positive reviews is key to maintaining a good reputation. Create automated campaigns that ask satisfied customers to leave reviews. Send review requests via email or SMS after successful transactions. Make it easy for customers by providing direct links to your review profiles. Follow up with customers who haven\'t responded.',
        action: 'review_generation_demo'
      }
    ]
  },
  {
    id: 'reporting-analytics',
    title: 'Reporting & Analytics',
    description: 'Track performance and generate insights',
    icon: BarChart3,
    category: 'Analytics',
    estimatedTime: 420,
    status: 'pending',
    progress: 0,
    steps: [
      {
        id: 'dashboard-metrics',
        title: 'Key Metrics Dashboard',
        instruction: 'Understand your key performance indicators',
        voiceScript: 'Your analytics dashboard shows the most important metrics for your business. Track lead generation numbers, conversion rates, revenue trends, and customer acquisition costs. Each metric tells a story about your business performance. Set up custom date ranges to analyze performance over specific periods. Use these insights to make data-driven decisions.',
        action: 'dashboard_metrics_demo'
      },
      {
        id: 'campaign-reporting',
        title: 'Campaign Performance',
        instruction: 'Analyze marketing campaign effectiveness',
        voiceScript: 'Campaign reporting helps you understand which marketing efforts are working best. Track email open rates, click rates, and conversion rates for each campaign. Monitor SMS delivery and response rates. Compare performance across different contact segments to identify your best audiences. Use A/B testing to optimize campaign performance.',
        action: 'campaign_reporting_demo'
      }
    ]
  }
];

export function ComprehensiveVoiceTraining() {
  const [selectedModule, setSelectedModule] = useState<VoiceTrainingModule | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [moduleProgress, setModuleProgress] = useState<Record<string, number>>({});
  const { announceFeature } = useVoiceTraining();

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startModule = (module: VoiceTrainingModule) => {
    setSelectedModule(module);
    setCurrentStep(0);
    speak(module.steps[0].voiceScript);
  };

  const nextStep = () => {
    if (!selectedModule) return;
    
    const nextStepIndex = currentStep + 1;
    if (nextStepIndex < selectedModule.steps.length) {
      setCurrentStep(nextStepIndex);
      speak(selectedModule.steps[nextStepIndex].voiceScript);
    } else {
      // Module completed
      setModuleProgress(prev => ({ ...prev, [selectedModule.id]: 100 }));
      speak('Congratulations! You have completed this training module. You can now confidently use this feature in your daily workflow.');
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1;
      setCurrentStep(prevStepIndex);
      if (selectedModule) {
        speak(selectedModule.steps[prevStepIndex].voiceScript);
      }
    }
  };

  const repeatStep = () => {
    if (selectedModule && selectedModule.steps[currentStep]) {
      speak(selectedModule.steps[currentStep].voiceScript);
    }
  };

  const groupedModules = voiceTrainingModules.reduce((acc, module) => {
    const category = module.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(module);
    return acc;
  }, {} as Record<string, VoiceTrainingModule[]>);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Module Selection */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Training Modules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              {Object.entries(groupedModules).map(([category, modules]) => (
                <div key={category} className="mb-6">
                  <h4 className="font-medium text-sm text-gray-600 mb-3">{category}</h4>
                  <div className="space-y-2">
                    {modules.map((module) => {
                      const IconComponent = module.icon;
                      const progress = moduleProgress[module.id] || 0;
                      const isCompleted = progress === 100;
                      
                      return (
                        <Card 
                          key={module.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedModule?.id === module.id ? 'ring-2 ring-blue-500' : ''
                          } ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}
                          onClick={() => startModule(module)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${
                                isCompleted ? 'bg-green-100' : 'bg-blue-100'
                              }`}>
                                <IconComponent className={`h-4 w-4 ${
                                  isCompleted ? 'text-green-600' : 'text-blue-600'
                                }`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-sm">{module.title}</h5>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {module.description}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Clock className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">
                                    {Math.floor(module.estimatedTime / 60)}m
                                  </span>
                                  {isCompleted && (
                                    <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                                      Completed
                                    </Badge>
                                  )}
                                </div>
                                {progress > 0 && (
                                  <Progress value={progress} className="mt-2 h-1" />
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Training Content */}
      <div className="lg:col-span-2">
        {selectedModule ? (
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <selectedModule.icon className="h-6 w-6 text-blue-600" />
                  <div>
                    <CardTitle>{selectedModule.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Step {currentStep + 1} of {selectedModule.steps.length}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">
                  {selectedModule.category}
                </Badge>
              </div>
              <Progress 
                value={(currentStep + 1) / selectedModule.steps.length * 100} 
                className="mt-4"
              />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Step */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3">
                  {selectedModule.steps[currentStep]?.title}
                </h3>
                <p className="text-gray-700 mb-4">
                  {selectedModule.steps[currentStep]?.instruction}
                </p>
                
                {/* Voice Script Display */}
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium text-sm text-gray-600 mb-2">Voice Guide:</h4>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {selectedModule.steps[currentStep]?.voiceScript}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    onClick={previousStep}
                    disabled={currentStep === 0}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={repeatStep}
                    variant="outline"
                    size="sm"
                    disabled={isPlaying}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Repeat
                  </Button>
                </div>
                
                <Button
                  onClick={nextStep}
                  disabled={currentStep >= selectedModule.steps.length - 1 && moduleProgress[selectedModule.id] === 100}
                >
                  {currentStep >= selectedModule.steps.length - 1 ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Complete Module
                    </>
                  ) : (
                    'Next Step'
                  )}
                </Button>
              </div>

              {/* Step List */}
              <div className="border-t pt-6">
                <h4 className="font-medium mb-3">Module Steps:</h4>
                <div className="space-y-2">
                  {selectedModule.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        index === currentStep 
                          ? 'bg-blue-100 border border-blue-200' 
                          : index < currentStep 
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                      onClick={() => {
                        setCurrentStep(index);
                        speak(step.voiceScript);
                      }}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        index === currentStep
                          ? 'bg-blue-600 text-white'
                          : index < currentStep
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {index < currentStep ? '✓' : index + 1}
                      </div>
                      <span className="font-medium text-sm">{step.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center">
              <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Select a Training Module
              </h3>
              <p className="text-gray-500">
                Choose a module from the left to start your comprehensive voice training
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
