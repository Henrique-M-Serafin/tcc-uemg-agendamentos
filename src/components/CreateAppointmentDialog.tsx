import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
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
import { useAppointmentsContext } from "@/context/AppointmentsContext";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";

interface Hour {
  id: number;
  time: string;
}

interface Resource {
  id: number;
  name: string;
  type: string;
  capacity?: number;
}

interface FormData {
  resource: string;
  start_hour: string;
  end_hour: string;
  date: string;
  sponsor: string;
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
}) => {
  const { refresh } = useAppointmentsContext();
  const [hours, setHours] = useState<Hour[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedShift, setSelectedShift] = useState(shifts);
  const [resourceType, setResourceType] = useState<"Lab" | "Aud">("Lab");
  const [isRecurring, setIsRecurring] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    resource: "",
    start_hour: "",
    end_hour: "",
    date: "",
    sponsor: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const startDate = new Date(formData.date);
      const datesToCreate: string[] = [];

      if (isRecurring) {
        // Gera 8 semanas (2 meses)
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
      setDialogOpen(false);
      refresh();
      setFormData({
        resource: "",
        start_hour: "",
        end_hour: "",
        date: "",
        sponsor: "",
      });


    } catch (err) {
      toast.error("Falha ao criar agendamento");
      console.error(err);
    }
  }

  useEffect(() => {
    const fetchHours = async () => {
      const { data, error } = await supabase.from("Hours").select("*");
      if (!error && data) setHours(data);
    };

    const fetchResources = async () => {
      const { data, error } = await supabase.from("Resources").select("*");
      if (!error && data) setResources(data);
    };

    fetchHours();
    fetchResources();
  }, []);

  const filteredResources = resources.filter(
    (r) => r.type === resourceType
  );

  const filteredHours = hours.filter((hour) => {
    const [h] = hour.time.split(":").map(Number);
    if (selectedShift === "Morning") return h >= 7 && h < 13;
    if (selectedShift === "Afternoon") return h >= 13 && h < 19;
    if (selectedShift === "Night") return h >= 18;
    return true;
  });

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-w-lg">
        <DialogTitle>Criar Agendamento</DialogTitle>
        <DialogDescription>
          Preencha os dados abaixo para criar um novo agendamento.
        </DialogDescription>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          
          {/* Tipo de Recurso */}
          <div className="flex flex-col gap-2">
            <Label>Tipo de Recurso</Label>
            <Select
              onValueChange={(value) =>
                setResourceType(value as "Lab" | "Aud")
              }
              value={resourceType}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lab">Laboratório</SelectItem>
                <SelectItem value="Aud">Auditório</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Recurso */}
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
                  placeholder={`Selecione um ${resourceType === "Lab" ? "laboratório" : "auditório"}`}
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
                    Nenhum {resourceType === "Lab" ? "laboratório" : "auditório"} disponível
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
                <SelectTrigger className="w-full">
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
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {filteredHours.length > 0 ? (
                    filteredHours.map((hour) => (
                      <SelectItem key={hour.id} value={hour.id.toString()}>
                        {hour.time}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="empty">
                      Nenhum horário
                    </SelectItem>
                  )}
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
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {filteredHours.length > 0 ? (
                    filteredHours.map((hour) => (
                      <SelectItem key={hour.id} value={hour.id.toString()}>
                        {hour.time}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="empty">
                      Nenhum horário
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Data */}
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
          {resourceType === "Lab" ? (
            <div className="flex gap-2 mt-2">
              <Label htmlFor="recurrence">Recorrente?</Label>
              <Checkbox
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(!!checked)}
                className="border-primary"
              />
            </div>
          ) : null}
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

          <Button type="submit">Criar Agendamento</Button>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancelar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
