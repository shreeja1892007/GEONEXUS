import React, { useState } from 'react';
import {
  GitPullRequest,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { GovernmentLayout } from '../../components/layout/GovernmentLayout';
import { useAuth } from '../../context/AuthContext';

interface WorkflowDefinition {
  id: string;
  title: string;
  description: string;
  stages: string[];
  activeCount: number;
  completedThisMonth: number;
  avgTurnaroundDays: number;
}

export const GovernmentWorkflowsPage: React.FC = () => {
  const { currentGovUser } = useAuth();

  const officerRole = currentGovUser?.officialRole || 'Government Officer';
  const departmentName = currentGovUser?.department || 'Department of Land Resources';
  const districtName = currentGovUser?.districtOffice || 'Chennai District';

  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('wf-01');

  // Department-aware workflows
  const isWater = departmentName === 'Water Resources Department';
  const isRevenue = departmentName === 'Revenue Department';
  const isPlanning = departmentName === 'Town & Country Planning Department';

  const workflows: WorkflowDefinition[] = isWater
    ? [
        {
          id: 'wf-01',
          title: 'Canal & Waterbody Complaint Resolution Workflow',
          description: 'Standard multi-stage procedure for investigating canal obstructions and waterbody complaints.',
          stages: ['Citizen Grievance Lodged', 'Field Survey & Inspection', 'Encroachment / Maintenance Notice', 'Remediation & Closure'],
          activeCount: 12,
          completedThisMonth: 28,
          avgTurnaroundDays: 4,
        },
        {
          id: 'wf-02',
          title: 'Water Extraction & NOC Permission Workflow',
          description: 'Approval process for commercial and industrial groundwater extraction clearance.',
          stages: ['Application Submission', 'Aquifer Impact Assessment', 'Inter-Departmental Review', 'NOC Certificate Issuance'],
          activeCount: 7,
          completedThisMonth: 15,
          avgTurnaroundDays: 7,
        },
        {
          id: 'wf-03',
          title: 'Lake Boundary & Encroachment Verification',
          description: 'Joint revenue-water spatial verification for bund preservation.',
          stages: ['Encroachment Tagged', 'Cadastral Boundary Mapping', 'Legal Eviction Notice', 'Restoration Completed'],
          activeCount: 6,
          completedThisMonth: 9,
          avgTurnaroundDays: 12,
        },
      ]
    : isRevenue
    ? [
        {
          id: 'wf-01',
          title: 'Patta Transfer & Name Mutation Workflow',
          description: 'Official procedure for post-registration title transfer in Revenue records.',
          stages: ['Sub-Registrar Intimation', 'VAO Field Verification', 'Tahsildar Approval', 'Digital Patta Generated'],
          activeCount: 24,
          completedThisMonth: 142,
          avgTurnaroundDays: 5,
        },
        {
          id: 'wf-02',
          title: 'Record of Rights (RoR) Correction Workflow',
          description: 'Correction of survey extent, land classification, or joint owner names.',
          stages: ['Petition Received', 'Revenue Inspector Report', 'RDO Order Passed', 'Database Updated'],
          activeCount: 9,
          completedThisMonth: 31,
          avgTurnaroundDays: 8,
        },
      ]
    : isPlanning
    ? [
        {
          id: 'wf-01',
          title: 'Building Plan Approval & Zoning Clearance',
          description: 'Technical appraisal for commercial and residential construction permissions.',
          stages: ['Plan Submission', 'FSI & Setback Verification', 'Fire/Water NOC Check', 'Permit Issued'],
          activeCount: 18,
          completedThisMonth: 54,
          avgTurnaroundDays: 10,
        },
      ]
    : [
        {
          id: 'wf-01',
          title: 'Standard Departmental Application Review',
          description: 'Official review and decision workflow for citizen services.',
          stages: ['Submitted & Routed', 'Under Review', 'Officer Recommendation', 'Final Order Issued'],
          activeCount: 14,
          completedThisMonth: 48,
          avgTurnaroundDays: 6,
        },
      ];

  const currentWorkflow = workflows.find((w) => w.id === selectedWorkflowId) || workflows[0];

  return (
    <GovernmentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center shrink-0 shadow-sm">
              <GitPullRequest className="w-6 h-6 text-tealAccent-light" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-navy">DEPARTMENT WORKFLOWS</h1>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                {departmentName} • {officerRole} ({districtName})
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-navy/10 text-navy font-semibold rounded-xl text-xs border border-navy/20">
            {workflows.length} Active Workflows
          </span>
        </div>

        {/* Workflow Selection & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Workflow List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider px-1">Configured Workflows</h3>
            {workflows.map((wf) => (
              <button
                key={wf.id}
                type="button"
                onClick={() => setSelectedWorkflowId(wf.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  wf.id === currentWorkflow.id
                    ? 'bg-navy text-white border-navy shadow-md'
                    : 'bg-white text-navy border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    wf.id === currentWorkflow.id ? 'bg-tealAccent text-navy' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {wf.activeCount} Active Cases
                  </span>
                  <ArrowRight className={`w-4 h-4 ${wf.id === currentWorkflow.id ? 'text-tealAccent-light' : 'text-slate-400'}`} />
                </div>
                <h4 className="text-sm font-bold truncate">{wf.title}</h4>
                <p className={`text-xs mt-1 line-clamp-2 ${wf.id === currentWorkflow.id ? 'text-slate-300' : 'text-slate-500'}`}>
                  {wf.description}
                </p>
              </button>
            ))}
          </div>

          {/* Right Column: Workflow Stage Breakdown */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workflow Details</span>
              <h2 className="text-lg font-bold text-navy mt-1">{currentWorkflow.title}</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{currentWorkflow.description}</p>
            </div>

            {/* Performance KPIs */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Active Cases</span>
                <span className="text-lg font-bold text-navy">{currentWorkflow.activeCount}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Completed (Month)</span>
                <span className="text-lg font-bold text-emerald-600">{currentWorkflow.completedThisMonth}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Avg Turnaround</span>
                <span className="text-lg font-bold text-primaryBlue">{currentWorkflow.avgTurnaroundDays} Days</span>
              </div>
            </div>

            {/* Workflow Stages Flow */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider">Sequential Workflow Stages</h3>
              <div className="space-y-2">
                {currentWorkflow.stages.map((stage, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-navy">{stage}</p>
                      <p className="text-[11px] text-slate-500">Official step {idx + 1} for {departmentName}</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert(`Initiated custom workflow instance for ${currentWorkflow.title}`)}
              className="w-full py-2.5 bg-navy text-white text-xs font-semibold rounded-xl hover:bg-navy/90 transition-colors"
            >
              Start New Workflow Instance
            </button>
          </div>
        </div>
      </div>
    </GovernmentLayout>
  );
};

