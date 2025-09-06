import { WeekDaySelector } from "@/components/weekDays";

const weekDays = [
  { label: "Segunda-Feira", value: "mon" },
  { label: "Terça-Feira", value: "tue" },
  { label: "Quarta-Feira", value: "wed" },
  { label: "Quinta-Feira", value: "thu" },
  { label: "Sexta-Feira", value: "fri" },
  { label: "Sábado", value: "sat" },
];

export function HomePage() {
  return (
    <>  
      <WeekDaySelector
        weekDays={weekDays}
        onChange={(day) => console.log("Selecionado:", day)}
        />
    </>
  );
}
