import { Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import DayTimeline from "./DayTimeLine";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription } from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import {slots} from "@/types";
import { ScrollArea } from "./ui/scroll-area";

type BadgeStatus = "Disponível" | "Reservado";

interface LabCardProps {
  title: string;
  description: string;
  capacity?: number;
  badge: BadgeStatus;
}

const LabCard: React.FC<LabCardProps> = ({ title, description, capacity, badge }) => {

  const [dialogOpen, setDialogOpen] = useState(false);


  return (
    <>
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogTitle className="text-lg font-semibold">Detalhes do {title}</DialogTitle>
        <DialogDescription>{capacity} alunos</DialogDescription>
        <ScrollArea className="max-h-[60vh] ">
          {slots.map((slot, index) => (

              <Card key={index} className="mb-2 mx-4 border-secondary bg-background-elevated shadow-md">
                <CardContent>
                  <CardTitle>{slot}</CardTitle>
                </CardContent>
              </Card>
            
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
    <Card className="bg-background-elevated shadow-lg"> 
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Badge className={`text-xs ${badge === "Disponível" ? "bg-accent" : "bg-destructive"} font-semibold px-2 py-1`}>{badge}</Badge>
      </CardHeader>
      <CardContent>
        <DayTimeline />
        <p className="mb-2">{description}</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Capacidade: {capacity} alunos</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button
            onClick={() => setDialogOpen(true)}
            variant="outline" className="w-full">
            <Calendar className="mr-2" />
            Ver Agenda Completa
        </Button>
      </CardFooter>
    </Card>
    </>
  );
};

export default LabCard;
