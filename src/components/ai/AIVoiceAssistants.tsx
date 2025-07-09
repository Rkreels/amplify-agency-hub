
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Phone, Play, Pause, Settings, Mic, PhoneCall, User } from 'lucide-react';
import { useAIStore } from '@/store/useAIStore';
import { toast } from 'sonner';

export function AIVoiceAssistants() {
  const { 
    voiceAssistants, 
    createVoiceAssistant 
  } = useAIStore();
  
  const [newAssistant, setNewAssistant] = useState({
    name: '',
    voice: 'female_professional',
    language: 'en-US',
    personality: 'professional_friendly'
  });

  const handleCreateAssistant = () => {
    if (!newAssistant.name.trim()) {
      toast.error('Please enter assistant name');
      return;
    }

    createVoiceAssistant({
      ...newAssistant,
      instructions: 'You are a helpful AI voice assistant.',
      isActive: true,
      callsHandled: 0,
      averageCallDuration: 180,
      satisfactionScore: 4.5,
      skills: ['appointment_booking', 'lead_qualification'],
      features: {
        appointment_booking: true,
        lead_qualification: true,
        information_gathering: true,
        call_routing: false
      }
    });

    setNewAssistant({
      name: '',
      voice: 'female_professional',
      language: 'en-US',
      personality: 'professional_friendly'
    });

    toast.success('Voice assistant created successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Phone className="h-6 w-6" />
            AI Voice Assistants
          </h2>
          <p className="text-muted-foreground">
            Intelligent voice assistants for phone calls and customer interactions
          </p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Voice Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Voice Assistant</CardTitle>
            <CardDescription>Set up a new AI-powered voice assistant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Assistant Name</Label>
              <Input
                placeholder="e.g., Sarah - Sales Assistant"
                value={newAssistant.name}
                onChange={(e) => setNewAssistant({...newAssistant, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Voice Type</Label>
                <Select 
                  value={newAssistant.voice} 
                  onValueChange={(value) => setNewAssistant({...newAssistant, voice: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female_professional">Female Professional</SelectItem>
                    <SelectItem value="male_professional">Male Professional</SelectItem>
                    <SelectItem value="female_friendly">Female Friendly</SelectItem>
                    <SelectItem value="male_friendly">Male Friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <Select 
                  value={newAssistant.language} 
                  onValueChange={(value) => setNewAssistant({...newAssistant, language: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="en-GB">English (UK)</SelectItem>
                    <SelectItem value="es-ES">Spanish</SelectItem>
                    <SelectItem value="fr-FR">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Personality</Label>
              <Select 
                value={newAssistant.personality} 
                onValueChange={(value) => setNewAssistant({...newAssistant, personality: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional_friendly">Professional & Friendly</SelectItem>
                  <SelectItem value="casual_helpful">Casual & Helpful</SelectItem>
                  <SelectItem value="formal_direct">Formal & Direct</SelectItem>
                  <SelectItem value="warm_empathetic">Warm & Empathetic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleCreateAssistant} className="w-full">
              <Mic className="h-4 w-4 mr-2" />
              Create Voice Assistant
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Voice Call Analytics</CardTitle>
            <CardDescription>Performance metrics for voice interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">247</div>
                  <div className="text-sm text-blue-600">Calls Handled</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">94%</div>
                  <div className="text-sm text-green-600">Success Rate</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Appointment Bookings</span>
                  <span className="font-medium">89</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Lead Qualifications</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Information Requests</span>
                  <span className="font-medium">78</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Voice Assistants</CardTitle>
          <CardDescription>Manage your AI voice assistants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {voiceAssistants.map((assistant) => (
              <div key={assistant.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Phone className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{assistant.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {assistant.voice} • {assistant.language}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={assistant.isActive} />
                    <Badge variant={assistant.isActive ? 'default' : 'secondary'}>
                      {assistant.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Features:</h4>
                  <div className="flex gap-2 flex-wrap">
                    {assistant.features.appointment_booking && (
                      <Badge variant="outline">Appointment Booking</Badge>
                    )}
                    {assistant.features.lead_qualification && (
                      <Badge variant="outline">Lead Qualification</Badge>
                    )}
                    {assistant.features.information_gathering && (
                      <Badge variant="outline">Information Gathering</Badge>
                    )}
                    {assistant.features.call_routing && (
                      <Badge variant="outline">Call Routing</Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Play className="h-3 w-3 mr-1" />
                    Test Call
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="h-3 w-3 mr-1" />
                    Configure
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
