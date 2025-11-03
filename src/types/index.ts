export const slots = [
    "07:00", "07:50", "08:40", "09:30",
    "09:50", "10:40", "11:30", "12:20",
    "13:00", "13:50", "14:40", "15:30",
    "15:40", "16:30", "17:20", "18:10",
    "19:00", "19:50", "20:40", "21:30", "22:30",
  ];

export type Appointments = {
    id: number;
    date: string;
    sponsor: string;
    status: 'pending' | 'approved' | 'rejected';
    resource_id: number;
    start_hour_id?: number;
    end_hour_id?: number;
}

export type AppointmentWithRelations = {
  id: string; // virou UUID na sua tabela
  date: string; // formato ISO (YYYY-MM-DD)
  sponsor: string;
  created_at: string; // timestamp
  resource_id: number;
  resource_name: string;
  resource_type: string;
  start_hour_id: number | null;
  start_time: string | null; // "HH:MM:SS"
  end_hour_id: number | null;
  end_time: string | null;   // "HH:MM:SS"
};

export type VehicleAppointmentsWithRelations = {
  appointment_id: string; // virou UUID na sua tabela
  vehicle_id: number;
  type: string;
  model: string;
  capacity: number;
  status: string;
  sponsor: string;
  date: string; // formato ISO (YYYY-MM-DD)
};

export interface Resource {
  id: string;
  name: string;
  type: string;
  capacity?: number; 
  is_active: boolean;
};

export interface Hour {
  id: string;
  time: string;
}

export interface Vehicle {
  id: string;
  type: string;
  model: string;
  capacity: number;
  status: string;
}