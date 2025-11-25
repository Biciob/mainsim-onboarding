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

export interface OnboardingData {
  // Step 1
  instanceName: string;
  brandColor: string;
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
}

export interface ProcessingState {
  status: 'idle' | 'generating' | 'success' | 'error';
  message?: string;
  aiSummary?: string;
}
