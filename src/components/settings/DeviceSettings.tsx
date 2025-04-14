
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Laptop, 
  Tablet, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  LogOut,
  ShieldAlert
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface DeviceSettingsProps {
  onChange: () => void;
}

export default function DeviceSettings({ onChange }: DeviceSettingsProps) {
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: "iPhone 13 Pro",
      type: "mobile",
      lastActive: "Just now",
      status: "current",
      location: "Eugene, OR",
      ipAddress: "192.168.1.1",
      loginDate: "Apr 13, 2025, 10:30 AM",
      trusted: true
    },
    {
      id: 2,
      name: "MacBook Pro",
      type: "desktop",
      lastActive: "10 minutes ago",
      status: "active",
      location: "Eugene, OR",
      ipAddress: "192.168.1.45",
      loginDate: "Apr 13, 2025, 9:15 AM",
      trusted: true
    },
    {
      id: 3,
      name: "iPad Air",
      type: "tablet",
      lastActive: "3 days ago",
      status: "inactive",
      location: "Portland, OR",
      ipAddress: "192.168.2.12",
      loginDate: "Apr 10, 2025, 3:45 PM",
      trusted: false
    },
    {
      id: 4,
      name: "Dell XPS 15",
      type: "desktop",
      lastActive: "2 weeks ago",
      status: "expired",
      location: "Seattle, WA",
      ipAddress: "192.168.3.78",
      loginDate: "Mar 30, 2025, 11:20 AM",
      trusted: false
    }
  ]);
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sessionDuration, setSessionDuration] = useState("168");
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [deviceVerification, setDeviceVerification] = useState(true);
  
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="h-5 w-5" />;
      case 'tablet':
        return <Tablet className="h-5 w-5" />;
      case 'desktop':
      default:
        return <Laptop className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'current':
        return <Badge variant="default">Current Device</Badge>;
      case 'active':
        return <Badge variant="outline" className="text-green-500 border-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Inactive</Badge>;
      case 'expired':
        return <Badge variant="outline" className="text-muted-foreground">Expired</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const refreshDevices = () => {
    setIsRefreshing(true);
    // Simulating a refresh
    setTimeout(() => {
      // Update the "last active" times
      setDevices(devices.map(device => {
        if (device.status === "current") {
          return { ...device, lastActive: "Just now" };
        }
        return device;
      }));
      
      setIsRefreshing(false);
      toast.success("Device list refreshed");
      onChange();
    }, 1500);
  };
  
  const revokeDevice = (id: number) => {
    setDevices(devices.map(device => 
      device.id === id 
        ? { ...device, status: "expired", lastActive: "Session ended" } 
        : device
    ));
    toast.success("Device access revoked");
    onChange();
  };
  
  const revokeAllOtherDevices = () => {
    setDevices(devices.map(device => 
      device.status === "current" 
        ? device 
        : { ...device, status: "expired", lastActive: "Session ended" }
    ));
    toast.success("All other devices revoked");
    onChange();
  };
  
  const toggleTrustedDevice = (id: number) => {
    setDevices(devices.map(device => 
      device.id === id 
        ? { ...device, trusted: !device.trusted } 
        : device
    ));
    
    const device = devices.find(d => d.id === id);
    if (device) {
      toast.success(`${device.name} ${device.trusted ? 'removed from' : 'added to'} trusted devices`);
    }
    onChange();
  };
  
  const handleSessionDurationChange = (value: string) => {
    setSessionDuration(value);
    onChange();
    
    const durationMap: {[key: string]: string} = {
      "1": "1 hour",
      "8": "8 hours",
      "24": "1 day",
      "168": "7 days",
      "720": "30 days"
    };
    
    toast.success(`Session duration set to ${durationMap[value]}`);
  };
  
  const toggleBiometricAuth = () => {
    setBiometricEnabled(!biometricEnabled);
    toast.success(`Biometric authentication ${biometricEnabled ? 'disabled' : 'enabled'}`);
    onChange();
  };
  
  const toggleDeviceVerification = () => {
    setDeviceVerification(!deviceVerification);
    toast.success(`Device verification ${deviceVerification ? 'disabled' : 'enabled'}`);
    onChange();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Connected Devices</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshDevices} 
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </CardTitle>
          <CardDescription>Manage devices connected to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${device.status === 'current' || device.status === 'active' ? 'bg-primary/10' : 'bg-muted'}`}>
                        {getDeviceIcon(device.type)}
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {device.name}
                          {device.trusted && (
                            <Badge variant="outline" className="text-blue-500 border-blue-500">Trusted</Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Login: {device.loginDate}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(device.status)}</TableCell>
                  <TableCell>
                    <div>{device.location}</div>
                    <div className="text-xs text-muted-foreground">{device.ipAddress}</div>
                  </TableCell>
                  <TableCell>{device.lastActive}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {device.status === 'current' ? (
                        <Button variant="outline" size="sm" disabled>
                          Current
                        </Button>
                      ) : (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-destructive"
                              disabled={device.status === 'expired'}
                            >
                              <LogOut className="h-4 w-4 mr-2" />
                              Revoke
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Revoke Device Access</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will end the current session on {device.name}. The user will need to log in again to access the account.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => revokeDevice(device.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                Revoke Access
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTrustedDevice(device.id)}
                        disabled={device.status === 'expired'}
                      >
                        {device.trusted ? "Untrust" : "Trust"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-4 flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive">
                  Revoke All Other Devices
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Revoke All Other Devices</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will sign out all devices except your current one. Everyone will need to log in again.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={revokeAllOtherDevices}
                    className="bg-destructive text-destructive-foreground"
                  >
                    <ShieldAlert className="h-4 w-4 mr-2" />
                    Revoke All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Device Security</CardTitle>
          <CardDescription>Manage security settings for your devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <h3 className="font-medium">Trusted Devices</h3>
                <p className="text-sm text-muted-foreground">
                  Skip two-factor authentication on devices you trust
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => {
                  toast.success("Managed trusted devices");
                  onChange();
                }}
              >
                Manage
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <h3 className="font-medium">Device Verification</h3>
                <p className="text-sm text-muted-foreground">
                  Require verification for new devices logging into your account
                </p>
              </div>
              <Switch 
                checked={deviceVerification}
                onCheckedChange={toggleDeviceVerification}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <h3 className="font-medium">Session Duration</h3>
                <p className="text-sm text-muted-foreground">
                  Set how long devices stay logged in before requiring re-authentication
                </p>
              </div>
              <select 
                className="h-9 rounded-md border border-input px-3 py-1"
                value={sessionDuration}
                onChange={(e) => handleSessionDurationChange(e.target.value)}
              >
                <option value="1">1 hour</option>
                <option value="8">8 hours</option>
                <option value="24">1 day</option>
                <option value="168">7 days</option>
                <option value="720">30 days</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Mobile App Settings</CardTitle>
          <CardDescription>Configure settings for the mobile application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <h3 className="font-medium">Mobile App Status</h3>
                <p className="text-sm text-muted-foreground">
                  GoHighLevel mobile app is installed and authenticated
                </p>
              </div>
              <Badge variant="outline" className="text-green-500 border-green-500">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Connected
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <h3 className="font-medium">Biometric Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Use Face ID, Touch ID or fingerprint to unlock the mobile app
                </p>
              </div>
              <Switch 
                checked={biometricEnabled}
                onCheckedChange={toggleBiometricAuth}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <h3 className="font-medium">Download Mobile App</h3>
                <p className="text-sm text-muted-foreground">
                  Get the GoHighLevel mobile app for iOS and Android
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    window.open('https://apps.apple.com', '_blank');
                    onChange();
                  }}
                >
                  iOS
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    window.open('https://play.google.com', '_blank');
                    onChange();
                  }}
                >
                  Android
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
