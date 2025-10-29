import React, { useState } from "react";
import { Button } from "./ui/button";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";

interface WeekDay {
  label: string;
  value: string;
}

interface WeekDaySelectorProps {
  weekDays: WeekDay[];
  onChange?: (selected: WeekDay | null) => void;
}

// Converte "mon", "tue", ... para número da semana JS (0 = domingo)
function dayToIndex(day: string): number {
  switch (day) {
    case "sun": return 0;
    case "mon": return 1;
    case "tue": return 2;
    case "wed": return 3;
    case "thu": return 4;
    case "fri": return 5;
    case "sat": return 6;
    default: return 0;
  }
}

// Retorna o índice do dia no array weekDays
function getDayIndex(dayValue: string, weekDays: WeekDay[]) {
  return weekDays.findIndex((d) => d.value === dayValue);
}

// Retorna o dia anterior ou seguinte no array weekDays (circular)
function getNextDay(current: string, weekDays: WeekDay[], direction: "left" | "right") {
  const index = getDayIndex(current, weekDays);
  if (index === -1) return current;

  if (direction === "left") {
    return weekDays[(index - 1 + weekDays.length) % weekDays.length].value;
  } else {
    return weekDays[(index + 1) % weekDays.length].value;
  }
}

export const WeekDaySelector: React.FC<WeekDaySelectorProps> = ({
  weekDays,
  onChange,
}) => {
  // Nenhum dia selecionado inicialmente
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const handleClick = (day: WeekDay) => {
    setSelectedDay(day.value);
    if (onChange) onChange(day);
  };

  const handleToday = () => {
    const todayIndex = new Date().getDay();
    const todayValue = weekDays.find((d) => dayToIndex(d.value) === todayIndex)?.value;
    setSelectedDay(todayValue || null);
    const today = weekDays.find((d) => d.value === todayValue);
    if (onChange && today) onChange(today);
  };

  const handleReset = () => {
    setSelectedDay(null);
    if (onChange) onChange(null); // avisa o pai que o filtro foi resetado
  };

  const handleLeftRight = (direction: "left" | "right") => {
    if (!selectedDay) return;
    const newDayValue = getNextDay(selectedDay, weekDays, direction);
    setSelectedDay(newDayValue);
    const newDay = weekDays.find((d) => d.value === newDayValue);
    if (onChange && newDay) onChange(newDay);
  };

  return (
    <div className="mb-8">
      <div className="p-4">
        <div className="flex flex-col lg:flex-row lg:justify-around justify-center items-center gap-2">
          <div className="flex gap-4 items-center">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="font-semibold">Selecionar Data</h2>
          </div>
          <div className="flex gap-2 items-center">
            
            <Button variant="outline" onClick={handleToday}>Hoje</Button>
            <Button variant="outline" onClick={() => handleLeftRight("left")}>
              <ChevronLeft />
            </Button>
            <Button variant="outline" onClick={() => handleLeftRight("right")}>
              <ChevronRight />
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <X />
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-6 justify-center gap-2 w-full mt-6">
        {weekDays.map((day) => {
          const isSelected = selectedDay === day.value;
          return (
            <Button
              key={day.value}
              variant={isSelected ? "default" : "outline"}
              className={`px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 text-sm sm:text-base ${
                isSelected
                  ? "bg-accent text-white"
                  : "hover:bg-accent hover:text-white transition-colors"
              }`}
              onClick={() => handleClick(day)}
            >
              {day.label}
            </Button>
          );
        })}
      </div>


    </div>
  );
};

