import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { useResources, useVehicles } from "@/hooks/use-supabase-client";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { EditResourceDialog } from "./EditResourceDialog";
import { ScrollArea } from "./ui/scroll-area";

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
  const { resources, loading: loadingResources } = useResources();
  const { vehicles, loading: loadingVehicles } = useVehicles();
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


  const handleDelete = () => {
    // Lógica para deletar o recurso selecionado
    setDeleteDialogOpen(false);
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
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-background hover:bg-destructive/90"
            >
              Confirmar Exclusão
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
                        onClick={() => setDeleteDialogOpen(true)}
                        variant="outline"
                        className="ml-2"
                      >
                        Excluir
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
