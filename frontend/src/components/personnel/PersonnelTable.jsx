import React from 'react';
import { User, MapPin, Compass, AlertCircle } from 'lucide-react';

const PersonnelTable = ({ personnel = [], onRowClick, selectedPersonId }) => {
  const getStatusBadgeStyle = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'UNREACHABLE') {
      return 'bg-rose-50 text-rose-800 border-rose-200 font-bold';
    }
    if (s === 'IN TRANSIT') {
      return 'bg-blue-50 text-blue-800 border-blue-200 font-semibold';
    }
    if (s === 'ACTIVE') {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="bg-white rounded-lg border border-polar-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left text-xs">
          <thead className="bg-slate-50 text-polar-textMuted font-semibold border-b border-polar-border uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Expedition</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-polar-border font-medium">
            {personnel.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-polar-textMuted">
                  <div className="flex flex-col items-center gap-2">
                    <User className="w-6 h-6 text-slate-400" />
                    <span>No personnel records match the selected criteria.</span>
                  </div>
                </td>
              </tr>
            ) : (
              personnel.map((person) => {
                const isSelected = selectedPersonId === person.person_id;
                return (
                  <tr
                    key={person.person_id}
                    onClick={() => onRowClick(person.person_id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-slate-100/90 font-semibold'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* 1. Name */}
                    <td className="py-3.5 px-4 text-polar-text">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{person.name}</span>
                        {person.status === 'UNREACHABLE' && (
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" title="Unreachable personnel" />
                        )}
                      </div>
                      <div className="text-[11px] text-polar-textMuted font-normal">
                        Dept: {person.department}
                      </div>
                    </td>

                    {/* 2. Role */}
                    <td className="py-3.5 px-4 text-polar-text font-medium">
                      {person.role}
                    </td>

                    {/* 3. Expedition */}
                    <td className="py-3.5 px-4 text-polar-textMuted">
                      <div className="flex items-center gap-1.5 max-w-[220px] truncate" title={person.expedition || 'Unassigned'}>
                        <Compass className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{person.expedition || 'Unassigned'}</span>
                      </div>
                    </td>

                    {/* 4. Location */}
                    <td className="py-3.5 px-4 text-polar-textMuted">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{person.current_location}</span>
                      </div>
                    </td>

                    {/* 5. Status */}
                    <td className="py-3.5 px-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider border ${getStatusBadgeStyle(person.status)}`}>
                        {person.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PersonnelTable;
