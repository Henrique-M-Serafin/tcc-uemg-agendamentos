import { Calendar, AlarmClock, CalendarFold, GraduationCap } from "lucide-react";
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
        <DialogContent className="border-1 border-primary">
          <DialogTitle className="text-lg font-semibold">
            Detalhes do {title}
          </DialogTitle>
          <DialogDescription>{capacity} alunos</DialogDescription>
          <ScrollArea className="max-h-[60vh]">
            {appointments.length > 0 ? (
              appointments.map((app) => {
                // Formatar data no padrão brasileiro
                const formattedDate = new Date(app.date).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });

                return (
                  <Card
                    key={app.id}
                    className="mb-2 mx-4 border-primary bg-background-elevated shadow-md"
                  >
                    <CardContent className="px-3 flex flex-col gap-3">
                      <div className="flex flex-wrap justify-between items-center">
                        <span className="flex items-center gap-1 text-md ">
                          <AlarmClock className="h-5 w-5" /> {app.start_time} - {app.end_time}
                        </span>
                        <span className="flex items-center gap-1 text-md font-medium text-primary">
                          <CalendarFold className="h-5 w-5"/> {formattedDate}
                        </span>
                        
                      </div>
                      <div className="flex items-center gap-1 text-md">
                        <GraduationCap className="h-5 w-5"/> <span className="font-semibold">{app.sponsor}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
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
