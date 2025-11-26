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

// Step 5 Constants
export const AUDIT_OBJECTIVES_POPUP_TEXT = `
Gli audit si riferiscono a revisioni sistematiche delle attività di manutenzione, dei processi e della conformità agli standard stabiliti. 
Aiutano a identificare aree di miglioramento, garantire l'aderenza alle normative e migliorare le prestazioni generali della manutenzione. 
Gli audit possono anche tracciare l'affidabilità delle apparecchiature e l'efficacia della manutenzione nel tempo.
`;

export const TEMPLATE_TYPE_OPTIONS = [
  "Manutenzione preventiva",
  "Verifiche ispettive",
  "Audit normativi",
  "Controlli qualità"
];

export const TEMPLATE_INCLUSION_OPTIONS = [
  "Elenco attività",
  "Campi personalizzati",
  "Checklist",
  "Documentazione allegata",
  "Esiti (Conforme/Non conforme)"
];

export const TEMPLATE_TRIGGER_OPTIONS = [
  "Creazione manuale OdL",
  "Generazione automatica",
  "Trigger (es. su guasto)"
];

export const AUDIT_TYPE_OPTIONS = [
  "Tecnici sugli asset",
  "Documentali",
  "Operativi",
  "Sicurezza",
  "Ambientali"
];

export const AUDIT_LINK_OPTIONS = [
  "Asset specifico",
  "Processo",
  "Team",
  "Sede"
];

export const AUDIT_FREQUENCY_OPTIONS = [
  "Frequenza fissa",
  "Su richiesta",
  "A seguito di eventi"
];

// Step 6 Constants (Workflow)
export const REACTIVE_WORKFLOW_POPUP_TEXT = `
La manutenzione reattiva comprende attività come la manutenzione di emergenza, manutenzione correttiva, manutenzione a guasto, manutenzione per la risoluzione dei problemi.
`;

export const PROACTIVE_WORKFLOW_POPUP_TEXT = `
La manutenzione proattiva consente la pianificazione delle attività di manutenzione preventiva, con la possibilità di assegnare Ordini di Lavoro, allegare documenti, creare liste di materiali e checklist. 
È possibile schedulare le attività e generare automaticamente manutenzioni cicliche (es. controlli semestrali) associando piani di manutenzione ad asset o criteri specifici.
`;

export const WF_OPENER_OPTIONS = ["Richiedenti", "Tecnici interni", "Utenti generici", "Clienti", "Fornitori"];
export const WF_AUTO_CREATION_OPTIONS = ["Invio Mail", "Notifiche Push", "Invio SMS"];
export const WF_REACTIVE_STATES = [
  "Apertura", "Approvazione", "Richieste preventivo", "Assegnazione", 
  "Pianificazione", "Esecuzione", "Chiusura", "In attesa", 
  "Risolto", "Completato", "Cancellato"
];
export const WF_ASSIGN_TO_OPTIONS = ["Personale interno", "Fornitori esterni"];
export const WF_CLOSURE_OPTIONS = ["Ore di lavoro", "Materiali", "Firma", "Cause", "Soluzione", "Check-list", "Beni/Servizi"];
export const WF_NOTIFICATIONS_OPTIONS = ["Apertura", "Assegnazione", "Approvazione", "Pianificazione", "Esecuzione", "Chiusura"];

export const WF_PROACTIVE_CREATION_OPTIONS = ["Caricamento massivo", "Integrazione", "Smart Assistant", "Manuale"];
export const WF_PROACTIVE_PLANNER_OPTIONS = ["Planner", "Responsabile Manutenzione"];
export const WF_PROACTIVE_PERMISSIONS_OPTIONS = ["Tecnico", "Supervisor", "Fornitore", "Amministratore"];
export const WF_PROACTIVE_STATES = [
  "Apertura", "Approvazione", "Assegnazione", "Pianificazione", 
  "Esecuzione", "Chiusura", "In attesa", "Risolto", 
  "Completato", "Cancellato", "Eseguito", "Non eseguito"
];