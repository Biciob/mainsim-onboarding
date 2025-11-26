import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Download, 
  Loader2, 
  Server, 
  Palette, 
  Lock, 
  Cpu, 
  Sparkles,
  Box,
  Workflow,
  QrCode,
  ArrowRight,
  ArrowLeft,
  PlayCircle,
  Zap,
  Layout,
  Upload,
  CalendarClock,
  Wrench,
  AlertTriangle,
  Info,
  X,
  ClipboardCheck,
  FileCheck,
  GitPullRequest
} from 'lucide-react';
import { InputGroup } from './components/InputGroup';
import { 
  AuthMode, 
  RestrictionType, 
  OnboardingData, 
  ProcessingState,
  AssetDataFormat,
  MainsimRole,
  QrCodeGoal,
  WizardMode,
  LocationScope,
  CorrectiveWorkflow
} from './types';
import { 
  DEFAULT_COLOR, 
  DOMAIN_SUFFIX, 
  ASSET_TUTORIAL_URL,
  ASSET_FIELDS_CONFIG,
  LABEL_INFO_OPTIONS,
  WIZARD_PROCESS_OPTIONS,
  WIZARD_DATA_OPTIONS,
  WIZARD_USER_OPTIONS,
  WIZARD_MODE_DESCRIPTIONS,
  OBJECTIVES_POPUP_TEXT,
  CA_POPUP_TEXT,
  REACTIVE_TYPES_OPTIONS,
  CONSTRAINT_TYPES_OPTIONS,
  AUDIT_OBJECTIVES_POPUP_TEXT,
  TEMPLATE_TYPE_OPTIONS,
  TEMPLATE_INCLUSION_OPTIONS,
  TEMPLATE_TRIGGER_OPTIONS,
  AUDIT_TYPE_OPTIONS,
  AUDIT_LINK_OPTIONS,
  AUDIT_FREQUENCY_OPTIONS,
  WF_OPENER_OPTIONS,
  WF_AUTO_CREATION_OPTIONS,
  WF_REACTIVE_STATES,
  WF_ASSIGN_TO_OPTIONS,
  WF_CLOSURE_OPTIONS,
  WF_NOTIFICATIONS_OPTIONS,
  WF_PROACTIVE_CREATION_OPTIONS,
  WF_PROACTIVE_PLANNER_OPTIONS,
  WF_PROACTIVE_PERMISSIONS_OPTIONS,
  WF_PROACTIVE_STATES,
  REACTIVE_WORKFLOW_POPUP_TEXT,
  PROACTIVE_WORKFLOW_POPUP_TEXT
} from './constants';
import { generateImplementationBrief } from './services/geminiService';
import { generateAndDownloadExcel } from './services/excelService';

