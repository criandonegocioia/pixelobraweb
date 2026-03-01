import { Button } from "@/components/ui/button";
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
import { Send, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n/translations";

import { WhatsAppIcon } from "@/components/FloatingWhatsApp";

const LOGO_URL = "/logo.jpg";

function Logo({ className = "h-10" }: { className?: string }) {
  return (
    <img
      src={LOGO_URL}
      alt="Pixel Obra"
      className={`${className} w-auto object-contain`}
      style={{
        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
        maxHeight: "48px",
      }}
    />
  );
}

export default function ContactFormModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { language } = useLanguage();
  const t = translations[language].contact;

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
    onSuccess: data => {
      if (data.success) {
        setIsSuccess(true);
        toast(t.successTitle, {
          description: t.successDesc,
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
        toast.error(t.errors.generic, {
          description: data.message,
        });
      }
    },
    onError: error => {
      console.error("Erro no envio:", error);
      toast.error(t.errors.generic, {
        description: error.message || t.errors.submitError,
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
            {t.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t.description}
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
              <h3 className="text-xl font-semibold mb-2">{t.successTitle}</h3>
              <p className="text-muted-foreground">{t.successDesc}</p>
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
                <Label htmlFor="nome">{t.fields.name} *</Label>
                <Input
                  id="nome"
                  placeholder={t.placeholders.name}
                  value={formData.nome}
                  onChange={e =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  required
                  className="bg-white/5 border-white/10 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpfCnpj">{t.fields.cpfCpfj} *</Label>
                <Input
                  id="cpfCnpj"
                  placeholder={t.placeholders.cpfCnpj}
                  value={formData.cpfCnpj}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      cpfCnpj: formatCpfCnpj(e.target.value),
                    })
                  }
                  required
                  className="bg-white/5 border-white/10 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t.fields.email} *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.placeholders.email}
                  value={formData.email}
                  onChange={e =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="bg-white/5 border-white/10 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone" className="flex items-center gap-2">
                  <WhatsAppIcon className="w-4 h-4 text-green-500" />
                  {t.fields.phone} *
                </Label>
                <Input
                  id="telefone"
                  placeholder={t.placeholders.phone}
                  value={formData.telefone}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      telefone: formatPhone(e.target.value),
                    })
                  }
                  required
                  className="bg-white/5 border-white/10 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">{t.fields.description} *</Label>
                <Textarea
                  id="descricao"
                  placeholder={t.placeholders.description}
                  value={formData.descricao}
                  onChange={e =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
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
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                    />
                    {t.sending}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {t.submit}
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
