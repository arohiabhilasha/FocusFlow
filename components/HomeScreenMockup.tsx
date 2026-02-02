
import React from 'react';
import TaskWidget from './TaskWidget.tsx';
import { Task } from '../types.ts';

interface HomeScreenMockupProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onClose: () => void;
}

const HomeScreenMockup: React.FC<HomeScreenMockupProps> = ({ tasks, onToggleTask, onClose }) => {
  const dummyIcons = [
    { name: 'Photos', color: 'bg-white', icon: '🖼️' },
    { name: 'Safari', color: 'bg-blue-50', icon: '🌐' },
    { name: 'Maps', color: 'bg-green-50', icon: '🗺️' },
    { name: 'Mail', color: 'bg-blue-500', icon: '✉️' },
    { name: 'Music', color: 'bg-pink-500', icon: '🎵' },
    { name: 'Wallet', color: 'bg-black', icon: '💳' },
  ];

  return (
    <div className="absolute inset-0 z-[200] overflow-hidden flex flex-col animate-in fade-in zoom-in-105 duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 scale-110 blur-xl opacity-80"></div>
      
      <div className="relative flex-1 p-6 flex flex-col">
        <div className="h-6 w-full flex justify-between items-center text-white text-[10px] font-bold px-2 mb-8">
          <span>9:41</span>
          <div className="flex gap-1 items-center">
            <div className="w-3 h-3 border border-white rounded-full"></div>
            <div className="w-4 h-2 border border-white rounded-[2px]"></div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2 px-2">
             <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">FocusFlow Widget</span>
          </div>
          <TaskWidget tasks={tasks} onToggleTask={onToggleTask} />
        </div>

        <div className="grid grid-cols-4 gap-y-6 gap-x-4 px-2">
          {dummyIcons.map((icon, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`${icon.color} w-14 h-14 rounded-[1.2rem] shadow-lg flex items-center justify-center text-2xl`}>
                {icon.icon}
              </div>
              <span className="text-[10px] font-medium text-white shadow-sm">{icon.name}</span>
            </div>
          ))}
          <button 
            onClick={onClose}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="bg-white w-14 h-14 rounded-[1.2rem] shadow-xl flex items-center justify-center overflow-hidden border-2 border-blue-500 group-active:scale-90 transition-transform">
               <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-400 flex items-center justify-center text-white text-xl font-black italic">
                 FF
               </div>
            </div>
            <span className="text-[10px] font-bold text-white shadow-sm">FocusFlow</span>
          </button>
        </div>

        <div className="mt-auto mb-4 bg-white/20 ios-blur rounded-[2.5rem] p-4 flex justify-around items-center">
            <div className="w-14 h-14 bg-green-500 rounded-[1.2rem] shadow-lg flex items-center justify-center text-2xl">📞</div>
            <div className="w-14 h-14 bg-white rounded-[1.2rem] shadow-lg flex items-center justify-center text-2xl">💬</div>
            <div className="w-14 h-14 bg-blue-400 rounded-[1.2rem] shadow-lg flex items-center justify-center text-2xl">📧</div>
            <div className="w-14 h-14 bg-gradient-to-b from-gray-100 to-gray-300 rounded-[1.2rem] shadow-lg flex items-center justify-center text-2xl">⚙️</div>
        </div>

        <div className="w-32 h-1 bg-white/40 rounded-full self-center mb-2"></div>
      </div>

      <button 
        onClick={onClose}
        className="absolute top-12 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-xs font-bold ios-blur border border-white/20 active:scale-95 transition-transform"
      >
        Exit Preview
      </button>
    </div>
  );
};

export default HomeScreenMockup;
