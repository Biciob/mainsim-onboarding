import * as XLSX from 'xlsx';
import { OnboardingData } from '../types';

export const generateAndDownloadExcel = (data: OnboardingData, aiSummary: string) => {
  // 1. Prepare data structure for Excel
  const rowData = [
    // --- STEP 1 ---
    { "Sezione": "Istanza", "Campo": "Nome Istanza Desiderato", "Valore": data.instanceName, "Note": "Deve terminare con .mainsim.cloud" },
    { "Sezione": "Istanza", "Campo": "Colore Interfaccia (Hex)", "Valore": data.brandColor, "Note": "Colore primario login" },
    { "Sezione": "Istanza", "Campo": "Logo Brand", "Valore": data.brandLogoName || "Non caricato", "Note": data.brandLogo ? "File incluso nei metadati" : "" },
    { "Sezione": "Sicurezza", "Campo": "Modalità Autenticazione", "Valore": data.authMode, "Note": "" },
    { "Sezione": "Sicurezza", "Campo": "Restrizioni Accesso", "Valore": data.restrictionType, "Note": data.restrictionDetails || "N/A" },
    { "Sezione": "IT", "Campo": "Requisiti Tecnici", "Valore": data.technicalRequirements, "Note": "" },

    // --- STEP 2: ASSET ENTRY ---
    { "Sezione": "Asset Data", "Campo": "Formato Anagrafica", "Valore": data.assetDataFormat, "Note": data.assetDataFormatOther },
    { "Sezione": "Asset Data", "Campo": "Caricamento Massivo vs Integrazione", "Valore": data.isMassUpload === 'Si' ? "Caricamento Massivo" : "Integrazione Continua", "Note": "" },
    { "Sezione": "Asset Data", "Campo": "Livello Dettaglio", "Valore": data.assetDetailLevel, "Note": "" },
    { "Sezione": "Asset Data", "Campo": "Uso Categorie Default", "Valore": data.useDefaultCategories, "Note": "" },
    { "Sezione": "Asset Data", "Campo": "Campi Obbligatori Selezionati", "Valore": data.selectedAssetFields.join(', '), "Note": "Campi richiesti per ogni asset" },
    { "Sezione": "Asset Data", "Campo": "Attributi Personalizzati", "Valore": data.customAttributes, "Note": "" },
    { "Sezione": "Asset Governance", "Campo": "Responsabile Manutenzione Dati", "Valore": data.assetMaintainer, "Note": `Ruolo: ${data.assetMaintainerRole}` },
    { "Sezione": "Asset Governance", "Campo": "Segnalazione Modifiche", "Valore": data.changeNotificationProcess, "Note": "" },
    { "Sezione": "Asset Governance", "Campo": "Validazione Interna", "Valore": data.hasValidationProcess, "Note": "" },
    { "Sezione": "Asset Governance", "Campo": "Flusso Approvativo", "Valore": data.hasApprovalFlow, "Note": data.approvalFlowDetails },
    { "Sezione": "Asset Governance", "Campo": "Audit Log", "Valore": data.hasAuditLog, "Note": "" },

    // --- STEP 2: WORKFLOW ---
    { "Sezione": "Asset Workflow", "Campo": "Uso 4 Stati Standard", "Valore": data.useStandardStates, "Note": data.standardStatesDetails || "Standard In Service/Not In Service..." },
    { "Sezione": "Asset Workflow", "Campo": "Impatto Stati su Moduli", "Valore": data.statusImpact, "Note": data.statusImpactDetails },

    // --- STEP 2: TAGGING ---
    { "Sezione": "Asset Tagging", "Campo": "Obiettivo QR/Barcode", "Valore": data.qrCodeGoal, "Note": "" },
    { "Sezione": "Asset Tagging", "Campo": "Etichettatura Esistente", "Valore": data.assetsAlreadyLabeled, "Note": "" },
    { "Sezione": "Asset Tagging", "Campo": "Standard Utilizzato", "Valore": data.taggingStandard, "Note": "" },
    { "Sezione": "Asset Tagging", "Campo": "Info su Etichetta", "Valore": data.labelInfo.join(', '), "Note": "" },

    // --- STEP 3: WIZARD ---
    { "Sezione": "Wizard Smart Guide", "Campo": "Modalità Scelta", "Valore": data.wizardMode, "Note": "" },
    { "Sezione": "Wizard Smart Guide", "Campo": "Processi Gestiti", "Valore": data.wizardProcesses.join(', '), "Note": "" },
    { "Sezione": "Wizard Smart Guide", "Campo": "Dati Raccolti", "Valore": data.wizardDataPoints.join(', '), "Note": "" },
    { "Sezione": "Wizard Smart Guide", "Campo": "Campi Custom", "Valore": data.wizardCustomFields, "Note": "" },
    { "Sezione": "Wizard Smart Guide", "Campo": "Approvazione Richieste", "Valore": data.wizardHasApproval, "Note": data.wizardApprovalDetails },
    { "Sezione": "Wizard Smart Guide", "Campo": "Assegnazione Automatica", "Valore": data.wizardAutoAssignment, "Note": "" },
    { "Sezione": "Wizard Smart Guide", "Campo": "Target Utenza", "Valore": data.wizardUsers.join(', '), "Note": "" },
    { "Sezione": "Wizard Smart Guide", "Campo": "Documentazione", "Valore": data.wizardDocsAvailable, "Note": data.wizardDocsFile },

    // --- STEP 4: EVENTI (MAINTENANCE) ---
    { "Sezione": "Eventi - Reattiva", "Campo": "Tipologie Intervento", "Valore": data.reactiveTypes.join(', '), "Note": "" },
    { "Sezione": "Eventi - Reattiva", "Campo": "Scope Sedi", "Valore": data.reactiveScope, "Note": "" },
    { "Sezione": "Eventi - Reattiva", "Campo": "Campi Custom", "Valore": data.reactiveCustomFields, "Note": "" },

    { "Sezione": "Eventi - Proattiva", "Campo": "Asset Soggetti", "Valore": data.proactiveAssets, "Note": "" },
    { "Sezione": "Eventi - Proattiva", "Campo": "Vincoli", "Valore": data.proactiveConstraints.join(', '), "Note": "" },
    { "Sezione": "Eventi - Proattiva", "Campo": "Campi Custom", "Valore": data.proactiveCustomFields, "Note": "" },
    { "Sezione": "Eventi - Proattiva", "Campo": "Rendicontazione Costi", "Valore": data.enableCostReporting, "Note": "" },
    { "Sezione": "Eventi - Proattiva", "Campo": "Scarico Materiali", "Valore": data.enableMaterialConsumption, "Note": "" },
    { "Sezione": "Eventi - Proattiva", "Campo": "Manodopera Interna", "Valore": data.enableLaborReporting, "Note": "" },
    { "Sezione": "Eventi - Proattiva", "Campo": "Costo Orario Standard", "Valore": data.enableStandardHourlyCost, "Note": "" },

    { "Sezione": "Eventi - Correttive (CA)", "Campo": "Automatismo Attivo", "Valore": data.caEnableAutomation, "Note": "" },
    { "Sezione": "Eventi - Correttive (CA)", "Campo": "Campi Follow-up", "Valore": data.caCustomFields, "Note": "" },
    { "Sezione": "Eventi - Correttive (CA)", "Campo": "Workflow CA", "Valore": data.caWorkflow, "Note": "" },

    // --- STEP 5: TEMPLATE & AUDIT ---
    { "Sezione": "Template", "Campo": "Tipologie Template", "Valore": data.templateTypes.join(', '), "Note": "" },
    { "Sezione": "Template", "Campo": "Contenuto Template", "Valore": data.templateInclusions.join(', '), "Note": "" },
    { "Sezione": "Template", "Campo": "Importazione Esistenti", "Valore": data.importExistingModels, "Note": data.importExistingModelsDetails },
    { "Sezione": "Template", "Campo": "Campi Obbligatori", "Valore": data.templateMandatoryFields, "Note": "" },
    { "Sezione": "Template", "Campo": "Trigger Utilizzo", "Valore": data.templateUsageTriggers.join(', '), "Note": "" },
    { "Sezione": "Template", "Campo": "Permessi (Gestione)", "Valore": data.templatePermissions, "Note": "" },
    { "Sezione": "Template", "Campo": "Workflow Specifico", "Valore": data.templateWorkflowSpecific, "Note": "" },

    { "Sezione": "Audit", "Campo": "Tipologie Audit", "Valore": data.auditTypes.join(', '), "Note": "" },
    { "Sezione": "Audit", "Campo": "Legame/Scope", "Valore": data.auditLinkedTo.join(', '), "Note": "" },
    { "Sezione": "Audit", "Campo": "Frequenza", "Valore": data.auditFrequency.join(', '), "Note": "" },
    { "Sezione": "Audit", "Campo": "Esecutori", "Valore": data.auditExecutors, "Note": "" },
    { "Sezione": "Audit", "Campo": "Import Dati Pregressi", "Valore": data.importPastAuditData, "Note": "" },
    { "Sezione": "Audit", "Campo": "Import Checklist Esistenti", "Valore": data.importChecklists, "Note": "" },

    // --- STEP 6: WORKFLOW DESIGN ---
    // Reactive
    { "Sezione": "Workflow - Reattiva", "Campo": "Chi apre OdL?", "Valore": data.wfReactiveOpeners.join(', '), "Note": "" },
    { "Sezione": "Workflow - Reattiva", "Campo": "Automatismi Apertura", "Valore": data.wfReactiveAutoCreation.join(', '), "Note": "" },
    { "Sezione": "Workflow - Reattiva", "Campo": "Fasi Operative (Sequenza)", "Valore": data.wfReactivePhases.join(' -> '), "Note": "" },
    { "Sezione": "Workflow - Reattiva", "Campo": "Approvazione Tecnica/Eco", "Valore": data.wfReactiveApproval, "Note": "" },
    { "Sezione": "Workflow - Reattiva", "Campo": "Tipo Assegnazione", "Valore": data.wfReactiveAssignmentType, "Note": `Ruoli: ${data.wfReactiveAssignerRoles}` },
    { "Sezione": "Workflow - Reattiva", "Campo": "Assegnato a", "Valore": data.wfReactiveAssignTo.join(', '), "Note": "" },
    { "Sezione": "Workflow - Reattiva", "Campo": "Allegati Necessari", "Valore": data.wfReactiveAttachments, "Note": "" },
    { "Sezione": "Workflow - Reattiva", "Campo": "Obbligatori per Chiusura", "Valore": data.wfReactiveClosureMandatory.join(', '), "Note": "" },
    { "Sezione": "Workflow - Reattiva", "Campo": "RCA Obbligatoria", "Valore": data.wfReactiveRCA, "Note": "" },
    { "Sezione": "Workflow - Reattiva", "Campo": "Validazione Post-Intervento", "Valore": data.wfReactiveValidation, "Note": "" },
    { "Sezione": "Workflow - Reattiva", "Campo": "Approvazione Cliente", "Valore": data.wfReactiveClientApproval, "Note": "" },
    { "Sezione": "Workflow - Reattiva", "Campo": "Notifiche (Fasi)", "Valore": data.wfReactiveNotifications.join(', '), "Note": "" },
    { "Sezione": "Workflow - Reattiva", "Campo": "Report Automatici", "Valore": data.wfReactiveReport, "Note": data.wfReactiveReportDetails },
    { "Sezione": "Workflow - Reattiva", "Campo": "Visibilità Stati", "Valore": data.wfReactiveVisibility, "Note": "" },
    { "Sezione": "Workflow - Reattiva", "Campo": "Restrizioni Campi", "Valore": data.wfReactiveRestrictions, "Note": data.wfReactiveRestrictionsDetails },

    // Proactive
    { "Sezione": "Workflow - Proattiva", "Campo": "Creazione Attività", "Valore": data.wfProactiveCreation.join(', '), "Note": "" },
    { "Sezione": "Workflow - Proattiva", "Campo": "Chi Pianifica", "Valore": data.wfProactivePlanners.join(', '), "Note": "" },
    { "Sezione": "Workflow - Proattiva", "Campo": "Promemoria", "Valore": data.wfProactiveReminders, "Note": "" },
    { "Sezione": "Workflow - Proattiva", "Campo": "Team Dedicato", "Valore": data.wfProactiveTeam, "Note": "" },
    { "Sezione": "Workflow - Proattiva", "Campo": "Checklist", "Valore": data.wfProactiveChecklist, "Note": "" },
    { "Sezione": "Workflow - Proattiva", "Campo": "Allegati", "Valore": data.wfProactiveAttachments, "Note": "" },
    { "Sezione": "Workflow - Proattiva", "Campo": "Campi Obbligatori", "Valore": data.wfProactiveMandatoryFields, "Note": "" },
    { "Sezione": "Workflow - Proattiva", "Campo": "Info Chiusura", "Valore": data.wfProactiveClosureInfo, "Note": "" },
    { "Sezione": "Workflow - Proattiva", "Campo": "Validazione Finale", "Valore": data.wfProactiveValidation, "Note": `Ruolo: ${data.wfProactiveValidatorRole}` },
    { "Sezione": "Workflow - Proattiva", "Campo": "Permessi Gestione", "Valore": data.wfProactivePermissions.join(', '), "Note": "" },
    { "Sezione": "Workflow - Proattiva", "Campo": "Fasi Operative", "Valore": data.wfProactivePhases.join(' -> '), "Note": "" },

    // --- AI SUMMARY ---
    { "Sezione": "Output AI", "Campo": "Brief Tecnico", "Valore": aiSummary, "Note": "Generato da Gemini 2.5 Flash" },
    { "Sezione": "Meta", "Campo": "Data Compilazione", "Valore": new Date().toLocaleString('it-IT'), "Note": "" }
  ];

  const worksheet = XLSX.utils.json_to_sheet(rowData);

  // Set column widths
  const wscols = [
    { wch: 20 }, // Section
    { wch: 40 }, // Field Name
    { wch: 60 }, // Value
    { wch: 40 }, // Notes
  ];
  worksheet['!cols'] = wscols;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Configurazione Completa");

  const cleanName = data.instanceName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const fileName = `mainsim_config_v6_${cleanName}.xlsx`;

  XLSX.writeFile(workbook, fileName);
};