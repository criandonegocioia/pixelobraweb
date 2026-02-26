import { useState } from "react";
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
 * Amplia Page
 * Design: Glass Morphism Arquitetônico com tema escuro
 */

// Imagens do portfólio (usando as imagens já geradas)
const IMAGES = {
    ideia1: "https://d2xsxph8kpxj0f.cloudfront.net/310519663329410379/6BCWYzW7mGqgAm22TjZhXb/ideia1_e13b74d4.jpg",
    ideia2: "/images/ampliacao/ideia2.jpg",
    ideia3: "https://d2xsxph8kpxj0f.cloudfront.net/310519663329410379/6BCWYzW7mGqgAm22TjZhXb/ideia3_ebf313bf.jpg",
    projeto1: "/images/ampliacao/projeto1.jpg",
    projeto2: "https://d2xsxph8kpxj0f.cloudfront.net/310519663329410379/6BCWYzW7mGqgAm22TjZhXb/projeto2_29641a66.jpg",
    projeto3: "/images/ampliacao/projeto3.jpg",
};

const PROJECT_IMAGES: Record<number, string> = {
    1: IMAGES.ideia1,
    2: IMAGES.ideia2,
    3: IMAGES.ideia3,
    4: IMAGES.projeto1,
    5: IMAGES.projeto2,
    6: IMAGES.projeto3,
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

export default function Amplia() {
    const { language } = useLanguage();
    const t = translations[language].amplia; // Using amplia key

    // Get projects from translations and map images to them
    const projects = t.projects.map((p: any) => ({
        ...p,
        image: PROJECT_IMAGES[p.id],
    }));

    const [selectedProject, setSelectedProject] = useState<
        (typeof projects)[0] | null
    >(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isContactOpen, setIsContactOpen] = useState(false);

    // Show all projects since filters are removed
    const filteredProjects = projects;

    // Split projects into groups
    const group1 = filteredProjects.slice(0, 3);
    const group2 = filteredProjects.slice(3, 6);
    const group3 = filteredProjects.slice(6, 7);

    const renderProjectCard = (project: typeof projects[0], index: number) => (
        <motion.div
            key={project.id}
            layout
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group cursor-pointer"
            onClick={() => openLightbox(project, index)}
        >
            <div
                className="relative overflow-hidden rounded-2xl"
                style={glassCardStyle}
            >
                <div className="aspect-[4/3] overflow-hidden">
                    <img
                        src={project.image}
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

    const openLightbox = (project: (typeof projects)[0], index: number) => {
        setSelectedProject(project);
        setCurrentImageIndex(index);
    };

    const closeLightbox = () => {
        setSelectedProject(null);
    };

    const nextImage = () => {
        setCurrentImageIndex(prev => (prev + 1) % filteredProjects.length);
        setSelectedProject(
            filteredProjects[(currentImageIndex + 1) % filteredProjects.length]
        );
    };

    const prevImage = () => {
        setCurrentImageIndex(
            prev => (prev - 1 + filteredProjects.length) % filteredProjects.length
        );
        setSelectedProject(
            filteredProjects[
            (currentImageIndex - 1 + filteredProjects.length) %
            filteredProjects.length
            ]
        );
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
                    </motion.div>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="pb-24 px-6">
                <div className="container">
                    {/* First Group of 3 */}
                    <div className="mb-16">
                        <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center tracking-tight">
                            {t.section1Title}
                        </h3>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            <AnimatePresence mode="popLayout">
                                {group1.map((project, index) => renderProjectCard(project, index))}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Second Group of 3 */}
                    {group2.length > 0 && (
                        <div className="mb-16">
                            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-center tracking-tight">
                                {t.section2Title}
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-2xl mx-auto text-center mb-8">
                                {t.section2Disclaimer}
                            </p>
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={staggerContainer}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                <AnimatePresence mode="popLayout">
                                    {group2.map((project, index) => renderProjectCard(project, index + 3))}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    )}


                </div>
            </section>

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
