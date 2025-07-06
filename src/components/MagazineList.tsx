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
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Your Library</h2>
            <p className="text-sm text-gray-600">{magazines.length} magazines available</p>
          </div>
          
          {/* View Toggle - Hidden on mobile */}
          {!isMobile && (
            <div className="bg-gray-100 rounded-lg p-1 flex">
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
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {magazines.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No magazines available.</p>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className={`grid ${getGridColumns()} gap-4`}>
                  {magazines.map((magazine) => (
                    <button
                      key={magazine.id}
                      onClick={() => onSelect(magazine)}
                      className={`text-left bg-white rounded-lg p-3 transition-all duration-200 hover:shadow-md ${
                        selectedMagazine.id === magazine.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-full aspect-[3/4] mb-3 overflow-hidden rounded-lg relative group">
                        <img
                          src={magazine.coverImage}
                          alt={magazine.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base line-clamp-2">
                        {magazine.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{magazine.date}</span>
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
