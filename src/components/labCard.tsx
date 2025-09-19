import { Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription } from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ScrollArea } from "./ui/scroll-area";
import type { AppointmentWithRelations } from "@/types";

type BadgeStatus = "Disponível" | "Reservado";

interface LabCardProps {
  title: string;
  description?: string;
  capacity?: number;
  badge: BadgeStatus;
  appointments?: AppointmentWithRelations[];
}

const LabCard: React.FC<LabCardProps> = ({
  title,
  description,
  capacity,
  badge,
  appointments = [],
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogTitle className="text-lg font-semibold">
            Detalhes do {title}
          </DialogTitle>
          <DialogDescription>{capacity} alunos</DialogDescription>
          <ScrollArea className="max-h-[60vh]">
            {appointments.length > 0 ? (
              appointments.map((app) => (
                <Card
                  key={app.id}
                  className="mb-2 mx-4 border-secondary bg-background-elevated shadow-md"
                >
                  <CardContent>
                    <CardTitle>
                      {app.date} | {app.start_time} - {app.end_time} → {app.sponsor}
                    </CardTitle>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="mx-4 my-2 text-sm text-muted-foreground">
                Nenhum agendamento
              </p>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Card className="bg-background-elevated shadow-lg">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Badge
            className={`text-xs ${
              badge === "Disponível" ? "bg-accent" : "bg-destructive"
            } font-semibold px-2 py-1`}
          >
            {badge}
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="mb-2">{description}</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Capacidade: {capacity} alunos</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => setDialogOpen(true)}
            variant="outline"
            className="w-full"
          >
            <Calendar className="mr-2" />
            Ver Agenda Completa
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default LabCard;
