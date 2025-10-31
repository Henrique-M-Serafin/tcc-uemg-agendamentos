import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Bus, BusFront, Car, CarFront } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
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
import { deleteVehicleAppointment } from "@/api/deleteVehicleAppointment";
import { toast } from "sonner";
import type { VehicleAppointmentsWithRelations } from "@/types";

interface VehicleCardProps {
  name: string;
  type?: string;
  model?: string;
  capacity?: number;
  appointments?: VehicleAppointmentsWithRelations[];
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  name,
  type,
  model,
  capacity = 0,
  appointments = [],
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [appointmentsList, setAppointmentsList] = useState(appointments);
  const { profile } = useAuth();

  const badge = appointmentsList.length > 0 ? "Reservado" : "Disponível";

  const handleDelete = async () => {
    if (!selectedAppointmentId) return;

    try {
      await deleteVehicleAppointment(selectedAppointmentId);
      toast.success("Reserva excluída com sucesso!");

      // Fecha o diálogo e limpa seleção
      setDeleteDialogOpen(false);
      setSelectedAppointmentId(null);

      // Atualiza a lista local (sem precisar do pai)
      setAppointmentsList((prev) =>
        prev.filter((app) => app.appointment_id !== selectedAppointmentId)
      );
    } catch (error) {
      console.error("Erro ao deletar reserva:", error);
      toast.error("Erro ao deletar reserva.");
    }
  };

  return (
    <>
      {/* Diálogo de reservas */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md border border-primary">
          <DialogTitle className="text-lg font-semibold">{name} - Reservas</DialogTitle>
          <DialogDescription>
            Modelo: {model ?? "Desconhecido"} <br />
            Capacidade: {capacity} {capacity === 1 ? "pessoa" : "pessoas"}
          </DialogDescription>

          <ScrollArea className="max-h-[50vh] mt-2">
            {appointmentsList.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {appointmentsList.map((app) => {
                  const [year, month, day] = app.date.split("-").map(Number);
                  const formattedDate = new Date(year, month - 1, day).toLocaleDateString("pt-BR");

                  return (
                    <li
                      key={app.appointment_id}
                      className="p-2 border-primary border rounded-md bg-background-elevated flex justify-between items-center"
                    >
                      <span className="mr-2">{formattedDate}</span>
                      <span className="font-semibold">{app.sponsor}</span>
                      {profile?.type === "admin" && (
                        <Button
                          onClick={() => {
                            setSelectedAppointmentId(app.appointment_id);
                            setDeleteDialogOpen(true);
                          }}
                          variant="outline"
                          size="sm"
                          className="border-destructive hover:bg-destructive hover:text-background"
                        >
                          Excluir
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma reserva</p>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border border-primary">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir reserva?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Deseja realmente excluir esta reserva?
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
          <div className="flex gap-2 items-center">
            {type === "Car" ? (
              <CarFront className="h-5 w-5 text-primary" />
            ) : type === "Bus" ? (
              <BusFront className="h-5 w-5 text-primary" />
            ) : type === "Van" ? (
              <Bus className="h-5 w-5 text-primary" />
            ) : (
              <Car className="h-5 w-5 text-primary" />
            )}

            <CardTitle className="text-md font-semibold">{name}</CardTitle>
          </div>
          <Badge
            className={`text-xs ${
              badge === "Disponível" ? "bg-accent" : "bg-destructive"
            } font-semibold px-2 py-1`}
          >
            {badge}
          </Badge>
        </CardHeader>

        <CardContent>
          <p>Tipo: {type ?? "Desconhecido"}</p>
          <p>Modelo: {model ?? "Desconhecido"}</p>
          <p>
            Capacidade: {capacity} {capacity === 1 ? "pessoa" : "pessoas"}
          </p>
        </CardContent>

        <CardFooter>
          <Button onClick={() => setDialogOpen(true)} variant="outline" className="w-full">
            Ver Detalhes
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default VehicleCard;
