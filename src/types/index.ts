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

