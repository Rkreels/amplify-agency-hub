
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Building, Globe, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function AgencyWelcome() {
  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <div className="h-24 bg-gradient-to-r from-brand-blue to-brand-purple" />
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center border-4 border-background shadow-sm -mt-12">
              <Building className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle>Welcome to Your Agency Hub</CardTitle>
              <CardDescription>Manage your clients, campaigns, and resources</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="h-fit">Pro Plan</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium">Clients</div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-muted-foreground mt-1">5 active campaigns</div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium">White Label</div>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">3</div>
            <div className="text-xs text-muted-foreground mt-1">Custom domains</div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium">Team</div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">8</div>
            <div className="text-xs text-muted-foreground mt-1">Team members</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">Resource Usage</div>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Contacts (8,540/10,000)</span>
              <span className="text-muted-foreground">85%</span>
            </div>
            <Progress value={85} className="h-2" />
            
            <div className="flex justify-between text-sm">
              <span>Email Credits (15,320/50,000)</span>
              <span className="text-muted-foreground">31%</span>
            </div>
            <Progress value={31} className="h-2" />
            
            <div className="flex justify-between text-sm">
              <span>SMS Credits (2,450/5,000)</span>
              <span className="text-muted-foreground">49%</span>
            </div>
            <Progress value={49} className="h-2" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <div className="flex gap-2 w-full">
          <Button className="flex-1">
            Add New Client
          </Button>
          <Button variant="outline" className="flex-1">
            Upgrade Plan
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
