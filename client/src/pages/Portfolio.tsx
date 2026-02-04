import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Link } from "wouter";

/**
 * Portfolio Page - Galeria de Projetos da Pixel Obra
 * Design: Glass Morphism Arquitetônico com tema escuro
 */

// Imagens do portfólio (usando as imagens já geradas)
const PORTFOLIO_IMAGES = {
  hero: "https://private-us-east-1.manuscdn.com/sessionFile/1vpb164jWrNm8CzTseVWP3/sandbox/rtqOEo9M616C0W1htn4O9z-img-1_1770149361000_na1fn_cGl4ZWwtb2JyYS1oZXJv.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvMXZwYjE2NGpXck5tOEN6VHNlVldQMy9zYW5kYm94L3J0cU9FbzlNNjE2QzBXMWh0bjRPOXotaW1nLTFfMTc3MDE0OTM2MTAwMF9uYTFmbl9jR2w0Wld3dGIySnlZUzFvWlhKdi5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=JSfFUUWkQqYSN8HNEhCgAF9zFjlwCCyvh~8yqreP0jEwd2ISnAwLx716gYkes3kJ32EZVTKJiciUZzGuwmRvm619hiF~29RMiLxBgnH~7UgdSmylx49qvIjeNLUfMG4fylxRvwb1zGgLhqQ~wvtPoHsZ4vM9tLnv1TxTr0D2lM1I-bHTSE9yDTMFnf4hxM4TAAhzDty5-k~jjwlqgFM8TwIzb6AJIhTjaKvtxk-n8Z5S~o8Xp1TrO8WnAnTRgswYSCiw9uj2gMRdtfqnJi-jkmLWvsP6Pz0YYdh4ScKBru~jwJxkBwFltEf-sXM-HKFQckzGY1b~~EITwb9vZqzUlw__",
  render: "https://private-us-east-1.manuscdn.com/sessionFile/1vpb164jWrNm8CzTseVWP3/sandbox/rtqOEo9M616C0W1htn4O9z-img-2_1770149359000_na1fn_cGl4ZWwtb2JyYS1yZW5kZXI.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvMXZwYjE2NGpXck5tOEN6VHNlVldQMy9zYW5kYm94L3J0cU9FbzlNNjE2QzBXMWh0bjRPOXotaW1nLTJfMTc3MDE0OTM1OTAwMF9uYTFmbl9jR2w0Wld3dGIySnlZUzF5Wlc1a1pYSS5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=igYIie1Mki1lfHujraWaVMuqFToZ9otNKsmX7y78EXHKaK6T7YOsuL7071S83MVW0t~aV5oXsxGo91R-MonQl6wdzQM6VWn9MZpr05jzS7HJX1lFW3snJvUiIEPtetp499vbKYJGaMy3rh4apouwdm6gtqTGHsnz~ajtgclgBd5VVXcSocD6AFo2b7BgHFWBIdySySxy~4GT6fHZs46taYy8oRC3G42rp3xSt8mChpRML0bULSCkIoyHLFMKoVreGdOmj8iftdPchntg4ywswNbqoNq1qikIm6I-ii5q~maqJdgWcsrdj0Aqm9VhpJ2-XmdxAsnUBCBqKEWSVHrrJw__",
  interior: "https://private-us-east-1.manuscdn.com/sessionFile/1vpb164jWrNm8CzTseVWP3/sandbox/rtqOEo9M616C0W1htn4O9z-img-3_1770149364000_na1fn_cGl4ZWwtb2JyYS1pbnRlcmlvcg.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvMXZwYjE2NGpXck5tOEN6VHNlVldQMy9zYW5kYm94L3J0cU9FbzlNNjE2QzBXMWh0bjRPOXotaW1nLTNfMTc3MDE0OTM2NDAwMF9uYTFmbl9jR2w0Wld3dGIySnlZUzFwYm5SbGNtbHZjZy5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=niCvEmC4ZYyUgc6zZ011KnjXDNMCzB5DRQlcpzFIYcNpD-YnYSAa1TVMiywTUEV0vL9QyNj3QTxGuFQo80ZXAnECo0XEtXauE8EY7rHkCBpBQmomY4a9KLaRDn4zsJuXu8Hp2I4M4bMhRtMfIeFNrUVoMXAUJxokb-8RMljgweMhJhan-H6itPISa3RAaatqgTAMDA~mSTkcU-jsxff8H0NToeg~E1hgdmCQG~HRUhJMY27jYmssA3i9Z4~UdwpB~LpV1ADaVAor5oUaAGmGs70oE2SeKozsbi6kbgheyNOzmuS4GFSRPx8fG5QxmqEDHcmJd4El1WbjZlzpsZnxgQ__",
  staging: "https://private-us-east-1.manuscdn.com/sessionFile/1vpb164jWrNm8CzTseVWP3/sandbox/rtqOEo9M616C0W1htn4O9z-img-4_1770149355000_na1fn_cGl4ZWwtb2JyYS1zdGFnaW5n.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvMXZwYjE2NGpXck5tOEN6VHNlVldQMy9zYW5kYm94L3J0cU9FbzlNNjE2QzBXMWh0bjRPOXotaW1nLTRfMTc3MDE0OTM1NTAwMF9uYTFmbl9jR2w0Wld3dGIySnlZUzF6ZEdGbmFXNW4uanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=f3ym95ajTuJbSSZNTgCqiWt2dbT6IYnSrdbWR7Wkxrw~9pIgCuhfhJJsNHYnbLXXtIo3w8Pu9wy4rQUraAbYPvSy1usLMYa0MlzUWen3o0VjJKXXSG25y2ARuK~I3weuECA8ANgbod-XEk9nGlSBln9T8JU62PYAUNSFeeoK50vMLkwq4crgiDruIZWL75~JQIjX-VQa1ZO1WHT9nC9gEIa0~8-AHME9G0BAt6p~C330EMOcxWUqWW7hsEam4Cvf6QJQOYvEvYDAaj6okReXBe2qWreq98jnZLUxeuKEmx3aga05-O73ZorXLbZfZ7R2urwJQ7C6Wpl9EScpodPV7Q__",
  exterior: "https://private-us-east-1.manuscdn.com/sessionFile/1vpb164jWrNm8CzTseVWP3/sandbox/rtqOEo9M616C0W1htn4O9z-img-5_1770149361000_na1fn_cGl4ZWwtb2JyYS1leHRlcmlvcg.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvMXZwYjE2NGpXck5tOEN6VHNlVldQMy9zYW5kYm94L3J0cU9FbzlNNjE2QzBXMWh0bjRPOXotaW1nLTVfMTc3MDE0OTM2MTAwMF9uYTFmbl9jR2w0Wld3dGIySnlZUzFsZUhSbGNtbHZjZy5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=GjUr0lHC-4RLhB9K1P41M5GPTthJPQyzWa3l0OZ36D0URqHpGlXu-t-ImEkEnLIilqZZVrjJIjWgtq7JjA2tcA722soHLgaZ7Mxn6N2Bl51R8fY9Z8Rnwn-LhYa4xBJsHwh-WCnjIcGFQQMCEkpVIosNzUAol9pYSGqXGfooiFnEAtXYi~z6e-m1lxLiDWedFbrzlFGI~HF6R9xofWihsDnzoWQaswvp-I3Bqdr5urMJ4NAJO2MlibtmJgJ~Yhig1mTSEbrXJdVTH2BcaV~lsgurMUDVCCQmJqCSkPPPYB6cc4VUdK4ZXCHGmbEBjIYqb3VL12jsIpTRS~1ziIH2wg__",
};

