
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { toast } from "sonner";

export function CalendarEmbedSection() {
  const handleConnectCalendar = () => {
    toast.success("Redirecting to calendar integration");
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium mb-4">Calendar Embed Links</h2>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium">Direct Link</h3>
                <p className="text-sm text-muted-foreground">
                  Share this link directly with your clients
                </p>
                <div className="flex">
                  <div className="flex-1 bg-muted px-3 py-2 rounded-l-md border border-r-0 text-sm text-muted-foreground overflow-hidden whitespace-nowrap text-ellipsis">
                    https://youragency.ghl.com/book
                  </div>
                  <Button 
                    variant="outline" 
                    className="rounded-l-none"
                    onClick={() => {
                      navigator.clipboard.writeText("https://youragency.ghl.com/book");
                      toast.success("Link copied to clipboard");
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Embed Code</h3>
                <p className="text-sm text-muted-foreground">
                  Embed the calendar on your website
                </p>
                <div className="flex">
                  <div className="flex-1 bg-muted px-3 py-2 rounded-l-md border border-r-0 text-sm text-muted-foreground overflow-hidden whitespace-nowrap text-ellipsis">
                    &lt;iframe src="https://youragency.ghl.com/embed"&gt;&lt;/iframe&gt;
                  </div>
                  <Button 
                    variant="outline" 
                    className="rounded-l-none"
                    onClick={() => {
                      navigator.clipboard.writeText('<iframe src="https://youragency.ghl.com/embed"></iframe>');
                      toast.success("Code copied to clipboard");
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Calendar Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with Google Calendar, Outlook, or iCal
                </p>
              </div>
              <Button variant="outline" onClick={handleConnectCalendar}>
                <Globe className="h-4 w-4 mr-2" />
                Connect Calendar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
