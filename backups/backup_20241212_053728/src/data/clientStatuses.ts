import { Users, Star, ThumbsUp, MessageCircle, XCircle, Calendar, UserCheck, CheckCircle, XOctagon, DollarSign, Clock, RefreshCcw, Facebook, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ClientStatus {
  key: string;
  label: string;
  icon: LucideIcon;
}

export const staticClientStatuses: ClientStatus[] = [
  { key: "new", label: "status.new", icon: Users },
  { key: "potential", label: "status.potential", icon: Star },
  { key: "interested", label: "status.interested", icon: ThumbsUp },
  { key: "responded", label: "status.responded", icon: MessageCircle },
  { key: "noResponse", label: "status.noResponse", icon: XCircle },
  { key: "scheduled", label: "status.scheduled", icon: Calendar },
  { key: "postMeeting", label: "status.postMeeting", icon: UserCheck },
  { key: "whatsappContact", label: "status.whatsappContact", icon: MessageSquare },
  { key: "facebookContact", label: "status.facebookContact", icon: Facebook },
  { key: "booked", label: "status.booked", icon: CheckCircle },
  { key: "cancelled", label: "status.cancelled", icon: XOctagon },
  { key: "sold", label: "status.sold", icon: DollarSign },
  { key: "postponed", label: "status.postponed", icon: Clock },
  { key: "resale", label: "status.resale", icon: RefreshCcw },
];

export const useClientStatuses = () => {
  return [
    { key: "all", label: "status.all", icon: Users },
    ...staticClientStatuses
  ];
};