'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, Plus } from 'lucide-react';

interface ComboboxProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  creatable?: boolean;
}

export default function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar',
  searchPlaceholder = 'Buscar...',
  label,
  error,
  disabled = false,
  creatable = false,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {label}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between rounded-md border bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-600'
        }`}
      >
        <span className={!value ? 'text-gray-400' : ''}>
          {value || placeholder}
        </span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-lg max-h-60 flex flex-col">
          <div className="p-2 border-b border-gray-200 dark:border-gray-600 sticky top-0 bg-white dark:bg-gray-700 rounded-t-md">
            <div className="flex items-center px-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="w-full bg-transparent border-none p-2 text-sm focus:ring-0 text-gray-900 dark:text-white placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          
          <ul className="overflow-auto py-1 flex-1 custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option}
                  className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                    value === option
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                {creatable && searchTerm ? (
                  <button
                    type="button"
                    onClick={() => handleSelect(searchTerm)}
                    className="flex items-center justify-center gap-2 w-full text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Plus size={14} />
                    Crear `&quot;`{searchTerm}`&quot;`
                  </button>
                ) : (
                  'No se encontraron resultados'
                )}
              </li>
            )}
            
            {creatable && searchTerm && filteredOptions.length > 0 && !filteredOptions.includes(searchTerm) && (
               <li className="border-t border-gray-100 dark:border-gray-600 mt-1 pt-1">
                 <button
                    type="button"
                    onClick={() => handleSelect(searchTerm)}
                    className="w-full text-left px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-2"
                  >
                    <Plus size={14} />
                    Crear `&quot;`{searchTerm}`&quot;`
                  </button>
               </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
