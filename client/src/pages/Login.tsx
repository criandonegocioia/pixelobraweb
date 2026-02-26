import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

// Estilo glass card equivalente ao resto do site
const glassCardStyle = {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
};

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Console log for now as requested (fazer "configuração dos botões e acesso" depois)
        console.log("Login attempt:", { username, password });
    };

    return (
        <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
            {/* Background com efeito */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background z-0" />

            {/* Header / Voltar */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4" style={glassCardStyle}>
                <div className="container flex items-center">
                    <Link href="/">
                        <Button variant="ghost" className="text-foreground hover:text-primary">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Voltar
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center relative z-10 w-full px-4 pt-24 pb-12">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    {/* Imagem no topo */}
                    <div className="w-full h-48 mb-6 rounded-2xl overflow-hidden shadow-xl border border-white/5 relative bg-black/20 p-4 flex items-center justify-center">
                        <img
                            src="/images/logoin.jpg"
                            alt="Login Image"
                            className="w-full h-full object-contain z-10"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-20 pointer-events-none" />
                    </div>

                    <div className="p-8 rounded-2xl shadow-2xl" style={glassCardStyle}>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold tracking-tight mb-2">Entrar</h1>
                            <p className="text-muted-foreground text-sm">
                                Acesse sua conta na Pixel Obra.
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="username">Usuário</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Seu nome de usuário ou e-mail"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="bg-white/5 border-white/10 focus:border-primary text-white"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Senha</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Sua senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-white/5 border-white/10 focus:border-primary text-white"
                                    required
                                />
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                                    Esqueceu a senha?
                                </a>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base py-5"
                            >
                                Entrar
                            </Button>
                        </form>
                    </div>
                </motion.div>

            </main>
        </div>
    );
}
