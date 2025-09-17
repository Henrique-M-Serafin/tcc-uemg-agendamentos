import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, DoorOpen, LockIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
    const [loginType, setLoginType] = useState<'admin' | null>(null);
    const navigate = useNavigate();

    const handleLogin = (event: React.FormEvent) => {
        event.preventDefault();
        // Implement login logic here
        navigate('/dashboard');
    }

    return (
        <main className="flex max-w-screen w-screen h-screen ">
            <div className="w-[40%] hidden lg:flex bg-primary"></div>
            <div className="w-screen lg:w-[60%] flex flex-col justify-center items-center gap-2">
                <h1 className="text-xl font-semibold">Agendamentos UEMG</h1>
                <Card className="bg-background shadow-lg border-secondary">
                    <CardHeader className="flex flex-col justify-center items-center gap-2">
                        <CardTitle>Realize seu login</CardTitle>
                        <form onSubmit={handleLogin} className={`${loginType === 'admin' ? 'flex' : 'hidden'} w-full gap-3 flex-col`}>
                            <div className="flex items-center gap-1 w-full">
                                 <UserIcon/>
                                <Input required className="w-full" placeholder="Digite seu login"></Input>
                            </div>
                            <div className="flex items-center gap-1 w-full">
                                <LockIcon/>
                                <Input required className="w-full" placeholder="Digite sua senha" type="password"></Input>
                            </div>
                            <Button 
                            type="submit"
                            className="w-full">Entrar <DoorOpen></DoorOpen></Button>
                        </form>
                    </CardHeader>   
                    <CardFooter className="flex w-full">
                        {loginType === null && 
                        <div className="flex gap-2 w-full justify-between">
                            <Button variant={"outline"} onClick={() => setLoginType('admin')}>Login como Admin</Button>
                            <Button variant={'default'} onClick={() => navigate('/dashboard')}>Login como Visitante</Button>
                        </div>
                        }
                        {loginType !== null &&
                        <div className="w-full">                          
                            <Button

                            className="w-full flex items-center gap-2 justify-center"
                            variant={"outline"}
                            onClick={() => setLoginType(null)}
                            >Voltar<ArrowLeft/></Button>
                        </div>
                            
                        }
                    </CardFooter>
                    <span className={`text-center ${loginType === null ? '' : 'hidden'}`}>Entre como admin ou visitante</span>
                </Card>
            </div>
        </main>
    )
}

