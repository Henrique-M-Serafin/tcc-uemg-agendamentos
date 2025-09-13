import { Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import DayTimeline from "./DayTimeLine";

type BadgeStatus = "Disponível" | "Reservado";

interface LabCardProps {
  title: string;
  description: string;
  capacity?: number;
  badge: BadgeStatus;
}

const LabCard: React.FC<LabCardProps> = ({ title, description, capacity, badge }) => {



  return (
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
        <Button variant="outline" className="w-full">
            <Calendar className="mr-2" />
            Ver Agenda Completa
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LabCard;
