import LabCard from "@/components/labCard";
import { WeekDaySelector } from "@/components/weekDays";

const weekDays = [
  { label: "Segunda-Feira", value: "mon" },
  { label: "Terça-Feira", value: "tue" },
  { label: "Quarta-Feira", value: "wed" },
  { label: "Quinta-Feira", value: "thu" },
  { label: "Sexta-Feira", value: "fri" },
  { label: "Sábado", value: "sat" },
];

const labs = [
    {
        title: "Laboratório 1",
        description: "Descrição do laboratório 1",
        capacity: 20,
        badge: "Disponível",

    },
    {
        title: "Laboratório 2",
        description: "Descrição do laboratório 2",
        capacity: 25,
        badge: "Reservado",
    },
    {
        title: "Laboratório 3",
        description: "Descrição do laboratório 3",
        capacity: 30,
        badge: "Reservado",
    },
    {
        title: "Laboratório 4",
        description: "Descrição do laboratório 4",
        capacity: 35,
        badge: "Disponível",
    },
    {
        title: "Laboratório 5",
        description: "Descrição do laboratório 5",
        capacity: 35,
        badge: "Reservado",
    
    },
    {
        title: "Laboratório 6",
        description: "Descrição do laboratório 6",
        capacity: 40,
        badge: "Disponível",
    },
] as const;

export function HomePage() {
    

  return (
    <main className="">
        <WeekDaySelector
            weekDays={weekDays}
            onChange={(day) => console.log("Selecionado:", day)}
        />
        <div className="grid grid-cols-3 gap-4">
            {labs.map((lab, index) => (
                <div className="" key={index}>
                    <LabCard title={lab.title} description={lab.description} capacity={lab.capacity} badge={lab.badge} />
                </div>
            ))}
        </div>
        
    </main>
  );
}
