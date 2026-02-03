/*
 * DESIGN SYSTEM: Architectural Glass Morphism
 * - Transparência em camadas com blur e opacidade
 * - Luz como protagonista - gradientes sutis
 * - Paleta: Azul noturno profundo (#0C1929) com acentos cyan (#00D4FF) e âmbar (#FFB800)
 * - Tipografia: Outfit (moderna e geométrica)
 */

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image,
  Sofa,
  ZoomIn,
  Pencil,
  Users,
  Video,
  ArrowRight,
  Zap,
  RefreshCw,
  MousePointer,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Globe,
  Sparkles,
  MessageCircle,
  Send,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Logo URL - Logo com fundo transparente
const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663329410379/pNiKuqDHYkXAjoHj.png";

// WhatsApp number
const WHATSAPP_NUMBER = "5585997589946";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

// Instagram
const INSTAGRAM_URL = "https://instagram.com/pixelobra";

// Image URLs
const IMAGES = {
  hero: "https://private-us-east-1.manuscdn.com/sessionFile/1vpb164jWrNm8CzTseVWP3/sandbox/rtqOEo9M616C0W1htn4O9z-img-1_1770149361000_na1fn_cGl4ZWwtb2JyYS1oZXJv.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvMXZwYjE2NGpXck5tOEN6VHNlVldQMy9zYW5kYm94L3J0cU9FbzlNNjE2QzBXMWh0bjRPOXotaW1nLTFfMTc3MDE0OTM2MTAwMF9uYTFmbl9jR2w0Wld3dGIySnlZUzFvWlhKdi5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=JSfFUUWkQqYSN8HNEhCgAF9zFjlwCCyvh~8yqreP0jEwd2ISnAwLx716gYkes3kJ32EZVTKJiciUZzGuwmRvm619hiF~29RMiLxBgnH~7UgdSmylx49qvIjeNLUfMG4fylxRvwb1zGgLhqQ~wvtPoHsZ4vM9tLnv1TxTr0D2lM1I-bHTSE9yDTMFnf4hxM4TAAhzDty5-k~jjwlqgFM8TwIzb6AJIhTjaKvtxk-n8Z5S~o8Xp1TrO8WnAnTRgswYSCiw9uj2gMRdtfqnJi-jkmLWvsP6Pz0YYdh4ScKBru~jwJxkBwFltEf-sXM-HKFQckzGY1b~~EITwb9vZqzUlw__",
  render: "https://private-us-east-1.manuscdn.com/sessionFile/1vpb164jWrNm8CzTseVWP3/sandbox/rtqOEo9M616C0W1htn4O9z-img-2_1770149359000_na1fn_cGl4ZWwtb2JyYS1yZW5kZXI.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvMXZwYjE2NGpXck5tOEN6VHNlVldQMy9zYW5kYm94L3J0cU9FbzlNNjE2QzBXMWh0bjRPOXotaW1nLTJfMTc3MDE0OTM1OTAwMF9uYTFmbl9jR2w0Wld3dGIySnlZUzF5Wlc1a1pYSS5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=igYIie1Mki1lfHujraWaVMuqFToZ9otNKsmX7y78EXHKaK6T7YOsuL7071S83MVW0t~aV5oXsxGo91R-MonQl6wdzQM6VWn9MZpr05jzS7HJX1lFW3snJvUiIEPtetp499vbKYJGaMy3rh4apouwdm6gtqTGHsnz~ajtgclgBd5VVXcSocD6AFo2b7BgHFWBIdySySxy~4GT6fHZs46taYy8oRC3G42rp3xSt8mChpRML0bULSCkIoyHLFMKoVreGdOmj8iftdPchntg4ywswNbqoNq1qikIm6I-ii5q~maqJdgWcsrdj0Aqm9VhpJ2-XmdxAsnUBCBqKEWSVHrrJw__",
  interior: "https://private-us-east-1.manuscdn.com/sessionFile/1vpb164jWrNm8CzTseVWP3/sandbox/rtqOEo9M616C0W1htn4O9z-img-3_1770149364000_na1fn_cGl4ZWwtb2JyYS1pbnRlcmlvcg.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvMXZwYjE2NGpXck5tOEN6VHNlVldQMy9zYW5kYm94L3J0cU9FbzlNNjE2QzBXMWh0bjRPOXotaW1nLTNfMTc3MDE0OTM2NDAwMF9uYTFmbl9jR2w0Wld3dGIySnlZUzFwYm5SbGNtbHZjZy5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=niCvEmC4ZYyUgc6zZ011KnjXDNMCzB5DRQlcpzFIYcNpD-YnYSAa1TVMiywTUEV0vL9QyNj3QTxGuFQo80ZXAnECo0XEtXauE8EY7rHkCBpBQmomY4a9KLaRDn4zsJuXu8Hp2I4M4bMhRtMfIeFNrUVoMXAUJxokb-8RMljgweMhJhan-H6itPISa3RAaatqgTAMDA~mSTkcU-jsxff8H0NToeg~E1hgdmCQG~HRUhJMY27jYmssA3i9Z4~UdwpB~LpV1ADaVAor5oUaAGmGs70oE2SeKozsbi6kbgheyNOzmuS4GFSRPx8fG5QxmqEDHcmJd4El1WbjZlzpsZnxgQ__",
  staging: "https://private-us-east-1.manuscdn.com/sessionFile/1vpb164jWrNm8CzTseVWP3/sandbox/rtqOEo9M616C0W1htn4O9z-img-4_1770149355000_na1fn_cGl4ZWwtb2JyYS1zdGFnaW5n.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvMXZwYjE2NGpXck5tOEN6VHNlVldQMy9zYW5kYm94L3J0cU9FbzlNNjE2QzBXMWh0bjRPOXotaW1nLTRfMTc3MDE0OTM1NTAwMF9uYTFmbl9jR2w0Wld3dGIySnlZUzF6ZEdGbmFXNW4uanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=f3ym95ajTuJbSSZNTgCqiWt2dbT6IYnSrdbWR7Wkxrw~9pIgCuhfhJJsNHYnbLXXtIo3w8Pu9wy4rQUraAbYPvSy1usLMYa0MlzUWen3o0VjJKXXSG25y2ARuK~I3weuECA8ANgbod-XEk9nGlSBln9T8JU62PYAUNSFeeoK50vMLkwq4crgiDruIZWL75~JQIjX-VQa1ZO1WHT9nC9gEIa0~8-AHME9G0BAt6p~C330EMOcxWUqWW7hsEam4Cvf6QJQOYvEvYDAaj6okReXBe2qWreq98jnZLUxeuKEmx3aga05-O73ZorXLbZfZ7R2urwJQ7C6Wpl9EScpodPV7Q__",
  exterior: "https://private-us-east-1.manuscdn.com/sessionFile/1vpb164jWrNm8CzTseVWP3/sandbox/rtqOEo9M616C0W1htn4O9z-img-5_1770149361000_na1fn_cGl4ZWwtb2JyYS1leHRlcmlvcg.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvMXZwYjE2NGpXck5tOEN6VHNlVldQMy9zYW5kYm94L3J0cU9FbzlNNjE2QzBXMWh0bjRPOXotaW1nLTVfMTc3MDE0OTM2MTAwMF9uYTFmbl9jR2w0Wld3dGIySnlZUzFsZUhSbGNtbHZjZy5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=GjUr0lHC-4RLhB9K1P41M5GPTthJPQyzWa3l0OZ36D0URqHpGlXu-t-ImEkEnLIilqZZVrjJIjWgtq7JjA2tcA722soHLgaZ7Mxn6N2Bl51R8fY9Z8Rnwn-LhYa4xBJsHwh-WCnjIcGFQQMCEkpVIosNzUAol9pYSGqXGfooiFnEAtXYi~z6e-m1lxLiDWedFbrzlFGI~HF6R9xofWihsDnzoWQaswvp-I3Bqdr5urMJ4NAJO2MlibtmJgJ~Yhig1mTSEbrXJdVTH2BcaV~lsgurMUDVCCQmJqCSkPPPYB6cc4VUdK4ZXCHGmbEBjIYqb3VL12jsIpTRS~1ziIH2wg__",
};

