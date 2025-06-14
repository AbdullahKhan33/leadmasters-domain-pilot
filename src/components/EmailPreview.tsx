
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EmailPreviewProps {
  senderName: string;
  fromEmail: string;
  logoUrl?: string;
  accentColor: string;
  subject: string;
  body: string;
  footer: string;
}

const EmailPreview = ({
  senderName,
  fromEmail,
  logoUrl,
  accentColor,
  subject,
  body,
  footer,
}: EmailPreviewProps) => {
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Email Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          {/* Header */}
          <div className="flex items-center gap-4 pb-4 border-b">
            <Avatar>
              <AvatarImage src={logoUrl} alt={senderName} />
              <AvatarFallback style={{ backgroundColor: accentColor, color: 'white' }}>
                {getInitials(senderName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{senderName}</p>
              <p className="text-sm text-muted-foreground">{`<${fromEmail}>`}</p>
            </div>
          </div>
          {/* Subject */}
          <div className="py-4">
            <h2 className="text-xl font-bold">{subject}</h2>
          </div>
          {/* Body */}
          <div className="prose prose-sm max-w-none text-slate-700">
            <p>{body}</p>
          </div>
          {/* Footer */}
          <div className="pt-4 mt-4 border-t text-xs text-muted-foreground text-center">
            <p>{footer}</p>
            <p>
              Sent from {senderName} &bull; <a href="#" style={{color: accentColor}}>Unsubscribe</a>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailPreview;
