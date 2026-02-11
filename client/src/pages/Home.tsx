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
import { trpc } from "@/lib/trpc";

import { WhatsAppIcon, WHATSAPP_LINK } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { INSTAGRAM_URL } from "@/const";

// Image URLs
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
    title: "Renderização",
    description: "Mande-nos esboços, elevações, plantas baixas em 2D, planta de fachadas ou outra imagem e faremos renders fotorrealistas profissionais.",
    image: IMAGES.render,
  },
  {
    icon: Image,
    title: "Visualização",
    description: "Descreva sua visão sobre uma ideia e receba uma imagem arquitetônica realista.",
    image: IMAGES.interior,
  },
  {
    icon: Sofa,
    title: "Decoração",
    description: "Mobilie e decore virtualmente seu espaço.",
    image: IMAGES.staging,
  },
  {
    icon: ZoomIn,
    title: "Ampliação",
    description: "Melhore, amplie, faça close-ups, ajustes e modificação em seus renders, com formatos e texturas de alta resolução e detalhes refinados.",
    image: IMAGES.exterior,
  },
  {
    icon: Pencil,
    title: "Edição",
    description: "Modifique seu design apenas nos descrevendo as alterações desejadas.",
    image: IMAGES.interior,
  },
  {
    icon: Users,
    title: "Adicione Pessoa e Objetos",
    description: "Popule suas cenas com objetos e personagens ultrarrealistas. Inclusive, adicionado você, o cliente ou terceiros interessados na cena.",
    image: IMAGES.exterior,
  },
  {
    icon: Video,
    title: "Animação e Vídeos",
    description: "Transforme uma única imagem estática em uma animação de vídeo dinâmica e realista, com contexto e storytelling.",
    image: IMAGES.hero,
  },
];

// Benefits data
const benefits = [
  {
    icon: Zap,
    title: "Rápido e Eficiente",
    description: "Do conceito ao render.",
  },
  {
    icon: RefreshCw,
    title: "Refinamento Ágil",
    description: "Amplie ou edite imagens de acordo com sua visão.",
  },
  {
    icon: MousePointer,
    title: "Fluxo de Trabalho Integrado",
    description: "Adicione pessoas ou anime a partir de uma única imagem.",
  },
];

