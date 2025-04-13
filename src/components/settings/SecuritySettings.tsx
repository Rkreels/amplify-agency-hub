
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  ShieldCheck, 
  Key, 
  Smartphone, 
  LogOut, 
  UserCheck, 
  EyeOff, 
  Clock, 
  Info,
  Lock,
  AlertTriangle 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SecuritySettingsProps {
  onChange: () => void;
}

export default function SecuritySettings({ onChange }: SecuritySettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage your account security and authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Account Protection</h3>
            </div>
            
            <div className="rounded-md border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-500 border-green-500">Enabled</Badge>
                  <Button variant="outline" size="sm" onClick={onChange}>Manage</Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Recovery Codes</Label>
                  <p className="text-sm text-muted-foreground">
                    Backup codes to access your account if you lose your device
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={onChange}>View Codes</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Trusted Devices</Label>
                  <p className="text-sm text-muted-foreground">
                    Manage devices that don't require 2FA verification
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={onChange}>Manage Devices</Button>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Password</h3>
            </div>
            
            <div className="rounded-md border p-4 space-y-4">
              <div className="space-y-1 mb-4">
                <p className="text-sm">Last changed: <span className="font-medium">30 days ago</span></p>
                <div className="flex items-center gap-2">
                  <Progress value={70} className="h-2 flex-1" />
                  <span className="text-sm font-medium">Strong</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" onChange={onChange} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-password">New Password</Label>
                    <span className="text-xs text-muted-foreground">Min. 8 characters</span>
                  </div>
                  <Input id="new-password" type="password" onChange={onChange} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" onChange={onChange} />
                </div>
              </div>
              
              <Button onClick={onChange}>Update Password</Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Login Sessions</h3>
            </div>
            
            <div className="rounded-md border divide-y">
              <div className="p-4 flex items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Current Session</span>
                    <Badge variant="outline" className="text-green-500 border-green-500">Active</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Chrome on Windows • Eugene, OR, USA • Started 2 hours ago
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-destructive" onClick={onChange}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </div>
              <div className="p-4 flex items-center">
                <div className="flex-1">
                  <div className="font-medium">Safari on MacOS</div>
                  <div className="text-sm text-muted-foreground">
                    Portland, OR, USA • Last active 2 days ago
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-destructive" onClick={onChange}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </div>
              <div className="p-4 flex items-center">
                <div className="flex-1">
                  <div className="font-medium">GoHighLevel Mobile App</div>
                  <div className="text-sm text-muted-foreground">
                    iPhone • Eugene, OR, USA • Last active yesterday
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-destructive" onClick={onChange}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" className="text-destructive" onClick={onChange}>
                Log Out Of All Devices
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Security Settings</h3>
            </div>
            
            <div className="rounded-md border divide-y">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <Label className="font-medium">Login Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone logs into your account
                  </p>
                </div>
                <Switch defaultChecked onChange={onChange} />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <Label className="font-medium">Login Approval</Label>
                  <p className="text-sm text-muted-foreground">
                    Approve new logins from unrecognized devices
                  </p>
                </div>
                <Switch defaultChecked onChange={onChange} />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <Label className="font-medium">API Access</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow external applications to access your account
                  </p>
                </div>
                <Switch onChange={onChange} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-destructive">
        <CardHeader className="text-destructive">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Actions in this section are irreversible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border border-destructive rounded-md">
              <h3 className="font-medium text-destructive mb-1">Delete Account</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This will permanently delete your account and all associated data.
              </p>
              <Button variant="destructive" onClick={onChange}>Delete Account</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
