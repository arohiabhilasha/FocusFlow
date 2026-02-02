
import React from 'react';
import { Task } from '../types';

interface TaskWidgetProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
}

const TaskWidget: React.FC<TaskWidgetProps> = ({ tasks, onToggleTask }) => {
  // Only show first 5 uncompleted tasks in the immediate view, 
  // but we allow scrolling if more are present or if the screen is small.
  const topTasks = tasks.filter(t => !t.completed).slice(0, 10); // Show up to 10 in the list but user asked for 5 visible

  return (
    <div className="bg-white/80 ios-blur widget-shadow rounded-[2rem] p-4 w-full aspect-square md:aspect-auto md:h-80 flex flex-col border border-white/40">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-bold text-base text-black/80 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          Priority Goals
        </h3>
        <span className="text-[10px] font-bold bg-blue-50 px-2 py-0.5 rounded-full text-blue-600 uppercase tracking-tight">
          Next 5
        </span>
      </div>

      <div className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar pr-0.5">
        {topTasks.length > 0 ? (
          topTasks.map((task) => (
            <button
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className="w-full group flex items-center gap-2.5 p-2.5 bg-white/50 hover:bg-white rounded-xl transition-all active:scale-[0.98] border border-gray-100/30 text-left shadow-sm"
            >
              <div className="w-5 h-5 rounded-full border-2 border-blue-400 flex-shrink-0 flex items-center justify-center transition-colors group-hover:bg-blue-50">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </div>
              <span className="text-xs font-semibold text-gray-800 truncate flex-1 leading-tight">
                {task.title}
              </span>
              <div className="w-4 h-4 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </button>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-2">
               <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">All Done</p>
          </div>
        )}

        {/* Dynamic Placeholder for 'Next' if less than 5 */}
        {topTasks.length > 0 && topTasks.length < 5 && Array.from({ length: 5 - topTasks.length }).map((_, i) => (
          <div key={`empty-${i}`} className="w-full h-[42px] bg-gray-50/30 rounded-xl border border-dashed border-gray-200/50"></div>
        ))}
      </div>
    </div>
  );
};

export default TaskWidget;
