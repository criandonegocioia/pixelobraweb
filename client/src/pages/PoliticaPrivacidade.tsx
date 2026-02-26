import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n/translations";

const glassCardStyle = {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
};

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function PoliticaPrivacidade() {
    const { language } = useLanguage();
    // @ts-ignore
    const t = translations[language].politicaPrivacidade;
    const c = t.content;

    return (
        <div className="min-h-screen bg-background">
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4" style={glassCardStyle}>
                <div className="container flex items-center justify-between">
                    <Link href="/">
                        <Button variant="ghost" className="text-foreground hover:text-primary">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            {translations[language].portfolio.header.back}
                        </Button>
                    </Link>
                    <h1 className="text-xl font-semibold text-foreground">{t.title}</h1>
                    <div className="w-24" />
                </div>
            </header>

            <section className="pt-32 pb-16 px-6">
                <div className="container">
                    <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-4xl mx-auto rounded-2xl p-8 md:p-12 text-muted-foreground leading-relaxed" style={glassCardStyle}>
                        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-foreground uppercase">{t.title}</h2>
                        <div className="space-y-6 text-lg">
                            <p>{c.p1}</p>
                            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">{c.h1}</h3>
                            <p>{c.p2}</p>
                            <ul className="list-disc pl-6 space-y-2">
                                {c.l1.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
                            </ul>
                            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">{c.h2}</h3>
                            <p>{c.p3}</p>
                            <ul className="list-disc pl-6 space-y-2">
                                {c.l2.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
                            </ul>
                            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">{c.h3}</h3>
                            <p>{c.p4}</p>
                            <ul className="list-disc pl-6 space-y-2">
                                {c.l3.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
                            </ul>
                            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">{c.h4}</h3>
                            <p>{c.p5}</p>
                            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">{c.h5}</h3>
                            <p>{c.p6}</p>
                            <ul className="list-disc pl-6 space-y-2 pb-4">
                                {c.l4.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
                            </ul>
                            <p>{c.p7}</p>
                            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">{c.h6}</h3>
                            <p>{c.p8}</p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
