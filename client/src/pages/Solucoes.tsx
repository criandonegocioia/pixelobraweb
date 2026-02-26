import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    X,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
} from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n/translations";
import ContactFormModal from "@/components/ContactFormModal";
import PhoneMockup from "@/components/PhoneMockup";

/**
 * Solucoes Page - Galeria de Projetos de Soluções da Pixel Obra
 * Design: Glass Morphism Arquitetônico com tema escuro
 */

// Imagens do portfólio (usando as imagens já geradas)
const SOLUCOES_IMAGES = {
    projeto3: "/images/solucoes/construcao/projeto3.jpeg",
    ideia1: "/images/solucoes/construcao/maps.jpg",
    ideia2: "/images/solucoes/construcao/cad.jpeg",
    projeto1: "/images/solucoes/construcao/projeto1.jpg",
    projeto2: "/images/solucoes/construcao/projeto2.jpeg",
    ideia3: "/images/solucoes/construcao/foto.jpg",
    logopo: "/images/PO.jpeg",
    // Loteamento images
    ideialt1: "/images/solucoes/loteamento/ideia1.jpeg",
    ideialt2: "/images/solucoes/loteamento/ideia2.jpeg",
    ideialt3: "/images/solucoes/loteamento/ideia3.jpeg",
    projetolt1: "/images/solucoes/loteamento/projeto1.jpeg",
    projetolt2: "/images/solucoes/loteamento/projeto2.jpg",
    projetolt3: "/images/solucoes/loteamento/projeto3.jpg",
    videolote: "/images/solucoes/loteamento/videolote.mp4",
    // Corretagem images
    ideiact1: "/images/solucoes/corretagem/ideia1.jpg",
    ideiact2: "/images/solucoes/corretagem/ideia2.jpg",
    ideiact3: "/images/solucoes/corretagem/ideia3.jpg",
    projetoct1: "/images/solucoes/corretagem/projeto1.jpeg",
    projetoct2: "/images/solucoes/corretagem/projeto2.jpeg",
    projetoct3: "/images/solucoes/corretagem/projeto3.jpeg",
    videocorre: "/images/solucoes/corretagem/videocorre.mp4",
    // Arquitetura images
    idadicao: "/images/solucoes/arquitetura/ideia_adicao.jpg",
    idamplia: "/images/solucoes/arquitetura/ideia_ampliacao.jpg",
    iddecora: "/images/solucoes/arquitetura/ideia_decoracao.jpg",
    idedicao: "/images/solucoes/arquitetura/ideia_edicao.jpg",
    idhumana: "/images/solucoes/arquitetura/ideia_humanizada.jpg",
    idrender: "/images/solucoes/arquitetura/ideia_renderizacao.jpg",
    idvisual: "/images/solucoes/arquitetura/ideia_visualizacao.jpg",
    pjadicao: "/images/solucoes/arquitetura/projeto_adicao.jpg",
    pjamplia: "/images/solucoes/arquitetura/projeto_ampliacao.jpg",
    pjdecora: "/images/solucoes/arquitetura/projeto_decoracao.jpg",
    pjedicao: "/images/solucoes/arquitetura/projeto_edicao.jpg",
    pjhumana: "/images/solucoes/arquitetura/projeto_humanizada.jpg",
    pjrender: "/images/solucoes/arquitetura/projeto_renderizacao.jpg",
    pjvisual: "/images/solucoes/arquitetura/projeto_visualizacao.jpg",
};

