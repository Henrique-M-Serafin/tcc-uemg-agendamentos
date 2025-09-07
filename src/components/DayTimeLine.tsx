import React from "react";

const DayTimeline: React.FC = () => {
  const slots = [
    "07:00", "07:50", "08:40", "09:30",
    "09:50", "10:40", "11:30", "12:20",
    "13:00", "13:50", "14:40", "15:30",
    "15:40", "16:30", "17:20", "18:10",
    "19:00", "19:50", "20:40", "21:30", "22:30",
  ];
  
  return (
    <div className="w-full max-w-xl mx-auto mb-2">
      {/* Cabeçalho */}
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>07:00</span>
        <span className="text-center flex-1">Timeline do dia</span>
        <span>22:30</span>
      </div>

      {/* Barrinha de blocos */}
      <div className="flex gap-1">
        {slots.map((_, idx) => (
          <div
            key={idx}
            className="flex-1 h-3 rounded bg-green-300"
          />
        ))}
      </div>
    </div>
  );
};

export default DayTimeline;
