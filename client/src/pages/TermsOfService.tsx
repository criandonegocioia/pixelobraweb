import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";

export default function TermsOfService() {
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
                            Termos de Serviço da Pixel Obra
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Última atualização: 11/02/2026
                        </p>
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none">
                        <p>
                            Bem-vindo à Pixel Obra.
                        </p>
                        <p>
                            Estes Termos de Serviço ("Termos", "Contrato") regem o seu acesso e uso do website da Pixel Obra (doravante referido como "Site"), bem como quaisquer serviços, produtos, conteúdos ou projetos digitais fornecidos por nós (coletivamente, os "Serviços").
                        </p>
                        <p>
                            Por favor, leia estes Termos atentamente antes de utilizar nossos Serviços.
                        </p>

                        <h3>1. Aceitação dos Termos</h3>
                        <p>
                            Ao acessar ou utilizar o Site e os Serviços da Pixel Obra, você concorda em ficar vinculado a estes Termos e a todas as leis e regulamentos aplicáveis. Se você não concordar com qualquer parte destes Termos, você não tem permissão para acessar o Site ou utilizar nossos Serviços.
                        </p>
                        <p>
                            Estes Termos aplicam-se a todos os visitantes, usuários, clientes e outras pessoas que acessam ou usam os Serviços.
                        </p>

                        <h3>2. Definições</h3>
                        <ul>
                            <li><strong>"Pixel Obra", "Nós", "Nosso":</strong> Refere-se à empresa Pixel Obra, seus proprietários, afiliados, diretores e funcionários.</li>
                            <li><strong>"Usuário", "Você", "Cliente":</strong> Refere-se à pessoa física ou jurídica que acessa o Site ou contrata nossos Serviços.</li>
                            <li><strong>"Conteúdo":</strong> Refere-se a textos, imagens, gráficos, códigos, softwares, áudios, vídeos e qualquer outro material disponibilizado no Site ou através dos Serviços.</li>
                        </ul>

                        <h3>3. Descrição dos Serviços</h3>
                        <p>
                            A Pixel Obra é uma empresa focada em criação de conteúdo visual (fotos, vídeos e renderizações) de alto padrão para os setores de arquitetura, engenharia, construção civil e mercado imobiliário.
                        </p>
                        <p>
                            Nós nos esforçamos para garantir que as informações sobre nossos serviços no Site sejam precisas. No entanto, não garantimos que as descrições, preços ou outros conteúdos sejam totalmente precisos, completos, confiáveis, atuais ou livres de erros.
                        </p>

                        <h3>4. Uso Aceitável e Conduta do Usuário</h3>
                        <p>
                            Você concorda em usar nossos Serviços apenas para fins legais e de acordo com estes Termos. Você concorda expressamente em não:
                        </p>
                        <ul>
                            <li>Usar os Serviços de qualquer forma que viole qualquer lei ou regulamento local, nacional ou internacional aplicável.</li>
                            <li>Usar os Serviços para transmitir, ou procurar o envio de, qualquer publicidade ou material promocional não solicitado ("spam").</li>
                            <li>Tentar obter acesso não autorizado a, interferir, danificar ou interromper qualquer parte dos Serviços, o servidor no qual o Site está armazenado, ou qualquer servidor, computador ou banco de dados conectado aos Serviços.</li>
                            <li>Engajar-se em qualquer conduta que restrinja ou iniba o uso ou gozo dos Serviços por qualquer outra pessoa, ou que, conforme determinado por nós, possa prejudicar a Pixel Obra ou os usuários dos Serviços ou expô-los a responsabilidade.</li>
                            <li>Usar qualquer robô, "spider" ou outro dispositivo automático, processo ou meio para acessar os Serviços para qualquer finalidade, incluindo monitorar ou copiar qualquer material do Site.</li>
                        </ul>

                        <h3>5. Propriedade Intelectual</h3>
                        <h4>5.1. Conteúdo da Pixel Obra</h4>
                        <p>
                            Salvo disposição em contrário, o Site e seu conteúdo original, recursos e funcionalidades são e permanecerão de propriedade exclusiva da Pixel Obra e seus licenciadores. O Site é protegido por direitos autorais, marcas registradas e outras leis do Brasil e de outros países. Nossas marcas registradas e identidade visual não podem ser usadas em conexão com qualquer produto ou serviço sem o consentimento prévio por escrito da Pixel Obra.
                        </p>

                        <h4>5.2. Propriedade de Projetos (Para Clientes)</h4>
                        <p>
                            Se você contratar a Pixel Obra para desenvolver um projeto específico (a "Obra"), os termos de propriedade intelectual dessa Obra serão regidos por um contrato de prestação de serviços separado ("Contrato de Projeto").
                        </p>
                        <p>
                            Na ausência de um Contrato de Projeto específico, aplica-se a regra padrão: após o pagamento integral de todas as taxas acordadas, a Pixel Obra cede ao Cliente os direitos de uso da Obra final entregue. No entanto, a Pixel Obra reserva-se o direito de usar a Obra (imagens, descrições, estudos de caso) em seu portfólio, site e materiais de marketing para fins de demonstração de suas capacidades.
                        </p>
                        <p>
                            A Pixel Obra retém a propriedade de quaisquer ferramentas, frameworks, ou códigos pré-existentes ("Ferramentas de Base") utilizados na criação da Obra. O Cliente recebe uma licença de uso dessas Ferramentas de Base conforme incorporadas na Obra final.
                        </p>

                        <h3>6. Contas e Segurança</h3>
                        <p>
                            Se algum de nossos Serviços exigir que você crie uma conta, você deve nos fornecer informações precisas, completas e atuais o tempo todo. O não cumprimento desta obrigação constitui uma violação dos Termos, o que pode resultar no encerramento imediato da sua conta em nossos Serviços.
                        </p>
                        <p>
                            Você é responsável por proteger a senha que usa para acessar o Serviço e por quaisquer atividades ou ações sob sua senha. Você concorda em não divulgar sua senha a terceiros. Você deve nos notificar imediatamente ao tomar conhecimento de qualquer violação de segurança ou uso não autorizado de sua conta.
                        </p>

                        <h3>7. Pagamentos e Reembolsos</h3>
                        <p>
                            Para serviços pagos ou compra de produtos digitais, termos específicos de pagamento, cronogramas e políticas de reembolso serão detalhados no momento da compra ou no Contrato de Projeto específico.
                        </p>
                        <p>
                            De modo geral, devido à natureza dos serviços digitais e criativos, uma vez que o trabalho tenha começado ou um produto digital tenha sido entregue/baixado, os pagamentos não são reembolsáveis, exceto onde exigido por lei ou explicitamente declarado em um contrato separado.
                        </p>

                        <h3>8. Limitação de Responsabilidade</h3>
                        <p>
                            EM NENHUMA CIRCUNSTÂNCIA A PIXEL OBRA, SEUS DIRETORES, FUNCIONÁRIOS, PARCEIROS, AGENTES, FORNECEDORES OU AFILIADOS SERÃO RESPONSÁVEIS POR QUAISQUER DANOS INDIRETOS, INCIDENTAIS, ESPECIAIS, CONSEQUENCIAIS OU PUNITIVOS, INCLUINDO, SEM LIMITAÇÃO, PERDA DE LUCROS, DADOS, USO, BOA VONTADE OU OUTRAS PERDAS INTANGÍVEIS, RESULTANTES DE:
                        </p>
                        <ul>
                            <li>(A) SEU ACESSO OU USO OU INCAPACIDADE DE ACESSAR OU USAR OS SERVIÇOS;</li>
                            <li>(B) QUALQUER CONDUTA OU CONTEÚDO DE QUALQUER TERCEIRO NOS SERVIÇOS;</li>
                            <li>(C) QUALQUER CONTEÚDO OBTIDO DOS SERVIÇOS; E</li>
                            <li>(D) ACESSO NÃO AUTORIZADO, USO OU ALTERAÇÃO DE SUAS TRANSMISSÕES OU CONTEÚDO.</li>
                        </ul>
                        <p>
                            A PIXEL OBRA NÃO GARANTE QUE OS SERVIÇOS SERÃO ININTERRUPTOS, SEGUROS OU LIVRES DE ERROS, OU QUE QUAISQUER DEFEITOS SERÃO CORRIGIDOS.
                        </p>

                        <h3>9. Links para Outros Sites</h3>
                        <p>
                            Nosso Site pode conter links para sites ou serviços de terceiros que não são de propriedade ou controlados pela Pixel Obra.
                        </p>
                        <p>
                            A Pixel Obra não tem controle e não assume nenhuma responsabilidade pelo conteúdo, políticas de privacidade ou práticas de quaisquer sites ou serviços de terceiros. Você reconhece e concorda que a Pixel Obra não será responsável, direta ou indiretamente, por qualquer dano ou perda causada ou supostamente causada por ou em conexão com o uso ou confiança em qualquer conteúdo, bens ou serviços disponíveis em ou através de tais sites ou serviços.
                        </p>

                        <h3>10. Política de Privacidade</h3>
                        <p>
                            O uso dos nossos Serviços também é regido pela nossa Política de Privacidade. Por favor, revise nossa Política de Privacidade para entender como coletamos, usamos e compartilhamos informações sobre os usuários.
                        </p>

                        <h3>11. Rescisão</h3>
                        <p>
                            Podemos encerrar ou suspender seu acesso aos nossos Serviços imediatamente, sem aviso prévio ou responsabilidade, por qualquer motivo, incluindo, sem limitação, se você violar os Termos.
                        </p>
                        <p>
                            Todas as disposições dos Termos que, por sua natureza, devem sobreviver à rescisão, sobreviverão à rescisão, incluindo, sem limitação, disposições de propriedade, isenções de garantia, indenização e limitações de responsabilidade.
                        </p>

                        <h3>12. Alterações nos Termos</h3>
                        <p>
                            Reservamo-nos o direito, a nosso exclusivo critério, de modificar ou substituir estes Termos a qualquer momento. Se uma revisão for material, tentaremos fornecer um aviso com pelo menos 15 dias de antecedência antes que quaisquer novos termos entrem em vigor. O que constitui uma alteração material será determinado a nosso exclusivo critério.
                        </p>
                        <p>
                            Ao continuar a acessar ou usar nossos Serviços após essas revisões entrarem em vigor, você concorda em ficar vinculado aos termos revisados. Se você não concordar com os novos termos, pare de usar os Serviços.
                        </p>

                        <h3>13. Legislação Aplicável e Foro</h3>
                        <p>
                            Estes Termos serão regidos e interpretados de acordo com as leis da República Federativa do Brasil, sem levar em conta seus conflitos de disposições legais.
                        </p>
                        <p>
                            Qualquer disputa relacionada a estes Termos será submetida à jurisdição exclusiva dos tribunais da comarca de Fortaleza, CE, Brasil, renunciando a qualquer outro, por mais privilegiado que seja.
                        </p>

                        <h3>14. Contato</h3>
                        <p>
                            Se você tiver alguma dúvida sobre estes Termos de Serviço, entre em contato conosco:
                        </p>
                        <ul>
                            <li>Por e-mail: pixelobra@pixelobra.com</li>
                            <li>Através da nossa página de contato no site.</li>
                        </ul>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
