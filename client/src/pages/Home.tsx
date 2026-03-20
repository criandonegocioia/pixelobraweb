/*
 * DESIGN SYSTEM: Architectural Glass Morphism
 * - Transparência em camadas com blur e opacidade
 * - Luz como protagonista - gradientes sutis
 * - Paleta: Azul noturno profundo (#0C1929) com acentos cyan (#00D4FF) e âmbar (#FFB800)
 * - Tipografia: Satoshi (moderna e premium)
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
  FileText,
  Building2,
} from "lucide-react";
import { useState } from "react";
import { useLocation, Link } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n/translations";

import { WhatsAppIcon, WHATSAPP_LINK } from "@/components/FloatingWhatsApp";
import ContactFormModal from "@/components/ContactFormModal";

// Logo URL - Logo com fundo transparente, Pixel em cinza claro, cores originais preservadas
const LOGO_URL = "/logo.jpg";
const INSTAGRAM_URL = "https://instagram.com/pixelobra";

// Image URLs
const IMAGES = {
  hero: "/images/back.jpg",
  render: "/images/renderizacao2.jpeg",
  visualiza: "/images/visualizacao.jpg",
  decora: "/images/decoracao.jpg",
  amplia: "https://d2xsxph8kpxj0f.cloudfront.net/310519663329410379/6BCWYzW7mGqgAm22TjZhXb/ampliacao_f3477357.jpg",
  edicao: "/images/edicao.jpg",
  adicao: "https://d2xsxph8kpxj0f.cloudfront.net/310519663329410379/6BCWYzW7mGqgAm22TjZhXb/adicao_5ad37a9e.jpg",
  humana: "/images/humanizada2.jpg",
  solucao: "/images/loteamento.jpg",
  render1: "/images/renderizacao.jpg",
  render2: "/images/humanizada.jpg",
  solucao1: "/images/loteamento2.jpg",
  solucao2: "/images/decoracao2.jpg",
  construcao: "https://d2xsxph8kpxj0f.cloudfront.net/310519663329410379/6BCWYzW7mGqgAm22TjZhXb/construcao_13644373.jpg",
  visualiza2: "/images/visualizacao2.jpg",
  visualiza3: "/images/visualizacao3.jpg",
  animacao: "/images/animacao.jpg",
};

// Languages
const languages = [
  { code: "PT", name: "Português" },
  { code: "EN", name: "English" },
];

// Featured generations
const featuredImages = [
  IMAGES.hero,
  IMAGES.render,
  IMAGES.visualiza,
  IMAGES.decora,
  IMAGES.amplia,
  IMAGES.edicao,
  IMAGES.adicao,
  IMAGES.humana,
  IMAGES.solucao,
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
  boxShadow:
    "0 4px 24px -1px rgba(0, 0, 0, 0.2), inset 0 0 1px 0 rgba(255, 255, 255, 0.1)",
};

// Logo Component - Apenas o símbolo (a logo já contém o nome)
function Logo({ className = "h-10" }: { className?: string }) {
  return (
    <img
      src={LOGO_URL}
      alt="Pixel Obra"
      className={`${className} w-auto object-contain`}
      fetchPriority="high"
      decoding="async"
      style={{
        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
        maxHeight: "48px",
      }}
    />
  );
}

// Language Selector Component
function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (code: Language) => {
    setLanguage(code);
    const langName = languages.find(l => l.code === code)?.name;
    const message =
      code === "EN"
        ? `Language changed to ${langName}`
        : `Idioma alterado para ${langName}`;
    toast(message);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <Globe className="w-4 h-4" />
          <span className="font-medium">{language}</span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-background/95 backdrop-blur-xl border-white/10 min-w-[120px]"
      >
        {languages.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code as Language)}
            className={`cursor-pointer ${language === lang.code ? "bg-primary/20 text-primary" : ""}`}
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
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const t = translations[language].nav;

  const handleNavClick = () => {
    toast("Funcionalidade em breve");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-b border-white/5" />
      <nav className="container relative flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center group hover:opacity-90 transition-opacity"
        >
          <Logo className="h-10 md:h-12" />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/solucoes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t.solutions}
          </Link>
          <a
            href="/portfolio"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.portfolio}
          </a>
          <a
            href="#sobre-nos"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.about}
          </a>

        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSelector />
          <Button variant="ghost" size="sm" onClick={() => setLocation("/login")}>
            {t.login}
          </Button>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={onOpenContact}
          >
            {translations[language].hero.cta}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
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
            <Link href="/solucoes" className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors block">
              {t.solutions}
            </Link>
            <a
              href="/portfolio"
              className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.portfolio}
            </a>
            <a
              href="#sobre-nos"
              className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.about}
            </a>

            <div className="py-2">
              <LanguageSelector />
            </div>
            <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => setLocation("/login")}
              >
                {t.login}
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={onOpenContact}
              >
                {translations[language].hero.cta}
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
  const { language } = useLanguage();
  const t = translations[language].hero;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          className="w-full h-full"
        >
          <img
            src={IMAGES.hero}
            alt="Arquitetura moderna"
            className="w-full h-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
        </motion.div>
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
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            style={{ fontSize: "51px" }}
          >
            {t.title}{" "}
            {t.subtitle}
          </h1>

          <motion.div variants={fadeInUp}>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg relative overflow-hidden"
              onClick={onOpenContact}
            >
              {t.cta}
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

// About Section
function AboutSection() {
  const { language } = useLanguage();
  const t = translations[language].about;

  return (
    <section
      id="sobre-nos"
      className="py-24 md:py-32 relative overflow-hidden bg-muted/20"
    >
      <div className="container relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            {t.title}{" "}
            {t.highlight}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {t.description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Tools Section
function ToolsSection() {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const t = translations[language].tools;

  // Tools data needs to be inside or memoized to use 't'
  const toolsList = [
    {
      id: "render",
      icon: Sparkles,
      title: t.items.render.title,
      description: t.items.render.description,
      image: IMAGES.render,
    },
    {
      id: "visualization",
      icon: Image,
      title: t.items.visualization.title,
      description: t.items.visualization.description,
      image: IMAGES.visualiza,
    },
    {
      id: "decoration",
      icon: Sofa,
      title: t.items.decoration.title,
      description: t.items.decoration.description,
      image: IMAGES.decora,
    },
    {
      id: "amplification",
      icon: ZoomIn,
      title: t.items.amplification.title,
      description: t.items.amplification.description,
      image: IMAGES.amplia,
    },
    {
      id: "edition",
      icon: Pencil,
      title: t.items.edition.title,
      description: t.items.edition.description,
      image: IMAGES.edicao,
    },
    {
      id: "addObjects",
      icon: Users,
      title: t.items.addObjects.title,
      description: t.items.addObjects.description,
      image: IMAGES.adicao,
    },
    {
      id: "animation",
      icon: Video,
      title: t.items.animation.title,
      description: t.items.animation.description,
      image: IMAGES.animacao,
    },
    {
      id: "solutions",
      icon: Building2,
      title: t.items.solutions.title,
      description: t.items.solutions.description,
      image: IMAGES.solucao,
    },
    {
      id: "humanized",
      icon: FileText,
      title: t.items.humanized.title,
      description: t.items.humanized.description,
      image: IMAGES.humana,
    },
  ];

  const handleClick = (id?: string) => {
    switch (id) {
      case "render":
        setLocation("/renderiza");
        break;
      case "visualization":
        setLocation("/visualiza");
        break;
      case "decoration":
        setLocation("/decora");
        break;
      case "amplification":
        setLocation("/amplia");
        break;
      case "edition":
        setLocation("/edita");
        break;
      case "addObjects":
        setLocation("/adiciona");
        break;
      case "animation":
        setLocation("/anima");
        break;
      case "solutions":
        setLocation("/solucoes");
        break;
      case "humanized":
        setLocation("/humanizada");
        break;
      default:
        toast("Funcionalidade em breve");
    }
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
          <motion.p
            variants={fadeInUp}
            className="text-primary text-sm font-medium tracking-wider uppercase mb-4"
          >
            {t.sectionTitle}
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-bold tracking-tight"
          >
            {t.mainTitle}
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {toolsList.map(tool => (
            <motion.div
              key={tool.id}
              variants={fadeInUp}
              className="group overflow-hidden transition-all duration-300 hover:border-white/20"
              style={glassCardStyle}
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={tool.image}
                  alt={tool.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
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
                  onClick={() => handleClick(tool.id)}
                >
                  {t.action}
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
  const { language } = useLanguage();
  const t = translations[language].benefits;
  const toolsT = translations[language].tools;

  const benefitsList = [
    {
      icon: Zap,
      title: t.items.fast.title,
      description: t.items.fast.description,
    },
    {
      icon: RefreshCw,
      title: t.items.agile.title,
      description: t.items.agile.description,
    },
    {
      icon: MousePointer,
      title: t.items.integrated.title,
      description: t.items.integrated.description,
    },
  ];

  const ctaT = translations[language].hero;

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={IMAGES.amplia}
          alt="Arquitetura"
          className="w-full h-full object-cover opacity-20"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background" />
      </div>

      <div className="container relative">
        <div className="flex flex-col gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
            >
              {t.title}{" "}
              {t.highlight}
            </motion.h2>

            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {benefitsList.map(benefit => (
                <div key={benefit.title} className="flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {benefit.description}
                    </p>
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
                {ctaT.cta}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto"
          >
            <div className="p-2 rounded-xl h-full" style={glassCardStyle}>
              <img
                src={IMAGES.render1}
                alt={toolsT.items.render.title}
                className="w-full h-auto rounded-lg"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="p-2 rounded-xl h-full" style={glassCardStyle}>
              <img
                src={IMAGES.render2}
                alt={toolsT.items.humanized.title}
                className="w-full h-auto rounded-lg"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="p-2 rounded-xl h-full" style={glassCardStyle}>
              <img
                src={IMAGES.solucao1}
                alt={toolsT.items.solutions.title}
                className="w-full h-auto rounded-lg"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="p-2 rounded-xl h-full" style={glassCardStyle}>
              <img
                src={IMAGES.solucao2}
                alt={toolsT.items.decoration.title}
                className="w-full h-auto rounded-lg"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="p-2 rounded-xl h-full" style={glassCardStyle}>
              <img
                src={IMAGES.construcao}
                alt={toolsT.items.construction.title}
                className="w-full h-auto rounded-lg"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="p-2 rounded-xl h-full" style={glassCardStyle}>
              <img
                src={IMAGES.visualiza2}
                alt={toolsT.items.visualization.title}
                className="w-full h-auto rounded-lg"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="p-2 rounded-xl h-full" style={glassCardStyle}>
              <img
                src={IMAGES.visualiza3}
                alt={toolsT.items.visualization.title}
                className="w-full h-auto rounded-lg"
                loading="lazy"
                decoding="async"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Featured Section
function FeaturedSection() {
  const { language } = useLanguage();
  const t = translations[language].featured;

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
          <motion.p
            variants={fadeInUp}
            className="text-primary text-sm font-medium tracking-wider uppercase mb-4"
          >
            {t.sectionTitle}
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            {t.title}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            {t.description}
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
  const { language } = useLanguage();
  const t = translations[language].faq;

  const faqsList = [t.q1, t.q2, t.q3, t.q4, t.q5, t.q6];

  return (
    <section id="faq" className="py-24 md:py-32 bg-muted/30">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p
            variants={fadeInUp}
            className="text-primary text-sm font-medium tracking-wider uppercase mb-4"
          >
            {t.sectionTitle}
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-bold tracking-tight"
          >
            {t.title}
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
            {faqsList.map((faq, index) => (
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
  const { language } = useLanguage();
  const t = translations[language].cta;

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={IMAGES.visualiza}
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
          <motion.p
            variants={fadeInUp}
            className="text-primary text-sm font-medium tracking-wider uppercase mb-4"
          >
            {t.label}
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="text-2xl md:text-4xl font-bold tracking-tight mb-4"
          >
            {t.title}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            {t.description}
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={onOpenContact}
            >
              {t.button}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Footer Component
function Footer({ onOpenContact }: { onOpenContact?: () => void }) {
  const { language } = useLanguage();
  const t = translations[language].footer;

  const handleClick = () => {
    toast("Funcionalidade em breve");
  };

  return (
    <footer className="py-16 border-t border-white/5">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a
              href="/"
              className="flex items-center mb-4 hover:opacity-90 transition-opacity"
            >
              <Logo className="h-10" />
            </a>
            <p className="text-sm text-muted-foreground">{t.description}</p>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">{t.resources}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/solucoes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t.links.solutions}
                </Link>
              </li>
              <li>
                <a
                  href="/portfolio"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t.links.portfolio}
                </a>
              </li>

              <li>
                <a
                  href="#faq"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t.links.faq}
                </a>
              </li>

            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">{t.company}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/aviso-legal" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t.links.legal}
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidade" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t.links.privacy}
                </Link>
              </li>
              <li>
                <Link href="/termos-de-servico" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t.links.terms}
                </Link>
              </li>
              <li>
                <Link href="/politica-de-cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t.links.cookies}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">{t.support}</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenContact || handleClick}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t.links.help}
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
            © {new Date().getFullYear()} Pixel Obra. {t.rights}
          </p>
          <div className="flex items-center gap-4">
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
      <Footer onOpenContact={() => setIsContactOpen(true)} />
      <ContactFormModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
