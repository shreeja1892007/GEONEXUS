import React from 'react';
import { Bell, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CitizenLayout } from '../../components/layout/CitizenLayout';
import { MOCK_NOTIFICATIONS } from '../../data/mockParcels';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <CitizenLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-navy">Notifications</h1>
        <p className="text-xs text-slate-500 mt-1">System alerts and updates for your linked parcels.</p>
      </div>

      <div className="space-y-3">
        {MOCK_NOTIFICATIONS.map((notif) => (
          <div
            key={notif.id}
            className={`bg-white border rounded-2xl px-5 py-4 shadow-card hover:shadow-card-hover transition-all cursor-pointer ${
              !notif.read ? 'border-navy/30 ring-1 ring-navy/10' : 'border-slate-200'
            }`}
            onClick={() => notif.ulpin && navigate(`/citizen/parcel/${notif.ulpin}`)}
          >
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${ !notif.read ? 'bg-navy text-white' : 'bg-slate-100 text-slate-500'}`}>
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm font-bold ${ !notif.read ? 'text-navy' : 'text-slate-700'}`}>
                    {notif.title}
                  </p>
                  {!notif.read && (
                    <span className="shrink-0 w-2 h-2 rounded-full bg-[#C53A3A]" />
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notif.message}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">{notif.date}</span>
                  {notif.ulpin && (
                    <span className="flex items-center gap-1 text-[11px] text-tealAccent font-medium">
                      <MapPin className="w-3 h-3" />
                      View Parcel
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CitizenLayout>
  );
};
