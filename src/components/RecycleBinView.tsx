import React, { useState } from 'react';
import { 
  Trash2, 
  RotateCcw, 
  Folder, 
  FileText, 
  CheckSquare, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { RecycleItem, DeletedItemType } from '../types';

interface RecycleBinViewProps {
  items: RecycleItem[];
  onRestoreItems: (ids: string[]) => void;
  onPermanentlyDeleteItems: (ids: string[]) => void;
}

export const RecycleBinView: React.FC<RecycleBinViewProps> = ({
  items,
  onRestoreItems,
  onPermanentlyDeleteItems,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | DeletedItemType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Type counts
  const workspaceCount = items.filter(i => i.type === 'workspace').length;
  const sectionCount = items.filter(i => i.type === 'section').length;
  const topicCount = items.filter(i => i.type === 'topic').length;
  const taskCount = items.filter(i => i.type === 'task').length;

  // Filtered list
  const filtered = items.filter(item => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.deletedFrom.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedIds.length === currentItems.length && currentItems.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentItems.map(i => i.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getTypeBadge = (type: DeletedItemType) => {
    switch (type) {
      case 'workspace':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700">Workspace</span>;
      case 'section':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-700">Section</span>;
      case 'topic':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">Topic</span>;
      case 'task':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">Task</span>;
    }
  };

  const getTypeIcon = (type: DeletedItemType) => {
    switch (type) {
      case 'workspace':
        return <Folder className="w-4 h-4 text-blue-500 fill-blue-500/10" />;
      case 'section':
        return <Folder className="w-4 h-4 text-purple-500 fill-purple-500/10" />;
      case 'topic':
        return <FileText className="w-4 h-4 text-emerald-500" />;
      case 'task':
        return <CheckSquare className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none">
      {/* Top Banner Header */}
      <div className="bg-white border border-[#E5EAF2] rounded-[12px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-[10px] bg-slate-50 border border-[#E3E9F2] flex items-center justify-center text-slate-700 shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recycle Bin</h2>
            <p className="text-xs text-slate-500 mt-1">
              Items in the recycle bin are stored for 30 days before being permanently deleted.
            </p>
          </div>
        </div>

        {/* Top 4 Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          <div className="bg-[#FAFBFD] border border-[#E5EAF2] rounded-[10px] p-3 flex items-center gap-3 w-32">
            <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Folder className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Workspaces</div>
              <div className="text-sm font-bold text-slate-900">{workspaceCount}</div>
            </div>
          </div>

          <div className="bg-[#FAFBFD] border border-[#E5EAF2] rounded-[10px] p-3 flex items-center gap-3 w-32">
            <div className="w-8 h-8 rounded-md bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
              <Folder className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Sections</div>
              <div className="text-sm font-bold text-slate-900">{sectionCount}</div>
            </div>
          </div>

          <div className="bg-[#FAFBFD] border border-[#E5EAF2] rounded-[10px] p-3 flex items-center gap-3 w-32">
            <div className="w-8 h-8 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Topics</div>
              <div className="text-sm font-bold text-slate-900">{topicCount}</div>
            </div>
          </div>

          <div className="bg-[#FAFBFD] border border-[#E5EAF2] rounded-[10px] p-3 flex items-center gap-3 w-32">
            <div className="w-8 h-8 rounded-md bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Tasks</div>
              <div className="text-sm font-bold text-slate-900">{taskCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-[#E5EAF2] rounded-[12px] shadow-2xs overflow-hidden">
        {/* Filter Tabs Header */}
        <div className="border-b border-[#E3E9F2] px-6 pt-3 flex items-center gap-6">
          <button
            onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
            className={`pb-3 text-xs font-bold transition-all relative ${
              activeTab === 'all' ? 'text-[#176BFF]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Items
            {activeTab === 'all' && <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#176BFF] rounded-t-full"></span>}
          </button>

          <button
            onClick={() => { setActiveTab('workspace'); setCurrentPage(1); }}
            className={`pb-3 text-xs font-bold transition-all relative ${
              activeTab === 'workspace' ? 'text-[#176BFF]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Workspaces
            {activeTab === 'workspace' && <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#176BFF] rounded-t-full"></span>}
          </button>

          <button
            onClick={() => { setActiveTab('section'); setCurrentPage(1); }}
            className={`pb-3 text-xs font-bold transition-all relative ${
              activeTab === 'section' ? 'text-[#176BFF]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sections
            {activeTab === 'section' && <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#176BFF] rounded-t-full"></span>}
          </button>

          <button
            onClick={() => { setActiveTab('topic'); setCurrentPage(1); }}
            className={`pb-3 text-xs font-bold transition-all relative ${
              activeTab === 'topic' ? 'text-[#176BFF]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Topics
            {activeTab === 'topic' && <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#176BFF] rounded-t-full"></span>}
          </button>

          <button
            onClick={() => { setActiveTab('task'); setCurrentPage(1); }}
            className={`pb-3 text-xs font-bold transition-all relative ${
              activeTab === 'task' ? 'text-[#176BFF]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Tasks
            {activeTab === 'task' && <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#176BFF] rounded-t-full"></span>}
          </button>
        </div>

        {/* Toolbar: Search, Filter, Batch Action Buttons */}
        <div className="p-4 border-b border-[#E9EDF3] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FAFBFD]">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search deleted items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#D8E0EC] rounded-[8px] text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#176BFF]"
              />
            </div>

            <button className="px-3 py-1.5 bg-white border border-[#D8E0EC] rounded-[8px] text-xs font-semibold text-slate-700 flex items-center gap-1.5 hover:bg-slate-50">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              disabled={selectedIds.length === 0}
              onClick={() => {
                onRestoreItems(selectedIds);
                setSelectedIds([]);
              }}
              className="px-4 py-1.5 bg-white border border-[#D8E0EC] hover:border-[#176BFF] text-slate-700 font-bold text-xs rounded-[8px] flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              <RotateCcw className="w-3 h-3 text-[#176BFF]" />
              <span>Restore</span>
            </button>

            <button
              disabled={selectedIds.length === 0}
              onClick={() => {
                onPermanentlyDeleteItems(selectedIds);
                setSelectedIds([]);
              }}
              className="px-4 py-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-[8px] flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete Permanently</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white border-b border-[#E9EDF3] text-slate-500 font-bold">
                <th className="p-3.5 pl-6 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === currentItems.length && currentItems.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded text-[#176BFF] focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Deleted From</th>
                <th className="p-3.5">Deleted On</th>
                <th className="p-3.5">Days Left</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9EDF3] text-slate-700 font-medium">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 italic">
                    Recycle bin is empty or no matching items found.
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-[#FAFBFD] transition-colors ${
                        isSelected ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <td className="p-3.5 pl-6">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(item.id)}
                          className="rounded text-[#176BFF] focus:ring-0 cursor-pointer"
                        />
                      </td>

                      <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                        {getTypeIcon(item.type)}
                        <span>{item.name}</span>
                      </td>

                      <td className="p-3.5">{getTypeBadge(item.type)}</td>

                      <td className="p-3.5 text-slate-500 font-mono text-[11px] truncate max-w-xs">
                        {item.deletedFrom}
                      </td>

                      <td className="p-3.5 text-slate-500 font-mono text-[11px]">{item.deletedOn}</td>

                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          {item.daysLeft} days
                        </span>
                      </td>

                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onRestoreItems([item.id])}
                            className="p-1.5 rounded-[6px] text-slate-500 hover:text-[#176BFF] hover:bg-blue-50 border border-transparent hover:border-[#176BFF]/20 transition-all"
                            title="Restore"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onPermanentlyDeleteItems([item.id])}
                            className="p-1.5 rounded-[6px] text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
                            title="Delete permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-[#E9EDF3] flex items-center justify-between bg-white text-xs text-slate-500 font-medium">
          <div>
            Showing <strong className="text-slate-900">{filtered.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> to <strong className="text-slate-900">{Math.min(currentPage * itemsPerPage, filtered.length)}</strong> of <strong className="text-slate-900">{filtered.length}</strong> items
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              className="p-1.5 rounded border border-[#E3E9F2] text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded text-xs font-bold transition-all ${
                  currentPage === pageNum
                    ? 'bg-[#176BFF] text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              className="p-1.5 rounded border border-[#E3E9F2] text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
