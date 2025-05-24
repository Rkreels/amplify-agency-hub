
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export function CalendarEmbedSection() {
  const embedCode = `<iframe src="https://app.amplify.com/calendar/embed/abc123" width="100%" height="600" frameborder="0"></iframe>`;

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    toast.success("Embed code copied to clipboard");
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Embed Calendar
        </CardTitle>
        <CardDescription>
          Embed your booking calendar on external websites
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="embedCode">Embed Code</Label>
          <div className="flex gap-2">
            <Input
              id="embedCode"
              value={embedCode}
              readOnly
              className="font-mono text-sm"
            />
            <Button variant="outline" onClick={handleCopyEmbed}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline">
            Customize Appearance
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
