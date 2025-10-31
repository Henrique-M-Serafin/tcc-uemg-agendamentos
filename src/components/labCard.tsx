import { Calendar, AlarmClock, CalendarFold, GraduationCap } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription } from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ScrollArea } from "./ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import type { AppointmentWithRelations } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/api/supabaseClient"; // ajuste o caminho conforme o seu projeto
import { toast } from "sonner";

type BadgeStatus = "Disponível" | "Reservado";

interface LabCardProps {
  title: string;
  description?: string;
  capacity?: number;
  badge: BadgeStatus;
  appointments?: AppointmentWithRelations[];
  onDeleteSuccess?: () => void; // callback opcional p/ recarregar lista após exclusão
}

const LabCard: React.FC<LabCardProps> = ({
  title,
  description,
  capacity,
  badge,
  appointments = [],
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const { profile } = useAuth();

 const [appointmentsList, setAppointmentsList] = useState(appointments);

const handleDelete = async () => {
  if (!selectedAppointmentId) return;

  try {
    const { error } = await supabase.functions.invoke("delete-appointment", {
      body: { id: selectedAppointmentId },
    });

    if (error) {
      toast.error("Erro ao deletar agendamento: " + error.message);
      return;
    }

    toast.success("Agendamento deletado com sucesso!");
    setDeleteDialogOpen(false);

    // Remove do estado local para re-renderizar automaticamente
    setAppointmentsList(prev =>
      prev.filter(app => app.id !== selectedAppointmentId)
    );
  } catch (err) {
    console.error("Erro inesperado:", err);
    toast.error("Erro inesperado ao deletar");
  }
};

  return (
    <>
      {/* Dialog principal de detalhes */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-1 border-primary">
          <DialogTitle className="text-lg font-semibold">
            Detalhes do {title}
          </DialogTitle>
          <DialogDescription>{capacity} alunos</DialogDescription>

          <ScrollArea className="max-h-[60vh]">
            {appointmentsList.length > 0 ? (
              appointmentsList.map((app) => {
                const [year, month, day] = app.date.split("-").map(Number);
                const formattedDate = new Date(year, month - 1, day).toLocaleDateString("pt-BR", {
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
                          <CalendarFold className="h-5 w-5" /> {formattedDate}
                        </span>
                      </div>

                      <div className="flex -mb-2 justify-between items-center text-md">
                        <span className="flex gap-1 items-center font-semibold">
                          <GraduationCap className="h-5 w-5" />
                          {app.sponsor}
                        </span>

                        {profile?.type === "admin" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-destructive hover:bg-destructive hover:text-background"
                            onClick={() => {
                              setSelectedAppointmentId(app.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            Excluir
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <p className="mx-4 my-2 text-sm text-muted-foreground">Nenhum agendamento</p>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* AlertDialog de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border border-primary">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir agendamento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Deseja realmente excluir este agendamento?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-background hover:bg-destructive/90"
            >
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Card principal */}
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
          <Button onClick={() => setDialogOpen(true)} variant="outline" className="w-full">
            <Calendar className="mr-2" />
            Ver Agenda Completa
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default LabCard;
