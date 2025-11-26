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

// Step 4 Constants
export const OBJECTIVES_POPUP_TEXT = `
• Definire chiaramente le tipologie di intervento (reattiva, programmata, su condizione, azioni correttive, audit, ecc.) e i relativi processi di gestione;
• Descrivere i workflow e le fasi operative per ciascuna tipologia di ordine di lavoro, inclusa la configurazione di campi personalizzati e regole di avanzamento;
• Garantire la corretta configurazione del sistema per supportare tutte le esigenze di gestione attività e ordini di lavoro, comprese funzionalità avanzate come clonazione moduli, scripting, pagine personalizzate e esportazioni integrate con software di terze parti;
• Stabilire criteri di priorità, automazioni e regole di escalation, per ottimizzare il coordinamento e la tempestività degli interventi;
• Assicurare l’allineamento tra il sistema e le modalità operative del cliente, facilitando così l’adozione e la continuità operativa;
• Supportare il team di sviluppo e implementazione con una guida precisa per la configurazione tecnica e funzionale del software;
• Consentire un confronto e una validazione condivisa tra tutte le parti interessate (cliente, project manager, team tecnico, utenti finali), riducendo rischi di incomprensioni e ritardi.
`;

export const CA_POPUP_TEXT = `
Le azioni correttive sono un follow-up successivo a un esito negativo di un'attività all'interno di una manutenzione periodica. 
La CA (Azione Correttiva) viene generata alla chiusura della manutenzione periodica che contiene l'attività con un esito negativo. 
Questo comportamento può essere gestito tramite un'impostazione di configurazione. 
Il cliente può decidere, tramite questa impostazione, se abilitare o meno questa funzione e se modificare il titolo della CA. 
Le CA possono seguire lo stesso flusso della manutenzione correttiva o avere un nuovo flusso e possono essere associate a campi personalizzati ed e-mail.
`;

export const REACTIVE_TYPES_OPTIONS = [
  "Guasti improvvisi", 
  "Emergenze", 
  "Manutenzioni correttive"
];

export const CONSTRAINT_TYPES_OPTIONS = [
  "Nessun vincolo",
  "Vincoli normativi",
  "Vincoli contrattuali"
];