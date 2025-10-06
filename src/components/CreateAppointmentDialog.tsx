import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
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

interface Hour {
  id: number;
  time: string;
}

interface Resources {
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
}

export const CreateAppointmentDialog: React.FC<CreateAppointmentDialogProps> = ({
  dialogOpen,
  setDialogOpen,
  shifts,
}) => {
  const [hours, setHours] = useState<Hour[]>([]);
  const [resources, setResources] = useState<Resources[]>([]);
  const [selectedShift, setSelectedShift] = useState(shifts);
  const [formData, setFormData] = useState<FormData>({
    resource: "",
    start_hour: "",
    end_hour: "",
    date: "",
    sponsor: "",
  });

  useEffect(() => {
    const fetchHours = async () => {
      const { data, error } = await supabase.from("Hours").select("*");
      if (error) {
        console.error("Erro ao buscar horários:", error);
      } else {
        setHours(data);
      }
    };

    const fetchLabs = async () => {
        const { data, error } = await supabase.from("Resources").select("*");
        if (error) {
            console.error("Erro ao buscar laboratórios:", error);
        } else {
            setResources(data);
        }
    }
    fetchLabs();
    fetchHours();
  }, []);

  const filteredResources = resources.filter(resource => resource.type === "Lab");
  

  const filteredHours = hours.filter((hour) => {
    const [h] = hour.time.split(":").map(Number);
    if (selectedShift === "Morning") return h >= 7 && h < 13;
    if (selectedShift === "Afternoon") return h >= 13 && h < 19;
    if (selectedShift === "Night") return h >= 18;
    return true;
  });

  const handleSubmit = async () => {
    // Validação simples
    if (!formData.resource || !formData.start_hour || !formData.end_hour || !formData.date || !formData.sponsor) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    const { data, error } = await supabase.from("Appointments").insert([
        {
          resource: formData.resource,
          start_hour: formData.start_hour,
          end_hour: formData.end_hour,
          date: formData.date,
          sponsor: formData.sponsor,
        },
      ]);
      if (error) {
        console.error("Erro ao criar agendamento:", error);
      } else {
        alert("Agendamento criado com sucesso!");
        setDialogOpen(false);
      }
    };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-w-lg">
        <DialogTitle>Criar Agendamento</DialogTitle>

        <form className="grid gap-4 py-4">
          {/* Laboratório */}
          <div className="flex flex-col gap-2">
            <Label>Laboratório</Label>
            <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, resource: value })
                }
                value={formData.resource}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {filteredResources.length > 0 ? (
                    filteredResources.map((resource) => (
                      <SelectItem key={resource.id} value={resource.name}>
                        {resource.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="empty">
                      Nenhum laboratório disponível
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
          </div>

         

          {/* Horários */}
          <div className="grid grid-cols-3 gap-4">
             {/* Turno */}
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
              <Label>Horário de Início</Label>
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
                      <SelectItem key={hour.id} value={hour.time}>
                        {hour.time}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="empty">
                      Nenhum horário disponível
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Horário de Fim</Label>
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
                      <SelectItem key={hour.id} value={hour.time}>
                        {hour.time}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="empty">
                      Nenhum horário disponível
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
        </form>
        <DialogFooter>
            <Button onClick={handleSubmit}>Criar Agendamento</Button>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
        </DialogFooter>
      </DialogContent>
      
    </Dialog>
  );
};
