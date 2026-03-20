import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Renderiza from "./pages/Renderiza";
import Visualiza from "./pages/Visualiza";
import Decora from "./pages/Decora";
import Amplia from "./pages/Amplia";
import Edita from "./pages/Edita";
import Adiciona from "./pages/Adiciona";
import Anima from "./pages/Anima";
import Solucoes from "./pages/Solucoes";
import Humanizada from "./pages/Humanizada";
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";
import ComponentsShowcase from "./pages/ComponentShowcase";
import { LanguageProvider } from "./contexts/LanguageContext";
import AvisoLegal from "./pages/AvisoLegal";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import TermosServico from "./pages/TermosServico";
import PoliticaCookies from "./pages/PoliticaCookies";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/portfolio"} component={Portfolio} />
      <Route path={"/renderiza"} component={Renderiza} />
      <Route path={"/visualiza"} component={Visualiza} />
      <Route path={"/decora"} component={Decora} />
      <Route path={"/amplia"} component={Amplia} />
      <Route path={"/edita"} component={Edita} />
      <Route path={"/adiciona"} component={Adiciona} />
      <Route path={"/anima"} component={Anima} />
      <Route path={"/solucoes"} component={Solucoes} />
      <Route path={"/humanizada"} component={Humanizada} />
      <Route path={"/showcase"} component={ComponentsShowcase} />
      <Route path={"/aviso-legal"} component={AvisoLegal} />
      <Route path={"/politica-privacidade"} component={PoliticaPrivacidade} />
      <Route path={"/termos-de-servico"} component={TermosServico} />
      <Route path={"/politica-de-cookies"} component={PoliticaCookies} />
      <Route path={"/login"} component={Login} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <Toaster />
            <Router />
            <FloatingWhatsApp />
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
