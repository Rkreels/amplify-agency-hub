
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Phone, 
  PhoneCall, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneMissed,
  Voicemail,
  Settings,
  Play,
  Pause,
  Download,
  Upload,
  Users,
  Clock,
  BarChart3,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export function PhoneSystemDashboard() {
  const [activeTab, setActiveTab] = useState("calls");
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const callStats = [
    { title: "Total Calls Today", value: "156", icon: Phone, color: "text-blue-600" },
    { title: "Answered Calls", value: "128", icon: PhoneIncoming, color: "text-green-600" },
    { title: "Missed Calls", value: "28", icon: PhoneMissed, color: "text-red-600" },
    { title: "Voicemails", value: "12", icon: Voicemail, color: "text-purple-600" }
  ];

  const recentCalls = [
    {
      id: 1,
      contact: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      type: "incoming",
      duration: "5:32",
      time: "2 minutes ago",
      status: "answered"
    },
    {
      id: 2,
      contact: "Michael Chen",
      phone: "+1 (555) 234-5678",
      type: "outgoing",
      duration: "12:45",
      time: "15 minutes ago",
      status: "answered"
    },
    {
      id: 3,
      contact: "Unknown",
      phone: "+1 (555) 345-6789",
      type: "incoming",
      duration: "0:00",
      time: "32 minutes ago",
      status: "missed"
    },
    {
      id: 4,
      contact: "Emily Rodriguez",
      phone: "+1 (555) 456-7890",
      type: "incoming",
      duration: "8:15",
      time: "1 hour ago",
      status: "answered"
    }
  ];

  const phoneNumbers = [
    {
      number: "+1 (555) 123-0001",
      type: "Main Line",
      status: "active",
      assignedTo: "All Users"
    },
    {
      number: "+1 (555) 123-0002",
      type: "Sales",
      status: "active",
      assignedTo: "Sales Team"
    },
    {
      number: "+1 (555) 123-0003",
      type: "Support",
      status: "active",
      assignedTo: "Support Team"
    },
    {
      number: "+1 (555) 123-0004",
      type: "Emergency",
      status: "inactive",
      assignedTo: "Management"
    }
  ];

  const voicemails = [
    {
      id: 1,
      from: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      duration: "1:45",
      time: "15 minutes ago",
      transcription: "Hi, I'm calling about the quote you sent. Could you please call me back?",
      isNew: true
    },
    {
      id: 2,
      from: "Unknown Caller",
      phone: "+1 (555) 987-6543",
      duration: "0:32",
      time: "2 hours ago",
      transcription: "Hello, this is regarding your recent inquiry...",
      isNew: false
    }
  ];

  const getCallIcon = (type: string, status: string) => {
    if (status === "missed") return PhoneMissed;
    return type === "incoming" ? PhoneIncoming : PhoneOutgoing;
  };

  const getCallColor = (type: string, status: string) => {
    if (status === "missed") return "text-red-600";
    return type === "incoming" ? "text-green-600" : "text-blue-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Phone className="h-8 w-8 text-primary" />
            Phone System
          </h1>
          <p className="text-muted-foreground">Manage calls, voicemails, and phone settings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <PhoneCall className="h-4 w-4 mr-2" />
            Make Call
          </Button>
        </div>
      </div>

      {/* Call Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {callStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Call Panel */}
      {isCallActive && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">Sarah Johnson</h3>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  <p className="text-sm text-muted-foreground">Call duration: 02:45</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={isMuted ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm">
                  <Volume2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setIsCallActive(false)}
                >
                  End Call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calls">Recent Calls</TabsTrigger>
          <TabsTrigger value="voicemails">Voicemails</TabsTrigger>
          <TabsTrigger value="numbers">Phone Numbers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="calls" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCalls.map((call) => {
                  const CallIcon = getCallIcon(call.type, call.status);
                  
                  return (
                    <div key={call.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <CallIcon className={`h-5 w-5 ${getCallColor(call.type, call.status)}`} />
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {call.contact.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{call.contact}</h4>
                          <p className="text-sm text-muted-foreground">{call.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{call.duration}</p>
                          <p className="text-xs text-muted-foreground">{call.time}</p>
                        </div>
                        <Badge variant={call.status === 'answered' ? 'default' : 'destructive'}>
                          {call.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <PhoneCall className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voicemails" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Voicemails</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {voicemails.map((voicemail) => (
                  <div key={voicemail.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Voicemail className="h-5 w-5 text-purple-600" />
                        <div>
                          <h4 className="font-medium">{voicemail.from}</h4>
                          <p className="text-sm text-muted-foreground">{voicemail.phone}</p>
                        </div>
                        {voicemail.isNew && (
                          <Badge variant="destructive">New</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{voicemail.duration}</span>
                        <span className="text-sm text-muted-foreground">{voicemail.time}</span>
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm bg-muted p-3 rounded-md">{voicemail.transcription}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="numbers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Phone Numbers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {phoneNumbers.map((number, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{number.number}</h4>
                      <p className="text-sm text-muted-foreground">{number.type}</p>
                      <p className="text-sm text-muted-foreground">Assigned to: {number.assignedTo}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={number.status === 'active' ? 'default' : 'secondary'}>
                        {number.status}
                      </Badge>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Call Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Peak Hours (9-11 AM)</span>
                      <span>45 calls</span>
                    </div>
                    <Progress value={75} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Business Hours</span>
                      <span>128 calls</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>After Hours</span>
                      <span>28 calls</span>
                    </div>
                    <Progress value={30} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Answer Rate</span>
                    <span className="font-semibold text-green-600">82%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Call Duration</span>
                    <span className="font-semibold">6:23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>First Call Resolution</span>
                    <span className="font-semibold text-blue-600">74%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Customer Satisfaction</span>
                    <span className="font-semibold text-purple-600">4.6/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Call Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Call Recording</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span>Voicemail Transcription</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span>Call Forwarding</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span>Do Not Disturb</span>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Monday - Friday</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input type="time" defaultValue="09:00" className="w-32" />
                    <span>to</span>
                    <Input type="time" defaultValue="17:00" className="w-32" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Saturday</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input type="time" defaultValue="10:00" className="w-32" />
                    <span>to</span>
                    <Input type="time" defaultValue="14:00" className="w-32" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sunday</span>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
