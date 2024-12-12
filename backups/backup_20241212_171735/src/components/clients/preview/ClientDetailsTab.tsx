import { useTranslation } from "react-i18next";
import { Client } from "@/data/clientsData";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, Facebook, MapPin, Building, User, Calendar } from "lucide-react";

interface ClientDetailsTabProps {
  client: Client;
}

export function ClientDetailsTab({ client }: ClientDetailsTabProps) {
  const { t } = useTranslation();

  const details = [
    { icon: Phone, label: "phone", value: client.phone },
    { icon: Mail, label: "email", value: client.email },
    { icon: Facebook, label: "facebook", value: client.facebook },
    { icon: MapPin, label: "country", value: client.country },
    { icon: MapPin, label: "city", value: client.city },
    { icon: Building, label: "project", value: client.project },
    { icon: User, label: "salesPerson", value: client.salesPerson },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {details.map(({ icon: Icon, label, value }) => value && (
              <div key={label} className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t(`clients.${label}`)}</p>
                  <p className="font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}