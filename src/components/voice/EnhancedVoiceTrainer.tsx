
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Headphones,
  Settings,
  Brain,
  Zap
} from 'lucide-react';

// Extend the Window interface to include Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface VoiceCommand {
  command: string;
  action: string;
  context: string;
  confidence: number;
}

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
  progress: number;
  duration: number;
  voice_guide: string;
}

export function EnhancedVoiceTrainer() {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentModule, setCurrentModule] = useState<TrainingModule | null>(null);
  const [voiceCommands, setVoiceCommands] = useState<VoiceCommand[]>([]);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const trainingModules: TrainingModule[] = [
    {
      id: 'dashboard-basics',
      title: 'Dashboard Navigation',
      description: 'Learn to navigate the main dashboard using voice commands',
      status: 'active',
      progress: 65,
      duration: 300,
      voice_guide: 'Welcome to dashboard navigation training. Say "show dashboard" to begin.'
    },
    {
      id: 'contacts-management',
      title: 'Contact Management',
      description: 'Master contact creation, editing, and organization with voice',
      status: 'pending',
      progress: 0,
      duration: 450,
      voice_guide: 'Learn to manage contacts efficiently. Say "create contact" to start adding new contacts.'
    },
    {
      id: 'workflow-automation',
      title: 'Workflow Builder',
      description: 'Build automation workflows using voice commands',
      status: 'pending',
      progress: 0,
      duration: 600,
      voice_guide: 'Master workflow automation. Say "create workflow" to begin building your first automation.'
    },
    {
      id: 'marketing-campaigns',
      title: 'Marketing Campaigns',
      description: 'Create and manage marketing campaigns with voice control',
      status: 'pending',
      progress: 0,
      duration: 420,
      voice_guide: 'Learn campaign management. Say "new campaign" to create your first marketing campaign.'
    }
  ];

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setRecognitionSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let final_transcript = '';
        let interim_transcript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final_transcript += transcript;
            setConfidence(event.results[i][0].confidence);
            processVoiceCommand(transcript);
          } else {
            interim_transcript += transcript;
          }
        }

        setTranscript(final_transcript + interim_transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Voice recognition error. Please try again.');
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setRecognitionSupported(false);
      toast.error('Speech recognition not supported in this browser.');
    }

    // Initialize speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const processVoiceCommand = useCallback((command: string) => {
    const lowerCommand = command.toLowerCase().trim();
    
    const newCommand: VoiceCommand = {
      command: lowerCommand,
      action: 'unknown',
      context: 'training',
      confidence: confidence
    };

    // Process common voice commands
    if (lowerCommand.includes('start training') || lowerCommand.includes('begin training')) {
      newCommand.action = 'start_training';
      startCurrentModule();
    } else if (lowerCommand.includes('stop training') || lowerCommand.includes('end training')) {
      newCommand.action = 'stop_training';
      stopTraining();
    } else if (lowerCommand.includes('next module')) {
      newCommand.action = 'next_module';
      nextModule();
    } else if (lowerCommand.includes('repeat') || lowerCommand.includes('say again')) {
      newCommand.action = 'repeat';
      repeatCurrentInstruction();
    } else if (lowerCommand.includes('help') || lowerCommand.includes('what can i say')) {
      newCommand.action = 'help';
      showVoiceHelp();
    }

    setVoiceCommands(prev => [newCommand, ...prev.slice(0, 9)]);
  }, [confidence]);

  const startListening = () => {
    if (recognitionRef.current && recognitionSupported) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.success('Voice recognition started');
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast.error('Failed to start voice recognition');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast.info('Voice recognition stopped');
    }
  };

  const speak = (text: string) => {
    if (synthRef.current && 'speechSynthesis' in window) {
      synthRef.current.cancel(); // Stop any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Try to use a female voice
      const voices = synthRef.current.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('victoria')
      ) || voices.find(voice => voice.lang === 'en-US');
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => {
        setIsPlaying(false);
        toast.error('Text-to-speech error');
      };

      synthRef.current.speak(utterance);
    } else {
      toast.error('Text-to-speech not supported');
    }
  };

  const startCurrentModule = () => {
    const module = trainingModules.find(m => m.status === 'active') || trainingModules[0];
    setCurrentModule(module);
    speak(module.voice_guide);
    toast.success(`Started training: ${module.title}`);
  };

  const stopTraining = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    setCurrentModule(null);
    toast.info('Training stopped');
  };

  const nextModule = () => {
    const currentIndex = trainingModules.findIndex(m => m.id === currentModule?.id);
    const nextModule = trainingModules[currentIndex + 1];
    
    if (nextModule) {
      setCurrentModule(nextModule);
      speak(nextModule.voice_guide);
      toast.success(`Switched to: ${nextModule.title}`);
    } else {
      speak('You have completed all training modules. Congratulations!');
      toast.success('All modules completed!');
    }
  };

  const repeatCurrentInstruction = () => {
    if (currentModule) {
      speak(currentModule.voice_guide);
    } else {
      speak('No active training module. Say "start training" to begin.');
    }
  };

  const showVoiceHelp = () => {
    const helpText = `
      Available voice commands:
      Say "start training" to begin a module.
      Say "next module" to move to the next lesson.
      Say "repeat" to hear the current instruction again.
      Say "stop training" to end the session.
      Say "help" to hear this message again.
    `;
    speak(helpText);
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Voice Trainer</h1>
        <p className="text-gray-600">Learn to use the application with natural voice commands</p>
      </div>

      {/* Voice Controls */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-blue-600" />
            Voice Control Center
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Button
                onClick={isListening ? stopListening : startListening}
                variant={isListening ? "destructive" : "default"}
                size="lg"
                disabled={!recognitionSupported}
                className="min-w-[120px]"
              >
                {isListening ? (
                  <>
                    <MicOff className="h-5 w-5 mr-2" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5 mr-2" />
                    Start Listening
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => speak("Voice trainer is ready. Say start training to begin.")}
                variant="outline"
                size="lg"
                disabled={isPlaying}
              >
                {isPlaying ? (
                  <>
                    <VolumeX className="h-5 w-5 mr-2" />
                    Speaking...
                  </>
                ) : (
                  <>
                    <Volume2 className="h-5 w-5 mr-2" />
                    Test Voice
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={recognitionSupported ? "default" : "destructive"}>
                {recognitionSupported ? "Recognition Ready" : "Not Supported"}
              </Badge>
              <Badge variant={isListening ? "default" : "secondary"}>
                {isListening ? "Listening" : "Idle"}
              </Badge>
            </div>
          </div>

          {transcript && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Last heard:</p>
              <p className="font-medium">{transcript}</p>
              {confidence > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Confidence: {Math.round(confidence * 100)}%
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Training Module */}
      {currentModule && (
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-green-600" />
              Active Training: {currentModule.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">{currentModule.description}</p>
            <Progress value={currentModule.progress} className="w-full" />
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Progress: {currentModule.progress}%</span>
              <span>Duration: {Math.floor(currentModule.duration / 60)}m {currentModule.duration % 60}s</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => speak(currentModule.voice_guide)} size="sm" variant="outline">
                <RotateCcw className="h-4 w-4 mr-1" />
                Repeat Instructions
              </Button>
              <Button onClick={nextModule} size="sm" variant="outline">
                <Zap className="h-4 w-4 mr-1" />
                Next Module
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Training Modules */}
      <div className="grid md:grid-cols-2 gap-6">
        {trainingModules.map((module) => (
          <Card 
            key={module.id} 
            className={`cursor-pointer transition-all ${
              module.status === 'active' ? 'border-2 border-blue-500 bg-blue-50' :
              module.status === 'completed' ? 'border-2 border-green-500 bg-green-50' :
              'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => {
              setCurrentModule(module);
              speak(module.voice_guide);
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {module.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : module.status === 'active' ? (
                    <Play className="h-5 w-5 text-blue-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-gray-400" />
                  )}
                  {module.title}
                </span>
                <Badge variant={
                  module.status === 'completed' ? 'default' :
                  module.status === 'active' ? 'secondary' : 'outline'
                }>
                  {module.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">{module.description}</p>
              <Progress value={module.progress} className="w-full" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Progress: {module.progress}%</span>
                <span>{Math.floor(module.duration / 60)}m {module.duration % 60}s</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Voice Commands */}
      {voiceCommands.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-purple-600" />
              Recent Voice Commands
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {voiceCommands.map((cmd, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">"{cmd.command}"</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {cmd.action}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {Math.round(cmd.confidence * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Voice Commands Help */}
      <Card className="border-2 border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-amber-600" />
            Voice Commands Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Training Control:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• "Start training" - Begin current module</li>
                <li>• "Next module" - Move to next lesson</li>
                <li>• "Repeat" - Hear instructions again</li>
                <li>• "Stop training" - End current session</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">General Commands:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• "Help" - Show available commands</li>
                <li>• "What can I say" - Voice help</li>
                <li>• "Say again" - Repeat last instruction</li>
                <li>• "Show dashboard" - Navigate to main</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
