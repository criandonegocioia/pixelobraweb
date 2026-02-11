import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
                <div className="container flex h-16 items-center">
                    <Link href="/">
                        <div className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
                            <Logo className="h-8" />
                        </div>
                    </Link>
                    <div className="ml-auto">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Voltar
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 container py-12 md:py-20 max-w-4xl">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                            Política de Privacidade - Pixel Obra
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Última atualização: 11/02/2026
                        </p>
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none">
                        <p>
                            A Pixel Obra valoriza a sua privacidade. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nosso site, contrata nossos serviços de produção visual ou interage conosco em nossas plataformas digitais.
                        </p>
                        <p>
                            Ao utilizar nossos serviços, você concorda com a coleta e uso de informações de acordo com esta política.
                        </p>

                        <h3>1. Informações que Coletamos</h3>
                        <p>
                            Para fornecer serviços de excelência em fotografia, vídeo e renderização, podemos coletar os seguintes dados:
                        </p>
                        <ul>
                            <li><strong>Dados de Contato:</strong> Nome, e-mail, número de telefone e nome da empresa (para fins de orçamento e comunicação).</li>
                            <li><strong>Dados de Projeto:</strong> Endereços de obras, plantas arquitetônicas, especificações técnicas e cronogramas fornecidos para a execução do serviço.</li>
                            <li><strong>Dados de Navegação (Cookies):</strong> Endereço IP, tipo de navegador, páginas visitadas em nosso site e tempo de permanência, coletados para melhorar sua experiência.</li>
                            <li><strong>Imagens e Vídeos:</strong> No exercício de nossa atividade, captamos imagens de propriedades e canteiros de obras. Tomamos medidas para garantir que a privacidade de terceiros seja respeitada durante essas captações.</li>
                        </ul>


                        <h3>2. Como Utilizamos Seus Dados</h3>
                        <p>
                            A Pixel Obra utiliza os dados coletados para:
                        </p>
                        <ul>
                            <li><strong>Prestação de Serviços:</strong> Cumprir obrigações contratuais, realizar captações no local e entregar materiais finais.</li>
                            <li><strong>Atendimento ao Cliente:</strong> Responder a solicitações de orçamento, dúvidas ou suporte técnico.</li>
                            <li><strong>Marketing e Portfólio:</strong> Com sua autorização, podemos utilizar imagens dos projetos realizados para divulgação em nosso site, redes sociais e materiais de apresentação.</li>
                            <li><strong>Segurança:</strong> Garantir a integridade de nossas plataformas e cumprir obrigações legais.</li>
                        </ul>

                        <h3>3. Compartilhamento de Dados</h3>
                        <p>
                            A Pixel Obra não vende seus dados pessoais a terceiros. Podemos compartilhar informações apenas nas seguintes situações:
                        </p>
                        <ul>
                            <li><strong>Com Parceiros e Colaboradores:</strong> Membros da equipe e parceiros estratégicos que precisam das informações para executar etapas específicas do projeto (ex: editores, técnicos de campo).</li>
                            <li><strong>Provedores de Serviços:</strong> Empresas de hospedagem de site, armazenamento em nuvem e ferramentas de gestão financeira.</li>
                            <li><strong>Cumprimento Legal:</strong> Quando exigido por autoridades judiciais ou administrativas para cumprir a lei ou proteger direitos da empresa.</li>
                        </ul>

                        <h3>4. Proteção de Dados e Armazenamento</h3>
                        <p>
                            Implementamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda ou alteração. Os arquivos visuais e dados de clientes são armazenados em servidores seguros com acesso restrito.
                        </p>
                        <p>
                            Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades descritas nesta política ou conforme exigido por obrigações fiscais e legais.
                        </p>

                        <h3>5. Seus Direitos (LGPD)</h3>
                        <p>
                            De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem o direito de:
                        </p>
                        <ul>
                            <li>Confirmar a existência de tratamento de seus dados.</li>
                            <li>Acessar seus dados pessoais.</li>
                            <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
                            <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários.</li>
                            <li>Revogar o consentimento para o uso de seus dados em comunicações de marketing.</li>
                        </ul>

                        <h3>6. Uso de Imagens e Direitos Autorais</h3>
                        <p>
                            Como uma empresa de conteúdo visual, a Pixel Obra segue normas éticas na captação de imagens:
                        </p>
                        <ul>
                            <li><strong>Privacidade de Terceiros:</strong> Esforçamo-nos para não captar ou para desfocar rostos de transeuntes ou placas de veículos em áreas públicas, focando estritamente na estrutura arquitetônica e técnica do projeto.</li>
                            <li><strong>Consentimento de Uso:</strong> O uso de imagens de projetos finalizados para o portfólio da Pixel Obra será sempre regido pelo contrato de prestação de serviços assinado entre as partes.</li>
                        </ul>

                        <h3>7. Cookies</h3>
                        <p>
                            Utilizamos cookies para entender como você interage com nosso site. Você pode optar por desativar os cookies nas configurações do seu navegador, embora isso possa afetar a funcionalidade de algumas partes do nosso site.
                        </p>

                        <h3>8. Alterações nesta Política</h3>
                        <p>
                            A Pixel Obra reserva-se o direito de atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre qualquer mudança material publicando a nova versão em nosso site com a data de atualização revisada.
                        </p>

                        <h3>9. Contato</h3>
                        <p>
                            Para exercer seus direitos de privacidade ou tirar dúvidas sobre esta política, entre em contato conosco:
                        </p>
                        <ul>
                            <li>E-mail: contato@pixelobra.com.br</li>
                        </ul>
                        <p className="text-sm text-muted-foreground mt-8 p-4 border border-white/10 rounded-lg bg-white/5">
                            <strong>Aviso Legal:</strong> Esta Política de Privacidade é um documento informativo sobre as práticas de dados da Pixel Obra. Por envolver captação de imagem em locais físicos (obras), recomendamos que esta política seja revisada por um advogado especializado para garantir total conformidade com as leis locais.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
