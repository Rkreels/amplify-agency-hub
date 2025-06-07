
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Phone, 
  PhoneCall, 
  PhoneIncoming, 
  PhoneOutgoing, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  Download,
  MessageSquare,
  Settings,
  Users,
  Clock,
  TrendingUp
} from 'lucide-react';
import { usePhoneSystemStore } from '@/store/usePhoneSystemStore';
import { useVoiceTraining } from '@/components/voice/VoiceTrainingProvider';

export function PhoneSystemDashboard() {
  const [activeCall, setActiveCall] = useState<any>(null);
  const [isDialpadOpen, setIsDialpadOpen] = useState(false);
  const [callNumber, setCallNumber] = useState('');
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');
  
  const { 
    phoneNumbers, 
    callRecords, 
    voicemailDrops,
    callQueues,
    makeCall, 
    endCall,
    addCallNote 
  } = usePhoneSystemStore();
  
  const { announceFeature } = useVoiceTraining();

  const handleMakeCall = () => {
    if (callNumber && selectedPhoneNumber) {
      makeCall(callNumber, selectedPhoneNumber);
      announceFeature('Outbound Call', `Initiating call to ${callNumber} from ${selectedPhoneNumber}`);
      setCallNumber('');
    }
  };

  const handleEndCall = () => {
    if (activeCall) {
      endCall(activeCall.id, 180);
      setActiveCall(null);
      announceFeature('Call Ended', 'Call has been disconnected and saved to call history');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Phone System</h2>
          <p className="text-muted-foreground">Manage calls, voicemails, and phone numbers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Phone className="h-4 w-4 mr-2" />
            Add Number
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <PhoneCall className="h-4 w-4 mr-2" />
              Total Calls Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">147</div>
            <p className="text-xs text-muted-foreground">+23% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Average Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4:32</div>
            <p className="text-xs text-muted-foreground">2 min longer than avg</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Voicemails
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">8 unheard</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Answer Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+5% this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Dialer & Active Call */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Quick Dialer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedPhoneNumber} onValueChange={setSelectedPhoneNumber}>
              <SelectTrigger>
                <SelectValue placeholder="Select phone number" />
              </SelectTrigger>
              <SelectContent>
                {phoneNumbers.map((number) => (
                  <SelectItem key={number.id} value={number.id}>
                    {number.number} - {number.assignedTo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              type="tel"
              placeholder="Enter phone number"
              value={callNumber}
              onChange={(e) => setCallNumber(e.target.value)}
            />
            
            <Button 
              onClick={handleMakeCall} 
              className="w-full"
              disabled={!callNumber || !selectedPhoneNumber}
            >
              <PhoneCall className="h-4 w-4 mr-2" />
              Call Now
            </Button>
          </CardContent>
        </Card>

        {activeCall && (
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PhoneCall className="h-5 w-5 mr-2" />
                Active Call
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-lg font-semibold">{activeCall.contactName || activeCall.contactNumber}</div>
                <div className="text-sm text-muted-foreground">Connected - 00:45</div>
              </div>
              
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm">
                  <Mic className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Volume2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Play className="h-4 w-4" />
                </Button>
                <Button variant="destructive" onClick={handleEndCall}>
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Call Management Tabs */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Calls</TabsTrigger>
          <TabsTrigger value="voicemail">Voicemails</TabsTrigger>
          <TabsTrigger value="numbers">Phone Numbers</TabsTrigger>
          <TabsTrigger value="queues">Call Queues</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          {callRecords.map((call) => (
            <Card key={call.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {call.direction === 'inbound' ? (
                      <PhoneIncoming className="h-5 w-5 text-green-600" />
                    ) : (
                      <PhoneOutgoing className="h-5 w-5 text-blue-600" />
                    )}
                    <div>
                      <div className="font-medium">{call.contactName || call.contactNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {call.duration > 0 ? `${Math.floor(call.duration / 60)}:${call.duration % 60}` : 'No answer'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={call.status === 'completed' ? 'default' : 'secondary'}>
                      {call.status}
                    </Badge>
                    {call.recordingUrl && (
                      <Button variant="outline" size="sm">
                        <Play className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="voicemail" className="space-y-4">
          {voicemailDrops.map((voicemail) => (
            <Card key={voicemail.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="font-medium">{voicemail.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {voicemail.duration}s • Used {voicemail.usageCount} times
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Play className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="numbers" className="space-y-4">
          {phoneNumbers.map((number) => (
            <Card key={number.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{number.number}</div>
                    <div className="text-sm text-muted-foreground">
                      {number.type} • {number.assignedTo} • ${number.monthlyRate}/month
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={number.isActive ? 'default' : 'secondary'}>
                      {number.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="queues" className="space-y-4">
          {callQueues.map((queue) => (
            <Card key={queue.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{queue.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {queue.agents.length} agents • Max wait: {queue.maxWaitTime}s
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={queue.isActive ? 'default' : 'secondary'}>
                      {queue.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Users className="h-3 w-3 mr-1" />
                      Manage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
