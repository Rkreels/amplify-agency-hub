
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Phone, 
  PhoneCall, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneMissed,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Clock,
  Users,
  Settings,
  Plus,
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { usePhoneStore, type Call } from '@/store/usePhoneStore';
import { useVoiceTraining } from '@/components/voice/VoiceTrainingProvider';
import { toast } from 'sonner';

export function PhoneSystemDashboard() {
  const {
    calls,
    phoneNumbers,
    activeCall,
    isDialerOpen,
    dialedNumber,
    isMuted,
    isOnHold,
    callVolume,
    addCall,
    updateCall,
    endCall,
    setActiveCall,
    setDialerOpen,
    setDialedNumber,
    dialNumber,
    answerCall,
    toggleMute,
    toggleHold,
    setVolume,
    addPhoneNumber,
    updatePhoneNumber
  } = usePhoneStore();

  const { announceFeature } = useVoiceTraining();
  const [selectedTab, setSelectedTab] = useState('dialer');
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    announceFeature(
      'Phone System',
      'Make and receive calls, manage phone numbers, and track call history. Use the dialer to make outbound calls or manage incoming calls with full call controls.'
    );
  }, [announceFeature]);

  // Call timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCall && activeCall.status === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  const handleDialerInput = (digit: string) => {
    setDialedNumber(dialedNumber + digit);
  };

  const handleMakeCall = () => {
    if (!dialedNumber) {
      toast.error('Please enter a phone number');
      return;
    }
    dialNumber(dialedNumber);
    toast.success(`Calling ${dialedNumber}...`);
  };

  const handleAnswerCall = (call: Call) => {
    answerCall(call.id);
    setActiveCall(call);
    toast.success(`Call connected with ${call.contactName}`);
  };

  const handleEndCall = () => {
    if (activeCall) {
      endCall(activeCall.id);
      setActiveCall(null);
      toast.success('Call ended');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCallStatusColor = (status: Call['status']) => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'ringing': return 'text-yellow-600';
      case 'ended': return 'text-gray-500';
      case 'missed': return 'text-red-600';
      case 'voicemail': return 'text-blue-600';
      default: return 'text-gray-500';
    }
  };

  const getCallIcon = (call: Call) => {
    if (call.direction === 'inbound') {
      return call.status === 'missed' ? PhoneMissed : PhoneIncoming;
    }
    return PhoneOutgoing;
  };

  const DialerPad = () => (
    <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
        <Button
          key={digit}
          variant="outline"
          className="aspect-square text-lg font-semibold"
          onClick={() => handleDialerInput(digit)}
        >
          {digit}
        </Button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Phone System</h1>
          <p className="text-muted-foreground">
            Make calls, manage phone numbers, and track call history
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setDialerOpen(true)}>
            <Phone className="h-4 w-4 mr-2" />
            Open Dialer
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Number
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Phone Number</DialogTitle>
                <DialogDescription>
                  Add a new phone number to your system
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input id="phone-number" placeholder="+1-555-0123" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number-type">Type</Label>
                  <select id="number-type" className="w-full border rounded-md px-3 py-2">
                    <option value="local">Local</option>
                    <option value="toll-free">Toll-Free</option>
                    <option value="international">International</option>
                  </select>
                </div>
                <Button className="w-full">Add Number</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Call Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Calls Today</p>
                <p className="text-2xl font-bold">
                  {calls.filter(call => {
                    const today = new Date();
                    const callDate = new Date(call.startTime);
                    return callDate.toDateString() === today.toDateString();
                  }).length}
                </p>
              </div>
              <PhoneCall className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Missed Calls</p>
                <p className="text-2xl font-bold text-red-600">
                  {calls.filter(call => call.status === 'missed').length}
                </p>
              </div>
              <PhoneMissed className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Duration</p>
                <p className="text-2xl font-bold">
                  {formatDuration(
                    Math.round(
                      calls.filter(call => call.duration > 0)
                        .reduce((acc, call) => acc + call.duration, 0) / 
                      Math.max(calls.filter(call => call.duration > 0).length, 1)
                    )
                  )}
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Numbers</p>
                <p className="text-2xl font-bold">
                  {phoneNumbers.filter(num => num.isActive).length}
                </p>
              </div>
              <Phone className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Call Widget */}
      {activeCall && (
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {activeCall.contactName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{activeCall.contactName}</h3>
                  <p className="text-blue-100">{activeCall.phoneNumber}</p>
                  <p className="text-sm text-blue-200">
                    {activeCall.status === 'connected' ? formatDuration(callDuration) : activeCall.status}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-center">
                  <p className="text-xs text-blue-200">Volume</p>
                  <Slider
                    value={[callVolume]}
                    onValueChange={(value) => setVolume(value[0])}
                    max={100}
                    step={1}
                    className="w-20"
                  />
                </div>
                
                <Button
                  variant={isMuted ? "destructive" : "secondary"}
                  size="sm"
                  onClick={toggleMute}
                >
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant={isOnHold ? "secondary" : "outline"}
                  size="sm"
                  onClick={toggleHold}
                >
                  {isOnHold ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="destructive"
                  onClick={handleEndCall}
                >
                  <Phone className="h-4 w-4 rotate-[135deg]" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dialer */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Dialer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={dialedNumber}
              onChange={(e) => setDialedNumber(e.target.value)}
              placeholder="Enter phone number"
              className="text-center text-lg"
            />
            
            <DialerPad />
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setDialedNumber('')}
              >
                Clear
              </Button>
              <Button 
                className="flex-1"
                onClick={handleMakeCall}
                disabled={!dialedNumber}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Call History */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Calls</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {calls.slice(0, 10).map((call) => {
                const CallIcon = getCallIcon(call);
                return (
                  <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CallIcon className={`h-5 w-5 ${getCallStatusColor(call.status)}`} />
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {call.contactName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{call.contactName}</p>
                        <p className="text-sm text-muted-foreground">{call.phoneNumber}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {call.duration > 0 ? formatDuration(call.duration) : call.status}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {call.startTime.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => setDialedNumber(call.phoneNumber)}>
                        <Phone className="h-3 w-3" />
                      </Button>
                      {call.status === 'ringing' && call.direction === 'inbound' && (
                        <Button size="sm" onClick={() => handleAnswerCall(call)}>
                          Answer
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phone Numbers Management */}
      <Card>
        <CardHeader>
          <CardTitle>Phone Numbers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {phoneNumbers.map((number) => (
              <div key={number.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{number.number}</p>
                    <p className="text-sm text-muted-foreground">{number.type}</p>
                  </div>
                  <Badge variant={number.isActive ? 'default' : 'secondary'}>
                    {number.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  {number.assignedTo && (
                    <p><span className="text-muted-foreground">Assigned to:</span> {number.assignedTo}</p>
                  )}
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={number.forwardingEnabled} 
                        onCheckedChange={(checked) => 
                          updatePhoneNumber(number.id, { forwardingEnabled: checked })
                        }
                      />
                      <span>Forwarding</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={number.voicemailEnabled}
                        onCheckedChange={(checked) => 
                          updatePhoneNumber(number.id, { voicemailEnabled: checked })
                        }
                      />
                      <span>Voicemail</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialer Modal */}
      <Dialog open={isDialerOpen} onOpenChange={setDialerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Phone Dialer</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <Input
              value={dialedNumber}
              onChange={(e) => setDialedNumber(e.target.value)}
              placeholder="Enter phone number"
              className="text-center text-xl"
            />
            
            <DialerPad />
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setDialedNumber('')}
              >
                Clear
              </Button>
              <Button 
                className="flex-1"
                onClick={handleMakeCall}
                disabled={!dialedNumber}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
