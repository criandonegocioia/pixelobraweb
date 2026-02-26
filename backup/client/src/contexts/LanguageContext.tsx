import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "PT" | "EN";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string; // Helper simple para traducoes diretas se necessario
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("PT");

    // Opcional: Persistir escolha no localStorage
    useEffect(() => {
        const savedLang = localStorage.getItem("pixelobra_lang");
        if (savedLang === "PT" || savedLang === "EN") {
            setLanguage(savedLang);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("pixelobra_lang", lang);
    };

    const t = (key: string) => {
        return key; // Placeholder para futura implementação de i18n complexa se precisar
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