// Languages
const languages = [
  { code: "PT", name: "Português" },
  { code: "EN", name: "English" },
  { code: "DE", name: "Deutsch" },
  { code: "FR", name: "Français" },
  { code: "ES", name: "Español" },
];

// Tools data
const tools = [
  {
    icon: Sparkles,
    title: "Renderizar",
    description: "Envie esboços, elevações ou plantas de fachadas e obtenha renders fotorrealistas em segundos.",
    image: IMAGES.render,
  },
  {
    icon: Image,
    title: "Visualizar",
    description: "Descreva sua visão com um prompt e receba instantaneamente uma imagem arquitetônica realista.",
    image: IMAGES.interior,
  },
  {
    icon: Sofa,
    title: "Decorar",
    description: "Mobilie e decore virtualmente seu espaço com um único clique.",
    image: IMAGES.staging,
  },
  {
    icon: ZoomIn,
    title: "Ampliar",
    description: "Melhore e amplie seus renders com texturas de alta resolução e detalhes refinados.",
    image: IMAGES.exterior,
  },
  {
    icon: Pencil,
    title: "Editar",
    description: "Modifique seu design facilmente descrevendo as alterações desejadas ou usando nossa ferramenta de pincel.",
    image: IMAGES.interior,
  },
  {
    icon: Users,
    title: "Adicionar Pessoas",
    description: "Popule suas cenas com personagens realistas com um único clique.",
    image: IMAGES.exterior,
  },
  {
    icon: Video,
    title: "Animar",
    description: "Transforme uma única imagem estática em uma animação de vídeo dinâmica instantaneamente.",
    image: IMAGES.hero,
  },
];

