import { MessageCircle } from "lucide-react";

interface CommunicationHistoryProps {
  communication: any;
}

const CommunicationHistory = ({ communication }: CommunicationHistoryProps) => {
  return (
    <div className="rounded-xl border border-border/60 p-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-semibold text-foreground">
          Communication
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Last Contact:</span>
          <span className="font-medium">
            {new Date(communication.lastContact).toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Method:</span>
          <span className="font-medium">{communication.contactMethod}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Next Update:</span>
          <span className="font-medium">{communication.nextUpdate}</span>
        </div>
      </div>
    </div>
  );
};

export default CommunicationHistory;
