import React, { useState } from "react";
import { Button } from "./ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface WeekDay {
  label: string;
  value: string;
}

interface WeekDaySelectorProps {
  weekDays: WeekDay[];
  onChange?: (selected: WeekDay) => void;
}

export const WeekDaySelector: React.FC<WeekDaySelectorProps> = ({
  weekDays,
  onChange,
}) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const handleClick = (day: WeekDay) => {
    setSelectedDay(day.value);
    if (onChange) onChange(day);
  };

  return (
    <>
    <div className="p-4">
      <div className="flex justify-around">
        <div className="flex gap-4 items-center">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="font-semibold">Selecionar Data</h2>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="outline">Hoje</Button>
          <Button variant="outline">
            <ChevronLeft />
          </Button>
          <Button variant="outline">
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
    <div className="flex justify-center gap-6 mt-6">
      {weekDays.map((day) => {
        const isSelected = selectedDay === day.value;
        return (
            
          <Button
            key={day.value}
            variant={isSelected ? "default" : "outline"} // muda estilo se selecionado
            className={`p-8 ${
              isSelected ? "bg-accent text-white" : "hover:bg-accent"
            }`}
            onClick={() => handleClick(day)}
          >
            {day.label}
          </Button>
        );
      })}
    </div>
    </>
  );
};
