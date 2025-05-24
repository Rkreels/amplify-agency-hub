
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Download, QrCode, Star } from "lucide-react";

export default function MobileApp() {
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mobile App</h1>
          <p className="text-muted-foreground">
            Access your business on the go with our mobile application
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="h-5 w-5 mr-2" />
              Download the App
            </CardTitle>
            <CardDescription>
              Get the mobile app to manage your business from anywhere
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                iOS App Store
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Google Play
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">Or scan QR code</p>
              <div className="flex justify-center">
                <div className="bg-muted p-8 rounded-lg">
                  <QrCode className="h-24 w-24 text-muted-foreground" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
            <CardDescription>
              Everything you need to run your business on mobile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Star className="h-4 w-4 text-primary" />
                </div>
                <span>Manage contacts and leads</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Star className="h-4 w-4 text-primary" />
                </div>
                <span>Schedule appointments</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Star className="h-4 w-4 text-primary" />
                </div>
                <span>Send SMS campaigns</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Star className="h-4 w-4 text-primary" />
                </div>
                <span>View analytics & reports</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Star className="h-4 w-4 text-primary" />
                </div>
                <span>Real-time notifications</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>App Statistics</CardTitle>
          <CardDescription>
            Mobile app usage and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-sm text-muted-foreground">App Store Rating</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">25k+</div>
              <p className="text-sm text-muted-foreground">Downloads</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">89%</div>
              <p className="text-sm text-muted-foreground">User Retention</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">1.2k</div>
              <p className="text-sm text-muted-foreground">Daily Active Users</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
