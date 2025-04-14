
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Laptop, 
  Monitor, 
  Tablet,
  X
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface Device {
  id: string;
  type: "mobile" | "tablet" | "desktop" | "laptop";
  browser: string;
  os: string;
  lastActive: string;
  location: string;
  ipAddress: string;
  isCurrentDevice: boolean;
}

export default function DeviceSettings({ onChange }: { onChange?: () => void }) {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "dev_1",
      type: "laptop",
      browser: "Chrome 114",
      os: "Windows 11",
      lastActive: "Now",
      location: "Eugene, Oregon",
      ipAddress: "192.168.1.1",
      isCurrentDevice: true,
    },
    {
      id: "dev_2",
      type: "mobile",
      browser: "Safari 16",
      os: "iOS 17",
      lastActive: "2 days ago",
      location: "Portland, Oregon",
      ipAddress: "192.168.1.2",
      isCurrentDevice: false,
    },
    {
      id: "dev_3",
      type: "desktop",
      browser: "Firefox 112",
      os: "macOS 14",
      lastActive: "1 week ago",
      location: "Seattle, Washington",
      ipAddress: "192.168.1.3",
      isCurrentDevice: false,
    }
  ]);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />;
      case "tablet":
        return <Tablet className="h-4 w-4" />;
      case "desktop":
        return <Monitor className="h-4 w-4" />;
      case "laptop":
        return <Laptop className="h-4 w-4" />;
      default:
        return <Laptop className="h-4 w-4" />;
    }
  };

  const handleRevokeAccess = (deviceId: string) => {
    if (devices.find(device => device.id === deviceId)?.isCurrentDevice) {
      toast.error("You cannot revoke access for your current device");
      return;
    }
    
    setDevices(devices.filter(device => device.id !== deviceId));
    toast.success("Device access revoked successfully");
    
    if (onChange) onChange();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Management</CardTitle>
        <CardDescription>
          Manage devices that are currently logged in to your account. You can revoke access to any device except your current one.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getDeviceIcon(device.type)}
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {device.os}
                        {device.isCurrentDevice && (
                          <Badge variant="outline" className="ml-1">Current</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {device.browser}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div>{device.location}</div>
                    <div className="text-sm text-muted-foreground">{device.ipAddress}</div>
                  </div>
                </TableCell>
                <TableCell>{device.lastActive}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRevokeAccess(device.id)}
                    disabled={device.isCurrentDevice}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Revoke
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
