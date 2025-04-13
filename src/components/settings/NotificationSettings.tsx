
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  CalendarClock, 
  Users, 
  CreditCard, 
  Shield 
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationSettingsProps {
  onChange: () => void;
}

export default function NotificationSettings({ onChange }: NotificationSettingsProps) {
  const notificationCategories = [
    {
      id: "account",
      title: "Account",
      icon: Shield,
      settings: [
        {
          id: "security_alerts",
          label: "Security Alerts",
          description: "Get notified about security events like login attempts",
          email: true,
          push: true,
          sms: true
        },
        {
          id: "account_updates",
          label: "Account Updates",
          description: "Updates about your account settings and billing",
          email: true,
          push: true,
          sms: false
        }
      ]
    },
    {
      id: "conversations",
      title: "Conversations",
      icon: MessageSquare,
      settings: [
        {
          id: "new_message",
          label: "New Messages",
          description: "When you receive a new message from a contact",
          email: true,
          push: true,
          sms: false
        },
        {
          id: "message_replies",
          label: "Message Replies",
          description: "When someone replies to your message",
          email: false,
          push: true,
          sms: false
        }
      ]
    },
    {
      id: "calendar",
      title: "Calendar",
      icon: CalendarClock,
      settings: [
        {
          id: "appointment_scheduled",
          label: "Appointment Scheduled",
          description: "When a new appointment is scheduled",
          email: true,
          push: true,
          sms: true
        },
        {
          id: "appointment_reminder",
          label: "Appointment Reminder",
          description: "Reminder before an upcoming appointment",
          email: true,
          push: true,
          sms: true
        },
        {
          id: "appointment_canceled",
          label: "Appointment Canceled",
          description: "When an appointment is canceled",
          email: true,
          push: true,
          sms: false
        }
      ]
    },
    {
      id: "contacts",
      title: "Contacts",
      icon: Users,
      settings: [
        {
          id: "new_lead",
          label: "New Lead",
          description: "When a new lead is added to your account",
          email: true,
          push: true,
          sms: false
        },
        {
          id: "lead_status_change",
          label: "Lead Status Change",
          description: "When a lead's status changes",
          email: false,
          push: true,
          sms: false
        }
      ]
    },
    {
      id: "payments",
      title: "Payments",
      icon: CreditCard,
      settings: [
        {
          id: "payment_received",
          label: "Payment Received",
          description: "When you receive a new payment",
          email: true,
          push: true,
          sms: true
        },
        {
          id: "payment_failed",
          label: "Payment Failed",
          description: "When a payment attempt fails",
          email: true,
          push: true,
          sms: false
        },
        {
          id: "refund_processed",
          label: "Refund Processed",
          description: "When a refund is processed",
          email: true,
          push: true,
          sms: false
        }
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Manage how you receive notifications</CardDescription>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <Label className="text-sm font-medium block mb-2">Email</Label>
              <Mail className="h-5 w-5 mx-auto text-muted-foreground" />
            </div>
            <div className="text-center">
              <Label className="text-sm font-medium block mb-2">Push</Label>
              <Bell className="h-5 w-5 mx-auto text-muted-foreground" />
            </div>
            <div className="text-center">
              <Label className="text-sm font-medium block mb-2">SMS</Label>
              <MessageSquare className="h-5 w-5 mx-auto text-muted-foreground" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {notificationCategories.map((category) => (
            <div key={category.id} className="space-y-4">
              <div className="flex items-center gap-2">
                <category.icon className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">{category.title}</h3>
              </div>
              <div className="rounded-md border divide-y">
                {category.settings.map((setting) => (
                  <div key={setting.id} className="flex items-center p-4">
                    <div className="flex-1">
                      <Label className="font-medium">{setting.label}</Label>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <div className="flex items-center gap-10">
                      <Switch defaultChecked={setting.email} onChange={onChange} />
                      <Switch defaultChecked={setting.push} onChange={onChange} />
                      <Switch defaultChecked={setting.sms} onChange={onChange} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-medium">Notification Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quiet Hours</Label>
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <span className="font-medium">Enable Quiet Hours</span>
                    <p className="text-sm text-muted-foreground">
                      Don't send notifications during specified hours
                    </p>
                  </div>
                  <Switch onChange={onChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Weekly Digest</Label>
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <span className="font-medium">Weekly Summary</span>
                    <p className="text-sm text-muted-foreground">
                      Receive a weekly summary of all activities
                    </p>
                  </div>
                  <Switch defaultChecked onChange={onChange} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={onChange}>Save Preferences</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
