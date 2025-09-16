import { slots } from "@/types";
import React from "react";

const DayTimeline: React.FC = () => {
 
  
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
