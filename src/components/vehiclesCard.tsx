import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Bus, BusFront, Car, CarFront } from "lucide-react";
import type { AppointmentWithRelations } from "@/types";

interface VehicleCardProps {
  name: string;
  type?: string;
  model?: string;
  capacity?: number;
  appointments?: AppointmentWithRelations[];
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  name,
  type,
  model,
  capacity = 0,
  appointments = [],
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const badge = appointments.length > 0 ? "Reservado" : "Disponível";

  return (
    <>
      {/* Dialog com reservas */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md border border-primary">
          <DialogTitle className="text-lg font-semibold">{name} - Reservas</DialogTitle>
          <DialogDescription>
            <div className="flex justify-between mb-2">
                <p>Tipo: {type ?? "Desconhecido"}</p>
                <p>Modelo: {model ?? "Desconhecido"}</p>
            </div>
            <p>Capacidade: {capacity} {capacity === 1 ? "pessoa" : "pessoas"}</p>
          </DialogDescription>

          <ScrollArea className="max-h-[50vh] mt-2">
            {appointments.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {appointments.map((app) => {
                  const formattedDate = new Date(app.date).toLocaleDateString("pt-BR");
                  return (
                    <li
                      key={app.id}
                      className="p-2 border-primary border rounded-md bg-background-elevated flex justify-between items-center"
                    >
                      <span>{formattedDate}</span>
                      <span className="font-semibold">{app.sponsor}</span>
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

      {/* Card principal do veículo */}
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
          <p>Capacidade: {capacity} {capacity === 1 ? "pessoa" : "pessoas"}</p>
        </CardContent>

        <CardFooter>
          <Button
            onClick={() => setDialogOpen(true)}
            variant="outline"
            className="w-full"
          >
            Ver Detalhes
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default VehicleCard;
