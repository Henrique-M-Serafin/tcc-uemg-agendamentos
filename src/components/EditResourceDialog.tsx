import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateResource } from "@/api/updateResource";
import { updateVehicle } from "@/api/updateVehicle"; // ✅ nova função importada
import { toast } from "sonner";
import { createVehicle } from "@/api/createVehicle";
import { createResource } from "@/api/createResource";

interface EditResourceDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  type: "Lab" | "Aud" | "Vehicle";
  selectedResource?: any | null; // null => modo criar
  mode?: "create" | "edit"; // default "edit"
  onUpdated?: () => void;
}

export const EditResourceDialog = ({
  open,
  setOpen,
  type,
  selectedResource = null,
  mode = "edit",
  onUpdated,
}: EditResourceDialogProps) => {
  const isVehicle = type === "Vehicle";
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(selectedResource?.status || "Ok");

  const title =
    mode === "create"
      ? isVehicle
        ? "Adicionar veículo"
        : "Adicionar recurso"
      : isVehicle
      ? "Editar veículo"
      : "Editar recurso";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString().trim() || "";
    const capacity = Number(formData.get("capacity") || 0);

    try {
      if (isVehicle) {
        if (mode === "create") {
          await createVehicle({ model: name, capacity, status, type: selectedResource?.type || "Car" });
          toast.success("Veículo criado com sucesso!");
        } else {
          await updateVehicle(selectedResource.id, { model: name, capacity, status });
          toast.success("Veículo atualizado com sucesso!");
        }
      } else {
        if (mode === "create") {
          await createResource({ name, capacity, type }); 
          toast.success("Recurso criado com sucesso!");
        } else {
          await updateResource(selectedResource.id, { name, capacity, type: selectedResource.type });
          toast.success("Recurso atualizado com sucesso!");
        }
      }

      if (onUpdated) onUpdated();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border border-primary w-sm">
        <DialogTitle>{title}</DialogTitle>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-3">
          {/* Nome / Modelo */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">{isVehicle ? "Modelo do veículo" : "Nome do recurso"}</Label>
            <Input
              id="name"
              name="name"
              defaultValue={selectedResource ? (isVehicle ? selectedResource.model : selectedResource.name) : ""}
              placeholder={isVehicle ? "Ex: Fiat Uno" : "Ex: Laboratório 3"}
              required
              className="border-primary"
            />
          </div>

          {/* Tipo */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Tipo</Label>
            <Input
              id="type"
              value={selectedResource?.type || type}
              disabled
              className="bg-muted/30 cursor-not-allowed border-primary"
            />
          </div>

          {/* Capacidade */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="capacity">Capacidade</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              min={0}
              defaultValue={selectedResource?.capacity || ""}
              placeholder="Ex: 30"
              className="border-primary"
            />
          </div>

          {/* Status (apenas veículos) */}
          {isVehicle && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status" className="border-primary">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OK">OK</SelectItem>
                  <SelectItem value="Manutenção">Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Botões */}
          <div className="flex flex-col gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setOpen(false)} type="button" disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-primary text-background hover:bg-primary/90">
              {loading ? "Salvando..." : mode === "create" ? "Criar" : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