const App: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [showObjectivesModal, setShowObjectivesModal] = useState(false);
  const [showCAModal, setShowCAModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showReactiveModal, setShowReactiveModal] = useState(false);
  const [showProactiveModal, setShowProactiveModal] = useState(false);

  const [formData, setFormData] = useState<OnboardingData>({
    // Step 1
    instanceName: '',
    brandColor: DEFAULT_COLOR,
    brandLogo: null,
    brandLogoName: '',
    authMode: AuthMode.EMAIL_PASSWORD,
    restrictionType: RestrictionType.NO,
    restrictionDetails: '',
    technicalRequirements: '',
    
    // Step 2
    assetDataFormat: AssetDataFormat.EXCEL,
    assetDataFormatOther: '',
    isMassUpload: 'Si',
    assetDetailLevel: '',
    useDefaultCategories: 'Si',
    selectedAssetFields: [],
    customAttributes: '',
    assetMaintainer: '',
    assetMaintainerRole: MainsimRole.MANAGER,
    changeNotificationProcess: '',
    hasValidationProcess: 'No',
    hasApprovalFlow: 'No',
    approvalFlowDetails: '',
    hasAuditLog: 'Si',
    useStandardStates: 'Si',
    standardStatesDetails: '',
    statusImpact: 'Si',
    statusImpactDetails: '',
    qrCodeGoal: QrCodeGoal.TRACKING,
    assetsAlreadyLabeled: 'No',
    taggingStandard: 'QR-code',
    labelInfo: [],

    // Step 3
    wizardProcesses: [],
    wizardDataPoints: [],
    wizardCustomFields: '',
    wizardHasApproval: 'No',
    wizardApprovalDetails: '',
    wizardAutoAssignment: 'No',
    wizardUsers: [],
    wizardDocsAvailable: 'No',
    wizardDocsFile: '',
    wizardMode: WizardMode.STANDARD,

    // Step 4
    reactiveTypes: [],
    reactiveScope: LocationScope.SAME,
    reactiveCustomFields: '',
    proactiveAssets: '',
    proactiveConstraints: [],
    proactiveCustomFields: '',
    enableCostReporting: 'No',
    enableMaterialConsumption: 'No',
    enableLaborReporting: 'No',
    enableStandardHourlyCost: 'No',
    caEnableAutomation: 'No',
    caCustomFields: '',
    caWorkflow: CorrectiveWorkflow.SAME,

    // Step 5
    templateTypes: [],
    templateInclusions: [],
    importExistingModels: 'No',
    importExistingModelsDetails: '',
    templateMandatoryFields: '',
    templateUsageTriggers: [],
    templatePermissions: '',
    templateWorkflowSpecific: 'No',
    auditTypes: [],
    auditLinkedTo: [],
    auditFrequency: [],
    auditExecutors: '',
    importPastAuditData: 'No',
    importChecklists: 'No',

    // Step 6
    wfReactiveOpeners: [],
    wfReactiveAutoCreation: [],
    wfReactivePhases: [],
    wfReactiveApproval: 'No',
    wfReactiveAssignmentType: 'Manuale',
    wfReactiveAssignerRoles: '',
    wfReactiveAssignTo: [],
    wfReactiveAttachments: 'No',
    wfReactiveClosureMandatory: [],
    wfReactiveRCA: 'No',
    wfReactiveValidation: 'No',
    wfReactiveClientApproval: 'No',
    wfReactiveNotifications: [],
    wfReactiveReport: 'No',
    wfReactiveReportDetails: '',
    wfReactiveVisibility: '',
    wfReactiveRestrictions: 'No',
    wfReactiveRestrictionsDetails: '',
    wfProactiveCreation: [],
    wfProactivePlanners: [],
    wfProactiveReminders: 'No',
    wfProactiveTeam: 'No',
    wfProactiveChecklist: 'No',
    wfProactiveAttachments: 'No',
    wfProactiveMandatoryFields: '',
    wfProactiveClosureInfo: '',
    wfProactiveValidation: 'No',
    wfProactiveValidatorRole: '',
    wfProactivePermissions: [],
    wfProactivePhases: []
  });

  const [processing, setProcessing] = useState<ProcessingState>({ status: 'idle' });
  const [errors, setErrors] = useState<Partial<Record<keyof OnboardingData, string>>>({});

  // --- Handlers ---

  const handleInstanceBlur = () => {
    if (formData.instanceName && !formData.instanceName.includes('.')) {
      setFormData(prev => ({ ...prev, instanceName: `${prev.instanceName}${DOMAIN_SUFFIX}` }));
    }
  };

  const toggleAssetField = (field: string) => {
    setFormData(prev => {
      const exists = prev.selectedAssetFields.includes(field);
      return {
        ...prev,
        selectedAssetFields: exists 
          ? prev.selectedAssetFields.filter(f => f !== field)
          : [...prev.selectedAssetFields, field]
      };
    });
  };

  const toggleLabelInfo = (info: string) => {
    setFormData(prev => {
      const exists = prev.labelInfo.includes(info);
      return {
        ...prev,
        labelInfo: exists
          ? prev.labelInfo.filter(i => i !== info)
          : [...prev.labelInfo, info]
      };
    });
  };

  const toggleWizardProcess = (process: string) => {
    setFormData(prev => {
      const exists = prev.wizardProcesses.includes(process);
      return { ...prev, wizardProcesses: exists ? prev.wizardProcesses.filter(p => p !== process) : [...prev.wizardProcesses, process] };
    });
  };

  const toggleWizardData = (dataPoint: string) => {
    setFormData(prev => {
      const exists = prev.wizardDataPoints.includes(dataPoint);
      return { ...prev, wizardDataPoints: exists ? prev.wizardDataPoints.filter(d => d !== dataPoint) : [...prev.wizardDataPoints, dataPoint] };
    });
  };

  const toggleWizardUser = (user: string) => {
    setFormData(prev => {
      const exists = prev.wizardUsers.includes(user);
      return { ...prev, wizardUsers: exists ? prev.wizardUsers.filter(u => u !== user) : [...prev.wizardUsers, user] };
    });
  };

  const toggleReactiveType = (type: string) => {
    setFormData(prev => {
      const exists = prev.reactiveTypes.includes(type);
      return { ...prev, reactiveTypes: exists ? prev.reactiveTypes.filter(t => t !== type) : [...prev.reactiveTypes, type] };
    });
  };

  const toggleProactiveConstraint = (type: string) => {
    setFormData(prev => {
      const exists = prev.proactiveConstraints.includes(type);
      return { ...prev, proactiveConstraints: exists ? prev.proactiveConstraints.filter(t => t !== type) : [...prev.proactiveConstraints, type] };
    });
  };

  // Generic toggle for Array Fields
  const toggleArrayField = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      const exists = currentArray.includes(value);
      return {
        ...prev,
        [field]: exists ? currentArray.filter(i => i !== value) : [...currentArray, value]
      };
    });
  };

  // Special toggle for ordered phases (Step 6)
  const toggleOrderedPhase = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      const exists = currentArray.includes(value);
      return {
        ...prev,
        [field]: exists ? currentArray.filter(i => i !== value) : [...currentArray, value]
      };
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          brandLogo: reader.result as string,
          brandLogoName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, wizardDocsAvailable: 'Si', wizardDocsFile: e.target.files![0].name }));
    }
  };

  // --- Validation ---

  const getStep1Errors = () => {
    const newErrors: Partial<Record<keyof OnboardingData, string>> = {};
    if (!formData.instanceName.trim()) newErrors.instanceName = "Il nome dell'istanza è obbligatorio.";
    else if (!formData.instanceName.endsWith(DOMAIN_SUFFIX)) newErrors.instanceName = `Deve terminare con ${DOMAIN_SUFFIX}`;
    
    if (!/^#[0-9A-F]{6}$/i.test(formData.brandColor)) newErrors.brandColor = "Colore non valido.";
    
    if ((formData.restrictionType === RestrictionType.YES || formData.restrictionType === RestrictionType.OTHER) && !formData.restrictionDetails.trim()) {
      newErrors.restrictionDetails = "Specificare i dettagli.";
    }
    return newErrors;
  };

  const getStep2Errors = () => {
    const newErrors: Partial<Record<keyof OnboardingData, string>> = {};
    if (!formData.assetDetailLevel.trim()) newErrors.assetDetailLevel = "Campo obbligatorio";
    if (formData.assetDataFormat === AssetDataFormat.OTHER && !formData.assetDataFormatOther.trim()) {
      newErrors.assetDataFormatOther = "Specificare il formato";
    }
    if (!formData.assetMaintainer.trim()) newErrors.assetMaintainer = "Indicare un responsabile";
    return newErrors;
  };

  const getStep3Errors = () => {
    const newErrors: Partial<Record<keyof OnboardingData, string>> = {};
    if (formData.wizardProcesses.length === 0) newErrors.wizardProcesses = "Seleziona almeno un processo.";
    return newErrors;
  };

  const getStep4Errors = () => {
    const newErrors: Partial<Record<keyof OnboardingData, string>> = {};
    if (formData.reactiveTypes.length === 0) newErrors.reactiveTypes = "Seleziona almeno una tipologia.";
    if (!formData.proactiveAssets.trim()) newErrors.proactiveAssets = "Indicare gli asset.";
    return newErrors;
  };

  const getStep5Errors = () => {
    const newErrors: Partial<Record<keyof OnboardingData, string>> = {};
    return newErrors;
  };
  
  const getStep6Errors = () => {
    const newErrors: Partial<Record<keyof OnboardingData, string>> = {};
    if (formData.wfReactivePhases.length === 0) newErrors.wfReactivePhases = "Seleziona almeno una fase.";
    if (formData.wfProactivePhases.length === 0) newErrors.wfProactivePhases = "Seleziona almeno una fase.";
    return newErrors;
  };

  // --- Navigation ---

  const handleStepClick = (targetStep: number) => {
    setStep(targetStep);
    setErrors({});
    window.scrollTo(0, 0);
  };

  const handleNext = () => {
    let stepErrors = {};
    if (step === 1) stepErrors = getStep1Errors();
    if (step === 2) stepErrors = getStep2Errors();
    if (step === 3) stepErrors = getStep3Errors();
    if (step === 4) stepErrors = getStep4Errors();
    // Step 5 has no blockers
    if (step === 6) stepErrors = getStep6Errors(); // Not actually called on Next, only Submit

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setStep(prev => prev + 1);
    setErrors({});
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const step1Errors = getStep1Errors();
    const step2Errors = getStep2Errors();
    const step3Errors = getStep3Errors();
    const step4Errors = getStep4Errors();
    const step6Errors = getStep6Errors();

    const allErrors = { ...step1Errors, ...step2Errors, ...step3Errors, ...step4Errors, ...step6Errors };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      alert("Attenzione: Ci sono campi obbligatori incompleti. Verifica i dati inseriti (es. seleziona almeno una fase per il workflow).");
      return;
    }

    setProcessing({ status: 'generating' });
    const aiSummary = await generateImplementationBrief(formData);
    setProcessing({ status: 'success', aiSummary });
  };

  const handleReset = () => {
    window.location.reload();
  };

  // --- Render Steps ---

  const renderStep1 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Section 1: Instance */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Server className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-slate-800">Identità Istanza</h2>
        </div>
        <InputGroup label="Nome Desiderato Istanza" description={`L'URL finale per accedere. Deve terminare con ${DOMAIN_SUFFIX}`} error={errors.instanceName}>
          <input
            type="text"
            value={formData.instanceName}
            onChange={(e) => setFormData({...formData, instanceName: e.target.value})}
            onBlur={handleInstanceBlur}
            placeholder={`cliente${DOMAIN_SUFFIX}`}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.instanceName ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
          />
        </InputGroup>
      </section>

      {/* Section 2: Branding */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Palette className="text-purple-600" size={24} />
          <h2 className="text-xl font-bold text-slate-800">Branding & Design</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="Colore Brand" description="Codice HEX per login e sidebar." error={errors.brandColor}>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">#</span>
                <input
                  type="text"
                  maxLength={7}
                  value={formData.brandColor.replace('#', '')}
                  onChange={(e) => setFormData({...formData, brandColor: `#${e.target.value.replace('#', '')}`})}
                  className="w-full p-3 pl-8 border rounded-lg font-mono focus:ring-2 focus:ring-purple-500 outline-none border-slate-300"
                />
              </div>
              <div className="w-12 h-12 rounded-lg border shadow-sm" style={{ backgroundColor: formData.brandColor }} />
              <input type="color" value={formData.brandColor} onChange={(e) => setFormData({...formData, brandColor: e.target.value})} className="invisible w-0" />
            </div>
          </InputGroup>

          <InputGroup label="Logo Aziendale" description="Carica un file (PNG, JPG, SVG, WEBP)">
            <div className="flex items-center gap-4">
               <label className="flex-1 cursor-pointer">
                  <div className="w-full p-3 border border-dashed border-slate-300 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 text-slate-500">
                    <Upload size={20} />
                    <span className="text-sm truncate">{formData.brandLogoName || "Scegli file..."}</span>
                  </div>
                  <input type="file" accept="image/png, image/jpeg, image/webp, image/svg+xml" onChange={handleLogoUpload} className="hidden" />
               </label>
               {formData.brandLogo && (
                 <div className="h-12 w-12 rounded border p-1 bg-white flex items-center justify-center overflow-hidden">
                   <img src={formData.brandLogo} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                 </div>
               )}
            </div>
          </InputGroup>
        </div>
      </section>

      {/* Section 3: Security */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Lock className="text-orange-600" size={24} />
          <h2 className="text-xl font-bold text-slate-800">Sicurezza & Accesso</h2>
        </div>
        <InputGroup label="Modalità Autenticazione">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.values(AuthMode).map((mode) => (
              <label key={mode} className={`flex items-center p-3 border rounded-lg cursor-pointer ${formData.authMode === mode ? 'border-orange-500 bg-orange-50' : 'border-slate-200'}`}>
                <input type="radio" name="authMode" value={mode} checked={formData.authMode === mode} onChange={() => setFormData({...formData, authMode: mode})} className="text-orange-600 focus:ring-orange-500" />
                <span className="ml-2 text-sm font-medium">{mode}</span>
              </label>
            ))}
          </div>
        </InputGroup>
        <InputGroup label="Restrizioni Accesso" error={errors.restrictionDetails}>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-4">
              {Object.values(RestrictionType).map((type) => (
                <label key={type} className="inline-flex items-center">
                  <input type="radio" name="restrictionType" value={type} checked={formData.restrictionType === type} onChange={() => setFormData({...formData, restrictionType: type, restrictionDetails: type === RestrictionType.NO ? '' : formData.restrictionDetails})} className="text-orange-600 focus:ring-orange-500" />
                  <span className="ml-2 text-sm">{type}</span>
                </label>
              ))}
            </div>
            {(formData.restrictionType === RestrictionType.YES || formData.restrictionType === RestrictionType.OTHER) && (
              <textarea placeholder="Descrivi le restrizioni..." value={formData.restrictionDetails} onChange={(e) => setFormData({...formData, restrictionDetails: e.target.value})} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
            )}
          </div>
        </InputGroup>
      </section>

      {/* Section 4: Technical */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Cpu className="text-teal-600" size={24} />
          <h2 className="text-xl font-bold text-slate-800">Requisiti Tecnici</h2>
        </div>
        <InputGroup label="Dettagli Integrazioni/Volumi">
          <textarea placeholder="Es. Integrazione ERP, volumi massivi..." value={formData.technicalRequirements} onChange={(e) => setFormData({...formData, technicalRequirements: e.target.value})} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none h-24 text-sm" />
        </InputGroup>
      </section>

      <div className="pt-6 flex justify-end">
        <button type="button" onClick={handleNext} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
          Prosegui: Asset <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
  
  // (Steps 2, 3, 4, 5 omitted from this snippet for brevity, assuming they are kept as provided in the context, but I will include them fully in the XML output to ensure full file integrity)
  const renderStep2 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* Intro Tutorial */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Box className="text-indigo-600 mt-1" size={24} />
          <div>
            <h3 className="font-bold text-indigo-900">Configurazione Asset</h3>
            <p className="text-sm text-indigo-700">Definisci struttura, workflow e tagging del patrimonio.</p>
          </div>
        </div>
        <a href={ASSET_TUTORIAL_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold border border-indigo-200 hover:bg-indigo-50 transition-colors shadow-sm whitespace-nowrap">
          <PlayCircle size={16} />
          Guarda Tutorial
        </a>
      </div>

      {/* Section 1: Asset Data Entry */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Server className="text-indigo-600" size={24} />
          <h2 className="text-xl font-bold text-slate-800">Asset Data Entry & Campi</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="Formato Anagrafica" description="Come fornirete i dati?" error={formData.assetDataFormat === AssetDataFormat.OTHER ? errors.assetDataFormatOther : undefined}>
             <select 
                value={formData.assetDataFormat} 
                onChange={(e) => setFormData({...formData, assetDataFormat: e.target.value as AssetDataFormat})}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white mb-2"
              >
                {Object.values(AssetDataFormat).map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              {formData.assetDataFormat === AssetDataFormat.OTHER && (
                <input type="text" placeholder="Specificare..." value={formData.assetDataFormatOther} onChange={(e) => setFormData({...formData, assetDataFormatOther: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
              )}
          </InputGroup>

          <InputGroup label="Modalità Caricamento">
             <div className="flex gap-4">
               {['Si', 'No'].map(opt => (
                 <label key={opt} className="flex items-center cursor-pointer">
                   <input type="radio" name="isMassUpload" checked={formData.isMassUpload === opt} onChange={() => setFormData({...formData, isMassUpload: opt})} className="text-indigo-600 focus:ring-indigo-500" />
                   <span className="ml-2 text-sm text-slate-700">{opt === 'Si' ? 'Primo caricamento massivo' : 'Integrazione continua'}</span>
                 </label>
               ))}
             </div>
          </InputGroup>
        </div>

        <InputGroup label="Livello di Dettaglio" description="Es. fino alla vite, solo asset principali..." error={errors.assetDetailLevel}>
          <input type="text" value={formData.assetDetailLevel} onChange={(e) => setFormData({...formData, assetDetailLevel: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Descrivi la granularità desiderata..." />
        </InputGroup>

        <InputGroup label="Categorie Tecnologiche">
          <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50">
             <span className="text-sm text-slate-700">Usare categorie default Mainsim?</span>
             <div className="flex gap-4">
               {['Si', 'No'].map(opt => (
                 <label key={opt} className="flex items-center cursor-pointer">
                   <input type="radio" name="useDefaultCategories" checked={formData.useDefaultCategories === opt} onChange={() => setFormData({...formData, useDefaultCategories: opt})} className="text-indigo-600" />
                   <span className="ml-2 text-sm font-medium">{opt}</span>
                 </label>
               ))}
             </div>
          </div>
        </InputGroup>

        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Campi Obbligatori (Seleziona)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {Object.entries(ASSET_FIELDS_CONFIG).map(([category, fields]) => (
              <div key={category}>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{category}</h4>
                <div className="space-y-1">
                  {fields.map(field => (
                    <label key={field} className="flex items-center cursor-pointer hover:bg-slate-50 p-1 rounded">
                      <input 
                        type="checkbox" 
                        checked={formData.selectedAssetFields.includes(field)} 
                        onChange={() => toggleAssetField(field)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-slate-600">{field}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <InputGroup label="Altri Attributi Custom">
           <textarea value={formData.customAttributes} onChange={(e) => setFormData({...formData, customAttributes: e.target.value})} placeholder="Es. normativa, rischio, classe energetica..." className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 h-20 text-sm" />
        </InputGroup>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="Responsabile Anagrafica" error={errors.assetMaintainer}>
            <input type="text" placeholder="Nome, Email, Telefono" value={formData.assetMaintainer} onChange={(e) => setFormData({...formData, assetMaintainer: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          </InputGroup>
          <InputGroup label="Ruolo Mainsim Assegnato">
            <select value={formData.assetMaintainerRole} onChange={(e) => setFormData({...formData, assetMaintainerRole: e.target.value as MainsimRole})} className="w-full p-3 border border-slate-300 rounded-lg bg-white">
              {Object.values(MainsimRole).map(role => <option key={role} value={role}>{role}</option>)}
            </select>
          </InputGroup>
        </div>

        <InputGroup label="Processo Segnalazione Modifiche">
           <textarea value={formData.changeNotificationProcess} onChange={(e) => setFormData({...formData, changeNotificationProcess: e.target.value})} placeholder="Come verranno segnalate modifiche o rimozioni?" className="w-full p-3 border border-slate-300 rounded-lg h-20 text-sm" />
        </InputGroup>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
           <div className="p-3 border rounded-lg bg-slate-50">
             <span className="block text-xs font-bold text-slate-500 mb-2">Validazione Interna?</span>
             <div className="flex gap-3">
               {['Si', 'No'].map(opt => (
                 <label key={opt} className="inline-flex items-center"><input type="radio" name="hasValidation" checked={formData.hasValidationProcess === opt} onChange={() => setFormData({...formData, hasValidationProcess: opt})} className="text-indigo-600" /><span className="ml-1 text-sm">{opt}</span></label>
               ))}
             </div>
           </div>
           <div className="p-3 border rounded-lg bg-slate-50">
             <span className="block text-xs font-bold text-slate-500 mb-2">Audit Log?</span>
             <div className="flex gap-3">
               {['Si', 'No'].map(opt => (
                 <label key={opt} className="inline-flex items-center"><input type="radio" name="auditLog" checked={formData.hasAuditLog === opt} onChange={() => setFormData({...formData, hasAuditLog: opt})} className="text-indigo-600" /><span className="ml-1 text-sm">{opt}</span></label>
               ))}
             </div>
           </div>
           <div className="p-3 border rounded-lg bg-slate-50">
             <span className="block text-xs font-bold text-slate-500 mb-2">Workflow Approvativo?</span>
             <div className="flex gap-3">
               {['Si', 'No'].map(opt => (
                 <label key={opt} className="inline-flex items-center"><input type="radio" name="approvalFlow" checked={formData.hasApprovalFlow === opt} onChange={() => setFormData({...formData, hasApprovalFlow: opt})} className="text-indigo-600" /><span className="ml-1 text-sm">{opt}</span></label>
               ))}
             </div>
           </div>
        </div>
        {formData.hasApprovalFlow === 'Si' && (
           <input type="text" placeholder="Dettagli flusso approvativo..." value={formData.approvalFlowDetails} onChange={(e) => setFormData({...formData, approvalFlowDetails: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
        )}
      </section>

      {/* Section 2: Workflow */}
      <section className="space-y-6 pt-6 border-t border-slate-200">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Workflow className="text-teal-600" size={24} />
          <h2 className="text-xl font-bold text-slate-800">Workflow di Stato</h2>
        </div>
        
        <InputGroup label="Conferma stati standard?" description="In Service, Not in Service, Decommissioned, Cancelled">
          <div className="space-y-2">
            <div className="flex gap-4 mb-2">
               {['Si', 'No'].map(opt => (
                 <label key={opt} className="flex items-center cursor-pointer">
                   <input type="radio" name="useStandardStates" checked={formData.useStandardStates === opt} onChange={() => setFormData({...formData, useStandardStates: opt})} className="text-teal-600 focus:ring-teal-500" />
                   <span className="ml-2 text-sm text-slate-700">{opt}</span>
                 </label>
               ))}
            </div>
            <input type="text" placeholder="Commenti o variazioni..." value={formData.standardStatesDetails} onChange={(e) => setFormData({...formData, standardStatesDetails: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
          </div>
        </InputGroup>

        <InputGroup label="Impatto su altri moduli" description="Lo stato blocca manutenzione o acquisti?">
           <div className="space-y-2">
            <div className="flex gap-4 mb-2">
               {['Si', 'No'].map(opt => (
                 <label key={opt} className="flex items-center cursor-pointer">
                   <input type="radio" name="statusImpact" checked={formData.statusImpact === opt} onChange={() => setFormData({...formData, statusImpact: opt})} className="text-teal-600 focus:ring-teal-500" />
                   <span className="ml-2 text-sm text-slate-700">{opt}</span>
                 </label>
               ))}
            </div>
            <input type="text" placeholder="Dettagli impatto..." value={formData.statusImpactDetails} onChange={(e) => setFormData({...formData, statusImpactDetails: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
          </div>
        </InputGroup>
      </section>

      {/* Section 3: Tagging */}
      <section className="space-y-6 pt-6 border-t border-slate-200">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <QrCode className="text-pink-600" size={24} />
          <h2 className="text-xl font-bold text-slate-800">Tagging & Scanning</h2>
        </div>
        
        <InputGroup label="Obiettivo Principale">
           <div className="grid grid-cols-1 gap-2">
             {Object.values(QrCodeGoal).map(goal => (
               <label key={goal} className={`flex items-center p-3 border rounded-lg cursor-pointer ${formData.qrCodeGoal === goal ? 'border-pink-500 bg-pink-50' : 'border-slate-200'}`}>
                 <input type="radio" name="qrCodeGoal" value={goal} checked={formData.qrCodeGoal === goal} onChange={() => setFormData({...formData, qrCodeGoal: goal as QrCodeGoal})} className="text-pink-600" />
                 <span className="ml-3 text-sm font-medium">{goal}</span>
               </label>
             ))}
           </div>
        </InputGroup>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <InputGroup label="Etichettatura Esistente?">
             <div className="flex gap-4">
                 {['Si', 'No'].map(opt => (
                   <label key={opt} className="flex items-center cursor-pointer">
                     <input type="radio" name="assetsAlreadyLabeled" checked={formData.assetsAlreadyLabeled === opt} onChange={() => setFormData({...formData, assetsAlreadyLabeled: opt})} className="text-pink-600" />
                     <span className="ml-2 text-sm text-slate-700">{opt}</span>
                   </label>
                 ))}
             </div>
           </InputGroup>
           <InputGroup label="Standard Preferito">
              <select value={formData.taggingStandard} onChange={(e) => setFormData({...formData, taggingStandard: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg bg-white">
                <option value="QR-code">QR-code</option>
                <option value="Barcode">Barcode</option>
                <option value="NFC">NFC</option>
                <option value="Altro">Altro</option>
              </select>
           </InputGroup>
        </div>

        <InputGroup label="Info su Etichetta">
          <div className="flex flex-wrap gap-2">
            {LABEL_INFO_OPTIONS.map(opt => (
              <label key={opt} className={`px-4 py-2 rounded-full border cursor-pointer text-sm transition-colors ${formData.labelInfo.includes(opt) ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-slate-600 border-slate-300 hover:border-pink-300'}`}>
                <input type="checkbox" className="hidden" checked={formData.labelInfo.includes(opt)} onChange={() => toggleLabelInfo(opt)} />
                {opt}
              </label>
            ))}
          </div>
        </InputGroup>
      </section>

      <div className="pt-6 flex justify-end">
        <button type="button" onClick={handleNext} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
          Prosegui: Wizard <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* Intro */}
      <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start">
         <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
           <Zap size={24} />
         </div>
         <div>
           <h3 className="font-bold text-yellow-900">Wizard - Smart Guide</h3>
           <p className="text-sm text-yellow-800 mt-1">
             Configura il modulo Wizard per semplificare e guidare gli utenti nell’apertura delle richieste.
             Questa sarà l'interfaccia principale per l'interazione iniziale con il sistema.
           </p>
         </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Layout className="text-yellow-600" size={24} />
          <h2 className="text-xl font-bold text-slate-800">Definizione Processi</h2>
        </div>

        <InputGroup label="Processi Principali" description="Cosa deve gestire il Wizard? (Multi-selezione)" error={errors.wizardProcesses}>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
             {WIZARD_PROCESS_OPTIONS.map(opt => (
               <label key={opt} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${formData.wizardProcesses.includes(opt) ? 'bg-yellow-50 border-yellow-500' : 'hover:bg-slate-50 border-slate-200'}`}>
                 <input type="checkbox" className="hidden" checked={formData.wizardProcesses.includes(opt)} onChange={() => toggleWizardProcess(opt)} />
                 <div className={`w-4 h-4 rounded border flex items-center justify-center mr-2 ${formData.wizardProcesses.includes(opt) ? 'bg-yellow-500 border-yellow-500' : 'border-slate-300'}`}>
                   {formData.wizardProcesses.includes(opt) && <CheckCircle2 size={12} className="text-white" />}
                 </div>
                 <span className="text-sm font-medium text-slate-700">{opt}</span>
               </label>
             ))}
           </div>
        </InputGroup>

        <InputGroup label="Dati da Raccogliere" description="Quali info chiedere per ogni processo?">
           <div className="flex flex-wrap gap-2">
             {WIZARD_DATA_OPTIONS.map(opt => (
               <label key={opt} className={`px-4 py-2 rounded-full border cursor-pointer text-sm transition-colors ${formData.wizardDataPoints.includes(opt) ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-slate-600 border-slate-300 hover:border-yellow-300'}`}>
                 <input type="checkbox" className="hidden" checked={formData.wizardDataPoints.includes(opt)} onChange={() => toggleWizardData(opt)} />
                 {opt}
               </label>
             ))}
           </div>
        </InputGroup>

        <InputGroup label="Campi Specifici/Custom">
           <textarea 
             placeholder="Elenca eventuali campi personalizzati necessari..." 
             value={formData.wizardCustomFields} 
             onChange={(e) => setFormData({...formData, wizardCustomFields: e.target.value})}
             className="w-full p-3 border border-slate-300 rounded-lg text-sm h-20 focus:ring-2 focus:ring-yellow-500 outline-none" 
           />
        </InputGroup>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-lg bg-slate-50">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Flussi Approvativi Diversificati?</label>
            <div className="flex gap-4 mb-3">
               {['Si', 'No'].map(opt => (
                 <label key={opt} className="flex items-center cursor-pointer">
                   <input type="radio" name="wizardApproval" checked={formData.wizardHasApproval === opt} onChange={() => setFormData({...formData, wizardHasApproval: opt})} className="text-yellow-600" />
                   <span className="ml-2 text-sm">{opt}</span>
                 </label>
               ))}
            </div>
            {formData.wizardHasApproval === 'Si' && (
              <input 
                type="text" 
                placeholder="Quali flussi?" 
                value={formData.wizardApprovalDetails} 
                onChange={(e) => setFormData({...formData, wizardApprovalDetails: e.target.value})} 
                className="w-full p-2 border border-slate-300 rounded text-sm" 
              />
            )}
          </div>

          <div className="p-4 border rounded-lg bg-slate-50">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Assegnazione Automatica (Team/Fornitori)?</label>
            <div className="flex gap-4">
               {['Si', 'No'].map(opt => (
                 <label key={opt} className="flex items-center cursor-pointer">
                   <input type="radio" name="wizardAutoAssign" checked={formData.wizardAutoAssignment === opt} onChange={() => setFormData({...formData, wizardAutoAssignment: opt})} className="text-yellow-600" />
                   <span className="ml-2 text-sm">{opt}</span>
                 </label>
               ))}
            </div>
          </div>
        </div>

        <InputGroup label="Chi compila il Wizard?" description="Seleziona chi avrà accesso all'interfaccia.">
           <div className="flex flex-wrap gap-4">
             {WIZARD_USER_OPTIONS.map(opt => (
               <label key={opt} className="flex items-center cursor-pointer">
                 <input type="checkbox" className="rounded border-slate-300 text-yellow-600 focus:ring-yellow-500" checked={formData.wizardUsers.includes(opt)} onChange={() => toggleWizardUser(opt)} />
                 <span className="ml-2 text-sm text-slate-700">{opt}</span>
               </label>
             ))}
           </div>
        </InputGroup>
        
        <InputGroup label="Documentazione Disponibile" description="Hai già manuali o esempi di procedure?">
           <div className="flex items-center gap-4">
             <div className="flex gap-4">
                 {['Si', 'No'].map(opt => (
                   <label key={opt} className="flex items-center cursor-pointer">
                     <input type="radio" name="wizardDocs" checked={formData.wizardDocsAvailable === opt} onChange={() => setFormData({...formData, wizardDocsAvailable: opt})} className="text-yellow-600" />
                     <span className="ml-2 text-sm">{opt}</span>
                   </label>
                 ))}
             </div>
             {formData.wizardDocsAvailable === 'Si' && (
               <input type="file" onChange={handleDocUpload} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100" />
             )}
           </div>
        </InputGroup>
      </section>

      <section className="space-y-6 pt-6 border-t border-slate-200">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Sparkles className="text-yellow-600" size={24} />
          <h2 className="text-xl font-bold text-slate-800">Modalità Configurazione</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {Object.values(WizardMode).map(mode => (
             <label key={mode} className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${formData.wizardMode === mode ? 'border-yellow-500 bg-yellow-50' : 'border-slate-200 hover:border-yellow-200'}`}>
               <div className="flex items-center mb-2">
                 <input type="radio" name="wizardMode" value={mode} checked={formData.wizardMode === mode} onChange={() => setFormData({...formData, wizardMode: mode})} className="text-yellow-600 focus:ring-yellow-500" />
                 <span className="ml-2 font-bold text-slate-800">{mode.split('(')[0]}</span>
               </div>
               <p className="text-xs text-slate-500 pl-6">{WIZARD_MODE_DESCRIPTIONS[mode]}</p>
             </label>
           ))}
        </div>
      </section>
      
      <div className="pt-6 flex justify-end">
        <button type="button" onClick={handleNext} className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
          Prosegui: Eventi <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Intro */}
      <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start justify-between">
         <div className="flex gap-4">
            <div className="bg-rose-100 p-2 rounded-lg text-rose-600 h-fit">
              <CalendarClock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-rose-900">Eventi & Manutenzione</h3>
              <p className="text-sm text-rose-800 mt-1 max-w-lg">
                Fornire una descrizione dettagliata dei requisiti funzionali e operativi per la gestione degli ordini di lavoro.
              </p>
            </div>
         </div>
         <button 
           type="button"
           onClick={() => setShowObjectivesModal(true)}
           className="flex items-center gap-2 bg-white text-rose-600 px-4 py-2 rounded-lg text-sm font-semibold border border-rose-200 hover:bg-rose-50 transition-colors shadow-sm whitespace-nowrap"
         >
           <Info size={16} />
           Obiettivi
         </button>
      </div>

      {/* Reactive Maintenance */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <AlertTriangle className="text-rose-600" size={24} />
          <h2 className="text-xl font-bold text-slate-800">Manutenzione Reattiva</h2>
        </div>

        <InputGroup label="Tipologie di Intervento" error={errors.reactiveTypes}>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
             {REACTIVE_TYPES_OPTIONS.map(opt => (
               <label key={opt} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${formData.reactiveTypes.includes(opt) ? 'bg-rose-50 border-rose-500' : 'hover:bg-slate-50 border-slate-200'}`}>
                 <input type="checkbox" className="hidden" checked={formData.reactiveTypes.includes(opt)} onChange={() => toggleReactiveType(opt)} />
                 <div className={`w-4 h-4 rounded border flex items-center justify-center mr-2 ${formData.reactiveTypes.includes(opt) ? 'bg-rose-500 border-rose-500' : 'border-slate-300'}`}>
                   {formData.reactiveTypes.includes(opt) && <CheckCircle2 size={12} className="text-white" />}
                 </div>
                 <span className="text-sm font-medium text-slate-700">{opt}</span>
               </label>
             ))}
           </div>
        </InputGroup>

        <InputGroup label="Validità Tipologie (Scope)">
          <div className="flex gap-4">
             {Object.values(LocationScope).map(opt => (
               <label key={opt} className="flex items-center cursor-pointer">
                 <input type="radio" name="reactiveScope" checked={formData.reactiveScope === opt} onChange={() => setFormData({...formData, reactiveScope: opt})} className="text-rose-600" />
                 <span className="ml-2 text-sm text-slate-700">{opt}</span>
               </label>
             ))}
          </div>
        </InputGroup>

        <InputGroup label="Campi Custom Reattiva">
           <textarea 
             placeholder="Es: Priorità - Livello di urgenza (Alta/Media/Bassa)..." 
             value={formData.reactiveCustomFields} 
             onChange={(e) => setFormData({...formData, reactiveCustomFields: e.target.value})}
             className="w-full p-3 border border-slate-300 rounded-lg text-sm h-24 focus:ring-2 focus:ring-rose-500 outline-none" 
           />
        </InputGroup>
      </section>

      {/* Proactive Maintenance */}
      <section className="space-y-6 pt-6 border-t border-slate-200">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Wrench className="text-rose-600" size={24} />
          <h2 className="text-xl font-bold text-slate-800">Manutenzione Proattiva (Time-based)</h2>
        </div>

        <InputGroup label="Asset Soggetti" description="Quali asset o categorie richiedono manutenzione periodica?" error={errors.proactiveAssets}>
          <textarea 
             value={formData.proactiveAssets} 
             onChange={(e) => setFormData({...formData, proactiveAssets: e.target.value})}
             className="w-full p-3 border border-slate-300 rounded-lg text-sm h-20 focus:ring-2 focus:ring-rose-500 outline-none" 
           />
        </InputGroup>

        <InputGroup label="Vincoli Normativi/Contrattuali">
           <div className="flex flex-wrap gap-2">
             {CONSTRAINT_TYPES_OPTIONS.map(opt => (
               <label key={opt} className={`px-4 py-2 rounded-full border cursor-pointer text-sm transition-colors ${formData.proactiveConstraints.includes(opt) ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-slate-600 border-slate-300 hover:border-rose-300'}`}>
                 <input type="checkbox" className="hidden" checked={formData.proactiveConstraints.includes(opt)} onChange={() => toggleProactiveConstraint(opt)} />
                 {opt}
               </label>
             ))}
           </div>
        </InputGroup>

        <InputGroup label="Campi Custom Proattiva">
           <textarea 
             placeholder="Es: Tecnico Certificato - Richiesto patentino..." 
             value={formData.proactiveCustomFields} 
             onChange={(e) => setFormData({...formData, proactiveCustomFields: e.target.value})}
             className="w-full p-3 border border-slate-300 rounded-lg text-sm h-20 focus:ring-2 focus:ring-rose-500 outline-none" 
           />
        </InputGroup>

        <div className="bg-slate-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <span className="block text-sm font-semibold text-slate-700 mb-2">Rendicontazione Costi?</span>
             <div className="flex gap-4">
               {['Si', 'No'].map(opt => (
                 <label key={`costs-${opt}`} className="flex items-center cursor-pointer">
                   <input type="radio" name="costRep" checked={formData.enableCostReporting === opt} onChange={() => setFormData({...formData, enableCostReporting: opt})} className="text-rose-600" />
                   <span className="ml-2 text-sm">{opt}</span>
                 </label>
               ))}
             </div>
           </div>
           <div>
             <span className="block text-sm font-semibold text-slate-700 mb-2">Scarico Materiali?</span>
             <div className="flex gap-4">
               {['Si', 'No'].map(opt => (
                 <label key={`mat-${opt}`} className="flex items-center cursor-pointer">
                   <input type="radio" name="matRep" checked={formData.enableMaterialConsumption === opt} onChange={() => setFormData({...formData, enableMaterialConsumption: opt})} className="text-rose-600" />
                   <span className="ml-2 text-sm">{opt}</span>
                 </label>
               ))}
             </div>
           </div>
           <div>
             <span className="block text-sm font-semibold text-slate-700 mb-2">Consuntivo Manodopera?</span>
             <div className="flex gap-4">
               {['Si', 'No'].map(opt => (
                 <label key={`labor-${opt}`} className="flex items-center cursor-pointer">
                   <input type="radio" name="laborRep" checked={formData.enableLaborReporting === opt} onChange={() => setFormData({...formData, enableLaborReporting: opt})} className="text-rose-600" />
                   <span className="ml-2 text-sm">{opt}</span>
                 </label>
               ))}
             </div>
           </div>
           <div>
             <span className="block text-sm font-semibold text-slate-700 mb-2">Costo Orario Standard?</span>
             <div className="flex gap-4">
               {['Si', 'No'].map(opt => (
                 <label key={`stdcost-${opt}`} className="flex items-center cursor-pointer">
                   <input type="radio" name="stdCost" checked={formData.enableStandardHourlyCost === opt} onChange={() => setFormData({...formData, enableStandardHourlyCost: opt})} className="text-rose-600" />
                   <span className="ml-2 text-sm">{opt}</span>
                 </label>
               ))}
             </div>
           </div>
        </div>
      </section>

      {/* Corrective Actions */}
      <section className="space-y-6 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
           <div className="flex items-center gap-2">
              <CheckCircle2 className="text-rose-600" size={24} />
              <h2 className="text-xl font-bold text-slate-800">Azioni Correttive</h2>
           </div>
           <button 
             type="button" 
             onClick={() => setShowCAModal(true)}
             className="text-rose-600 hover:text-rose-700 text-sm font-medium flex items-center gap-1"
           >
             <Info size={16} /> Cosa sono?
           </button>
        </div>

        <InputGroup label="Abilitare Automatismo?" description="Generazione automatica CA su esito negativo.">
          <div className="flex gap-4">
               {['Si', 'No'].map(opt => (
                 <label key={`ca-${opt}`} className="flex items-center cursor-pointer">
                   <input type="radio" name="caAuto" checked={formData.caEnableAutomation === opt} onChange={() => setFormData({...formData, caEnableAutomation: opt})} className="text-rose-600" />
                   <span className="ml-2 text-sm">{opt}</span>
                 </label>
               ))}
           </div>
        </InputGroup>

        <InputGroup label="Campi Follow-up">
           <textarea 
             placeholder="Campi specifici per CA..." 
             value={formData.caCustomFields} 
             onChange={(e) => setFormData({...formData, caCustomFields: e.target.value})}
             className="w-full p-3 border border-slate-300 rounded-lg text-sm h-20 focus:ring-2 focus:ring-rose-500 outline-none" 
           />
        </InputGroup>

        <InputGroup label="Flusso Workflow">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
             {Object.values(CorrectiveWorkflow).map((wf) => (
               <label key={wf} className={`flex items-center p-3 border rounded-lg cursor-pointer ${formData.caWorkflow === wf ? 'border-rose-500 bg-rose-50' : 'border-slate-200'}`}>
                 <input type="radio" name="caWorkflow" value={wf} checked={formData.caWorkflow === wf} onChange={() => setFormData({...formData, caWorkflow: wf})} className="text-rose-600 focus:ring-rose-500" />
                 <span className="ml-2 text-sm font-medium">{wf}</span>
               </label>
             ))}
           </div>
        </InputGroup>

      </section>

      <div className="pt-6 flex justify-end">
        <button type="button" onClick={handleNext} className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
          Prosegui: Template <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Intro */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start justify-between">
         <div className="flex gap-4">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600 h-fit">
              <ClipboardCheck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-emerald-900">Template & Audit</h3>
              <p className="text-sm text-emerald-800 mt-1 max-w-lg">
                Attivazione moduli per gestione modelli attività, assegnazioni standard e revisioni sistematiche (Audit).
              </p>
            </div>
         </div>
         <button 
           type="button"
           onClick={() => setShowAuditModal(true)}
           className="flex items-center gap-2 bg-white text-emerald-600 px-4 py-2 rounded-lg text-sm font-semibold border border-emerald-200 hover:bg-emerald-50 transition-colors shadow-sm whitespace-nowrap"
         >
           <Info size={16} />
           Info Audit
         </button>
      </div>

      {/* SECTION 1: TEMPLATES */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <FileCheck className="text-emerald-600" size={24} />
          <h2 className="text-xl font-bold text-slate-800">Configurazione Template</h2>
        </div>

        <InputGroup label="Tipologie di Template" description="Seleziona una o più opzioni">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
             {TEMPLATE_TYPE_OPTIONS.map(opt => (
               <label key={opt} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${formData.templateTypes.includes(opt) ? 'bg-emerald-50 border-emerald-500' : 'hover:bg-slate-50 border-slate-200'}`}>
                 <input type="checkbox" className="hidden" checked={formData.templateTypes.includes(opt)} onChange={() => toggleArrayField('templateTypes', opt)} />
                 <div className={`w-4 h-4 rounded border flex items-center justify-center mr-2 ${formData.templateTypes.includes(opt) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                   {formData.templateTypes.includes(opt) && <CheckCircle2 size={12} className="text-white" />}
                 </div>
                 <span className="text-sm font-medium text-slate-700">{opt}</span>
               </label>
             ))}
           </div>
        </InputGroup>

        <InputGroup label="Contenuto del Template" description="Cosa deve essere incluso nel modello?">
           <div className="flex flex-wrap gap-2">
             {TEMPLATE_INCLUSION_OPTIONS.map(opt => (
               <label key={opt} className={`px-4 py-2 rounded-full border cursor-pointer text-sm transition-colors ${formData.templateInclusions.includes(opt) ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-600 border-slate-300 hover:border-emerald-300'}`}>
                 <input type="checkbox" className="hidden" checked={formData.templateInclusions.includes(opt)} onChange={() => toggleArrayField('templateInclusions', opt)} />
                 {opt}
               </label>
             ))}
           </div>
        </InputGroup>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <InputGroup label="Importazione Modelli Esistenti?">
             <div className="space-y-3">
               <div className="flex gap-4">
                   {['Si', 'No'].map(opt => (
                     <label key={opt} className="flex items-center cursor-pointer">
                       <input type="radio" name="importModels" checked={formData.importExistingModels === opt} onChange={() => setFormData({...formData, importExistingModels: opt})} className="text-emerald-600" />
                       <span className="ml-2 text-sm text-slate-700">{opt}</span>
                     </label>
                   ))}
               </div>
               {formData.importExistingModels === 'Si' && (
                  <input type="text" placeholder="Descrivi formati (Word, Excel...)" value={formData.importExistingModelsDetails} onChange={(e) => setFormData({...formData, importExistingModelsDetails: e.target.value})} className="w-full p-2 border border-slate-300 rounded text-sm" />
               )}
             </div>
           </InputGroup>

           <InputGroup label="Campi Obbligatori">
              <input type="text" placeholder="Es. Firma, Data, Esito..." value={formData.templateMandatoryFields} onChange={(e) => setFormData({...formData, templateMandatoryFields: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
           </InputGroup>
        </div>

        <InputGroup label="Trigger Utilizzo">
           <div className="flex flex-wrap gap-2">
             {TEMPLATE_TRIGGER_OPTIONS.map(opt => (
               <label key={opt} className={`px-4 py-2 rounded-full border cursor-pointer text-sm transition-colors ${formData.templateUsageTriggers.includes(opt) ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-white text-slate-600 border-slate-300'}`}>
                 <input type="checkbox" className="hidden" checked={formData.templateUsageTriggers.includes(opt)} onChange={() => toggleArrayField('templateUsageTriggers', opt)} />
                 <span className="flex items-center gap-1">
                   {formData.templateUsageTriggers.includes(opt) && <CheckCircle2 size={12} />}
                   {opt}
                 </span>
               </label>
             ))}
           </div>
        </InputGroup>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <InputGroup label="Permessi (Creazione/Edit)">
              <input type="text" placeholder="Ruoli autorizzati..." value={formData.templatePermissions} onChange={(e) => setFormData({...formData, templatePermissions: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
           </InputGroup>
           <InputGroup label="Workflow Specifico?">
             <div className="flex gap-4 mt-2">
                 {['Si', 'No'].map(opt => (
                   <label key={opt} className="flex items-center cursor-pointer">
                     <input type="radio" name="tplWorkflow" checked={formData.templateWorkflowSpecific === opt} onChange={() => setFormData({...formData, templateWorkflowSpecific: opt})} className="text-emerald-600" />
                     <span className="ml-2 text-sm text-slate-700">{opt}</span>
                   </label>
                 ))}
             </div>
           </InputGroup>
        </div>
      </section>

      {/* SECTION 2: AUDIT */}
      <section className="space-y-6 pt-6 border-t border-slate-200">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <ClipboardCheck className="text-emerald-600" size={24} />
          <h2 className="text-xl font-bold text-slate-800">Configurazione Audit</h2>
        </div>

        <InputGroup label="Tipologie Audit Attuali">
           <div className="flex flex-wrap gap-2">
             {AUDIT_TYPE_OPTIONS.map(opt => (
               <label key={opt} className={`px-4 py-2 rounded-lg border cursor-pointer text-sm transition-colors ${formData.auditTypes.includes(opt) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-300 hover:border-emerald-400'}`}>
                 <input type="checkbox" className="hidden" checked={formData.auditTypes.includes(opt)} onChange={() => toggleArrayField('auditTypes', opt)} />
                 {opt}
               </label>
             ))}
           </div>
        </InputGroup>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="Scope (Legato a)">
            <div className="flex flex-col gap-2">
              {AUDIT_LINK_OPTIONS.map(opt => (
                 <label key={opt} className="flex items-center cursor-pointer">
                   <input type="checkbox" checked={formData.auditLinkedTo.includes(opt)} onChange={() => toggleArrayField('auditLinkedTo', opt)} className="text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                   <span className="ml-2 text-sm text-slate-700">{opt}</span>
                 </label>
              ))}
            </div>
          </InputGroup>
          <InputGroup label="Frequenza">
            <div className="flex flex-col gap-2">
              {AUDIT_FREQUENCY_OPTIONS.map(opt => (
                 <label key={opt} className="flex items-center cursor-pointer">
                   <input type="checkbox" checked={formData.auditFrequency.includes(opt)} onChange={() => toggleArrayField('auditFrequency', opt)} className="text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                   <span className="ml-2 text-sm text-slate-700">{opt}</span>
                 </label>
              ))}
            </div>
          </InputGroup>
        </div>

        <InputGroup label="Esecutori / Ruoli">
           <input type="text" placeholder="Chi esegue gli audit?" value={formData.auditExecutors} onChange={(e) => setFormData({...formData, auditExecutors: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
        </InputGroup>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
           <div className="p-3 border rounded-lg bg-slate-50">
             <span className="block text-xs font-bold text-slate-500 mb-2">Import Dati Audit Pregressi?</span>
             <div className="flex gap-3">
               {['Si', 'No'].map(opt => (
                 <label key={opt} className="inline-flex items-center"><input type="radio" name="pastAudit" checked={formData.importPastAuditData === opt} onChange={() => setFormData({...formData, importPastAuditData: opt})} className="text-emerald-600" /><span className="ml-1 text-sm">{opt}</span></label>
               ))}
             </div>
           </div>
           <div className="p-3 border rounded-lg bg-slate-50">
             <span className="block text-xs font-bold text-slate-500 mb-2">Import Checklist Esistenti?</span>
             <div className="flex gap-3">
               {['Si', 'No'].map(opt => (
                 <label key={opt} className="inline-flex items-center"><input type="radio" name="chkImport" checked={formData.importChecklists === opt} onChange={() => setFormData({...formData, importChecklists: opt})} className="text-emerald-600" /><span className="ml-1 text-sm">{opt}</span></label>
               ))}
             </div>
           </div>
        </div>

      </section>

      <div className="pt-6 flex justify-end">
        <button type="button" onClick={handleNext} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
          Prosegui: Workflow <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Intro */}
      <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start justify-between">
         <div className="flex gap-4">
            <div className="bg-violet-100 p-2 rounded-lg text-violet-600 h-fit">
              <GitPullRequest size={24} />
            </div>
            <div>
              <h3 className="font-bold text-violet-900">Workflow Design</h3>
              <p className="text-sm text-violet-800 mt-1 max-w-lg">
                Mappatura dettagliata dei flussi reattivi e proattivi per la configurazione del motore di workflow.
              </p>
            </div>
         </div>
      </div>

      {/* REACTIVE WORKFLOW */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
           <div className="flex items-center gap-2">
             <AlertTriangle className="text-violet-600" size={24} />
             <h2 className="text-xl font-bold text-slate-800">Workflow Standard - Manutenzione Reattiva</h2>
           </div>
           <button type="button" onClick={() => setShowReactiveModal(true)} className="text-violet-600 hover:text-violet-700 text-sm font-medium flex items-center gap-1"><Info size={16} /> Info</button>
        </div>

        <InputGroup label="Chi può aprire un OdL Reattivo?">
           <div className="flex flex-wrap gap-2">
             {WF_OPENER_OPTIONS.map(opt => (
               <label key={opt} className={`px-4 py-2 rounded-full border cursor-pointer text-sm transition-colors ${formData.wfReactiveOpeners.includes(opt) ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-600 border-slate-300 hover:border-violet-300'}`}>
                 <input type="checkbox" className="hidden" checked={formData.wfReactiveOpeners.includes(opt)} onChange={() => toggleArrayField('wfReactiveOpeners', opt)} />
                 {opt}
               </label>
             ))}
           </div>
        </InputGroup>

        <InputGroup label="Automatismi Apertura Ticket">
           <div className="flex flex-wrap gap-2">
             {WF_AUTO_CREATION_OPTIONS.map(opt => (
               <label key={opt} className={`px-4 py-2 rounded-full border cursor-pointer text-sm transition-colors ${formData.wfReactiveAutoCreation.includes(opt) ? 'bg-violet-100 text-violet-800 border-violet-200' : 'bg-white text-slate-600 border-slate-300'}`}>
                 <input type="checkbox" className="hidden" checked={formData.wfReactiveAutoCreation.includes(opt)} onChange={() => toggleArrayField('wfReactiveAutoCreation', opt)} />
                 <span className="flex items-center gap-1">{formData.wfReactiveAutoCreation.includes(opt) && <CheckCircle2 size={12} />}{opt}</span>
               </label>
             ))}
           </div>
        </InputGroup>

        <InputGroup label="Fasi Operative (Seleziona in ordine)" description="Clicca sugli stati per definire la sequenza" error={errors.wfReactivePhases}>
           <div className="flex flex-wrap gap-3">
             {WF_REACTIVE_STATES.map(opt => {
               const idx = formData.wfReactivePhases.indexOf(opt);
               const isSelected = idx >= 0;
               return (
                 <button 
                   key={opt} 
                   type="button"
                   onClick={() => toggleOrderedPhase('wfReactivePhases', opt)}
                   className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${isSelected ? 'bg-violet-600 text-white border-violet-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'}`}
                 >
                   {isSelected && <span className="bg-white text-violet-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{idx + 1}</span>}
                   {opt}
                 </button>
               );
             })}
           </div>
           {formData.wfReactivePhases.length > 0 && (
             <div className="mt-2 text-sm text-slate-500 bg-slate-50 p-2 rounded">
               Sequenza: {formData.wfReactivePhases.join(' → ')}
             </div>
           )}
        </InputGroup>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <InputGroup label="Approvazione Tecnica/Economica?">
             <div className="flex gap-4">
                 {['Si', 'No'].map(opt => (
                   <label key={`app-${opt}`} className="flex items-center cursor-pointer">
                     <input type="radio" name="wfReactApproval" checked={formData.wfReactiveApproval === opt} onChange={() => setFormData({...formData, wfReactiveApproval: opt})} className="text-violet-600" />
                     <span className="ml-2 text-sm">{opt}</span>
                   </label>
                 ))}
             </div>
           </InputGroup>
           <InputGroup label="Tipo Assegnazione">
             <div className="space-y-2">
                <div className="flex gap-4">
                   {['Manuale', 'Automatico'].map(opt => (
                     <label key={`assign-${opt}`} className="flex items-center cursor-pointer">
                       <input type="radio" name="wfReactAssign" checked={formData.wfReactiveAssignmentType === opt} onChange={() => setFormData({...formData, wfReactiveAssignmentType: opt})} className="text-violet-600" />
                       <span className="ml-2 text-sm">{opt}</span>
                     </label>
                   ))}
                </div>
                <input type="text" placeholder="Ruoli abilitati all'assegnazione..." value={formData.wfReactiveAssignerRoles} onChange={(e) => setFormData({...formData, wfReactiveAssignerRoles: e.target.value})} className="w-full p-2 border border-slate-300 rounded text-sm" />
             </div>
           </InputGroup>
        </div>

        <InputGroup label="Assegnazione a">
           <div className="flex gap-4">
             {WF_ASSIGN_TO_OPTIONS.map(opt => (
               <label key={opt} className="flex items-center cursor-pointer">
                 <input type="checkbox" className="rounded border-slate-300 text-violet-600" checked={formData.wfReactiveAssignTo.includes(opt)} onChange={() => toggleArrayField('wfReactiveAssignTo', opt)} />
                 <span className="ml-2 text-sm text-slate-700">{opt}</span>
               </label>
             ))}
           </div>
        </InputGroup>

        <InputGroup label="Obbligatori per Chiusura">
           <div className="flex flex-wrap gap-2">
             {WF_CLOSURE_OPTIONS.map(opt => (
               <label key={opt} className={`px-4 py-2 rounded-full border cursor-pointer text-sm transition-colors ${formData.wfReactiveClosureMandatory.includes(opt) ? 'bg-violet-100 text-violet-800 border-violet-200' : 'bg-white text-slate-600 border-slate-300'}`}>
                 <input type="checkbox" className="hidden" checked={formData.wfReactiveClosureMandatory.includes(opt)} onChange={() => toggleArrayField('wfReactiveClosureMandatory', opt)} />
                 {opt}
               </label>
             ))}
           </div>
        </InputGroup>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {['Allegati Obbligatori', 'RCA Obbligatoria', 'Approvazione Cliente'].map((label, idx) => {
             const key = idx === 0 ? 'wfReactiveAttachments' : idx === 1 ? 'wfReactiveRCA' : 'wfReactiveClientApproval';
             return (
               <div key={key} className="p-3 border rounded-lg bg-slate-50">
                 <span className="block text-xs font-bold text-slate-500 mb-2">{label}?</span>
                 <div className="flex gap-3">
                   {['Si', 'No'].map(opt => (
                     <label key={opt} className="inline-flex items-center">
                       <input 
                         type="radio" 
                         name={key} 
                         checked={(formData as any)[key] === opt} 
                         onChange={() => setFormData({...formData, [key]: opt})} 
                         className="text-violet-600" 
                       />
                       <span className="ml-1 text-sm">{opt}</span>
                     </label>
                   ))}
                 </div>
               </div>
             );
           })}
        </div>

        <InputGroup label="Notifiche (Fasi)">
           <div className="flex flex-wrap gap-2">
             {WF_NOTIFICATIONS_OPTIONS.map(opt => (
               <label key={opt} className={`px-4 py-2 rounded-lg border cursor-pointer text-sm transition-colors ${formData.wfReactiveNotifications.includes(opt) ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-600 border-slate-300'}`}>
                 <input type="checkbox" className="hidden" checked={formData.wfReactiveNotifications.includes(opt)} onChange={() => toggleArrayField('wfReactiveNotifications', opt)} />
                 {opt}
               </label>
             ))}
           </div>
        </InputGroup>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <InputGroup label="Report Automatici?">
             <div className="space-y-2">
               <div className="flex gap-4">
                   {['Si', 'No'].map(opt => (
                     <label key={`rep-${opt}`} className="flex items-center cursor-pointer">
                       <input type="radio" name="wfReactReport" checked={formData.wfReactiveReport === opt} onChange={() => setFormData({...formData, wfReactiveReport: opt})} className="text-violet-600" />
                       <span className="ml-2 text-sm">{opt}</span>
                     </label>
                   ))}
               </div>
               {formData.wfReactiveReport === 'Si' && (
                 <input type="text" placeholder="Frequenza e destinatari..." value={formData.wfReactiveReportDetails} onChange={(e) => setFormData({...formData, wfReactiveReportDetails: e.target.value})} className="w-full p-2 border border-slate-300 rounded text-sm" />
               )}
             </div>
           </InputGroup>
           <InputGroup label="Restrizioni Visibilità">
              <input type="text" placeholder="Quali ruoli vedono cosa?" value={formData.wfReactiveVisibility} onChange={(e) => setFormData({...formData, wfReactiveVisibility: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
           </InputGroup>
        </div>
      </section>

      {/* PROACTIVE WORKFLOW */}
      <section className="space-y-6 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
           <div className="flex items-center gap-2">
             <Wrench className="text-violet-600" size={24} />
             <h2 className="text-xl font-bold text-slate-800">Workflow Standard - Manutenzione Proattiva</h2>
           </div>
           <button type="button" onClick={() => setShowProactiveModal(true)} className="text-violet-600 hover:text-violet-700 text-sm font-medium flex items-center gap-1"><Info size={16} /> Info</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <InputGroup label="Creazione Attività">
             <div className="flex flex-wrap gap-2">
               {WF_PROACTIVE_CREATION_OPTIONS.map(opt => (
                 <label key={opt} className={`px-3 py-1 rounded border cursor-pointer text-sm transition-colors ${formData.wfProactiveCreation.includes(opt) ? 'bg-violet-100 border-violet-300 text-violet-800' : 'bg-white text-slate-600 border-slate-300'}`}>
                   <input type="checkbox" className="hidden" checked={formData.wfProactiveCreation.includes(opt)} onChange={() => toggleArrayField('wfProactiveCreation', opt)} />
                   {opt}
                 </label>
               ))}
             </div>
           </InputGroup>
           <InputGroup label="Chi Pianifica?">
             <div className="flex flex-wrap gap-2">
               {WF_PROACTIVE_PLANNER_OPTIONS.map(opt => (
                 <label key={opt} className={`px-3 py-1 rounded border cursor-pointer text-sm transition-colors ${formData.wfProactivePlanners.includes(opt) ? 'bg-violet-100 border-violet-300 text-violet-800' : 'bg-white text-slate-600 border-slate-300'}`}>
                   <input type="checkbox" className="hidden" checked={formData.wfProactivePlanners.includes(opt)} onChange={() => toggleArrayField('wfProactivePlanners', opt)} />
                   {opt}
                 </label>
               ))}
             </div>
           </InputGroup>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {['Promemoria', 'Team Dedicato', 'Checklist', 'Allegati'].map((label, idx) => {
             const key = idx === 0 ? 'wfProactiveReminders' : idx === 1 ? 'wfProactiveTeam' : idx === 2 ? 'wfProactiveChecklist' : 'wfProactiveAttachments';
             return (
               <div key={key} className="p-3 border rounded-lg bg-slate-50">
                 <span className="block text-xs font-bold text-slate-500 mb-2">{label}?</span>
                 <div className="flex gap-2">
                   {['Si', 'No'].map(opt => (
                     <label key={opt} className="inline-flex items-center">
                       <input 
                         type="radio" 
                         name={key} 
                         checked={(formData as any)[key] === opt} 
                         onChange={() => setFormData({...formData, [key]: opt})} 
                         className="text-violet-600" 
                       />
                       <span className="ml-1 text-sm">{opt}</span>
                     </label>
                   ))}
                 </div>
               </div>
             );
           })}
        </div>

        <InputGroup label="Info Chiusura e Campi">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Campi obbligatori..." value={formData.wfProactiveMandatoryFields} onChange={(e) => setFormData({...formData, wfProactiveMandatoryFields: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
              <input type="text" placeholder="Info da registrare a chiusura..." value={formData.wfProactiveClosureInfo} onChange={(e) => setFormData({...formData, wfProactiveClosureInfo: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
           </div>
        </InputGroup>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <InputGroup label="Validazione Finale">
              <div className="space-y-2">
                 <div className="flex gap-4">
                   {['Si', 'No'].map(opt => (
                     <label key={`val-${opt}`} className="flex items-center cursor-pointer">
                       <input type="radio" name="wfProVal" checked={formData.wfProactiveValidation === opt} onChange={() => setFormData({...formData, wfProactiveValidation: opt})} className="text-violet-600" />
                       <span className="ml-2 text-sm">{opt}</span>
                     </label>
                   ))}
                 </div>
                 {formData.wfProactiveValidation === 'Si' && (
                   <input type="text" placeholder="Ruolo validatore..." value={formData.wfProactiveValidatorRole} onChange={(e) => setFormData({...formData, wfProactiveValidatorRole: e.target.value})} className="w-full p-2 border border-slate-300 rounded text-sm" />
                 )}
              </div>
           </InputGroup>
           <InputGroup label="Permessi (Modifica/Pianifica)">
             <div className="flex flex-wrap gap-2">
               {WF_PROACTIVE_PERMISSIONS_OPTIONS.map(opt => (
                 <label key={opt} className={`px-3 py-1 rounded border cursor-pointer text-sm transition-colors ${formData.wfProactivePermissions.includes(opt) ? 'bg-violet-100 border-violet-300 text-violet-800' : 'bg-white text-slate-600 border-slate-300'}`}>
                   <input type="checkbox" className="hidden" checked={formData.wfProactivePermissions.includes(opt)} onChange={() => toggleArrayField('wfProactivePermissions', opt)} />
                   {opt}
                 </label>
               ))}
             </div>
           </InputGroup>
        </div>

        <InputGroup label="Fasi Operative (Seleziona in ordine)" error={errors.wfProactivePhases}>
           <div className="flex flex-wrap gap-3">
             {WF_PROACTIVE_STATES.map(opt => {
               const idx = formData.wfProactivePhases.indexOf(opt);
               const isSelected = idx >= 0;
               return (
                 <button 
                   key={opt} 
                   type="button"
                   onClick={() => toggleOrderedPhase('wfProactivePhases', opt)}
                   className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${isSelected ? 'bg-violet-600 text-white border-violet-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'}`}
                 >
                   {isSelected && <span className="bg-white text-violet-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{idx + 1}</span>}
                   {opt}
                 </button>
               );
             })}
           </div>
           {formData.wfProactivePhases.length > 0 && (
             <div className="mt-2 text-sm text-slate-500 bg-slate-50 p-2 rounded">
               Sequenza: {formData.wfProactivePhases.join(' → ')}
             </div>
           )}
        </InputGroup>
      </section>

      {/* Navigation Actions */}
      <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
        <button type="button" onClick={handleBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium px-4 py-2">
          <ArrowLeft size={18} /> Indietro
        </button>

        <button
          type="submit"
          disabled={processing.status === 'generating'}
          className={`
            flex items-center gap-2 py-3 px-8 rounded-lg font-bold text-white shadow-lg transform transition-all
            ${processing.status === 'generating' 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 hover:-translate-y-1 hover:shadow-xl'}
          `}
        >
          {processing.status === 'generating' ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Analisi IA...
            </>
          ) : (
            <>
              Genera File Finale
              <Download size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );

  // --- Main View ---

  const Modal = ({ isOpen, onClose, title, content }: { isOpen: boolean, onClose: () => void, title: string, content: string }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative animate-in zoom-in-95 duration-200">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
          <h3 className="text-xl font-bold text-slate-800 mb-4 pr-8">{title}</h3>
          <p className="text-slate-600 whitespace-pre-line leading-relaxed text-sm">
            {content.trim()}
          </p>
        </div>
      </div>
    );
  };

  if (processing.status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 text-center border-t-8 border-green-500 animate-in zoom-in-95 duration-300">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Onboarding Completato!</h2>
          <p className="text-slate-600 mb-6">
            Tutti i dati sono stati acquisiti correttamente.
          </p>

          <div className="bg-slate-50 p-4 rounded-lg text-left mb-6 border border-slate-200 max-h-60 overflow-y-auto">
            <div className="flex items-center gap-2 mb-2 sticky top-0 bg-slate-50 pb-2 border-b border-slate-100">
              <Sparkles size={16} className="text-purple-600" />
              <h3 className="font-semibold text-slate-800 text-sm">Brief Tecnico (Gemini)</h3>
            </div>
            <p className="text-sm text-slate-600 italic whitespace-pre-wrap">{processing.aiSummary}</p>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => generateAndDownloadExcel(formData, processing.aiSummary || "")}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              <Download size={20} />
              Scarica Excel Completo
            </button>
            <button 
              onClick={handleReset}
              className="w-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-semibold py-3 px-6 rounded-lg transition-all"
            >
              Nuova Configurazione
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Helper for timeline circles
  const getCircleClass = (s: number, current: number, color: string) => {
     if (current === s) return `border-${color} bg-${color.replace('text-', 'bg-').replace('600', '50')} text-${color} font-bold`;
     if (current > s) return `border-${color} bg-${color} text-white`;
     return 'border-slate-300 text-slate-500';
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <Modal isOpen={showObjectivesModal} onClose={() => setShowObjectivesModal(false)} title="Obiettivi Eventi" content={OBJECTIVES_POPUP_TEXT} />
      <Modal isOpen={showCAModal} onClose={() => setShowCAModal(false)} title="Azioni Correttive" content={CA_POPUP_TEXT} />
      <Modal isOpen={showAuditModal} onClose={() => setShowAuditModal(false)} title="Obiettivi Audit" content={AUDIT_OBJECTIVES_POPUP_TEXT} />
      <Modal isOpen={showReactiveModal} onClose={() => setShowReactiveModal(false)} title="Manutenzione Reattiva" content={REACTIVE_WORKFLOW_POPUP_TEXT} />
      <Modal isOpen={showProactiveModal} onClose={() => setShowProactiveModal(false)} title="Manutenzione Proattiva" content={PROACTIVE_WORKFLOW_POPUP_TEXT} />

      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl mb-2">
            Mainsim <span className="text-blue-600">Onboarding</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Wizard di configurazione: Istanza, Asset, Wizard, Eventi & Audit
          </p>
        </div>

        {/* Step Indicator (Interactive) */}
        <div className="mb-8 flex justify-center items-center gap-2 sm:gap-4 overflow-x-auto py-2">
           {/* Step 1 */}
           <button type="button" onClick={() => handleStepClick(1)} className={`flex items-center gap-2 focus:outline-none transition-all group ${step === 1 ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${step === 1 ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold' : (step > 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-slate-500')}`}>
               {step > 1 ? <CheckCircle2 size={16} /> : 1}
             </div>
             <span className={`text-sm font-medium hidden sm:inline ${step === 1 ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-600'}`}>Istanza</span>
           </button>
           <div className={`h-1 bg-slate-200 relative rounded-full overflow-hidden w-6 sm:w-8`}>
             <div className={`absolute left-0 top-0 h-full bg-blue-600 transition-all duration-500 ease-out ${step > 1 ? 'w-full' : 'w-0'}`}></div>
           </div>

           {/* Step 2 */}
           <button type="button" onClick={() => handleStepClick(2)} className={`flex items-center gap-2 focus:outline-none transition-all group ${step === 2 ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${step === 2 ? 'border-indigo-600 bg-indigo-50 text-indigo-600 font-bold' : (step > 2 ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 text-slate-500')}`}>
               {step > 2 ? <CheckCircle2 size={16} /> : 2}
             </div>
             <span className={`text-sm font-medium hidden sm:inline ${step === 2 ? 'text-indigo-600' : 'text-slate-500 group-hover:text-indigo-600'}`}>Asset</span>
           </button>
           <div className={`h-1 bg-slate-200 relative rounded-full overflow-hidden w-6 sm:w-8`}>
             <div className={`absolute left-0 top-0 h-full bg-indigo-600 transition-all duration-500 ease-out ${step > 2 ? 'w-full' : 'w-0'}`}></div>
           </div>

           {/* Step 3 */}
           <button type="button" onClick={() => handleStepClick(3)} className={`flex items-center gap-2 focus:outline-none transition-all group ${step === 3 ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${step === 3 ? 'border-yellow-500 bg-yellow-50 text-yellow-600 font-bold' : (step > 3 ? 'border-yellow-500 bg-yellow-500 text-white' : 'border-slate-300 text-slate-500')}`}>
               {step > 3 ? <CheckCircle2 size={16} /> : 3}
             </div>
             <span className={`text-sm font-medium hidden sm:inline ${step === 3 ? 'text-yellow-600' : 'text-slate-500 group-hover:text-yellow-600'}`}>Wizard</span>
           </button>
           <div className={`h-1 bg-slate-200 relative rounded-full overflow-hidden w-6 sm:w-8`}>
             <div className={`absolute left-0 top-0 h-full bg-yellow-500 transition-all duration-500 ease-out ${step > 3 ? 'w-full' : 'w-0'}`}></div>
           </div>

           {/* Step 4 */}
           <button type="button" onClick={() => handleStepClick(4)} className={`flex items-center gap-2 focus:outline-none transition-all group ${step === 4 ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${step === 4 ? 'border-rose-600 bg-rose-50 text-rose-600 font-bold' : (step > 4 ? 'border-rose-600 bg-rose-600 text-white' : 'border-slate-300 text-slate-500')}`}>
               {step > 4 ? <CheckCircle2 size={16} /> : 4}
             </div>
             <span className={`text-sm font-medium hidden sm:inline ${step === 4 ? 'text-rose-600' : 'text-slate-500 group-hover:text-rose-600'}`}>Eventi</span>
           </button>
           <div className={`h-1 bg-slate-200 relative rounded-full overflow-hidden w-6 sm:w-8`}>
             <div className={`absolute left-0 top-0 h-full bg-rose-600 transition-all duration-500 ease-out ${step > 4 ? 'w-full' : 'w-0'}`}></div>
           </div>

           {/* Step 5 */}
           <button type="button" onClick={() => handleStepClick(5)} className={`flex items-center gap-2 focus:outline-none transition-all group ${step === 5 ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${step === 5 ? 'border-emerald-600 bg-emerald-50 text-emerald-600 font-bold' : (step > 5 ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 text-slate-500')}`}>
               {step > 5 ? <CheckCircle2 size={16} /> : 5}
             </div>
             <span className={`text-sm font-medium hidden sm:inline ${step === 5 ? 'text-emerald-600' : 'text-slate-500 group-hover:text-emerald-600'}`}>Audit</span>
           </button>
           <div className={`h-1 bg-slate-200 relative rounded-full overflow-hidden w-6 sm:w-8`}>
             <div className={`absolute left-0 top-0 h-full bg-emerald-600 transition-all duration-500 ease-out ${step > 5 ? 'w-full' : 'w-0'}`}></div>
           </div>

           {/* Step 6 */}
           <button type="button" onClick={() => handleStepClick(6)} className={`flex items-center gap-2 focus:outline-none transition-all group ${step === 6 ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${step === 6 ? 'border-violet-600 bg-violet-50 text-violet-600 font-bold' : 'border-slate-300 text-slate-500'}`}>
               6
             </div>
             <span className={`text-sm font-medium hidden sm:inline ${step === 6 ? 'text-violet-600' : 'text-slate-500 group-hover:text-violet-600'}`}>Workflow</span>
           </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <form onSubmit={handleSubmit} className="p-8">
             {step === 1 && renderStep1()}
             {step === 2 && renderStep2()}
             {step === 3 && renderStep3()}
             {step === 4 && renderStep4()}
             {step === 5 && renderStep5()}
             {step === 6 && renderStep6()}
          </form>
        </div>
        
        <p className="text-center text-slate-400 text-sm mt-8">
          &copy; {new Date().getFullYear()} Mainsim.cloud Operations
        </p>
      </div>
    </div>
  );
};

export default App;