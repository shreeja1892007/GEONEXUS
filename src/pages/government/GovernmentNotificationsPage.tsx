import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  FileText,
  Check,
} from 'lucide-react';
import { GovernmentLayout } from '../../components/layout/GovernmentLayout';
import { useAuth } from '../../context/AuthContext';
import { useApplications } from '../../context/ApplicationContext';

interface GovNotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'request' | 'alert' | 'update';
}

export const GovernmentNotificationsPage: React.FC = () => {
  const { currentGovUser } = useAuth();
  const { getApplicationsForGovUser } = useApplications();

  const departmentName = currentGovUser?.department || 'Department of Land Resources';
  const officerRole = currentGovUser?.officialRole || 'Government Officer';
  const districtName = currentGovUser?.districtOffice || 'Chennai District';

  const myApps = currentGovUser ? getApplicationsForGovUser(currentGovUser) : [];
  const latestApp = myApps[0];

  const [items, setItems] = useState<GovNotificationItem[]>([
    {
      id: 'n-101',
      title: 'New Citizen Request Submitted',
      message: latestApp
        ? `Application ${latestApp.applicationId} (${latestApp.purposeLabel}) has been routed to your department.`
        : 'New application routed to your department queue.',
      time: '10 minutes ago',
      read: false,
      type: 'request',
    },
    {
      id: 'n-102',
      title: 'Critical Department Alert',
      message: `System alert raised for ${districtName}: High priority verification flagged.`,
      time: '1 hour ago',
      read: false,
      type: 'alert',
    },
    {
      id: 'n-103',
      title: 'Citizen Responded with Additional Information',
      message: 'Applicant attached supporting documents for review.',
      time: '3 hours ago',
      read: false,
      type: 'update',
    },
    {
      id: 'n-104',
      title: 'Inter-Departmental Clearance Update',
      message: 'Survey & Settlement Department updated boundaries for block 54/2B.',
      time: '1 day ago',
      read: true,
      type: 'update',
    },
  ]);

  const markAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const toggleRead = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: !item.read } : item)));
  };

  const unreadCount = items.filter((i) => !i.read).length;

  return (
    <GovernmentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center shrink-0 shadow-sm">
              <Bell className="w-6 h-6 text-tealAccent-light" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-navy">DEPARTMENT NOTIFICATIONS</h1>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#C53A3A] text-white">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                {departmentName} • {officerRole} ({districtName})
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-navy font-semibold rounded-xl border border-slate-300 text-xs transition-colors"
            >
              <Check className="w-4 h-4 text-emerald-600" />
              Mark All as Read
            </button>
          )}
        </div>

        {/* Notifications List Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100">
            <span className="text-xs font-bold text-navy uppercase tracking-wider">
              {items.length} Recent Alerts & Notifications
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleRead(item.id)}
                className={`py-3.5 px-3 flex items-start justify-between gap-4 rounded-xl cursor-pointer transition-colors ${
                  item.read ? 'hover:bg-slate-50 opacity-80' : 'bg-blue-50/50 hover:bg-blue-50 border-l-4 border-primaryBlue'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {item.type === 'alert' ? (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    ) : item.type === 'request' ? (
                      <FileText className="w-5 h-5 text-primaryBlue" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-bold ${item.read ? 'text-navy' : 'text-primaryBlue'}`}>
                        {item.title}
                      </p>
                      {!item.read && <span className="w-2 h-2 rounded-full bg-primaryBlue" />}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.message}</p>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">{item.time}</span>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 hover:text-navy shrink-0 font-medium">
                  {item.read ? 'Mark Unread' : 'Mark Read'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GovernmentLayout>
  );
};

