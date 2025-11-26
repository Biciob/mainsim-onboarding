export enum AuthMode {
  EMAIL_PASSWORD = "E-mail + Password",
  SSO = "SSO (Single Sign-On)",
  LDAP = "LDAP",
  OTHER = "Altro"
}

export enum RestrictionType {
  NO = "Nessuna restrizione",
  YES = "Si, specifiche restrizioni",
  OTHER = "Altro"
}

// Step 2 Enums
export enum AssetDataFormat {
  EXCEL = "Excel",
  CSV = "CSV",
  API = "API",
  DB = "Database",
  OTHER = "Altro"
}

export enum MainsimRole {
  ADMIN = "Amministratore",
  MANAGER = "Responsabile",
  IT_MANAGER = "IT Manager",
  OTHER = "Altro"
}

export enum QrCodeGoal {
  TRACKING = "Tracciamento",
  IDENTIFICATION = "Identificazione rapida sul campo",
  DOCS = "Accesso a documentazione tecnica"
}

// Step 3 Enums
export enum WizardMode {
  STANDARD = "Standard (max 2 flussi)",
  CUSTOM = "Custom (max 5 flussi)",
  ADVANCED = "Advanced (max 10 flussi, regole dinamiche)",
  MATRIX = "Matrix (routing automatico su condizioni)"
}

// Step 4 Enums
export enum ReactiveType {
  FAILURE = "Guasti improvvisi",
  EMERGENCY = "Emergenze",
  CORRECTIVE = "Manutenzioni correttive"
}

export enum LocationScope {
  SAME = "Stessa per tutte le sedi",
  VARIES = "Variano per sito/BU"
}

export enum ConstraintType {
  NONE = "Nessun vincolo",
  REGULATORY = "Vincoli normativi",
  CONTRACTUAL = "Vincoli contrattuali"
}

export enum CorrectiveWorkflow {
  SAME = "Stesso flusso reattiva",
  CUSTOM = "Flusso personalizzato"
}

export interface OnboardingData {
  // Step 1
  instanceName: string;
  brandColor: string;
  brandLogo: string | null; // Base64 or URL
  brandLogoName: string;
  authMode: AuthMode;
  restrictionType: RestrictionType;
  restrictionDetails: string;
  technicalRequirements: string;

  // Step 2: Asset Data Entry
  assetDataFormat: AssetDataFormat;
  assetDataFormatOther: string;
  isMassUpload: string; // "Si" | "No"
  assetDetailLevel: string;
  useDefaultCategories: string; // "Si" | "No"
  selectedAssetFields: string[]; // List of selected mandatory fields
  customAttributes: string;
  assetMaintainer: string; // Name/Email/Phone
  assetMaintainerRole: MainsimRole;
  changeNotificationProcess: string;
  hasValidationProcess: string; // "Si" | "No"
  hasApprovalFlow: string; // "Si" | "No"
  approvalFlowDetails: string;
  hasAuditLog: string; // "Si" | "No"

  // Step 2: Workflow
  useStandardStates: string; // "Si" | "No"
  standardStatesDetails: string;
  statusImpact: string; // "Si" | "No"
  statusImpactDetails: string;

  // Step 2: Tagging
  qrCodeGoal: QrCodeGoal;
  assetsAlreadyLabeled: string; // "Si" | "No"
  taggingStandard: string; // "QR-code" | "Barcode" | other
  labelInfo: string[]; // Multi-select

  // Step 3: Wizard - Smart Guide
  wizardProcesses: string[];
  wizardDataPoints: string[];
  wizardCustomFields: string;
  wizardHasApproval: string; // "Si" | "No"
  wizardApprovalDetails: string;
  wizardAutoAssignment: string; // "Si" | "No"
  wizardUsers: string[]; // Utenti, Fornitori, Referenti
  wizardDocsAvailable: string; // "Si" | "No"
  wizardDocsFile: string; // Filename
  wizardMode: WizardMode;

  // Step 4: Events (Maintenance)
  // Reactive
  reactiveTypes: string[];
  reactiveScope: LocationScope;
  reactiveCustomFields: string;
  
  // Proactive
  proactiveAssets: string;
  proactiveConstraints: string[];
  proactiveCustomFields: string;
  enableCostReporting: string; // "Si" | "No"
  enableMaterialConsumption: string; // "Si" | "No"
  enableLaborReporting: string; // "Si" | "No"
  enableStandardHourlyCost: string; // "Si" | "No"

  // Corrective Actions (CA)
  caEnableAutomation: string; // "Si" | "No"
  caCustomFields: string;
  caWorkflow: CorrectiveWorkflow;

  // Step 5: Template & Audit
  // Templates
  templateTypes: string[];
  templateInclusions: string[];
  importExistingModels: string; // "Si" | "No"
  importExistingModelsDetails: string;
  templateMandatoryFields: string;
  templateUsageTriggers: string[];
  templatePermissions: string; // Create/Assign/Edit
  templateWorkflowSpecific: string; // "Si" | "No"

  // Audits
  auditTypes: string[];
  auditLinkedTo: string[];
  auditFrequency: string[];
  auditExecutors: string;
  importPastAuditData: string; // "Si" | "No"
  importChecklists: string; // "Si" | "No"

  // Step 6: Workflow Design
  // Reactive Workflow
  wfReactiveOpeners: string[];
  wfReactiveAutoCreation: string[];
  wfReactivePhases: string[]; // Ordered list
  wfReactiveApproval: string; // "Si" | "No"
  wfReactiveAssignmentType: string; // "Manuale" | "Automatico"
  wfReactiveAssignerRoles: string;
  wfReactiveAssignTo: string[]; // Internal/External
  wfReactiveAttachments: string; // "Si" | "No"
  wfReactiveClosureMandatory: string[];
  wfReactiveRCA: string; // "Si" | "No"
  wfReactiveValidation: string; // "Si" | "No"
  wfReactiveClientApproval: string; // "Si" | "No"
  wfReactiveNotifications: string[];
  wfReactiveReport: string; // "Si" | "No"
  wfReactiveReportDetails: string;
  wfReactiveVisibility: string;
  wfReactiveRestrictions: string; // "Si" | "No"
  wfReactiveRestrictionsDetails: string;

  // Proactive Workflow
  wfProactiveCreation: string[];
  wfProactivePlanners: string[];
  wfProactiveReminders: string; // "Si" | "No"
  wfProactiveTeam: string; // "Si" | "No"
  wfProactiveChecklist: string; // "Si" | "No"
  wfProactiveAttachments: string; // "Si" | "No"
  wfProactiveMandatoryFields: string;
  wfProactiveClosureInfo: string;
  wfProactiveValidation: string; // "Si" | "No"
  wfProactiveValidatorRole: string;
  wfProactivePermissions: string[];
  wfProactivePhases: string[]; // Ordered list
}

export interface ProcessingState {
  status: 'idle' | 'generating' | 'success' | 'error';
  message?: string;
  aiSummary?: string;
}