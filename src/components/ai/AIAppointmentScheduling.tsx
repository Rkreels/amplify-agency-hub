
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Settings, Brain } from 'lucide-react';
import { useAIStore } from '@/store/useAIStore';
import { toast } from 'sonner';

export function AIAppointmentScheduling() {
  const { 
    aiAppointments, 
    scheduleAppointmentWithAI 
  } = useAIStore();
  
  const [contactId, setContactId] = useState('');
  const [preferences, setPreferences] = useState({
    timezone: 'America/New_York',
    preferred_duration: 30,
    preferred_times: ['morning'],
    avoid_times: []
  });
  const [isScheduling, setIsScheduling] = useState(false);

  const handleScheduleAppointment = async () => {
    if (!contactId.trim()) {
      toast.error('Please enter a contact ID');
      return;
    }

    setIsScheduling(true);
    try {
      await scheduleAppointmentWithAI(contactId, preferences);
      setContactId('');
      toast.success('AI appointment scheduling completed!');
    } catch (error) {
      toast.error('Failed to schedule appointment');
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            AI Appointment Scheduling
          </h2>
          <p className="text-muted-foreground">
            Intelligent appointment scheduling based on preferences and availability
          </p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Scheduling Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Schedule with AI</CardTitle>
            <CardDescription>Let AI find the best appointment times</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Contact ID</Label>
              <Input
                placeholder="Enter contact ID"
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Select 
                  value={preferences.preferred_duration.toString()} 
                  onValueChange={(value) => setPreferences({...preferences, preferred_duration: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select 
                  value={preferences.timezone} 
                  onValueChange={(value) => setPreferences({...preferences, timezone: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleScheduleAppointment}
              disabled={isScheduling || !contactId.trim()}
              className="w-full"
            >
              {isScheduling ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-spin" />
                  Finding Best Times...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule with AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scheduling Analytics</CardTitle>
            <CardDescription>AI scheduling performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">95%</div>
                  <div className="text-sm text-blue-600">Success Rate</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">2.3s</div>
                  <div className="text-sm text-green-600">Avg. Processing</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Appointments Scheduled</span>
                  <span className="font-medium">{aiAppointments.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Auto-Confirmed</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>No-Show Rate</span>
                  <span className="font-medium">5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI-Scheduled Appointments</CardTitle>
          <CardDescription>Recent appointments scheduled by AI</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No AI-scheduled appointments yet. Try the scheduling feature above!
              </div>
            ) : (
              aiAppointments.slice(-5).reverse().map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">Contact {appointment.contactId}</span>
                    </div>
                    <Badge variant={appointment.autoConfirm ? 'default' : 'secondary'}>
                      {appointment.autoConfirm ? 'Auto-Confirmed' : 'Pending'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Suggested Times:</h4>
                    <div className="space-y-1">
                      {appointment.suggestedTimes.map((time, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Clock className="h-3 w-3" />
                          {time.toLocaleString()}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm font-medium">AI Reasoning:</p>
                    <p className="text-sm text-muted-foreground">{appointment.reasoning}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
