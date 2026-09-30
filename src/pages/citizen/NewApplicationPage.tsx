import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FilePlus2,
  Eye,
} from 'lucide-react';
import { CitizenLayout } from '../../components/layout/CitizenLayout';
import { ApplicationStepper } from '../../components/applications/ApplicationStepper';
import { PurposeSelector } from '../../components/applications/PurposeSelector';
import { RoutingInfoCard } from '../../components/applications/RoutingInfoCard';
import { ParcelLocationSelector } from '../../components/applications/ParcelLocationSelector';
import { DynamicApplicationForm } from '../../components/applications/DynamicApplicationForm';
import { DocumentUploader } from '../../components/applications/DocumentUploader';
import { ApplicationReview } from '../../components/applications/ApplicationReview';
import { useApplications } from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';
import type { CitizenServiceDefinition } from '../../types/citizenService';
import type { Parcel } from '../../types/parcel';
import type { ApplicationLocation, ApplicationDocument, CitizenApplicationRecord } from '../../types/application';

const EMPTY_LOCATION: ApplicationLocation = {
  state: '',
  district: '',
  localBody: '',
  villageOrWard: '',
  taluk: '',
  panchayat: '',
  landmark: '',
  description: '',
};

export const NewApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addApplication } = useApplications();

  const [currentStep, setCurrentStep] = useState(1);
  const [service, setService] = useState<CitizenServiceDefinition | null>(null);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [location, setLocation] = useState<ApplicationLocation>(EMPTY_LOCATION);
  const [requestDetails, setRequestDetails] = useState<Record<string, string>>({});
  const [documents, setDocuments] = useState<ApplicationDocument[]>([]);
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<CitizenApplicationRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);

  const handleServiceChange = (svc: CitizenServiceDefinition) => {
    setService(svc);
    setRequestDetails({});
    // Initialize documents list
    setDocuments(svc.requiredDocuments.map((req) => ({
      id: req.id,
      name: req.label,
      fileName: '',
      required: req.required,
      uploaded: false,
    })));
    setStepError(null);
  };

  const handleFieldChange = (id: string, value: string) => {
    setRequestDetails((prev) => ({ ...prev, [id]: value }));
  };

  const handleDocumentChange = (docId: string, fileName: string | null) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, fileName: fileName || '', uploaded: !!fileName }
          : d
      )
    );
  };

  const handleLocationChange = (patch: Partial<ApplicationLocation>) => {
    setLocation((prev) => ({ ...prev, ...patch }));
  };

  const validateStep = (): boolean => {
    setStepError(null);
    if (currentStep === 1) {
      if (!service) { setStepError('Please select a citizen purpose.'); return false; }
    }
    if (currentStep === 2) {
      if (service?.requiresParcel && !service.allowsLocationOnly && !selectedParcel) {
        setStepError('Please select a parcel for this purpose.'); return false;
      }
      if (!selectedParcel) {
        if (!location.state) { setStepError('Please select a State / UT.'); return false; }
        if (!location.district) { setStepError('Please enter a District.'); return false; }
      }
    }
    if (currentStep === 3) {
      if (service) {
        for (const field of service.fields) {
          if (field.required && !requestDetails[field.id]?.trim()) {
            setStepError(`Please fill in: ${field.label}`);
            return false;
          }
        }
      }
    }
    if (currentStep === 4) {
      const missingRequired = documents.filter((d) => d.required && !d.uploaded);
      if (missingRequired.length > 0) {
        setStepError(`Please upload: ${missingRequired.map((d) => d.name).join(', ')}`);
        return false;
      }
    }
    if (currentStep === 5) {
      if (!declarationChecked) { setStepError('Please accept the declaration before submitting.'); return false; }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setCurrentStep((s) => s + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setStepError(null);
    setCurrentStep((s) => Math.max(1, s - 1));
    window.scrollTo(0, 0);
  };

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!validateStep()) return;
    if (!service || !currentUser) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const appLocation: ApplicationLocation = selectedParcel
        ? {
            state: selectedParcel.state,
            district: selectedParcel.district,
            villageOrWard: selectedParcel.village,
          }
        : location;

      const result = await addApplication({
        citizenId: currentUser.id,
        citizenName: currentUser.fullName,
        citizenMobile: currentUser.mobile,
        citizenEmail: currentUser.email,
        purposeId: service.id,
        purposeLabel: service.label,
        category: service.category,
        parcelId: selectedParcel?.id,
        ulpin: selectedParcel?.ulpin,
        surveyNumber: selectedParcel?.surveyNumber,
        location: appLocation,
        requestDetails,
        documents,
        targetDepartment: service.targetDepartment,
        targetRole: service.primaryRole,
        fallbackDepartments: service.fallbackDepartments,
        fallbackRoles: service.fallbackRoles,
        collaboratingDepartments: service.collaboratingDepartments,
        collaboratingRoles: service.collaboratingRoles,
      });

      setSubmittedApp(result);
      setCurrentStep(6);
      window.scrollTo(0, 0);
    } catch (err: any) {
      console.error('[Application Submission Error]:', err);
      setSubmitError(err?.message || 'Application could not be submitted. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles: Record<number, { heading: string; subtitle: string }> = {
    1: { heading: 'What would you like to request?', subtitle: 'Select the citizen purpose that best describes your need.' },
    2: { heading: 'Select Property or Location', subtitle: 'Identify the property or location this request relates to.' },
    3: { heading: 'Request Details', subtitle: 'Provide specific details for your selected purpose.' },
    4: { heading: 'Upload Documents', subtitle: 'Attach required supporting documents.' },
    5: { heading: 'Review & Submit', subtitle: 'Review your application before submitting.' },
    6: { heading: 'Application Submitted', subtitle: 'Your request has been submitted and routed.' },
  };

  const current = stepTitles[currentStep];

  return (
    <CitizenLayout>
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate('/citizen/applications')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Applications
          </button>
          <h1 className="text-xl font-bold text-navy">New Application Request</h1>
          <p className="text-xs text-slate-500 mt-1">
            Submit a request for land, property, planning, infrastructure or citizen services.
          </p>
        </div>

        {/* Stepper */}
        {currentStep < 6 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6 flex justify-center">
            <ApplicationStepper currentStep={currentStep} />
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {/* Step Title */}
          {currentStep < 6 && (
            <div className="mb-6 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <ClipboardList className="w-4 h-4 text-tealAccent" />
                <span className="text-[11px] font-bold text-tealAccent uppercase tracking-wider">
                  Step {currentStep} of 5
                </span>
              </div>
              <h2 className="text-lg font-bold text-navy">{current.heading}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{current.subtitle}</p>
            </div>
          )}

          {/* STEP 1: PURPOSE */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-navy">
                  Citizen Purpose <span className="text-red-500">*</span>
                </label>
                <PurposeSelector
                  value={service?.id || ''}
                  onChange={handleServiceChange}
                />
              </div>
              {service && <RoutingInfoCard service={service} />}
            </div>
          )}

          {/* STEP 2: PARCEL/LOCATION */}
          {currentStep === 2 && service && (
            <ParcelLocationSelector
              allowsLocationOnly={service.allowsLocationOnly}
              requiresParcel={service.requiresParcel}
              selectedParcel={selectedParcel}
              location={location}
              onParcelSelect={setSelectedParcel}
              onLocationChange={handleLocationChange}
            />
          )}

          {/* STEP 3: REQUEST DETAILS */}
          {currentStep === 3 && service && (
            <div className="space-y-4">
              {/* Common fields: description/remarks */}
              <DynamicApplicationForm
                fields={service.fields}
                values={requestDetails}
                onChange={handleFieldChange}
              />
              {/* Description / Remarks */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-navy">Additional Remarks</label>
                <textarea
                  rows={3}
                  value={requestDetails['_remarks'] || ''}
                  onChange={(e) => handleFieldChange('_remarks', e.target.value)}
                  placeholder="Any additional information or special instructions..."
                  className="w-full px-3 py-2 text-sm text-navy bg-white border border-slate-300 rounded-xl focus:border-navy focus:ring-2 focus:ring-navy/10 focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4: DOCUMENTS */}
          {currentStep === 4 && service && (
            <div className="space-y-4">
              {documents.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">No documents required for this purpose.</p>
              ) : (
                <DocumentUploader
                  requirements={service.requiredDocuments}
                  documents={documents}
                  onDocumentChange={handleDocumentChange}
                />
              )}
            </div>
          )}

          {/* STEP 5: REVIEW */}
          {currentStep === 5 && service && (
            <>
              {submitError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-semibold flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{submitError}</span>
                </div>
              )}
              <ApplicationReview
              appData={{
                citizenName: currentUser?.fullName || '',
                citizenMobile: currentUser?.mobile || '',
                citizenEmail: currentUser?.email,
                purposeLabel: service.label,
                category: service.category,
                selectedParcel,
                location,
                requestDetails,
                documents,
                targetDepartment: service.targetDepartment,
                targetRole: service.primaryRole,
              }}
              service={service}
              declarationChecked={declarationChecked}
              onDeclarationChange={setDeclarationChecked}
            />
          </>
          )}

          {/* STEP 6: SUCCESS */}
          {currentStep === 6 && submittedApp && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl font-bold text-navy mb-1">Application Submitted Successfully</h2>
              <p className="text-sm text-slate-500 mb-6">Your request has been submitted and automatically routed.</p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-3 max-w-md mx-auto mb-8">
                <div className="text-center">
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Application ID</p>
                  <p className="text-2xl font-bold font-mono text-navy mt-1">{submittedApp.applicationId}</p>
                </div>
                <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 w-24">Purpose:</span>
                    <span className="font-semibold text-navy">{submittedApp.purposeLabel}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 w-24">Routed to:</span>
                    <span className="font-semibold text-navy">{submittedApp.targetDepartment}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 w-24">Officer Role:</span>
                    <span className="font-semibold text-navy">{submittedApp.targetRole}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 w-24">Status:</span>
                    <span className="font-semibold text-[#2E7D32]">{submittedApp.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => navigate(`/citizen/applications/${submittedApp.applicationId}`)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-navy text-white text-xs font-semibold rounded-xl"
                >
                  <Eye className="w-4 h-4" />
                  View Application
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/citizen/dashboard')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* Error */}
          {stepError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
              {stepError}
            </div>
          )}

          {/* Navigation */}
          {currentStep < 6 && (
            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy disabled:opacity-40 disabled:cursor-not-allowed py-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy text-white text-xs font-semibold rounded-xl hover:bg-navy/90 transition-colors"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !declarationChecked}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2E7D32] text-white text-xs font-semibold rounded-xl hover:bg-[#256429] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  <FilePlus2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </CitizenLayout>
  );
};
