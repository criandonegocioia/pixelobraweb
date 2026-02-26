import { translations } from "./client/src/lib/i18n/translations";
import fs from "fs";
import path from "path";

const PORTFOLIO_IMAGES = {
  hero: "/images/back.jpg",
  render: "/images/renderizacao.jpeg",
  interior: "/images/visualizacao.jpg",
  staging: "/images/decoracao.jpg",
  exterior: "/images/ampliacao.jpg",
  edicao: "/images/edicao.jpg",
  adicao: "/images/adicao.jpg",
};

const PROJECT_IMAGES = {
  1: PORTFOLIO_IMAGES.edicao,
  2: PORTFOLIO_IMAGES.interior,
  3: PORTFOLIO_IMAGES.render,
  4: PORTFOLIO_IMAGES.staging,
  5: PORTFOLIO_IMAGES.exterior,
  6: PORTFOLIO_IMAGES.hero,
  7: PORTFOLIO_IMAGES.adicao,
};

const logFile = path.join(process.cwd(), "test_output.txt");
try {
  fs.writeFileSync(logFile, ""); // Clear file
} catch (e) {
  console.error("Could not write to log file, printing to console only");
}

function log(message: string) {
  try {
    fs.appendFileSync(logFile, message + "\n");
  } catch (e) {
    // ignore
  }
  console.log(message);
}

function checkMapping(lang: "PT" | "EN") {
  log(`Checking ${lang}...`);
  const t = translations[lang]?.portfolio;
  if (!t) {
    log("Error: Missing portfolio translations");
    return;
  }

  if (!t.projects) {
    log("Error: Missing projects array");
    return;
  }

  t.projects.forEach(p => {
    // @ts-ignore
    const img = PROJECT_IMAGES[p.id];
    if (!img) {
      log(`Error: No image mapped for Project ID ${p.id} (${p.title})`);
    } else {
      log(`ID: ${p.id}, Title: "${p.title}", Image: ${img}`);
    }
  });
  log("---");
}

try {
  checkMapping("PT");
  checkMapping("EN");
  log("Check complete.");
} catch (e) {
  log(`Fatal Error: ${e}`);
}