// Benefits data
const benefits = [
  {
    icon: Zap,
    title: "Rápido e Eficiente",
    description: "Do conceito ao render em segundos.",
  },
  {
    icon: RefreshCw,
    title: "Refinamento Fácil",
    description: "Amplie ou edite imagens de acordo com sua visão.",
  },
  {
    icon: MousePointer,
    title: "Fluxo de Trabalho Integrado",
    description: "Adicione pessoas com um clique ou anime a partir de uma única imagem.",
  },
];

// FAQ data
const faqs = [
  {
    question: "O que é a Pixel Obra?",
    answer: "A Pixel Obra é uma suíte completa de ferramentas que transforma esboços arquitetônicos, desenhos de elevação e plantas de fachadas em renderizações fotorrealistas em segundos, otimizando seu processo criativo do conceito à saída visual. Também permite visualizar sua visão com um prompt, mobiliar e decorar virtualmente seu espaço, melhorar e ampliar seus renders, modificar seu design e popular suas cenas com personagens realistas.",
  },
  {
    question: "A Pixel Obra é gratuita?",
    answer: "Você recebe 3 créditos gratuitos ao se cadastrar. Para acesso contínuo, você pode escolher entre nossos planos Light, Standard ou Professional. Saiba mais na nossa página de Assinatura.",
  },
  {
    question: "Quantos créditos são necessários por geração?",
    answer: "A maioria dos renders únicos usa 1 crédito. Modelos Pro usam mais créditos, e renders com definição correspondente à entrada e alta definição também requerem créditos adicionais. Alguns recursos avançados—como ampliação de alto nível (acima de 2×) e animações—podem requerer créditos adicionais.",
  },
  {
    question: "Os créditos acumulam para o próximo mês?",
    answer: "Sim, créditos não utilizados acumulam para o próximo mês. Ao fazer upgrade, todos os créditos são transferidos. Se você fizer upgrade no meio do ciclo, receberá a diferença de créditos entre os planos. No entanto, se você cancelar a assinatura, os créditos restantes expiram no final do seu período de cobrança.",
  },
  {
    question: "Posso usar a Pixel Obra para projetos comerciais?",
    answer: "Absolutamente. Os renders e edições da Pixel Obra são licenciados para uso comercial.",
  },
  {
    question: "Posso renderizar esboços à mão livre?",
    answer: "Sim. A ferramenta Renderizar suporta esboços à mão livre. Basta enviar e converter.",
  },
  {
    question: "Posso renderizar plantas de elevação?",
    answer: "Sim. Plantas de elevação são totalmente suportadas através da ferramenta Renderizar.",
  },
  {
    question: "Posso modificar partes do meu render?",
    answer: "Sim. Use a ferramenta Editar para refinar seu render. Você pode descrever o que gostaria de alterar ou desenhar diretamente com o pincel. Você também pode adicionar pessoas dentro do mesmo conjunto de ferramentas.",
  },
  {
    question: "Como a Pixel Obra beneficia arquitetos?",
    answer: "Ao transformar esboços rápidos em visuais fotorrealistas quase instantaneamente, a Pixel Obra capacita arquitetos a iterar ideias de design e desenvolver apresentações sem precisar de software de renderização.",
  },
  {
    question: "Como a Pixel Obra apoia corretores imobiliários?",
    answer: "Profissionais do mercado imobiliário agora podem gerar visualizações polidas, desde renderizações e decoração virtual até animações, sem depender de agências ou contratados externos, tudo em segundos.",
  },
];

