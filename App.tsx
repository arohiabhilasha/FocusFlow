
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import TaskWidget from './components/TaskWidget';
import HomeScreenMockup from './components/HomeScreenMockup';
import { Task } from './types';
import { suggestTasks } from './services/geminiService';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [activeTab, setActiveTab] = useState<'today' | 'manage'>('today');
  const [showHomeScreen, setShowHomeScreen] = useState(false);
  const [isWidgetMode, setIsWidgetMode] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  
  // Modal state
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tempDescription, setTempDescription] = useState('');

  // 1. Detect Widget Mode from URL (For "Add to Home Screen" specific view)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'widget') {
      setIsWidgetMode(true);
    }
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('focusflow_tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved tasks");
      }
    }
  }, []);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('focusflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string) => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
  };

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  }, []);

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const updateTaskDescription = (id: string, description: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, description } : t
    ));
    setEditingTask(null);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTempDescription(task.description || '');
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(t => !t.completed));
  };

  const handleAISuggestions = async () => {
    setIsSuggesting(true);
    const intent = newTaskTitle || "productive day";
    const suggestions = await suggestTasks(intent);
    
    const newBatch = suggestions.map(s => ({
      id: Math.random().toString(36).substr(2, 9),
      title: s,
      completed: false,
      createdAt: Date.now(),
    }));
    
    setTasks(prev => [...prev, ...newBatch]);
    setIsSuggesting(false);
    setNewTaskTitle('');
  };

  const enterWidgetMode = () => {
    // Update URL without reloading to allow user to bookmark/add to home screen
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?mode=widget';
    window.history.pushState({ path: newUrl }, '', newUrl);
    setIsWidgetMode(true);
    setShowInstallGuide(true);
  };

  // Render PURE WIDGET MODE (No Navigation, No Headers)
  if (isWidgetMode) {
    return (
      <div className="min-h-screen bg-[#f2f2f7] p-6 flex flex-col items-center justify-center animate-in fade-in duration-700 safe-top safe-bottom">
        <div className="w-full max-w-sm relative">
           <TaskWidget tasks={tasks} onToggleTask={toggleTask} />
           
           {/* Floating Settings Button in Widget Mode */}
           <button 
             onClick={() => {
               const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
               window.history.pushState({ path: newUrl }, '', newUrl);
               setIsWidgetMode(false);
             }}
             className="mt-8 mx-auto w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-400 active:scale-90 transition-transform"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
             </svg>
           </button>
        </div>

        {/* Install Guide Modal */}
        {showInstallGuide && (
          <div className="fixed inset-0 z-[300] flex items-end justify-center p-4">
            <div className="absolute inset-0 bg-black/20" onClick={() => setShowInstallGuide(false)}></div>
            <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom-full duration-500">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl font-black italic shadow-xl shadow-blue-200">FF</div>
                <h3 className="text-xl font-bold">Add to Home Screen</h3>
                <p className="text-gray-500 text-sm mt-2">Use FocusFlow like a real widget!</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 text-sm font-medium text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-blue-600 font-bold">1</div>
                  <p>Tap the <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Share</span> button at the bottom</p>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-blue-600 font-bold">2</div>
                  <p>Scroll down and tap <span className="font-bold">Add to Home Screen</span></p>
                </div>
              </div>

              <button 
                onClick={() => setShowInstallGuide(false)}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
              >
                Got it!
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Layout>
      {showHomeScreen && (
        <HomeScreenMockup 
          tasks={tasks} 
          onToggleTask={toggleTask} 
          onClose={() => setShowHomeScreen(false)} 
        />
      )}

      <div className="pt-6">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">FocusFlow</h1>
            <p className="text-gray-500 font-medium">Your day at a glance.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={enterWidgetMode}
              className="mt-1 bg-blue-50 border border-blue-100 p-2 rounded-2xl shadow-sm active:scale-95 transition-all text-blue-600 hover:bg-blue-100"
              title="Enter Widget Mode"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button 
              onClick={() => setShowHomeScreen(true)}
              className="mt-1 bg-white border border-gray-200 p-2 rounded-2xl shadow-sm active:scale-95 transition-all text-gray-500 hover:text-blue-500"
              title="Preview on Home Screen"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </header>

        {activeTab === 'today' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <section>
              <div className="flex items-end justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">App Dashboard</h2>
                <span className="text-[10px] text-gray-300 font-mono">LIVE WIDGET</span>
              </div>
              <TaskWidget tasks={tasks} onToggleTask={toggleTask} />
            </section>

            <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-4">Add Daily Goals</h2>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTask(newTaskTitle)}
                  placeholder="What's next?"
                  className="flex-1 bg-gray-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <button
                  onClick={() => addTask(newTaskTitle)}
                  disabled={!newTaskTitle.trim()}
                  className="bg-blue-600 disabled:bg-blue-300 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 active:scale-90 transition-transform"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <button
                onClick={handleAISuggestions}
                disabled={isSuggesting}
                className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-2xl text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isSuggesting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-indigo-700 border-t-transparent rounded-full animate-spin"></div>
                    Thinking...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L14.4 7.2L20 8L16 12L16.8 17.6L12 15L7.2 17.6L8 12L4 8L9.6 7.2L12 2Z" />
                    </svg>
                    Suggest 5 Micro-Goals (AI)
                  </>
                )}
              </button>
            </section>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pb-12">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Manage All Tasks</h2>
              <button 
                onClick={clearCompleted}
                className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full active:scale-95 transition-transform"
              >
                Clear Done
              </button>
            </div>

            <div className="space-y-3">
              {tasks.length > 0 ? (
                tasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`group relative flex items-center gap-3 p-4 bg-white rounded-2xl border transition-all hover:border-blue-200 ${task.completed ? 'border-gray-50 opacity-60' : 'border-gray-100'}`}
                  >
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                      className={`z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
                    >
                      {task.completed && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    
                    <button 
                      onClick={() => openEditModal(task)}
                      className="flex-1 text-left flex flex-col items-start gap-0.5"
                    >
                      <span className={`text-sm font-semibold transition-all ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {task.title}
                      </span>
                      {task.description && (
                        <span className="text-[11px] text-gray-400 font-medium truncate max-w-[200px]">
                          {task.description}
                        </span>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => openEditModal(task)}
                        className="text-gray-300 hover:text-blue-500 transition-colors p-1"
                        title="Edit description"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                        className="text-gray-300 hover:text-red-400 transition-colors p-1"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-gray-400">
                  <p>Your task list is empty.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Task Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setEditingTask(null)}
          ></div>
          <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-300">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Task Details</h3>
                <button 
                  onClick={() => setEditingTask(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Title</label>
                  <p className="text-lg font-semibold text-gray-800 leading-tight">
                    {editingTask.title}
                  </p>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Description / Notes</label>
                  <textarea
                    rows={4}
                    value={tempDescription}
                    onChange={(e) => setTempDescription(e.target.value)}
                    placeholder="Add more context to this goal..."
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
                    autoFocus
                  />
                </div>

                <button
                  onClick={() => updateTaskDescription(editingTask.id, tempDescription)}
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* iOS Style Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 h-20 bg-white/70 ios-blur border-t border-gray-100 flex items-center justify-around px-10 pb-4 z-50">
        <button 
          onClick={() => setActiveTab('today')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'today' ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-widest">Today</span>
        </button>
        <button 
          onClick={() => setActiveTab('manage')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'manage' ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-widest">List</span>
        </button>
      </nav>
    </Layout>
  );
};

export default App;
