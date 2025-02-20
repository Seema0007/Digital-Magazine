import React from 'react';
import { Calendar, BookOpen } from 'lucide-react';
import { Magazine } from '../types';

interface MagazineListProps {
  magazines: Magazine[];
  selectedMagazine: Magazine;
  onSelect: (magazine: Magazine) => void;
}

function MagazineList({ magazines, selectedMagazine, onSelect }: MagazineListProps) {
  return (
    <div className="overflow-y-auto h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Your Library</h2>
        <p className="text-sm text-gray-600">{magazines.length} magazines available</p>
      </div>
      {magazines.map((magazine) => (
        <button
          key={magazine.id}
          onClick={() => onSelect(magazine)}
          className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors ${
            selectedMagazine.id === magazine.id ? 'bg-blue-50' : ''
          }`}
        >
          <div className="w-full aspect-[3/4] mb-3 overflow-hidden rounded-lg relative group">
            <img
              src={magazine.coverImage}
              alt={magazine.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">{magazine.title}</h3>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {magazine.date}
          </p>
        </button>
      ))}
    </div>
  );
}

export default MagazineList;