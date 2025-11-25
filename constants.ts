import { WizardMode } from "./types";

export const DEFAULT_COLOR = "#0056b3"; // Mainsim-ish blue
export const DOMAIN_SUFFIX = ".mainsim.cloud";
export const PLACEHOLDER_IMAGE = "https://picsum.photos/800/600";
export const ASSET_TUTORIAL_URL = "https://app.supademo.com/demo/cmhkrcrkh0029zg0j8pcq5y6e?utm_source=link";

export const ASSET_FIELDS_CONFIG = {
  "Generale": [
    "Organizzazione",
    "Categoria asset",
    "Descrizione breve",
    "Descrizione completa",
    "Classe",
    "QR-code"
  ],
  "Dettagli tecnici": [
    "Seriale",
    "Area",
    "Perimetro",
    "Quantità",
    "Unità di misura"
  ],
  "Localizzazione": [
    "Indirizzo"
  ],
  "Gestione asset": [
    "Costo iniziale",
    "Data di acquisto",
    "Tipologia di acquisto",
    "Costo di sostituzione",
    "Costo Orario downtime",
    "Fine vita",
    "Fine vita supposta",
    "Data di installazione",
    "Data di scadenza garanzia",
    "Criticità asset",
    "Punteggio di condizione"
  ]
};

export const LABEL_INFO_OPTIONS = [
  "Nome asset",
  "Codice interno",
  "Localizzazione",
  "Logo aziendale"
];

// Step 3 Constants
export const WIZARD_PROCESS_OPTIONS = [
  "Emergenze",
  "Auto-manutenzione",
  "Prenotazione stanze",
  "Cancelleria",
  "Rilascio badge",
  "Segnalazioni rapide",
  "Richiesta pulizia",
  "Richieste IT"
];

export const WIZARD_DATA_OPTIONS = [
  "Data e ora apertura",
  "Nome richiedente",
  "Organizzazione",
  "Lettura contatori",
  "Seriale asset",
  "Priorità"
];

export const WIZARD_USER_OPTIONS = [
  "Utenti finali",
  "Fornitori",
  "Referenti interni"
];

export const WIZARD_MODE_DESCRIPTIONS: Record<WizardMode, string> = {
  [WizardMode.STANDARD]: "Ideale per setup semplici. Include fino a 2 flussi di richiesta base.",
  [WizardMode.CUSTOM]: "Per esigenze specifiche. Gestisce fino a 5 flussi personalizzati.",
  [WizardMode.ADVANCED]: "Alta complessità. Fino a 10 flussi con regole dinamiche avanzate.",
  [WizardMode.MATRIX]: "Automazione totale. Routing automatico basato su matrice condizionale."
};