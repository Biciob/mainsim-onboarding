import * as XLSX from 'xlsx';
import { OnboardingData } from '../types';

export const generateAndDownloadExcel = (data: OnboardingData, aiSummary: string) => {
  // 1. Prepare data structure for Excel
  const rowData = [
    // --- STEP 1 ---
    { "Sezione": "Istanza", "Campo": "Nome Istanza Desiderato", "Valore": data.instanceName, "Note": "Deve terminare con .mainsim.cloud" },
    { "Sezione": "Istanza", "Campo": "Colore Interfaccia (Hex)", "Valore": data.brandColor, "Note": "Colore primario login" },
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
  const fileName = `mainsim_config_v2_${cleanName}.xlsx`;

  XLSX.writeFile(workbook, fileName);
};
