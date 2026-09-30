import React, { useRef } from 'react';
import { Upload, File, X, CheckCircle2 } from 'lucide-react';
import type { ApplicationDocument } from '../../types/application';
import type { DocumentRequirement } from '../../types/citizenService';

interface DocumentUploaderProps {
  requirements: DocumentRequirement[];
  documents: ApplicationDocument[];
  onDocumentChange: (docId: string, fileName: string | null) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  requirements,
  documents,
  onDocumentChange,
}) => {
  const getDoc = (id: string) => documents.find((d) => d.id === id);

  return (
    <div className="space-y-3">
      {requirements.map((req) => {
        const doc = getDoc(req.id);
        const isUploaded = Boolean(doc?.uploaded && doc?.fileName);

        return (
          <DocumentUploadRow
            key={req.id}
            requirement={req}
            doc={doc || null}
            isUploaded={isUploaded}
            onChange={(fileName) => onDocumentChange(req.id, fileName)}
          />
        );
      })}
    </div>
  );
};

interface DocumentUploadRowProps {
  requirement: DocumentRequirement;
  doc: ApplicationDocument | null;
  isUploaded: boolean;
  onChange: (fileName: string | null) => void;
}

const DocumentUploadRow: React.FC<DocumentUploadRowProps> = ({ requirement, doc, isUploaded, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(file.name);
  };

  return (
    <div
      className={`flex items-center justify-between gap-3 p-4 rounded-xl border transition-all ${
        isUploaded
          ? 'border-emerald-200 bg-emerald-50/50'
          : requirement.required
          ? 'border-slate-300 bg-white'
          : 'border-dashed border-slate-300 bg-slate-50/50'
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            isUploaded ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
          }`}
        >
          {isUploaded ? <CheckCircle2 className="w-4 h-4" /> : <File className="w-4 h-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-navy flex items-center gap-1.5">
            {requirement.label}
            {requirement.required ? (
              <span className="text-red-500 text-[10px]">Required</span>
            ) : (
              <span className="text-slate-400 text-[10px]">Optional</span>
            )}
          </p>
          {isUploaded && doc?.fileName ? (
            <p className="text-[11px] text-emerald-600 truncate">{doc.fileName}</p>
          ) : (
            <p className="text-[11px] text-slate-400">{requirement.hint || 'PDF, JPG, PNG accepted'}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isUploaded && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-colors ${
            isUploaded
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              : requirement.required
              ? 'bg-navy text-white hover:bg-navy/90'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Upload className="w-3 h-3" />
          {isUploaded ? 'Replace' : 'Upload'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
