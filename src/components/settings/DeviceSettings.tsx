
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Smartphone, 
  Laptop, 
  Tablet, 
  Desktop, 
  ShieldCheck, 
  AlertTriangle,
  MapPin,
  Clock,
  XCircle,
  SearchCode
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface DeviceSettingsProps {
  onChange: (changes: any) => void;
  lastSaved?: number;
}

export default function DeviceSettings({ onChange, lastSaved }: DeviceSettingsProps) {
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: "MacBook Pro",
      type: "desktop",
      browser: "Chrome",
      os: "macOS Monterey",
      lastActive: new Date(2025, 3, 13, 15, 30),
      location: "Eugene, OR",
      ip: "192.168.1.1",
      trusted: true
    },
    {
      id: 2,
      name: "iPhone 14 Pro",
      type: "mobile",
      browser: "Safari",
      os: "iOS 16.5",
      lastActive: new Date(2025, 3, 14, 8, 15),
      location: "Eugene, OR",
      ip: "192.168.1.2",
      trusted: true
    },
    {
      id: 3,
      name: "Dell XPS 15",
      type: "desktop",
      browser: "Firefox",
      os: "Windows 11",
      lastActive: new Date(2025, 3, 7, 10, 45),
      location: "Portland, OR",
      ip: "203.0.113.45",
      trusted: false
    },
    {
      id: 4,
      name: "iPad Pro",
      type: "tablet",
      browser: "Safari",
      os: "iPadOS 16.3",
      lastActive: new Date(2025, 3, 1, 14, 20),
      location: "Seattle, WA",
      ip: "198.51.100.87",
      trusted: true
    }
  ]);
  
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return <Smartphone className="h-5 w-5" />;
      case "tablet":
        return <Tablet className="h-5 w-5" />;
      case "desktop":
        return type === "desktop" ? <Desktop className="h-5 w-5" /> : <Laptop className="h-5 w-5" />;
      default:
        return <Laptop className="h-5 w-5" />;
    }
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today at " + format(date, "h:mm a");
    } else if (diffDays === 1) {
      return "Yesterday at " + format(date, "h:mm a");
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return format(date, "MMM d, yyyy");
    }
  };

  const handleTrustDevice = (id: number) => {
    const updatedDevices = devices.map(device => 
      device.id === id ? { ...device, trusted: true } : device
    );
    setDevices(updatedDevices);
    onChange({ devices: updatedDevices });
    toast.success("Device marked as trusted");
  };

  const handleRevokeAccess = () => {
    if (!selectedDevice) return;
    
    const updatedDevices = devices.filter(device => device.id !== selectedDevice.id);
    setDevices(updatedDevices);
    onChange({ devices: updatedDevices });
    setShowRevokeDialog(false);
    toast.success("Device access revoked successfully");
  };

  const handleRevokeAllOtherDevices = () => {
    const currentDevice = devices[0]; // Assume first device is current
    const updatedDevices = [currentDevice];
    setDevices(updatedDevices);
    onChange({ devices: updatedDevices });
    toast.success("Revoked access from all other devices");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Active Devices</CardTitle>
            <CardDescription>
              Manage devices that have access to your account
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleRevokeAllOtherDevices}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Revoke All Other Devices
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="bg-muted/50 p-2 rounded-full">
                          {getDeviceIcon(device.type)}
                        </div>
                        <div>
                          <div className="font-medium">{device.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {device.browser} on {device.os}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{device.location}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        IP: {device.ip}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{formatLastActive(device.lastActive)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {device.trusted ? (
                        <Badge className="flex items-center gap-1 bg-green-500 hover:bg-green-600">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Trusted
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex items-center gap-1 text-amber-500 border-amber-500">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Unverified
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {!device.trusted && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleTrustDevice(device.id)}
                          >
                            Trust
                          </Button>
                        )}
                        <Dialog open={showRevokeDialog && selectedDevice?.id === device.id} onOpenChange={(open) => {
                          setShowRevokeDialog(open);
                          if (!open) setSelectedDevice(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                setSelectedDevice(device);
                                setShowRevokeDialog(true);
                              }}
                            >
                              Revoke
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Revoke Device Access</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to revoke access for this device?
                              </DialogDescription>
                            </DialogHeader>
                            {selectedDevice && (
                              <div className="py-4">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="bg-muted/50 p-2 rounded-full">
                                    {selectedDevice && getDeviceIcon(selectedDevice.type)}
                                  </div>
                                  <div>
                                    <div className="font-medium">{selectedDevice?.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {selectedDevice?.browser} on {selectedDevice?.os}
                                    </div>
                                  </div>
                                </div>
                                <Alert variant="destructive">
                                  <AlertTriangle className="h-4 w-4" />
                                  <AlertTitle>Warning</AlertTitle>
                                  <AlertDescription>
                                    Revoking access will sign this device out immediately. You'll need to log in again to use this device.
                                  </AlertDescription>
                                </Alert>
                              </div>
                            )}
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button 
                                variant="destructive" 
                                onClick={handleRevokeAccess}
                              >
                                Revoke Access
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <SearchCode className="h-4 w-4" />
              <span>
                Suspicious activity? <Button variant="link" className="h-auto p-0">Review recent logins</Button>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Device Settings</CardTitle>
          <CardDescription>Configure device-specific preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Remember Login Sessions</h3>
                <p className="text-sm text-muted-foreground">
                  Stay logged in on trusted devices
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => {
                  toast.success("Session preference updated");
                  onChange({ rememberSessions: true });
                }}
              >
                Enabled
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Login Verification</h3>
                <p className="text-sm text-muted-foreground">
                  Verify new device logins with a security code
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => {
                  toast.success("Login verification preference updated");
                  onChange({ loginVerification: true });
                }}
              >
                Enabled
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Inactive Session Timeout</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically log out after period of inactivity
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => {
                  toast.success("Session timeout updated");
                  onChange({ sessionTimeout: 30 });
                }}
              >
                30 minutes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