const PROJECT_IMAGES: Record<number, string> = {
    1: SOLUCOES_IMAGES.ideia3,
    2: SOLUCOES_IMAGES.ideia2,
    3: SOLUCOES_IMAGES.ideia1,
    4: SOLUCOES_IMAGES.projeto1,
    5: SOLUCOES_IMAGES.projeto2,
    6: SOLUCOES_IMAGES.projeto3,
    7: SOLUCOES_IMAGES.logopo,
    // Loteamento ID mappings
    8: SOLUCOES_IMAGES.ideialt1,
    9: SOLUCOES_IMAGES.ideialt2,
    10: SOLUCOES_IMAGES.ideialt3,
    11: SOLUCOES_IMAGES.projetolt1,
    12: SOLUCOES_IMAGES.projetolt2,
    13: SOLUCOES_IMAGES.projetolt3,
    14: SOLUCOES_IMAGES.videolote,
    // Corretagem ID mappings
    15: SOLUCOES_IMAGES.ideiact1,
    16: SOLUCOES_IMAGES.ideiact2,
    17: SOLUCOES_IMAGES.ideiact3,
    18: SOLUCOES_IMAGES.projetoct1,
    19: SOLUCOES_IMAGES.projetoct2,
    20: SOLUCOES_IMAGES.projetoct3,
    21: SOLUCOES_IMAGES.videocorre,
    // Arquitetura ID mappings
    22: SOLUCOES_IMAGES.idadicao,
    23: SOLUCOES_IMAGES.idamplia,
    24: SOLUCOES_IMAGES.iddecora,
    25: SOLUCOES_IMAGES.idedicao,
    26: SOLUCOES_IMAGES.idhumana,
    27: SOLUCOES_IMAGES.idrender,
    28: SOLUCOES_IMAGES.idvisual,
    29: SOLUCOES_IMAGES.pjadicao,
    30: SOLUCOES_IMAGES.pjamplia,
    31: SOLUCOES_IMAGES.pjdecora,
    32: SOLUCOES_IMAGES.pjedicao,
    33: SOLUCOES_IMAGES.pjhumana,
    34: SOLUCOES_IMAGES.pjrender,
    35: SOLUCOES_IMAGES.pjvisual,
};

// Animações
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

// Estilo glass card
const glassCardStyle = {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
};

