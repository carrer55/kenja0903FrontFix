import React from 'react';
import { Plane, Receipt, Plus, FolderOpen } from 'lucide-react';

interface QuickActionsProps {
  onNavigate: (view: 'dashboard' | 'business-trip' | 'expense' | 'tax-simulation' | 'document-management') => void;
}

function QuickActions({ onNavigate }: QuickActionsProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg lg:text-xl font-semibold text-slate-800 mb-4">クイックアクション</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button 
          onClick={() => onNavigate('business-trip')}
          className="flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-navy-700 to-navy-900 hover:from-navy-800 hover:to-navy-950 rounded-xl text-white font-medium shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 backdrop-blur-sm min-h-[60px]"
        >
          <Plus className="w-5 h-5" />
          <Plane className="w-5 h-5" />
          <span>出張申請</span>
        </button>
        <button 
          onClick={() => onNavigate('expense')}
          className="flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-navy-600 to-navy-800 hover:from-navy-700 hover:to-navy-900 rounded-xl text-white font-medium shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 backdrop-blur-sm min-h-[60px]"
        >
          <Plus className="w-5 h-5" />
          <Receipt className="w-5 h-5" />
          <span>経費申請</span>
        </button>
        <button 
          onClick={() => onNavigate('document-management')}
          className="flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 rounded-xl text-white font-medium shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 backdrop-blur-sm min-h-[60px] sm:col-span-2 lg:col-span-1"
        >
          <Plus className="w-5 h-5" />
          <FolderOpen className="w-5 h-5" />
          <span>出張精算</span>
        </button>
      </div>
    </div>
  );
}

export default QuickActions;