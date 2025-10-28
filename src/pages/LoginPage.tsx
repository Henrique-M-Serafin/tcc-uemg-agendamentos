import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, DoorOpen, LockIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // <-- Importa o contexto

export function LoginPage() {
  const [loginType, setLoginType] = useState<"admin" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { signIn, signInVisitor } = useAuth(); // <-- pega funções de login
  const navigate = useNavigate();


  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg("");

    if (loginType === "admin") {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMsg(error);
        return;
      }

      navigate("/agendamentos");
    }
  };


  const handleVisitorLogin = async () => {
    const { error } = await signInVisitor();
    if (error) {
      setErrorMsg(error);
      return;
    }
    navigate("/agendamentos");
  };

  return (
    <main className="flex max-w-screen w-screen h-screen ">
      <div className="w-[40%] hidden lg:flex bg-cover border-r-1 border-primary bg-[url('/public/bg-login.png')]"></div>
      <div className="w-screen w-[60%] flex flex-col justify-center items-center gap-2">
        <div className="flex flex-col items-center mb-2 animate-bounce-slow">
          <img
            src="/favicon.png"
            alt="Logo UEMG"
            className="w-14 h-14 drop-shadow-lg hover:scale-110 rounded-md transition-transform duration-300"
          />
        </div>
        <h1 className="text-md lg:text-lg  font-semibold">Terminal Universitário de Calendário - UEMG</h1>
        <Card className="lg:w-sm max-w-screen w-xs bg-background shadow-lg border-primary">
          <CardHeader className="flex flex-col justify-center items-center gap-2">
            <CardTitle>Realize seu login</CardTitle>
            <form
              onSubmit={handleLogin}
              className={`${
                loginType === "admin" ? "flex" : "hidden"
              } w-full gap-3 flex-col`}
            >
              <div className="flex items-center gap-1 w-full">
                <UserIcon />
                <Input
                  required
                  className="w-full"
                  placeholder="Digite seu login"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-1 w-full">
                <LockIcon />
                <Input
                  required
                  className="w-full"
                  placeholder="Digite sua senha"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Entrar <DoorOpen />
              </Button>
            </form>
            {errorMsg && (
              <span className="text-red-500 text-sm">{errorMsg}</span>
            )}
          </CardHeader>
          <CardFooter className="flex w-full">
            {loginType === null && (
              <div className="flex flex-col lg:flex-row gap-2 w-full justify-between">
                <Button variant={"outline"} onClick={() => setLoginType("admin")}>
                  Login como Admin
                </Button>
                <Button variant={"default"} onClick={handleVisitorLogin}>
                  Login como Visitante
                </Button>
              </div>
            )}
            {loginType !== null && (
              <div className="w-full">
                <Button
                  className="w-full flex items-center gap-2 justify-center"
                  variant={"outline"}
                  onClick={() => setLoginType(null)}
                >
                  Voltar
                  <ArrowLeft />
                </Button>
              </div>
            )}
          </CardFooter>
          <span className={`lg:text-md text-xs text-center ${loginType === null ? "" : "hidden"}`}>
            Entre como admin ou visitante
          </span>
        </Card>
      </div>
    </main>
  );
}
