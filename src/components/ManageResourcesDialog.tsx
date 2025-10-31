import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { useResources, useVehicles } from "@/hooks/use-supabase-client";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

interface ManageResourcesDialogProps {
  manageDialogOpen: boolean;
  setManageDialogOpen: (open: boolean) => void;
}

export const ManageResourcesDialog = ({
  manageDialogOpen,
  setManageDialogOpen,
}: ManageResourcesDialogProps) => {
  const [selectedResource, setSelectedResource] = useState<"Lab" | "Aud" | "Vehicle">("Lab");

  const { resources, loading: loadingResources } = useResources();
  const { vehicles, loading: loadingVehicles } = useVehicles();

  // Filtra os resources apenas se for Lab ou Aud
  const filteredResources =
    selectedResource === "Vehicle"
      ? []
      : resources.filter((r) => r.type === selectedResource);

  // Decide qual lista mostrar
  const isLoading =
    selectedResource === "Vehicle" ? loadingVehicles : loadingResources;

  const itemsToShow =
    selectedResource === "Vehicle" ? vehicles : filteredResources;

  return (
    <Dialog open={manageDialogOpen} onOpenChange={setManageDialogOpen}>
      <DialogContent className="border-primary">
        <div className="flex flex-col gap-1">
          <DialogTitle>Painel de Gerenciamento de Recursos</DialogTitle>
          <DialogDescription>
            Selecione o tipo de recurso que deseja visualizar ou alterar.
          </DialogDescription>
        </div>

        <Select
          value={selectedResource}
          onValueChange={(value) =>
            setSelectedResource(value as "Lab" | "Aud" | "Vehicle")
          }
        >
          <SelectTrigger className="w-full border-primary">
            <SelectValue placeholder="Selecione um recurso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Lab">Laboratórios</SelectItem>
            <SelectItem value="Aud">Auditórios</SelectItem>
            <SelectItem value="Vehicle">Veículos</SelectItem>
          </SelectContent>
        </Select>

        <Separator />
        <Button>Adicionar {selectedResource === "Vehicle" ? "veículo" : selectedResource === "Lab" ? "laboratório" : selectedResource === "Aud" ? "auditório" : "recurso"}</Button>
        <Separator />

        {isLoading ? (
          <p>Carregando {selectedResource === "Vehicle" ? "veículos" : "recursos"}...</p>
        ) : itemsToShow.length === 0 ? (
          <p>
            Nenhum {selectedResource === "Vehicle" ? "veículo" : "recurso"} encontrado.
          </p>
        ) : (
          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
            {itemsToShow.map((item: any) => (
              <Card
                key={item.id}
                className="bg-background border-primary border py-2 px-0 flex rounded-lg shadow-sm hover:bg-muted transition-colors"
              >
                
                <CardContent className="flex justify-between items-center w-full">
                    <CardTitle className="font-semibold">
                        {item.name || item.model || "Sem nome"}
                    </CardTitle>
                    <div className="flex gap-1">
                        <Button>Editar</Button>
                        <Button variant="outline" className="ml-2">Excluir</Button>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
