
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Copy, Code, ExternalLink } from "lucide-react";

export function CalendarEmbedSection() {
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>("default");
  const [selectedTab, setSelectedTab] = useState<string>("iframe");
  
  const handleCopyCode = () => {
    let codeToCopy = "";
    
    if (selectedTab === "iframe") {
      codeToCopy = `<iframe src="https://example.com/embed/calendar/${selectedCalendarId}" width="100%" height="600" frameborder="0"></iframe>`;
    } else if (selectedTab === "script") {
      codeToCopy = `<script src="https://example.com/embed/calendar/${selectedCalendarId}.js"></script>
<div id="calendar-embed"></div>`;
    } else {
      codeToCopy = `https://example.com/calendar/${selectedCalendarId}`;
    }
    
    navigator.clipboard.writeText(codeToCopy);
    toast.success("Code copied to clipboard");
  };
  
  const handleViewLive = () => {
    window.open(`https://example.com/calendar/${selectedCalendarId}`, "_blank");
    toast.success("Opening calendar in new tab");
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Embed Your Calendar</CardTitle>
        <CardDescription>
          Share your calendar on your website or send a direct link to clients
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label htmlFor="calendar-select" className="block text-sm font-medium mb-1">
            Select Calendar
          </label>
          <div className="flex gap-3">
            <select 
              id="calendar-select" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedCalendarId}
              onChange={(e) => setSelectedCalendarId(e.target.value)}
            >
              <option value="default">Main Booking Calendar</option>
              <option value="team">Team Availability Calendar</option>
              <option value="consulting">Consulting Services Calendar</option>
            </select>
            <Button className="shrink-0" onClick={handleViewLive}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Live
            </Button>
          </div>
        </div>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="iframe">Embed Code</TabsTrigger>
            <TabsTrigger value="script">Script Tag</TabsTrigger>
            <TabsTrigger value="link">Direct Link</TabsTrigger>
          </TabsList>
          
          <TabsContent value="iframe" className="space-y-4">
            <div className="bg-muted p-4 rounded-md">
              <code className="text-sm whitespace-pre-wrap">
                {`<iframe src="https://example.com/embed/calendar/${selectedCalendarId}" width="100%" height="600" frameborder="0"></iframe>`}
              </code>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleCopyCode}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Code
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="script" className="space-y-4">
            <div className="bg-muted p-4 rounded-md">
              <code className="text-sm whitespace-pre-wrap">
                {`<script src="https://example.com/embed/calendar/${selectedCalendarId}.js"></script>\n<div id="calendar-embed"></div>`}
              </code>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleCopyCode}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Code
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="link" className="space-y-4">
            <div className="flex gap-3">
              <Input 
                value={`https://example.com/calendar/${selectedCalendarId}`} 
                readOnly
              />
              <Button className="shrink-0" onClick={handleCopyCode}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-sm font-medium mb-3">Customization Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Theme</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option>Light</option>
                <option>Dark</option>
                <option>Auto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Default View</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option>Month</option>
                <option>Week</option>
                <option>Day</option>
                <option>Agenda</option>
              </select>
            </div>
          </div>
          <Button variant="outline" className="mt-4 w-full" onClick={() => toast.success("Changes saved")}>
            <Code className="h-4 w-4 mr-2" />
            Generate Customized Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
