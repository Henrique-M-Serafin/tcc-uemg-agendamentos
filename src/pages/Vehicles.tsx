import VehicleCard from "@/components/vehiclesCard";
import { useAppData } from "@/context/AppDataContext";
import { useVehicleAppointmentsContext } from "@/context/VehicleAppointmentsContext";


export function VehiclesPage() {
  const { vehicleAppointments, loading: loadingAppointments } = useVehicleAppointmentsContext();
  const { vehicles, loadingVehicles } = useAppData();
  
  const loading = loadingVehicles || loadingAppointments;
  
  const vehicleTypeMap: Record<string, string> = {
    Car: "Carro",
    Bus: "Ônibus",
    Van: "Van",
    };  

  if (loading) {
    return (
      <main className="p-4">
        <h2 className="text-lg font-bold mb-4">Veículos</h2>
        <p>Carregando veículos...</p>
      </main>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <main className="p-4">
        <h2 className="text-lg font-bold mb-4">Veículos</h2>
        <p className="text-muted-foreground">Nenhum veículo cadastrado.</p>
      </main>
    );
  }

  // Agrupar agendamentos por VehicleID
  const appointmentsByVehicle: Record<number, typeof vehicleAppointments> = {};
  vehicleAppointments.forEach((app) => {
    if (!appointmentsByVehicle[app.vehicle_id]) appointmentsByVehicle[app.vehicle_id] = [];
    appointmentsByVehicle[app.vehicle_id].push(app);
  });

  const activeVehicles = vehicles.filter((v) => v.is_active);

  // Agrupar veículos por tipo
  const vehiclesByType: Record<string, typeof vehicles> = {};
  activeVehicles.forEach((vehicle) => {
    const type = vehicle.type ?? "Outros";
    if (!vehiclesByType[type]) vehiclesByType[type] = [];
    vehiclesByType[type].push(vehicle);
  });

  return (
    <main className="p-4">
      <h2 className="text-lg font-bold mb-4">Veículos</h2>
      <hr className="mb-4" />

      {Object.keys(vehiclesByType).map((type) => (
        <section key={type} className="mb-8">
            <h3 className="text-md font-semibold mb-4">
            {vehicleTypeMap[type] ?? type}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehiclesByType[type].map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  name={vehicle.model ?? vehicle.name ?? "Desconhecido"}
                  type={vehicle.type} // <-- aqui deve ser Car, Bus ou Van
                  model={vehicle.model}
                  capacity={vehicle.capacity ?? 0}
                  appointments={appointmentsByVehicle[vehicle.id] ?? []}
                />
            ))}
            </div>
        </section>
    ))}
    </main>
  );
}
