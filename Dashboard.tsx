import React, { useState, useEffect, useRef } from 'react';
import { PdfNote } from './types';
import { PLUS_ICON, PDF_ICON, GRID_VIEW_ICON, LIST_VIEW_ICON, ELLIPSIS_VERTICAL_ICON, CHEVRON_DOWN_ICON, OPEN_ICON, TRASH_ICON } from './constants';
import CreateNoteModal from './CreateNoteModal'; 
import OpenNotebookIcon from './components/OpenNotebookIcon';

interface DashboardProps {
  notes: PdfNote[];
  onFileProvidedForNewNote: (file: File) => void; 
  onOpenNote: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
}

type ViewMode = 'grid' | 'list';

const cleanDisplayName = (name: string | null | undefined, defaultName: string = "Untitled Note"): string => {
  if (!name) return defaultName;
  let cleanedName = name.replace(/\s*\)\}\s*$/, ""); 
  cleanedName = cleanedName.replace(/\)\}\s*$/, "");   
  return cleanedName.trim() || defaultName;
};

const Dashboard: React.FC<DashboardProps> = ({ notes, onFileProvidedForNewNote, onOpenNote, onDeleteNote }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [openMenuNoteId, setOpenMenuNoteId] = useState<string | null>(null);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuNoteId && menuRefs.current[openMenuNoteId] && !menuRefs.current[openMenuNoteId]?.contains(event.target as Node)) {
        setOpenMenuNoteId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuNoteId]);

  useEffect(() => {
    if (isCreateModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCreateModalOpen]);

  const sortedNotes = [...notes].sort((a, b) => b.timestamp - a.timestamp);

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleModalFileSelect = (file: File) => {
    setIsCreateModalOpen(false);
    onFileProvidedForNewNote(file);
  };

  const NoteActionMenu: React.FC<{ note: PdfNote, positionClass?: string }> = ({ note, positionClass = "absolute right-2 top-10 mt-1" }) => {
    const displayName = cleanDisplayName(note.name, 'Untitled Note');
    return (
      <div
        ref={el => { menuRefs.current[note.id] = el; }}
        className={`${positionClass} w-40 bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-lg ring-1 ring-slate-700/50 z-20 overflow-hidden`}
      >
        <div className="py-1">
          <button
            onClick={() => { onOpenNote(note.id); setOpenMenuNoteId(null); }}
            className="flex items-center w-full px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-700/70 transition-colors"
            aria-label={`Open note ${displayName}`}
          >
            {OPEN_ICON} <span className="ml-2">Open</span>
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete "${displayName}"? This action cannot be undone.`)) {
                onDeleteNote(note.id);
              }
              setOpenMenuNoteId(null);
            }}
            className="flex items-center w-full px-4 py-2.5 text-sm text-red-400 hover:bg-slate-700/70 hover:text-red-300 transition-colors"
            aria-label={`Delete note ${displayName}`}
          >
            {TRASH_ICON} <span className="ml-2">Delete</span>
          </button>
        </div>
      </div>
    );
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {sortedNotes.map((note) => {
        const displayName = cleanDisplayName(note.name, 'Untitled Note');
        return (
          <div
            key={note.id}
            className="group bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-lg transition-all duration-300 hover:shadow-primary-500/10 hover:border-primary-500/30 flex flex-col p-4 sm:p-6 min-h-[160px] sm:min-h-[180px] relative"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 text-slate-500 group-hover:text-primary-400 transition-colors">
                {PDF_ICON}
              </div>
              <button
                onClick={() => setOpenMenuNoteId(openMenuNoteId === note.id ? null : note.id)}
                className="text-slate-400 hover:text-slate-100 p-1.5 -mr-1.5 -mt-1.5 rounded-lg hover:bg-slate-700/70 transition-colors"
                aria-haspopup="true"
                aria-expanded={openMenuNoteId === note.id}
                aria-controls={`menu-${note.id}`}
                aria-label={`Options for note ${displayName}`}
              >
                {ELLIPSIS_VERTICAL_ICON}
              </button>
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold break-all text-md sm:text-lg text-slate-100 mb-2 line-clamp-2">
                {displayName}
              </h3>
              <p className="text-xs text-slate-400">
                {new Date(note.timestamp).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
                <span className="mx-1.5 text-slate-600">•</span>
                1 source
              </p>
            </div>
            {openMenuNoteId === note.id && <NoteActionMenu note={note} positionClass="absolute right-4 top-12" />}
          </div>
        );
      })}
    </div>
  );

  const renderListView = () => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-lg overflow-hidden">
      <div className="hidden sm:grid sm:grid-cols-[minmax(0,3fr)_repeat(3,minmax(0,1fr))_auto] gap-x-4 px-4 sm:px-6 py-3 border-b border-slate-700/50">
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Title</div>
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider text-center sm:text-left">Sources</div>
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider text-center sm:text-left">Created</div>
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider text-center sm:text-left">Role</div>
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider text-right sr-only">Actions</div>
      </div>
      <div className="divide-y divide-slate-700/50">
        {sortedNotes.map((note) => {
          const displayName = cleanDisplayName(note.name, 'Untitled Note');
          return (
            <div 
              key={note.id} 
              className="grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,3fr)_repeat(3,minmax(0,1fr))_auto] gap-x-2 sm:gap-x-4 items-center px-3 py-3 sm:px-6 sm:py-4 hover:bg-slate-700/30 transition-colors relative group"
            >
              <div className="flex items-center min-w-0 col-span-1 sm:col-auto">
                <div className="w-5 h-5 text-slate-500 group-hover:text-primary-400 transition-colors mr-2 sm:mr-3 flex-shrink-0">
                  {PDF_ICON}
                </div>
                <div className="flex-grow min-w-0">
                  <span className="text-sm text-slate-100 truncate block" title={displayName}>
                    {displayName}
                  </span>
                  <div className="sm:hidden text-xs text-slate-400">
                    {new Date(note.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • 1 source
                  </div>
                </div>
              </div>
              <div className="hidden sm:block text-sm text-slate-300 text-center sm:text-left">1 source</div>
              <div className="hidden sm:block text-sm text-slate-300 text-center sm:text-left">
                {new Date(note.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="hidden sm:block text-sm text-slate-300 text-center sm:text-left">Owner</div>
              <div className="relative flex justify-end col-span-1 sm:col-auto">
                <button
                  onClick={() => setOpenMenuNoteId(openMenuNoteId === note.id ? null : note.id)}
                  className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-700/70 transition-colors"
                  aria-haspopup="true"
                  aria-expanded={openMenuNoteId === note.id}
                  aria-controls={`menu-${note.id}-list`}
                  aria-label={`Options for note ${displayName}`}
                >
                  {ELLIPSIS_VERTICAL_ICON}
                </button>
                {openMenuNoteId === note.id && <NoteActionMenu note={note} positionClass="absolute right-0 top-full mt-1.5" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100 p-4 md:p-8 flex flex-col">
        <header className="mb-8 md:mb-10">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <OpenNotebookIcon className="w-7 h-7 sm:w-8 sm:h-8" />
            <h1 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-slate-100 to-slate-300 text-transparent bg-clip-text">
              OpenNotebook
            </h1>
          </div>
        </header>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center px-4 py-2 sm:px-5 sm:py-2.5 bg-primary-500 text-white font-semibold rounded-lg shadow-lg shadow-primary-500/20 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all sm:w-auto"
              aria-label="Create new note"
            >
              {PLUS_ICON} <span className="ml-1.5">Create new</span>
            </button>

            <div className="inline-flex items-center bg-slate-800/50 backdrop-blur-sm rounded-lg p-1 shadow-lg border border-slate-700/50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 sm:p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary-500/20 text-primary-400 ring-1 ring-primary-500/30' 
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                }`}
                aria-pressed={viewMode === 'grid'}
                aria-label="Switch to Grid view"
              >
                {GRID_VIEW_ICON}
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 sm:p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary-500/20 text-primary-400 ring-1 ring-primary-500/30' 
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                }`}
                aria-pressed={viewMode === 'list'}
                aria-label="Switch to List view"
              >
                {LIST_VIEW_ICON}
              </button>
            </div>
          </div>

          <div className="relative">
            <button className="flex items-center justify-between w-full xs:w-auto px-4 py-2 bg-slate-800/50 backdrop-blur-sm text-slate-300 rounded-lg hover:bg-slate-700/50 shadow-lg border border-slate-700/50 transition-colors">
              <span className="mr-2">Most recent</span> {CHEVRON_DOWN_ICON}
            </button>
          </div>
        </div>

        <main className="flex-grow">
          {sortedNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <div className="w-16 h-16 text-slate-700 mb-4">
                {PDF_ICON}
              </div>
              <p className="text-slate-300 text-lg mt-2">
                You don't have any notes yet
              </p>
              <p className="text-slate-500 text-sm mt-1">Click "Create new" to get started!</p>
            </div>
          ) : (
            viewMode === 'grid' ? renderGridView() : renderListView()
          )}
        </main>

        <footer className="mt-12 text-center text-sm text-slate-500 py-4 border-t border-slate-800">
          <p>&copy; {new Date().getFullYear()} OpenNotebook. Powered by Gemini & Google Cloud TTS.</p>
        </footer>
      </div>
      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onFileSelect={handleModalFileSelect}
      />
    </>
  );
};

export default Dashboard;