// Projetos do portfólio
const projects = [
  {
    id: 1,
    title: "Residência Moderna",
    category: "Renderização Exterior",
    description: "Projeto residencial de alto padrão com fachada em vidro e madeira. Renderização fotorrealista destacando a integração com a paisagem.",
    image: PORTFOLIO_IMAGES.hero,
    tags: ["Residencial", "Exterior", "Moderno"],
  },
  {
    id: 2,
    title: "Apartamento Conceito",
    category: "Design de Interiores",
    description: "Visualização de apartamento com conceito aberto, integrando sala, cozinha e varanda gourmet.",
    image: PORTFOLIO_IMAGES.interior,
    tags: ["Apartamento", "Interior", "Contemporâneo"],
  },
  {
    id: 3,
    title: "Villa Mediterrânea",
    category: "Renderização Exterior",
    description: "Projeto de villa com inspiração mediterrânea, piscina infinita e vista panorâmica.",
    image: PORTFOLIO_IMAGES.render,
    tags: ["Villa", "Exterior", "Luxo"],
  },
  {
    id: 4,
    title: "Loft Industrial",
    category: "Decoração Virtual",
    description: "Staging virtual de loft com estilo industrial, mobiliário contemporâneo e iluminação natural.",
    image: PORTFOLIO_IMAGES.staging,
    tags: ["Loft", "Staging", "Industrial"],
  },
  {
    id: 5,
    title: "Edifício Corporativo",
    category: "Renderização Exterior",
    description: "Fachada de edifício comercial com design sustentável e certificação LEED.",
    image: PORTFOLIO_IMAGES.exterior,
    tags: ["Comercial", "Exterior", "Sustentável"],
  },
  {
    id: 6,
    title: "Casa de Praia",
    category: "Renderização Exterior",
    description: "Residência de veraneio com arquitetura tropical, integração indoor-outdoor e materiais naturais.",
    image: PORTFOLIO_IMAGES.hero,
    tags: ["Residencial", "Praia", "Tropical"],
  },
];

