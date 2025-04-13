
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarClock, Mail, MoreHorizontal, Phone } from "lucide-react";

interface ContactCardProps {
  contact: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    tags?: string[];
    lastActivity?: string;
    imageUrl?: string;
  };
}

export function ContactCard({ contact }: ContactCardProps) {
  return (
    <Card className="card-hover overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between">
          <Avatar className="h-12 w-12">
            <AvatarImage src={contact.imageUrl} alt={contact.name} />
            <AvatarFallback>
              {contact.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold">{contact.name}</h3>
          <div className="mt-2 space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="mr-2 h-4 w-4" />
              <span className="truncate">{contact.email}</span>
            </div>
            {contact.phone && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="mr-2 h-4 w-4" />
                <span>{contact.phone}</span>
              </div>
            )}
          </div>
          {contact.tags && contact.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1">
              {contact.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {contact.lastActivity && (
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              <CalendarClock className="mr-1 h-3 w-3" />
              <span>Last active: {contact.lastActivity}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 p-3 bg-muted/30 border-t">
        <Button size="sm" variant="ghost">
          <Mail className="mr-2 h-4 w-4" />
          Email
        </Button>
        <Button size="sm" variant="ghost">
          <Phone className="mr-2 h-4 w-4" />
          Call
        </Button>
      </CardFooter>
    </Card>
  );
}
