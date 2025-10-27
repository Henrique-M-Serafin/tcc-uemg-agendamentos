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
  onSuccess?: () => void;
}

export const CreateAppointmentDialog: React.FC<CreateAppointmentDialogProps> = ({
  dialogOpen,
  setDialogOpen,
  shifts,
}) => {
  const { refresh } = useAppointmentsContext(); // 🔹 pega o refresh do contexto
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
  const [isRecurring, setIsRecurring] = useState(false);

  // ...fetchHours e fetchLabs continuam iguais

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  try {
    // Converte a data inicial selecionada em objeto Date
    const startDate = new Date(formData.date);
    
    // Cria array de datas a serem agendadas
    const datesToCreate: string[] = [];

    if (isRecurring) {
      // Gera 8 semanas (2 meses) de agendamentos
      for (let i = 0; i < 8; i++) {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() + i * 7); // adiciona 7 dias a cada iteração
        datesToCreate.push(newDate.toISOString().slice(0, 10));
      }
    } else {
      // Apenas a data selecionada
      datesToCreate.push(formData.date);
    }

    // Envia cada agendamento ao backend
    for (const date of datesToCreate) {
      const response = await createAppointment({
        sponsor: formData.sponsor,
        resources_id: Number(formData.resource),
        start_hour_id: Number(formData.start_hour),
        end_hour_id: Number(formData.end_hour),
        date: date,
      });

      if (!response.success) {
        toast.error(`Erro ao criar agendamento em ${date}: ${response.error}`);
        return;
      }
    }

    toast.success("Agendamento(s) criado(s) com sucesso!");
    setDialogOpen(false);
    refresh(); // atualiza a home page

  } catch (err) {
    toast.error("Falha ao criar agendamento");
    console.error(err);
  }
}

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


  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-w-lg">
        <DialogTitle>Criar Agendamento</DialogTitle>
        <DialogDescription>Preencha os dados abaixo para criar um novo agendamento.</DialogDescription>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
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
                      <SelectItem key={resource.id} value={resource.id.toString()}>
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
                      <SelectItem key={hour.id} value={hour.id.toString()}>
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
                      <SelectItem key={hour.id} value={hour.id.toString()}>
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
            <div className="flex gap-2 mt-2"> 
              <Label htmlFor="recurrence">Recorrente?</Label>
              <Checkbox 
                checked={isRecurring}
                onCheckedChange={(checked) => {
                setIsRecurring(!!checked); 
                console.log("Recorrente agora:", !!checked);
              }} className="border-primary"></Checkbox>
            </div>
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
        </form>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                
      </DialogContent>
      
    </Dialog>
  );
};
