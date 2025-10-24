import { sendEmail } from "@/api/sendEmail";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

// const labs = [
//     { value: 'lab1', label: 'Laboratório 1' },
//     { value: 'lab2', label: 'Laboratório 2' },
//     { value: 'lab3', label: 'Laboratório 3' },
//     { value: 'lab4', label: 'Laboratório 4' },
//     { value: 'lab5', label: 'Laboratório 5' },
//     { value: 'lab6', label: 'Laboratório 6' },
// ];

// const vehicles = [
//     { value: 'vehicle1', label: 'Veículo 1' },
//     { value: 'vehicle2', label: 'Veículo 2' },
//     { value: 'vehicle3', label: 'Veículo 3' },
// ]

const shifts: Record<string, string[]> = {
  'morning': ["07:00", "07:50", "08:40", "09:30", "09:50", "10:40", "11:30", "12:20"],
  'afternoon': ["13:00", "13:50", "14:40", "15:30", "15:40", "16:30", "17:20", "18:10"],
  'evening': ["19:00", "19:50", "20:40", "21:30"],
};

export function AppointmentsPage() {
    const [selectedType, setSelectedType] = useState<'lab' | 'vehicle'>('lab');
    const [selectedShift, setSelectedShift] = useState<'morning' | 'afternoon' | 'evening'>('morning');
    const [formData, setFormData] = useState({
        name: '',
        from: '',
        date: '',
        start_hour: '',
        end_hour: '',
        description: '',
    });

    async function handleSendEmail(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  try {
    // Exemplo: envia a requisição e aguarda resposta
    const response = await sendEmail({
        name: formData.name,
        from: formData.from,
        description: formData.description || "Sem descrição.",
        date: formData.date,
        start_hour: formData.start_hour,
        end_hour: formData.end_hour,
        });

        if (response.success) {
        alert("Solicitação enviada com sucesso!");
        } else {
        alert("Erro ao enviar solicitação: " + (response.error || "Desconhecido"));
        }
    
    } catch (err) {
        console.error("Erro ao enviar:", err);
        alert("Falha ao enviar o e-mail.");
    }
    }


    return (
        <main className="p-4 flex  justify-center h-full">
            <Card className="max-w-5xl w-full bg-background border-secondary shadow-lg">
                <CardHeader>
                    <CardTitle><h1 className="text-center text-primary font-semibold text-2xl">Solicitar Agendamento</h1></CardTitle>
                    <CardDescription className="text-center">Preencha o formulário abaixo para solicitar um agendamento.</CardDescription>
                </CardHeader>
                <CardContent className="h-full">
                    <form onSubmit={handleSendEmail} className="flex flex-col h-full gap-2">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Nome<span className="text-destructive">*</span></Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                autoComplete="off" id="name" placeholder="Digite seu nome" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">E-mail<span className="text-destructive">*</span></Label>
                            <Input
                                value={formData.from}
                                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                                autoComplete="off" id="email" placeholder="Digite seu e-mail" />
                        </div>
                        <div className="flex flex-col lg:flex-row lg:justify-between w-full gap-2">
                            <div className="flex flex-col gap-2 w-full">
                                <Label htmlFor="lab">Laboratório ou Veículo<span className="text-destructive">*</span></Label>
                                <Select 
                                    value={selectedType}
                                    onValueChange={(value) => setSelectedType(value as 'lab' | 'vehicle')}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione um laboratório" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="lab">Laboratório</SelectItem>
                                        <SelectItem value="vehicle">Veículo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row justify-between gap-2 mb-2">
                            <div className="flex flex-col w-full gap-2">
                                <Label htmlFor="date">Data<span className="text-destructive">*</span></Label>
                                <Input
                                    type="date"
                                    id="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            {selectedType === 'lab' &&
                            <div className="flex lg:flex-row flex-col items-center w-full gap-2">
                            <div className="flex flex-col w-full gap-2">
                               <Label htmlFor="turn">Turno<span className="text-destructive">*</span></Label>
                               <Select
                                   value={selectedShift}
                                   onValueChange={(value) => setSelectedShift(value as 'morning' | 'afternoon' | 'evening')}
                               >
                                   <SelectTrigger className="w-full">
                                       <SelectValue placeholder="Selecione o turno" />
                                   </SelectTrigger>
                                   <SelectContent>
                                       <SelectItem value="morning">Manhã</SelectItem>
                                       <SelectItem value="afternoon">Tarde</SelectItem>
                                       <SelectItem value="evening">Noite</SelectItem>
                                   </SelectContent>
                               </Select>
                            </div>
                            
                            <div className="flex items-center gap-2 w-full">
                                <div className="flex flex-col gap-2 w-full">
                                <Label htmlFor="time">Horário (Inicio)<span className=" text-destructive">*</span></Label>
                                <Select
                                    value={formData.start_hour}
                                    onValueChange={(value) => setFormData({ ...formData, start_hour: value })}
                                    defaultValue={shifts[selectedShift][0]}
                                    key={selectedShift} // força re-render quando o turno muda
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione a hora" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {shifts[selectedShift].map((time) => (
                                            <SelectItem key={time} value={time}>{time}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                <Label htmlFor="time">Horário (Fim)<span className="text-destructive">*</span></Label>
                                <Select
                                    value={formData.end_hour}
                                    onValueChange={(value) => setFormData({ ...formData, end_hour: value })}
                                    defaultValue={shifts[selectedShift][0]}
                                    key={selectedShift} // força re-render quando o turno muda
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione a hora" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {shifts[selectedShift].map((time) => (
                                            <SelectItem key={time} value={time}>{time}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                </div>
                            </div>
                            </div>
                            }
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                            <Label htmlFor="description">Descrição (Opcional)</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="flex-1 resize-none" id="description" placeholder="Digite suas observações aqui..." 
                                />
                        </div>
                        <Button 
                            type="submit" className="w-full mt-auto"
                        >
                            Solicitar Agendamento
                        </Button>
                        
                    </form>
                </CardContent>
            </Card>
            
        </main>
    )
}