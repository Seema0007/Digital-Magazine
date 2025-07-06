import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, Grid, List } from 'lucide-react';
import { Magazine } from '../types';

interface MagazineListProps {
  magazines: Magazine[];
  selectedMagazine: Magazine;
  onSelect: (magazine: Magazine) => void;
}

function MagazineList({ magazines, selectedMagazine, onSelect }: MagazineListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Grid column classes based on screen size
  const getGridColumns = () => {
    if (isMobile) return 'grid-cols-2';
    return 'grid-cols-3 lg:grid-cols-4';
  };

  return (
    <div className="h-full max-h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 truncate">
              Your Library
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
              {magazines.length} magazine{magazines.length !== 1 ? 's' : ''} available
            </p>
          </div>
          
          {/* View Toggle - Hidden on mobile */}
          {!isMobile && (
            <div className="bg-gray-100 rounded-lg p-1 flex ml-4 flex-shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
                title="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ minHeight: 0 }}>
        <div className="p-3 sm:p-4">
          {magazines.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm sm:text-base">No magazines available.</p>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className={`grid ${getGridColumns()} gap-3 sm:gap-4`}>
                  {magazines.map((magazine) => (
                    <button
                      key={magazine.id}
                      onClick={() => onSelect(magazine)}
                      className={`text-left bg-white rounded-lg p-2 sm:p-3 transition-all duration-200 hover:shadow-md ${
                        selectedMagazine.id === magazine.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-full aspect-[3/4] mb-2 sm:mb-3 overflow-hidden rounded-lg relative group">
                        <img
                          src={magazine.coverImage}
                          alt={magazine.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                          <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-xs sm:text-sm md:text-base line-clamp-2 leading-tight">
                        {magazine.title}
                      </h3>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate text-xs">{magazine.date}</span>
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {/* List View - Desktop only */}
              {viewMode === 'list' && !isMobile && (
                <div className="space-y-3">
                  {magazines.map((magazine) => (
                    <button
                      key={magazine.id}
                      onClick={() => onSelect(magazine)}
                      className={`w-full p-4 text-left bg-white rounded-lg border transition-all duration-200 hover:shadow-md ${
                        selectedMagazine.id === magazine.id 
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className="w-20 h-24 flex-shrink-0 overflow-hidden rounded-lg relative group">
                          <img
                            src={magazine.coverImage}
                            alt={magazine.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 mb-2 text-base">
                            {magazine.title}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span>{magazine.date}</span>
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MagazineList;
