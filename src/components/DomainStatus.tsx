
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "./Icon";

type Status = "idle" | "verifying" | "verified" | "failed";

interface DomainStatusProps {
  status: Status;
  domain: string;
}

const statusConfig = {
  idle: {
    icon: "HelpCircle",
    color: "bg-slate-500",
    text: "Awaiting input",
    message: "Enter a domain to begin verification.",
  },
  verifying: {
    icon: "Loader",
    color: "bg-blue-500",
    text: "Verifying",
    message: "We are now checking your DNS records.",
  },
  verified: {
    icon: "CheckCircle2",
    color: "bg-green-500",
    text: "Verified",
    message: "Your domain is authenticated and ready to use.",
  },
  failed: {
    icon: "XCircle",
    color: "bg-red-500",
    text: "Failed",
    message: "Verification failed. Please check your DNS records and try again.",
  },
};

const DomainStatus = ({ status, domain }: DomainStatusProps) => {
  const { icon, color, text, message } = statusConfig[status];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Domain Status</span>
          <Badge variant="secondary" className={`${color} text-white`}>
            {text}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${color}`}>
            <Icon name={icon as any} className={`w-8 h-8 text-white ${status === 'verifying' ? 'animate-spin' : ''}`} />
          </div>
        </div>
        <p className="text-lg font-semibold">{domain || "yourdomain.com"}</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
};

export default DomainStatus;