// Featured generations
const featuredImages = [
  IMAGES.hero,
  IMAGES.render,
  IMAGES.interior,
  IMAGES.staging,
  IMAGES.exterior,
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

// Glass card styles as inline styles
const glassCardStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "0.75rem",
  boxShadow: "0 4px 24px -1px rgba(0, 0, 0, 0.2), inset 0 0 1px 0 rgba(255, 255, 255, 0.1)",
};

// WhatsApp Icon Component
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

// Logo Component - Símbolo + Nome com cores do site
function Logo({ className = "h-10", showName = true }: { className?: string; showName?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <img 
        src={LOGO_URL} 
        alt="Pixel Obra" 
        className={`${className} w-auto object-contain`}
        style={{ 
          filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
          maxHeight: "48px"
        }}
      />
      {showName && (
        <span className="font-bold text-lg md:text-xl tracking-tight">
          <span className="text-cyan-400">PIXEL</span>
          <span className="text-amber-400 ml-1">OBRA</span>
        </span>
      )}
    </div>
  );
}

// Contact Form Modal
function ContactFormModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    nome: "",
    cpfCnpj: "",
    email: "",
    telefone: "",
    descricao: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    // In production, this would send to a backend that emails pixelobra@gmail.com
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create mailto link as fallback
    const subject = encodeURIComponent("Solicitação de Orçamento - Pixel Obra");
    const body = encodeURIComponent(
      `Nome: ${formData.nome}\n` +
      `CPF/CNPJ: ${formData.cpfCnpj}\n` +
      `E-mail: ${formData.email}\n` +
      `Telefone: ${formData.telefone}\n\n` +
      `Descrição da Solicitação:\n${formData.descricao}`
    );
    
    window.location.href = `mailto:pixelobra@gmail.com?subject=${subject}&body=${body}`;
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setFormData({
        nome: "",
        cpfCnpj: "",
        email: "",
        telefone: "",
        descricao: "",
      });
    }, 2000);
  };

  const formatCpfCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      // CPF: 000.000.000-00
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
    } else {
      // CNPJ: 00.000.000/0000-00
      return numbers
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    // Format: +55 (85) 99758-9946
    if (numbers.length <= 2) {
      return `+${numbers}`;
    } else if (numbers.length <= 4) {
      return `+${numbers.slice(0, 2)} (${numbers.slice(2)}`;
    } else if (numbers.length <= 9) {
      return `+${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4)}`;
    } else {
      return `+${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4, 9)}-${numbers.slice(9, 13)}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-background/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <Logo className="h-8" showName={false} />
            Solicite seu Orçamento
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preencha o formulário abaixo e entraremos em contato em breve.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-12 text-center"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Solicitação Enviada!</h3>
              <p className="text-muted-foreground">Entraremos em contato em breve.</p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4 mt-4"
            >
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  placeholder="Seu nome completo"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                  className="bg-white/5 border-white/10 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpfCnpj">CPF/CNPJ *</Label>
                <Input
                  id="cpfCnpj"
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  value={formData.cpfCnpj}
                  onChange={(e) => setFormData({ ...formData, cpfCnpj: formatCpfCnpj(e.target.value) })}
                  required
                  className="bg-white/5 border-white/10 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-white/5 border-white/10 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone" className="flex items-center gap-2">
                  <WhatsAppIcon className="w-4 h-4 text-green-500" />
                  Contato (WhatsApp) *
                </Label>
                <Input
                  id="telefone"
                  placeholder="+55 (00) 00000-0000"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: formatPhone(e.target.value) })}
                  required
                  className="bg-white/5 border-white/10 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição da Solicitação *</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva seu projeto e o que você precisa..."
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  required
                  rows={4}
                  className="bg-white/5 border-white/10 focus:border-primary resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                    />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Solicitação
                  </>
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

// Floating WhatsApp Button
function FloatingWhatsApp() {
  return (
    <motion.a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Contato via WhatsApp"
    >
      <WhatsAppIcon className="w-7 h-7 text-white" />
      <motion.div
        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.a>
  );
}

// Language Selector Component
function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState("PT");

  const handleLanguageChange = (code: string) => {
    setCurrentLang(code);
    toast(`Idioma alterado para ${languages.find(l => l.code === code)?.name}`, {
      description: "A tradução completa estará disponível em breve.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
          <Globe className="w-4 h-4" />
          <span className="font-medium">{currentLang}</span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-background/95 backdrop-blur-xl border-white/10 min-w-[120px]"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`cursor-pointer ${currentLang === lang.code ? "bg-primary/20 text-primary" : ""}`}
          >
            <span className="font-medium">{lang.code}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Header Component
function Header({ onOpenContact }: { onOpenContact: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = () => {
    toast("Funcionalidade em breve", {
      description: "Esta seção estará disponível em breve.",
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-b border-white/5" />
      <nav className="container relative flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group hover:opacity-90 transition-opacity">
          <Logo className="h-9 md:h-11" showName={true} />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={handleNavClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Soluções
          </button>
          <button onClick={handleNavClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Preços
          </button>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSelector />
          <Button variant="ghost" size="sm" onClick={handleNavClick}>
            Entrar
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={onOpenContact}>
            Solicite seu Orçamento
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-white/5"
        >
          <div className="container py-4 flex flex-col gap-4">
            <button onClick={handleNavClick} className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors">
              Soluções
            </button>
            <button onClick={handleNavClick} className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors">
              Preços
            </button>
            <div className="py-2">
              <LanguageSelector />
            </div>
            <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
              <Button variant="ghost" className="justify-start" onClick={handleNavClick}>
                Entrar
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={onOpenContact}>
                Solicite seu Orçamento
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}

// Hero Section
function HeroSection({ onOpenContact }: { onOpenContact: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={IMAGES.hero}
          alt="Arquitetura moderna"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
      </div>

      {/* Content */}
      <div className="container relative z-10 pt-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.p
            variants={fadeInUp}
            className="text-primary text-sm font-medium tracking-wider uppercase mb-4"
          >
            Visualização Arquitetônica com IA
          </motion.p>
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            Crie Renders Arquitetônicos{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-amber-400">em Segundos.</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Seu assistente de visualização arquitetônica com inteligência artificial.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg relative overflow-hidden"
              onClick={onOpenContact}
            >
              Solicite seu Orçamento
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
}

// Tools Section
function ToolsSection() {
  const handleClick = () => {
    toast("Funcionalidade em breve", {
      description: "Esta seção estará disponível em breve.",
    });
  };

  return (
    <section className="py-24 md:py-32 relative">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeInUp} className="text-primary text-sm font-medium tracking-wider uppercase mb-4">
            Nossas Ferramentas
          </motion.p>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold tracking-tight">
            Descubra nossas ferramentas
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {tools.map((tool) => (
            <motion.div
              key={tool.title}
              variants={fadeInUp}
              className="group overflow-hidden transition-all duration-300 hover:border-white/20"
              style={glassCardStyle}
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={tool.image}
                  alt={tool.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                      <tool.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{tool.title}</h3>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {tool.description}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary/80 p-0 h-auto"
                  onClick={handleClick}
                >
                  Visualizar
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Benefits Section
function BenefitsSection({ onOpenContact }: { onOpenContact: () => void }) {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={IMAGES.exterior}
          alt="Arquitetura"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              A Pixel Obra é a forma mais fácil de criar{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-amber-400">renderizações arquitetônicas.</span>
            </motion.h2>

            <motion.div variants={fadeInUp} className="space-y-6 mb-8">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={onOpenContact}
              >
                Solicite seu Orçamento
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="p-2 rounded-xl" style={glassCardStyle}>
              <img
                src={IMAGES.render}
                alt="Antes e depois do render"
                className="w-full rounded-lg"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 px-4 py-2 rounded-xl" style={glassCardStyle}>
              <p className="text-xs text-muted-foreground">Tempo de processamento</p>
              <p className="text-lg font-semibold text-primary">~5 segundos</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Featured Section
function FeaturedSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeInUp} className="text-primary text-sm font-medium tracking-wider uppercase mb-4">
            Galeria
          </motion.p>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Gerações em Destaque
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto">
            Descubra imagens geradas recentemente por nossa comunidade
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {featuredImages.map((image, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className={`relative overflow-hidden rounded-xl group ${
                index === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <img
                src={image}
                alt={`Geração ${index + 1}`}
                className="w-full h-full object-cover aspect-square transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  return (
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeInUp} className="text-primary text-sm font-medium tracking-wider uppercase mb-4">
            FAQ
          </motion.p>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold tracking-tight">
            Perguntas Frequentes
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="px-6 border-0 rounded-xl"
                style={glassCardStyle}
              >
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection({ onOpenContact }: { onOpenContact: () => void }) {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={IMAGES.interior}
          alt="Interior"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/80" />
      </div>

      <div className="container relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="p-8 md:p-12 lg:p-16 text-center max-w-4xl mx-auto rounded-2xl"
          style={glassCardStyle}
        >
          <motion.p variants={fadeInUp} className="text-primary text-sm font-medium tracking-wider uppercase mb-4">
            Precisa de mais?
          </motion.p>
          <motion.h2 variants={fadeInUp} className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
            Considere nossos Serviços Empresariais personalizados
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Soluções sob medida para escritórios de arquitetura, construtoras e incorporadoras que precisam de volume e personalização.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={onOpenContact}
            >
              Falar com Especialista
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Footer Component
function Footer() {
  const handleClick = () => {
    toast("Funcionalidade em breve", {
      description: "Esta seção estará disponível em breve.",
    });
  };

  return (
    <footer className="py-16 border-t border-white/5">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4 hover:opacity-90 transition-opacity">
              <Logo className="h-9" showName={true} />
            </a>
            <p className="text-sm text-muted-foreground">
              Fornecendo ferramentas e serviços de visualização arquitetônica globalmente.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={handleClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Soluções
                </button>
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
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={handleClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Aviso Legal
                </button>
              </li>
              <li>
                <button onClick={handleClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Política de Privacidade
                </button>
              </li>
              <li>
                <button onClick={handleClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Termos de Serviço
                </button>
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
            <h4 className="font-semibold mb-4">Suporte</h4>
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
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>
            <a 
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
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

// Main Home Component
export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenContact={() => setIsContactOpen(true)} />
      <main>
        <HeroSection onOpenContact={() => setIsContactOpen(true)} />
        <ToolsSection />
        <BenefitsSection onOpenContact={() => setIsContactOpen(true)} />
        <FeaturedSection />
        <FAQSection />
        <CTASection onOpenContact={() => setIsContactOpen(true)} />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <ContactFormModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />
    </div>
  );
}
