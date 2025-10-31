import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { supabase } from "@/api/supabaseClient";
import { Button } from "./ui/button";
import { createAppointment } from "@/api/createAppointment";
import { createVehicleAppointment } from "@/api/createVehicleAppointment"
import { useAppointmentsContext } from "@/context/AppointmentsContext";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";
import type { Hour, Resource, Vehicle } from "@/types";
import { useVehicleAppointmentsContext } from "@/context/VehicleAppointmentsContext";

interface FormData {
  resource: string;
  start_hour: string;
  end_hour: string;
  date: string;
  sponsor: string;
}

interface VehicleForm {
  vehicle: string;
  sponsor: string;
  date: string;
}

interface CreateAppointmentDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  shifts: string; // "Morning" | "Afternoon" | "Night"
  onSuccess?: () => void;
}

export const CreateAppointmentDialog: React.FC<CreateAppointmentDialogProps> = ({
  dialogOpen,
  setDialogOpen,
  shifts,
  onSuccess,
}) => {
  const { refresh } = useAppointmentsContext();
  const { refreshVehicles } = useVehicleAppointmentsContext();
  const [hours, setHours] = useState<Hour[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedShift, setSelectedShift] = useState(shifts);
  const [resourceType, setResourceType] = useState<"Lab" | "Aud" | "Vehicle">("Lab");

  const [isRecurring, setIsRecurring] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    resource: "",
    start_hour: "",
    end_hour: "",
    date: "",
    sponsor: "",
  });

  const [vehicleFormData, setVehicleFormData] = useState<VehicleForm>({
    vehicle: "",
    sponsor: "",
    date: "",
  });

  // 🔹 Busca dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      const [{ data: hoursData }, { data: resourcesData }, { data: vehiclesData }] =
        await Promise.all([
          supabase.from("Hours").select("*"),
          supabase.from("Resources").select("*"),
          supabase.from("Vehicles").select("*"),
        ]);

      if (hoursData) setHours(hoursData);
      if (resourcesData) setResources(resourcesData);
      if (vehiclesData) setVehicles(vehiclesData);
    };

    fetchData();
  }, []);

  const filteredResources = resources.filter((r) => r.type === resourceType);
  const filteredHours = hours.filter((hour) => {
    const [h] = hour.time.split(":").map(Number);
    if (selectedShift === "Morning") return h >= 7 && h < 13;
    if (selectedShift === "Afternoon") return h >= 13 && h < 19;
    if (selectedShift === "Night") return h >= 18;
    return true;
  });

  // 🔹 Handle submit (Lab/Aud/Vehicle)
 async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log("Submitting:", { resourceType, formData, vehicleFormData });

    try {
      if (resourceType === "Vehicle") {
        // 🚗 Agendamento de veículo
        if (!vehicleFormData.vehicle || !vehicleFormData.date || !vehicleFormData.sponsor) {
          toast.error("Preencha todos os campos para o agendamento de veículo.");
          return;
        }

        const response = await createVehicleAppointment({
          vehicle_id: Number(vehicleFormData.vehicle),
          date: vehicleFormData.date,
          sponsor: vehicleFormData.sponsor,
        });

        if (!response.success) {
          toast.error(`Erro ao criar agendamento em ${vehicleFormData.date}: ${response.error}`);
          return;
        }

        toast.success("Agendamento de veículo criado com sucesso!");
        refreshVehicles();

      } else if (resourceType === "Lab" || resourceType === "Aud") {
        // 🧪 Agendamento de laboratório ou auditório
        if (
          !formData.resource ||
          !formData.start_hour ||
          !formData.end_hour ||
          !formData.date ||
          !formData.sponsor
        ) {
          toast.error("Preencha todos os campos para o agendamento.");
          return;
        }

        const startDate = new Date(formData.date);
        const datesToCreate: string[] = [];

        if (isRecurring) {
          for (let i = 0; i < 8; i++) {
            const newDate = new Date(startDate);
            newDate.setDate(startDate.getDate() + i * 7);
            datesToCreate.push(newDate.toISOString().slice(0, 10));
          }
        } else {
          datesToCreate.push(formData.date);
        }

        for (const date of datesToCreate) {
          const response = await createAppointment({
            sponsor: formData.sponsor,
            resources_id: Number(formData.resource),
            start_hour_id: Number(formData.start_hour),
            end_hour_id: Number(formData.end_hour),
            date,
          });

          if (!response.success) {
            toast.error(`Erro ao criar agendamento em ${date}: ${response.error}`);
            return;
          }
        }

        toast.success("Agendamento(s) criado(s) com sucesso!");
        refresh();

      } else {
        // ❌ Tipo de recurso inválido
        console.error("Tipo de recurso inválido:", resourceType);
        toast.error("Tipo de recurso inválido.");
        return;
      }

      setDialogOpen(false);
      onSuccess?.();
    } catch (err) {
      toast.error("Erro ao criar agendamento. " + (err as Error).message);
      console.error("Erro ao criar agendamento:", err);
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-w-lg">
        <DialogTitle>Painel de Criação de Agendamento</DialogTitle>
        <DialogDescription>Preencha os dados abaixo para criar um agendamento.</DialogDescription>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Tipo de Recurso */}
          <div className="flex flex-col gap-2">
            <Label>Tipo de Recurso</Label>
            <Select
              onValueChange={(value) => setResourceType(value as "Lab" | "Aud" | "Vehicle")}
              value={resourceType}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lab">Laboratório</SelectItem>
                <SelectItem value="Aud">Auditório</SelectItem>
                <SelectItem value="Vehicle">Veículo</SelectItem>
              </SelectContent>
            </Select>

          </div>

          {/* 🔸 Campos dinâmicos */}
          {resourceType === "Vehicle" ? (
            <>
              <div className="flex flex-col gap-2">
                <Label>Veículo</Label>
                <Select
                  onValueChange={(value) =>
                    setVehicleFormData({ ...vehicleFormData, vehicle: value })
                  }
                  value={vehicleFormData.vehicle}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((v) => (
                      <SelectItem key={v.id} value={v.id.toString()}>
                        {v.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="vehicle-date">Data</Label>
                <Input
                  type="date"
                  id="vehicle-date"
                  value={vehicleFormData.date}
                  onChange={(e) =>
                    setVehicleFormData({ ...vehicleFormData, date: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="vehicle-sponsor">Solicitante</Label>
                <Input
                  type="text"
                  id="vehicle-sponsor"
                  value={vehicleFormData.sponsor}
                  onChange={(e) =>
                    setVehicleFormData({ ...vehicleFormData, sponsor: e.target.value })
                  }
                  placeholder="Nome do solicitante"
                />
              </div>
            </>
          ) : (
            <>
              {/* Recurso (Lab/Aud) */}
              <div className="flex flex-col gap-2">
                <Label>{resourceType === "Lab" ? "Laboratório" : "Auditório"}</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, resource: value })
                  }
                  value={formData.resource}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={`Selecione um ${
                        resourceType === "Lab" ? "laboratório" : "auditório"
                      }`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredResources.length > 0 ? (
                      filteredResources.map((r) => (
                        <SelectItem key={r.id} value={r.id.toString()}>
                          {r.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="empty">
                        Nenhum disponível
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Turno e horários */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Turno</Label>
                  <Select
                    onValueChange={(value) => setSelectedShift(value)}
                    value={selectedShift}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o turno" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Morning">Manhã</SelectItem>
                      <SelectItem value="Afternoon">Tarde</SelectItem>
                      <SelectItem value="Night">Noite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Início</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData({ ...formData, start_hour: value })
                    }
                    value={formData.start_hour}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredHours.map((hour) => (
                        <SelectItem key={hour.id} value={hour.id.toString()}>
                          {hour.time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Fim</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData({ ...formData, end_hour: value })
                    }
                    value={formData.end_hour}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredHours.map((hour) => (
                        <SelectItem key={hour.id} value={hour.id.toString()}>
                          {hour.time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Data + Recorrência */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
                {resourceType === "Lab" && (
                  <div className="flex gap-2 mt-2 items-center">
                    <Label htmlFor="recurrence">Recorrente?</Label>
                    <Checkbox
                      checked={isRecurring}
                      onCheckedChange={(checked) =>
                        setIsRecurring(!!checked)
                      }
                      className="border-primary"
                    />
                  </div>
                )}
              </div>

              {/* Solicitante */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="sponsor">Solicitante</Label>
                <Input
                  type="text"
                  id="sponsor"
                  value={formData.sponsor}
                  onChange={(e) =>
                    setFormData({ ...formData, sponsor: e.target.value })
                  }
                  placeholder="Nome do solicitante"
                />
              </div>
            </>
          )}

          <div className="flex gap-2 justify-end">
            <Button type="submit">Criar Agendamento</Button>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