const SolutionSection = ({
    id,
    title,
    projects,
    t,
    onProjectClick,
}: {
    id?: string;
    title: string;
    projects: any[];
    t: any;
    onProjectClick: (project: any, index: number) => void;
}) => {
    // Split projects into groups
    const projectGroups = [
        projects.slice(0, 3),
        projects.slice(3, 6),
        projects.slice(6),
    ];

    const renderCard = (project: any, index: number) => (
        <motion.div
            key={project.id}
            layout
            variants={fadeInUp}
            className="group cursor-pointer"
            onClick={() => onProjectClick(project, index)}
        >
            <div
                className="relative overflow-hidden rounded-2xl"
                style={glassCardStyle}
            >
                <div className="aspect-[4/3] overflow-hidden">
                    <img
                        src={`${project.image}?v=${new Date().getTime()}`}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-primary text-xl font-bold">
                        {project.category}
                    </p>
                </div>
            </div>
        </motion.div>
    );

    return (
        <section id={id} className="pb-24 px-6 relative border-t border-white/5 pt-16">
            <div className="container">
                {/* Main Section Title */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center max-w-4xl mx-auto mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                        {title}
                    </h2>
                </motion.div>

                {/* Sub-section 1 */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center max-w-4xl mx-auto mb-12"
                >
                    <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center tracking-tight">
                        {t.section1Title}
                    </h3>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24"
                >
                    <AnimatePresence mode="popLayout">
                        {projectGroups[0].map((project, index) =>
                            renderCard(project, index)
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Sub-section 2 */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center max-w-4xl mx-auto mb-12"
                >
                    <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center tracking-tight">
                        {t.section2Title}
                    </h3>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24"
                >
                    <AnimatePresence mode="popLayout">
                        {projectGroups[1].map((project, index) =>
                            renderCard(project, 3 + index)
                        )}
                    </AnimatePresence>
                </motion.div>


            </div>
        </section>
    );
};

const ArchitectureSection = ({
    id,
    title,
    projects,
    t,
    onProjectClick,
}: {
    id?: string;
    title: string;
    projects: any[];
    t: any;
    onProjectClick: (project: any, index: number) => void;
}) => {
    // Split projects into two groups of 7
    const projectGroups = [
        projects.slice(0, 7),
        projects.slice(7, 14),
    ];

    const renderCard = (project: any, index: number) => (
        <motion.div
            key={project.id}
            layout
            variants={fadeInUp}
            className="group cursor-pointer"
            onClick={() => onProjectClick(project, index)}
        >
            <div
                className="relative overflow-hidden rounded-2xl"
                style={glassCardStyle}
            >
                <div className="aspect-[4/3] overflow-hidden">
                    <img
                        src={`${project.image}?v=${new Date().getTime()}`}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-primary text-xl font-bold">
                        {project.category}
                    </p>
                </div>
            </div>
        </motion.div>
    );

    return (
        <section id={id} className="pb-24 px-6 relative border-t border-white/5 pt-16">
            <div className="container">
                {/* Main Section Title */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center max-w-4xl mx-auto mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                        {title}
                    </h2>
                </motion.div>

                {/* Sub-section 1 */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center max-w-4xl mx-auto mb-12"
                >
                    <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center tracking-tight">
                        {t.section1Title}
                    </h3>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-24"
                >
                    <AnimatePresence mode="popLayout">
                        {projectGroups[0].map((project, index) =>
                            renderCard(project, index)
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Sub-section 2 */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center max-w-4xl mx-auto mb-12"
                >
                    <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center tracking-tight">
                        {t.section2Title}
                    </h3>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {projectGroups[1].map((project, index) =>
                            renderCard(project, 7 + index)
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

export default function Solucoes() {
    const { language } = useLanguage();
    const t = translations[language].solucoes;

    // Get projects from translations and map images to them
    const allProjects = t.projects.map(p => ({
        ...p,
        image: PROJECT_IMAGES[p.id],
    }));

    // Split projects for different sections
    // Default projects (Construção and Corretagem) are IDs 1-7
    const defaultProjects = allProjects.filter(p => p.id <= 7);

    // Loteamento projects are IDs 8-14
    const loteamentoProjects = allProjects.filter(p => p.id >= 8 && p.id <= 14);

    // Corretagem projects are IDs 15-21
    const corretagemProjects = allProjects.filter(p => p.id >= 15 && p.id <= 21);

    // Arquitetura projects are IDs 22-35
    const architectureProjects = allProjects.filter(p => p.id >= 22 && p.id <= 35);

    // Helper to get projects for lightbox navigation based on which set is active
    const getActiveProjectSet = (projectId: number) => {
        if (projectId >= 22) return architectureProjects;
        if (projectId >= 15) return corretagemProjects;
        if (projectId >= 8) return loteamentoProjects;
        return defaultProjects;
    };

    const [selectedProject, setSelectedProject] = useState<
        (typeof allProjects)[0] | null
    >(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isContactOpen, setIsContactOpen] = useState(false);

    const openLightbox = (project: (typeof allProjects)[0], index: number) => {
        setSelectedProject(project);
        setCurrentImageIndex(index);
    };

    const closeLightbox = () => {
        setSelectedProject(null);
    };

    const nextImage = () => {
        if (!selectedProject) return;
        const activeProjects = getActiveProjectSet(selectedProject.id);
        const currentIndex = activeProjects.findIndex(p => p.id === selectedProject.id);
        // If not found (shouldn't happen), default to 0
        if (currentIndex === -1) return;

        const nextIndex = (currentIndex + 1) % activeProjects.length;
        setSelectedProject(activeProjects[nextIndex]);
    };

    const prevImage = () => {
        if (!selectedProject) return;
        const activeProjects = getActiveProjectSet(selectedProject.id);
        const currentIndex = activeProjects.findIndex(p => p.id === selectedProject.id);
        // If not found (shouldn't happen), default to 0
        if (currentIndex === -1) return;

        const prevIndex = (currentIndex - 1 + activeProjects.length) % activeProjects.length;
        setSelectedProject(activeProjects[prevIndex]);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header
                className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
                style={glassCardStyle}
            >
                <div className="container flex items-center justify-between">
                    <Link href="/">
                        <Button
                            variant="ghost"
                            className="text-foreground hover:text-primary"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            {t.header.back}
                        </Button>
                    </Link>
                    <h1 className="text-xl font-semibold text-foreground">
                        {t.header.title}
                    </h1>
                    <div className="w-24" /> {/* Spacer para centralizar */}
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-6">
                <div className="container">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <motion.h2
                            variants={fadeInUp}
                            className="text-4xl md:text-5xl font-bold mb-6"
                        >
                            {t.hero.title}{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-amber-400">
                                {t.hero.titleHighlight}
                            </span>
                        </motion.h2>
                        <motion.p
                            variants={fadeInUp}
                            className="text-lg text-muted-foreground mb-8"
                        >
                            {t.hero.description}
                        </motion.p>

                        <motion.div
                            variants={fadeInUp}
                            className="flex flex-wrap justify-center gap-4 mt-8"
                        >
                            <Button
                                variant="outline"
                                onClick={() => document.getElementById("architecture")?.scrollIntoView({ behavior: "smooth" })}
                                className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                            >
                                {t.architectureTitle}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => document.getElementById("construction")?.scrollIntoView({ behavior: "smooth" })}
                                className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                            >
                                {t.constructionTitle}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => document.getElementById("brokerage")?.scrollIntoView({ behavior: "smooth" })}
                                className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                            >
                                {t.brokerageTitle}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => document.getElementById("subdivision")?.scrollIntoView({ behavior: "smooth" })}
                                className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                            >
                                {t.subdivisionTitle}
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Content Sections */}
            <div className="space-y-0">
                <SolutionSection
                    id="construction"
                    title={t.constructionTitle}
                    projects={defaultProjects}
                    t={t}
                    onProjectClick={(p) => openLightbox(p, 0)}
                />
                <SolutionSection
                    id="brokerage"
                    title={t.brokerageTitle}
                    projects={corretagemProjects}
                    t={t}
                    onProjectClick={(p) => openLightbox(p, 0)}
                />
                <SolutionSection
                    id="subdivision"
                    title={t.subdivisionTitle}
                    projects={loteamentoProjects}
                    t={t}
                    onProjectClick={(p) => openLightbox(p, 0)}
                />
                <ArchitectureSection
                    id="architecture"
                    title={t.architectureTitle}
                    projects={architectureProjects}
                    t={t}
                    onProjectClick={(p) => openLightbox(p, 0)}
                />
            </div>

            {/* CTA Section */}
            <section
                className="py-16 px-6"
                style={{ background: "rgba(0, 0, 0, 0.3)" }}
            >
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-2xl mx-auto"
                    >
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">
                            {t.cta.title}
                        </h3>
                        <p className="text-muted-foreground mb-8">{t.cta.description}</p>
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            onClick={() => setIsContactOpen(true)}
                        >
                            {t.cta.button}
                            <ExternalLink className="ml-2 w-5 h-5" />
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                        onClick={closeLightbox}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-5xl w-full"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button
                                onClick={closeLightbox}
                                className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
                            >
                                <X className="w-8 h-8" />
                            </button>

                            {/* Navigation buttons */}
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/70 transition-all z-10"
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/70 transition-all z-10"
                            >
                                <ChevronRight className="w-8 h-8" />
                            </button>

                            {/* Image */}
                            <div
                                className="rounded-2xl overflow-hidden"
                                style={glassCardStyle}
                            >
                                <img
                                    src={selectedProject.image}
                                    alt={selectedProject.title}
                                    className="w-full h-auto max-h-[70vh] object-contain"
                                />
                                <div className="p-6">
                                    <p className="text-primary text-sm font-medium mb-1">
                                        {selectedProject.category}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ContactFormModal
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
            />
        </div>
    );
}
