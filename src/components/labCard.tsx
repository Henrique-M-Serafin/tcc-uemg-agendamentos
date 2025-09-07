import { Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

type BadgeStatus = "Disponível" | "Reservado";

interface LabCardProps {
  title: string;
  description: string;
  capacity?: number;
  badge: BadgeStatus;
}

const LabCard: React.FC<LabCardProps> = ({ title, description, capacity, badge }) => {



  return (
    <Card className="bg-background-elevated shadow-md border-none"> 
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Badge className={`text-xs ${badge === "Disponível" ? "bg-accent" : "bg-destructive"} font-semibold px-2 py-1`}>{badge}</Badge>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">7:30</p>
            <p className="text-xs text-muted-foreground">Timeline do Dia</p>
            <p className="text-xs text-muted-foreground">22:30</p>
        </div>
        <p className="mb-2">{description}</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Capacidade: {capacity} alunos</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
            <Calendar className="mr-2" />
            Ver Agenda Completa
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LabCard;
