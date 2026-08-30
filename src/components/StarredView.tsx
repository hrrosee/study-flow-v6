import React from 'react';
import { Star, Folder, ArrowRight } from 'lucide-react';
import { Workspace } from '../types';

interface StarredViewProps {
  workspaces: Workspace[];
  onSelectWorkspace: (id: string) => void;
  onToggleStarWorkspace: (id: string) => void;
}

export const StarredView: React.FC<StarredViewProps> = ({
  workspaces,
  onSelectWorkspace,
  onToggleStarWorkspace,
}) => {
  const starredWorkspaces = workspaces.filter(w => w.isStarred);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 select-none">
      <div className="bg-white border border-[#E5EAF2] rounded-[12px] p-6 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
            <Star className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Starred Workspaces</h2>
            <p className="text-xs text-slate-500">Quick access to your pinned favorite study spaces</p>
          </div>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
          {starredWorkspaces.length} Starred
        </span>
      </div>

      {starredWorkspaces.length === 0 ? (
        <div className="bg-white border border-[#E5EAF2] rounded-[12px] p-12 text-center text-slate-400 text-xs italic">
          No starred workspaces yet. Hover over any workspace in the sidebar menu to star it!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {starredWorkspaces.map((ws) => (
            <div
              key={ws.id}
              className="bg-white border border-[#E5EAF2] hover:border-[#176BFF] rounded-[10px] p-4 shadow-2xs hover:shadow-xs transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-blue-50 text-[#176BFF] flex items-center justify-center">
                    <Folder className="w-4 h-4 fill-[#176BFF]/10" />
                  </div>
                  <span className="font-bold text-sm text-slate-900 group-hover:text-[#176BFF] transition-colors">
                    {ws.name}
                  </span>
                </div>
                <button
                  onClick={() => onToggleStarWorkspace(ws.id)}
                  className="p-1 text-amber-500 hover:text-amber-600"
                  title="Unstar workspace"
                >
                  <Star className="w-4 h-4 fill-amber-500" />
                </button>
              </div>

              <button
                onClick={() => onSelectWorkspace(ws.id)}
                className="w-full py-2 px-3 bg-[#FAFBFD] group-hover:bg-blue-50 border border-[#E5EAF2] group-hover:border-blue-200 text-slate-700 group-hover:text-[#176BFF] text-xs font-semibold rounded-[8px] flex items-center justify-between transition-colors mt-2"
              >
                <span>Open Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
