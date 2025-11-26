import { GoogleGenAI } from "@google/genai";
import { OnboardingData } from "../types";

const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export const generateImplementationBrief = async (data: OnboardingData): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key not found, skipping AI generation.");
    return "Riepilogo automatico non disponibile (API Key mancante).";
  }

  const prompt = `
    Sei un Project Manager esperto per mainsim, un software CMMS.
    Analizza i seguenti dati di configurazione forniti da un cliente/fornitore per una nuova istanza.
    
    SEZIONE 1: CONFIGURAZIONE ISTANZA
    - Nome Istanza: ${data.instanceName}
    - Colore Brand: ${data.brandColor}
    - Logo: ${data.brandLogoName ? 'Presente' : 'Assente'}
    - Autenticazione: ${data.authMode}
    - Restrizioni: ${data.restrictionType} ${data.restrictionDetails ? `(${data.restrictionDetails})` : ''}
    - Requisiti Tecnici IT: ${data.technicalRequirements}

    SEZIONE 2: STRATEGIA ASSET
    - Formato Dati: ${data.assetDataFormat} ${data.assetDataFormatOther ? `(${data.assetDataFormatOther})` : ''}
    - Integrazione: ${data.isMassUpload === 'No' ? 'Integrazione continua' : 'Caricamento massivo unico'}
    - Campi Obbligatori Richiesti: ${data.selectedAssetFields.join(', ')}
    - Responsabile Dati: ${data.assetMaintainer} (${data.assetMaintainerRole})
    - Audit/Workflow: Audit Log: ${data.hasAuditLog}, Approvazione: ${data.hasApprovalFlow}
    - Tagging: ${data.qrCodeGoal}, Standard: ${data.taggingStandard}

    SEZIONE 3: WIZARD & SMART GUIDE
    - Modalità Scelta: ${data.wizardMode}
    - Processi Chiave: ${data.wizardProcesses.join(', ')}
    - Utenti: ${data.wizardUsers.join(', ')}
    - Automazione: Assegnazione Auto (${data.wizardAutoAssignment}), Approvazione (${data.wizardHasApproval})

    SEZIONE 4: EVENTI E MANUTENZIONE
    - Reattiva: ${data.reactiveTypes.join(', ')} (Scope: ${data.reactiveScope})
    - Proattiva: Vincoli (${data.proactiveConstraints.join(', ')}). Moduli attivi: Costi (${data.enableCostReporting}), Materiali (${data.enableMaterialConsumption}).
    - Azioni Correttive: Automazione (${data.caEnableAutomation}), Workflow (${data.caWorkflow}).

    SEZIONE 5: TEMPLATE & AUDIT
    - Template: Tipologie (${data.templateTypes.join(', ')}). Includono: ${data.templateInclusions.join(', ')}.
    - Importazione Template: ${data.importExistingModels}.
    - Audit: Tipologie (${data.auditTypes.join(', ')}). Frequenza: ${data.auditFrequency.join(', ')}.

    SEZIONE 6: WORKFLOW DESIGN
    - Reattiva: Fasi (${data.wfReactivePhases.join(' -> ')}). Assegnazione: ${data.wfReactiveAssignmentType}.
    - Proattiva: Fasi (${data.wfProactivePhases.join(' -> ')}). Pianificazione: ${data.wfProactivePlanners.join(', ')}.

    Genera un breve paragrafo professionale (massimo 250 parole) in Italiano intitolato "Brief di Implementazione".
    
    Obiettivi del testo:
    1. Valutare la complessità del deploy.
    2. Evidenziare criticità tecniche (es. SSO, integrazioni API).
    3. Commentare la maturità della gestione asset.
    4. Analizzare la strategia di richiesta (Wizard) e Manutenzione.
    5. Fornire un parere sulla strutturazione dei controlli qualità (Audit) e Workflow operativi.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Impossibile generare il riepilogo.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Errore nella generazione del riepilogo AI.";
  }
};