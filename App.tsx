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
  PlayCircle
} from 'lucide-react';
import { InputGroup } from './components/InputGroup';
import { 
  AuthMode, 
  RestrictionType, 
  OnboardingData, 
  ProcessingState,
  AssetDataFormat,
  MainsimRole,
  QrCodeGoal
} from './types';
import { 
  DEFAULT_COLOR, 
  DOMAIN_SUFFIX, 
  ASSET_TUTORIAL_URL,
  ASSET_FIELDS_CONFIG,
  LABEL_INFO_OPTIONS
} from './constants';
import { generateImplementationBrief } from './services/geminiService';
import { generateAndDownloadExcel } from './services/excelService';

const App: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<OnboardingData>({
    // Step 1
    instanceName: '',
    brandColor: DEFAULT_COLOR,
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
    labelInfo: []
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

  // --- Navigation ---

  const handleStepClick = (targetStep: number) => {
    // Allows free navigation without validation
    setStep(targetStep);
    setErrors({}); // Clear errors to give a clean view
    window.scrollTo(0, 0);
  };

  const handleNext = () => {
    // Standard "Next" button retains validation for UX guidance
    const step1Errors = getStep1Errors();
    if (Object.keys(step1Errors).length > 0) {
      setErrors(step1Errors);
      return;
    }
    setStep(2);
    setErrors({});
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setStep(1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate ALL steps before submission
    const step1Errors = getStep1Errors();
    const step2Errors = getStep2Errors();
    const allErrors = { ...step1Errors, ...step2Errors };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      alert("Attenzione: Ci sono campi obbligatori incompleti in uno o più passaggi. Verifica i dati inseriti.");
      
      // If we are on step 2 but errors are only in step 1, we might want to alert the user specifically,
      // but showing the alert above is usually sufficient.
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
            Configurazione Istanza e Asset acquisita.
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

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl mb-2">
            Mainsim <span className="text-blue-600">Onboarding</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Wizard di configurazione: Istanza & Asset
          </p>
        </div>

        {/* Step Indicator (Interactive) */}
        <div className="mb-8 flex justify-center items-center gap-4">
           <button 
             type="button" 
             onClick={() => handleStepClick(1)}
             className={`flex items-center gap-2 focus:outline-none transition-all group ${step === 1 ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
           >
             <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${step === 1 ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold' : (step > 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-slate-500')}`}>
               {step > 1 ? <CheckCircle2 size={16} /> : 1}
             </div>
             <span className={`text-sm font-medium ${step === 1 ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-600'}`}>Istanza</span>
           </button>

           <div className="w-16 h-1 bg-slate-200 relative rounded-full overflow-hidden">
             <div className={`absolute left-0 top-0 h-full bg-blue-600 transition-all duration-500 ease-out ${step === 2 ? 'w-full' : 'w-0'}`}></div>
           </div>

           <button 
             type="button" 
             onClick={() => handleStepClick(2)}
             className={`flex items-center gap-2 focus:outline-none transition-all group ${step === 2 ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
           >
             <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${step === 2 ? 'border-indigo-600 bg-indigo-50 text-indigo-600 font-bold' : 'border-slate-300 text-slate-500'}`}>
               2
             </div>
             <span className={`text-sm font-medium ${step === 2 ? 'text-indigo-600' : 'text-slate-500 group-hover:text-indigo-600'}`}>Asset</span>
           </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <form onSubmit={handleSubmit} className="p-8">
             {step === 1 ? renderStep1() : renderStep2()}
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