// FAQ data
const faqs = [
  {
    question: "O que é a Pixel Obra?",
    answer: "A Pixel Obra é uma empresa completa, com ferramentas que transforma esboços arquitetônicos, desenhos de elevação e plantas de fachadas em renderizações fotorrealistas, otimizando seu processo criativo do conceito à saída visual. Também permite implementar sua visão, mobiliar e decorar virtualmente seu espaço, melhorar e ampliar seus renders, modificar seu design e popular suas cenas com personagens realistas.",
  },
  {
    question: "Os produtos da Pixel Obra são caros?",
    answer: "Acreditamos que a sofisticação do design premium deve ser um diferencial acessível a quem busca se destacar. Temos afinidade com clientes exigentes pois nossa filosofia interna de trabalho é igualmente rigorosa, alinhando estética impecável à inteligência financeira que o seu negócio necessita. Solicite um orçamento para analisar nosso custo-benefício e descubra como a alta qualidade da nossa entrega pode transformar a conexão com o seu público.",
  },

  {
    question: "Posso renderizar plantas de elevação?",
    answer: "Sim. Plantas de elevação são totalmente Renderizáveis.",
  },
  {
    question: "Posso modificar partes do meu render?",
    answer: "Sim. Editamos e renderizamos o seu render. Você pode descrever o que gostaria de alterar ou desenhar. Você também pode adicionar pessoas e objetos no seu trabalho.",
  },
  {
    question: "Como a Pixel Obra beneficia arquitetos?",
    answer: "Ao transformarmos seus esboços e projetos em visuais fotorrealistas, a Pixel Obra ajuda arquitetos a iterar ideias de design e desenvolver apresentações sem ocupar seu tempo com renderização, liberando a sua criatividade em outros projetos.",
  },
  {
    question: "Como a Pixel Obra apoia corretores imobiliários?",
    answer: "Profissionais do mercado imobiliário agora podem ter visualizações polidas de seus imóveis, desde renderizações e decoração virtual até animações, sem depender de agências ou contratados externos e tornando suas apresentações visualmente atraentes e potencializando vendas.",
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
  background: "rgba(255, 255, 255, 0.03)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "0.5rem",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
};





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

  const submitContactMutation = trpc.contact.submit.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setIsSuccess(true);
        toast("Solicitação enviada com sucesso!", {
          description: "Recebemos seu pedido e entraremos em contato em breve.",
        });

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
      } else {
        toast.error("Erro ao enviar solicitação", {
          description: data.message,
        });
      }
    },
    onError: (error) => {
      console.error("Erro no envio:", error);
      toast.error("Erro ao enviar solicitação", {
        description: error.message || "Houve um problema ao enviar seu pedido.",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitContactMutation.mutateAsync(formData);
    } finally {
      setIsSubmitting(false);
    }
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
            <Logo className="h-8" />
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

// Header Component - Redesigned (Floating Pill)
function Header({ onOpenContact }: { onOpenContact: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = () => {
    toast("Funcionalidade em breve", {
      description: "Esta seção estará disponível em breve.",
    });
  };

  return (
    <>
      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        {/* Floating Pill Container */}
        <nav className="relative flex items-center justify-between h-14 md:h-16 px-6 bg-background/80 backdrop-blur-md border border-white/10 rounded-full shadow-2xl max-w-5xl w-full">

          {/* Logo (Left) */}
          <a href="/" className="flex items-center group hover:opacity-90 transition-opacity mr-auto">
            <Logo className="h-8 md:h-10" />
          </a>

          {/* Desktop Navigation (Center) */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <button onClick={handleNavClick} className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Soluções
            </button>
            <a href="/portfolio" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Portfólio
            </a>
            <a href="#sobre-nos" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Sobre Nós
            </a>
            <button onClick={handleNavClick} className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Preços
            </button>
            <LanguageSelector />
          </div>

          {/* Desktop CTA (Right) */}
          <div className="hidden md:flex items-center gap-4 ml-auto">
            <Button variant="ghost" size="sm" onClick={handleNavClick} className="text-white/70 hover:text-white">
              Entrar
            </Button>
            <Button
              size="sm"
              className="bg-transparent border border-cyan-400 text-white hover:bg-cyan-400/10 font-medium rounded-full px-6 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all duration-300"
              onClick={onOpenContact}
            >
              Solicite seu Orçamento
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden ml-auto">
            <LanguageSelector />
            <button
              className="p-2 -mr-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-4 top-24 z-40 bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl md:hidden overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              <button onClick={handleNavClick} className="text-left py-2 text-lg font-medium text-white/80 hover:text-white">
                Soluções
              </button>
              <a href="/portfolio" className="text-left py-2 text-lg font-medium text-white/80 hover:text-white">
                Portfólio
              </a>
              <a href="#sobre-nos" className="text-left py-2 text-lg font-medium text-white/80 hover:text-white">
                Sobre Nós
              </a>
              <button onClick={handleNavClick} className="text-left py-2 text-lg font-medium text-white/80 hover:text-white">
                Preços
              </button>

              <div className="h-px bg-white/10 my-2" />

              <Button variant="ghost" className="justify-start text-white/80" onClick={handleNavClick}>
                Entrar
              </Button>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium rounded-full py-6" onClick={onOpenContact}>
                Solicite seu Orçamento
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Hero Section
function HeroSection({ onOpenContact }: { onOpenContact: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* SVG Filters Definition for Edge Detection */}
      <svg className="hidden">
        <defs>
          <filter id="edge-detection">
            {/* Desaturate */}
            <feColorMatrix type="saturate" values="0" />
            {/* Edge Detection (finding transitions) */}
            <feConvolveMatrix
              order="3,3"
              kernelMatrix="-1 -1 -1
                            -1  8 -1
                            -1 -1 -1"
              divisor="1"
              bias="0"
              preserveAlpha="true"
            />
            {/* Invert colors to simulate blueprint/white-lines-on-dark */}
            <feColorMatrix type="matrix" values="-1 0 0 0 1
                                                  0 -1 0 0 1
                                                  0 0 -1 0 1
                                                  0 0 0 1 0" />
          </filter>
        </defs>
      </svg>

      {/* Background Image - Cinematic & Clean */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">

        {/* Container for the Zoom Animation - Applies to ALL layers to ensure perfect sync */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1.0 }}
          transition={{
            duration: 14,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 1.0
          }}
        >
          {/* Layer 1: Clay/Plaster Base (SketchUp Flat Look) - High Brightness/Low Contrast to wash out textures */}
          <div className="absolute inset-0">
            <img
              src="/hero_render.jpg"
              alt="Base Clay"
              className="w-full h-full object-cover filter grayscale brightness-[1.3] contrast-[0.6]"
            />
          </div>

          {/* Layer 2: Edges/Lines (Overlay) - Stronger edges */}
          <div className="absolute inset-0 mix-blend-multiply opacity-80">
            <img
              src="/hero_render.jpg"
              alt="Edges"
              className="w-full h-full object-cover"
              style={{ filter: "url(#edge-detection)" }}
            />
          </div>

          {/* Layer 3: Realistic Render (Fade In) - Delayed start to show SketchUp first */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 12,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 1.0
            }}
          >
            <img
              src="/hero_render.jpg"
              alt="Render Realista"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>

        {/* Subtle Vignette - Static on top */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,oklch(0.1_0_0)_100%)] z-20 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="container relative z-10 pt-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-5xl mx-auto text-center"
        >

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tighter mb-8 text-white leading-[1.1]"
          >
            Tecnologia e Precisão em Projetos para <br className="hidden md:block" />
            <span className="font-normal">Arquitetura, Construção Civil e Imobiliários</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/50 font-light mb-10 max-w-2xl mx-auto tracking-wide">
            Renders inteligentes e imersivos pela Pixel Obra.
          </p>

          <motion.div variants={fadeInUp}>
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 rounded-full px-10 py-7 text-lg font-medium tracking-wide transition-all duration-300 hover:scale-105"
              onClick={onOpenContact}
            >
              Solicite seu Orçamento
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// About Section
function AboutSection() {
  return (
    <section id="sobre-nos" className="py-32 relative overflow-hidden bg-black/40">
      <div className="container relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-8 text-white">
            Sobre <span className="font-normal">Nós</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/70 leading-relaxed font-light max-w-3xl mx-auto tracking-wide">
            "A Pixel Obra é uma plataforma dedicada à convergência entre arquitetura, construção e design, aplicando soluções digitais de alta precisão em projetos imobiliários. Unimos a exatidão do pixel à solidez da obra para transformar o mercado de engenharia e design."
          </p>
        </motion.div>
      </div>
    </section >
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
    <section className="py-32 relative">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-20"
        >
          <motion.p variants={fadeInUp} className="text-white/40 text-xs font-medium tracking-[0.2em] uppercase mb-4">
            Visões
          </motion.p>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-light tracking-tight text-white">
            Nosso jeito de <span className="font-normal text-white">Ver</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]"
        >
          {tools.map((tool, index) => (
            <motion.div
              key={tool.title}
              variants={fadeInUp}
              className={`group relative overflow-hidden rounded-lg border border-white/10 bg-black/20 ${index === 0 || index === 3 ? "md:col-span-2" : ""
                }`}
            >
              {/* Image Background */}
              <div className="absolute inset-0">
                <img
                  src={tool.image}
                  alt={tool.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-60 group-hover:opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 transition-all duration-500">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-3 opacity-80 group-hover:opacity-100">
                    <div className="p-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                      <tool.icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-medium text-white tracking-wide">{tool.title}</h3>
                  </div>

                  <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {tool.description}
                  </p>

                  <Button
                    variant="link"
                    className="text-white/80 hover:text-white p-0 h-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200"
                    onClick={handleClick}
                  >
                    Explorar <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
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
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={IMAGES.exterior}
          alt="Arquitetura"
          className="w-full h-full object-cover opacity-10 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background" />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-light tracking-tight mb-12 text-white leading-tight">
              A forma mais fácil de criar <br />
              <span className="font-normal">renderizações arquitetônicas.</span>
            </motion.h2>

            <motion.div variants={fadeInUp} className="space-y-8 mb-12">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-6 group">
                  <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
                    <benefit.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2 text-white">{benefit.title}</h3>
                    <p className="text-white/60 text-base font-light">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-lg font-medium tracking-wide"
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
              <p className="text-xs text-muted-foreground">Projetos em tempo hábil</p>
              <p className="text-lg font-semibold text-primary">Solicite orçamento</p>
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
            Descubra imagens geradas recentemente por nossa equipe
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
              className={`relative overflow-hidden rounded-xl group ${index === 0 ? "col-span-2 row-span-2" : ""
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
            Soluções sob medida para escritórios de arquitetura, construtoras, incorporadoras e corretores que precisam de volume e personalização.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={onOpenContact}
            >
              Fale conosco
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
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
        <AboutSection />
        <FAQSection />
        <CTASection onOpenContact={() => setIsContactOpen(true)} />
      </main>
      <Footer />
      <ContactFormModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
