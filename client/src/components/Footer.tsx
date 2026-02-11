import { toast } from "sonner";
import { Link } from "wouter";
import { Logo } from "./Logo";
import { WhatsAppIcon, WHATSAPP_LINK } from "./FloatingWhatsApp";
import { INSTAGRAM_URL } from "../const";

export function Footer() {
    const handleClick = () => {
        toast("Funcionalidade em breve", {
            description: "Esta seção estará disponível em breve.",
        });
    };

    return (
        <footer className="py-16 border-t border-white/5 bg-background">
            <div className="container">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center mb-4 hover:opacity-90 transition-opacity w-fit">
                            <Logo className="h-10" />
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Fornecendo ferramentas e serviços de visualização arquitetônica nacionalmente.
                        </p>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Recursos</h4>
                        <ul className="space-y-2">
                            <li>
                                <button onClick={handleClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Soluções
                                </button>
                            </li>
                            <li>
                                <Link href="/portfolio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Portfólio
                                </Link>
                            </li>
                            <li>
                                <button onClick={handleClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Preços
                                </button>
                            </li>
                            <li>
                                <button onClick={handleClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    FAQ
                                </button>
                            </li>
                            <li>
                                <button onClick={handleClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Guias
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Empresa</h4>
                        <ul className="space-y-2">
                            <li>
                                <button onClick={handleClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Aviso Legal
                                </button>
                            </li>
                            <li>
                                <Link href="/politica-de-privacidade" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Política de Privacidade
                                </Link>
                            </li>
                            <li>
                                <Link href="/termos-de-servico" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Termos de Serviço
                                </Link>
                            </li>
                            <li>
                                <button onClick={handleClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Cookies
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Suporte</h4>
                        <ul className="space-y-2">
                            <li>
                                <button onClick={handleClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Ajuda
                                </button>
                            </li>
                            <li>
                                <button onClick={handleClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Serviços Empresariais
                                </button>
                            </li>
                            <li>
                                <a
                                    href={WHATSAPP_LINK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                                >
                                    <WhatsAppIcon className="w-4 h-4" />
                                    WhatsApp
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Pixel Obra. Todos os direitos reservados.
                    </p>
                    <div className="flex items-center gap-4">
                        <button onClick={handleClick} className="text-muted-foreground hover:text-foreground transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </button>
                        <a
                            href={INSTAGRAM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                        <a
                            href={WHATSAPP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <WhatsAppIcon className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
