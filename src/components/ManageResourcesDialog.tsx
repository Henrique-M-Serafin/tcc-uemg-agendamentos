import { useState } from "react";
import { Dialog, DialogContent, DialogTitle,  DialogDescription } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { EditResourceDialog } from "./EditResourceDialog";
import { ScrollArea } from "./ui/scroll-area";
import { deleteResource } from "@/api/deleteResources";
import { toast } from "sonner";
import { deleteVehicle } from "@/api/deleteVehicle";
import { reactivateVehicle } from "@/api/reactivateVehicle";
import { reactivateResource } from "@/api/reactivateResource";
import { useAppData } from "@/context/AppDataContext";


interface ManageResourcesDialogProps {
  manageDialogOpen: boolean;
  setManageDialogOpen: (open: boolean) => void;
}

export const ManageResourcesDialog = ({
  manageDialogOpen,
  setManageDialogOpen,
}: ManageResourcesDialogProps) => {
  const [selectedResource, setSelectedResource] = useState<"Lab" | "Aud" | "Vehicle">("Lab");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { resources, vehicles, refreshResources, refreshVehicles, loadingResources, loadingVehicles } = useAppData();
  const [editResourceDialogOpen, setEditResourceDialogOpen] = useState(false);

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

  const reactivateItem = async () => {
    if (!selectedItem) return;
    try {
      if (selectedResource === "Vehicle") {
        // Aqui você chamaria deleteVehicle ou outra função que atualize is_active = true
        await reactivateVehicle(selectedItem.id);
        refreshVehicles();
        toast.success("Veículo reativado com sucesso!");
      } else {
        // Reativar recurso
        await reactivateResource(selectedItem.id);
        refreshResources();
        toast.success("Recurso reativado com sucesso!");
      }
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    } catch (error: any) {
      console.error("Erro ao reativar:", error);
      toast.error(error.message || "Erro ao reativar item");
    }
  };



  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      if (selectedResource === "Vehicle") {
        // 🚗 Deletar veículo
        const result = await deleteVehicle(selectedItem.id);
        refreshVehicles();
        toast.success(result.message || "Veículo excluído com sucesso!");
      } else {
        // 🧩 Deletar recurso (Lab/Aud)
        const result = await deleteResource(selectedItem.id);
        refreshResources();
        toast.success(result.message || "Recurso excluído com sucesso!");
      }

      setDeleteDialogOpen(false);
      setSelectedItem(null);
    } catch (error: any) {
      console.error("Erro ao excluir:", error);
      toast.error(error.message || "Erro ao excluir item");
    }
  };

  return (
    <>
    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border border-primary">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir {selectedResource === "Vehicle" ? "veículo" : "recurso"}</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Deseja realmente excluir este {selectedResource === "Vehicle" ? "veículo" : "recurso"}?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={selectedItem?.is_active ? handleDelete : reactivateItem}
                className={`${
                  selectedItem?.is_active ? "bg-destructive text-background hover:bg-destructive/90" : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                Confirmar
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    <Dialog open={manageDialogOpen} onOpenChange={setManageDialogOpen}>
      <DialogContent className="border-primary w-full flex flex-col max-w-lg max-h-[90vh] p-4">
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

        <Separator className="my-2" />
        <Button
          onClick={() => {
            setSelectedItem(null); // sem recurso selecionado
            setEditResourceDialogOpen(true);
          }}
        >
          Adicionar {selectedResource === "Vehicle" ? "veículo" : selectedResource === "Lab" ? "laboratório" : "auditório"}
        </Button>
        <Separator className="my-2" />

        {isLoading ? (
          <p>Carregando {selectedResource === "Vehicle" ? "veículos" : "recursos"}...</p>
        ) : itemsToShow.length === 0 ? (
          <p>
            Nenhum {selectedResource === "Vehicle" ? "veículo" : "recurso"} encontrado.
          </p>
        ) : (
          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-2 p-2">
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
                      <Button
                        onClick={() => {
                          setSelectedItem(item);
                          setEditResourceDialogOpen(true);
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedItem(item); // define o item antes de abrir o diálogo
                          setDeleteDialogOpen(true);
                        }}
                        variant="outline"
                        className="ml-2"
                      >
                        {item.is_active ? "Excluir" : "Reativar"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>

    <EditResourceDialog
      open={editResourceDialogOpen}
      setOpen={setEditResourceDialogOpen}
      type={selectedResource}
      selectedResource={selectedItem} // null para criação
      mode={selectedItem ? "edit" : "create"}
      onUpdated={() => {
        // opcional: refetch
      }}
    />

    </>
  );
};
