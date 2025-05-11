
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Clock, Send, Upload, Users, X } from "lucide-react";

export function SmsCampaignBuilder() {
  const [campaignName, setCampaignName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTab, setSelectedTab] = useState("message");
  const [selectedTag, setSelectedTag] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [sendNow, setSendNow] = useState(false);
  
  // Mock data
  const availableTags = [
    "New Leads", 
    "Recent Customers", 
    "Webinar Attendees", 
    "Cart Abandoners",
    "Birthday This Month",
    "VIP Clients"
  ];
  
  const handleSendTest = () => {
    if (!message) {
      toast.error("Please enter a message before sending a test");
      return;
    }
    
    toast.success("Test message sent to your phone number");
  };
  
  const handleScheduleCampaign = () => {
    if (!campaignName) {
      toast.error("Please enter a campaign name");
      return;
    }
    
    if (!message) {
      toast.error("Please enter a message");
      return;
    }
    
    if (!selectedTag) {
      toast.error("Please select a target audience");
      return;
    }
    
    if (!sendNow && (!scheduledDate || !scheduledTime)) {
      toast.error("Please select a date and time for scheduled delivery");
      return;
    }
    
    toast.success(
      sendNow 
        ? "Campaign has been sent!" 
        : `Campaign scheduled for ${scheduledDate} at ${scheduledTime}`
    );
  };
  
  const getRecipientsCount = () => {
    if (!selectedTag) return 0;
    
    // Mock counts for each tag
    const counts: Record<string, number> = {
      "New Leads": 84,
      "Recent Customers": 127,
      "Webinar Attendees": 56,
      "Cart Abandoners": 32,
      "Birthday This Month": 19,
      "VIP Clients": 43
    };
    
    return counts[selectedTag] || 0;
  };
  
  const personalizationTags = [
    {label: "First Name", code: "{first_name}"},
    {label: "Last Name", code: "{last_name}"},
    {label: "Full Name", code: "{full_name}"},
    {label: "Phone", code: "{phone}"},
    {label: "Email", code: "{email}"},
    {label: "Company", code: "{company}"},
  ];
  
  const insertPersonalization = (code: string) => {
    setMessage(prev => prev + code);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SMS Campaign Builder</CardTitle>
        <CardDescription>
          Create and send SMS messages to targeted groups of contacts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="message">Message</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="message" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input 
                id="campaign-name"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g. Spring Sale Announcement"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="message">Message Content</Label>
                <span className="text-xs text-muted-foreground">
                  {message.length} / 160 characters
                </span>
              </div>
              <Textarea 
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here. Use personalization tags for a more targeted approach."
                rows={6}
              />
              
              <div className="mt-2">
                <Label className="text-sm mb-1 block">Personalization Tags</Label>
                <div className="flex flex-wrap gap-1">
                  {personalizationTags.map((tag, i) => (
                    <Button 
                      key={i} 
                      variant="outline" 
                      size="sm" 
                      onClick={() => insertPersonalization(tag.code)}
                      className="text-xs h-7"
                    >
                      {tag.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setMessage("")}>
                  <X className="h-4 w-4 mr-2" />
                  Clear Message
                </Button>
                <Button variant="secondary" onClick={handleSendTest}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Test
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="audience" className="space-y-4">
            <div className="space-y-2">
              <Label>Select Target Audience</Label>
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tag or segment" />
                </SelectTrigger>
                <SelectContent>
                  {availableTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedTag && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>Recipients:</span>
                    </div>
                    <span className="font-medium">{getRecipientsCount()} contacts</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t pt-4">
              <Label className="mb-2 block">Import New Contacts</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Import CSV
                </Button>
                <Button variant="outline" className="justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Excel
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="send-now" 
                  checked={sendNow}
                  onCheckedChange={(checked) => setSendNow(!!checked)}
                />
                <Label htmlFor="send-now">Send immediately</Label>
              </div>
            </div>
            
            {!sendNow && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduled-date">Date</Label>
                  <Input 
                    id="scheduled-date"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduled-time">Time</Label>
                  <Input 
                    id="scheduled-time"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <div className="pt-4">
              <Button 
                onClick={handleScheduleCampaign} 
                className="w-full"
                disabled={!campaignName || !message || !selectedTag || (!sendNow && (!scheduledDate || !scheduledTime))}
              >
                {sendNow ? (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Campaign Now
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Schedule Campaign
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