// Categorias para filtro
const categories = ["Todos", "Renderização Exterior", "Design de Interiores", "Decoração Virtual"];

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

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredProjects = selectedCategory === "Todos"
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  const openLightbox = (project: typeof projects[0], index: number) => {
    setSelectedProject(project);
    setCurrentImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedProject(null);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredProjects.length);
    setSelectedProject(filteredProjects[(currentImageIndex + 1) % filteredProjects.length]);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
    setSelectedProject(filteredProjects[(currentImageIndex - 1 + filteredProjects.length) % filteredProjects.length]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4" style={glassCardStyle}>
        <div className="container flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Portfólio</h1>
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
              Nossos{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-amber-400">
                Projetos
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground mb-8"
            >
              Conheça alguns dos trabalhos realizados pela nossa equipe. Cada projeto é único e desenvolvido com atenção aos detalhes para superar as expectativas dos nossos clientes.
            </motion.p>
          </motion.div>

          {/* Filtros */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "border-border text-foreground hover:bg-primary/10"
                }
              >
                {category}
              </Button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-24 px-6">
        <div className="container">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
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
                      <p className="text-primary text-sm font-medium mb-1">{project.category}</p>
                      <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/80"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6" style={{ background: "rgba(0, 0, 0, 0.3)" }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Quer ver seu projeto aqui?
            </h3>
            <p className="text-muted-foreground mb-8">
              Entre em contato conosco e transforme suas ideias em visualizações impressionantes.
            </p>
            <Link href="/">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Solicite seu Orçamento
                <ExternalLink className="ml-2 w-5 h-5" />
              </Button>
            </Link>
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
              onClick={(e) => e.stopPropagation()}
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
              <div className="rounded-2xl overflow-hidden" style={glassCardStyle}>
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
                <div className="p-6">
                  <p className="text-primary text-sm font-medium mb-1">{selectedProject.category}</p>
                  <h3 className="text-2xl font-semibold text-white mb-2">{selectedProject.title}</h3>
                  <p className="text-muted-foreground">{selectedProject.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
