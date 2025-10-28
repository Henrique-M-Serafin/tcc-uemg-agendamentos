// import { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { updateAdminEmail } from "@/api/updateAdminEmail"; // ou onde colocou a função
// interface UpdateAdminEmailDialogProps {
//   dialogOpen: boolean;
//   setDialogOpen: (open: boolean) => void;
// }
// export function UpdateAdminEmailDialog({ dialogOpen, setDialogOpen }: UpdateAdminEmailDialogProps) {
//   const [newEmail, setNewEmail] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function handleUpdate() {
//     try {
//       setLoading(true);
//       await updateAdminEmail(newEmail);
//       alert("E-mail do administrador atualizado com sucesso!");
//       setDialogOpen(false);
//       setNewEmail("");
//     } catch (err: any) {
//       alert("Erro: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Alterar e-mail do administrador</DialogTitle>
//         </DialogHeader>
//         <div className="flex flex-col gap-2 mt-4">
//           <Input
//             type="email"
//             placeholder="Novo e-mail do administrador"
//             value={newEmail}
//             onChange={(e) => setNewEmail(e.target.value)}
//           />
//           <Button onClick={handleUpdate} disabled={loading || !newEmail}>
//             {loading ? "Atualizando..." : "Salvar"}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
