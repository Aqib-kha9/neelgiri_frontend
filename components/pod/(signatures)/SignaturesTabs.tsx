import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle, RefreshCw } from "lucide-react";

interface SignaturesTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  signaturesData: any[];
}

const SignaturesTabs = ({
  activeTab,
  onTabChange,
  signaturesData,
}: SignaturesTabsProps) => {
  const getStatusCount = (status: string) => {
    return signaturesData.filter(
      (sig) => status === "all" || sig.status === status
    ).length;
  };

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-5 rounded-xl bg-muted/50 p-1">
            <TabsTrigger
              value="all"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              All Signatures
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {signaturesData.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="verified"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Verified
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("verified")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <Clock className="h-4 w-4" />
              Pending
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("pending")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="review_required"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              Review
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("review_required")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="in_progress"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              In Progress
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("in_progress")}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SignaturesTabs;
