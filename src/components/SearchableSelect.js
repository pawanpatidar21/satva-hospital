import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaTimes, FaSearch } from 'react-icons/fa';

const SearchableSelect = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option...',
  disabled = false,
  error = false,
  className = '',
  isGrouped = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Flatten grouped options for search
  const flatOptions = isGrouped
    ? options.flatMap(group => group.options || [])
    : options;

  // Filter options based on search term
  const filteredOptions = searchTerm
    ? (isGrouped
        ? options.map(group => ({
            ...group,
            options: (group.options || []).filter(opt =>
              opt.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              opt.value?.toLowerCase().includes(searchTerm.toLowerCase())
            )
          })).filter(group => group.options.length > 0)
        : flatOptions.filter(opt =>
            opt.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            opt.value?.toLowerCase().includes(searchTerm.toLowerCase())
          ))
    : options;

  const selectedOption = flatOptions.find(opt => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
  };

  const handleKeyDown = (e) => {
    if (!isOpen && (e.key === 'Enter' || e.key === 'ArrowDown')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const flatFiltered = isGrouped
        ? filteredOptions.flatMap(group => group.options || [])
        : filteredOptions;
      setHighlightedIndex(prev =>
        prev < flatFiltered.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      const flatFiltered = isGrouped
        ? filteredOptions.flatMap(group => group.options || [])
        : filteredOptions;
      if (flatFiltered[highlightedIndex]) {
        handleSelect(flatFiltered[highlightedIndex]);
      }
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className={`
          w-full px-4 sm:px-5 py-3 sm:py-4 border-2 rounded-lg sm:rounded-xl
          bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md
          transition-all duration-300 cursor-pointer
          flex items-center justify-between
          ${error ? 'border-red-500' : 'border-gray-200 focus-within:border-primary-500'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex-1 min-w-0">
          {selectedOption ? (
            <span className="text-sm sm:text-base text-gray-900 font-medium block truncate">
              {selectedOption.label}
            </span>
          ) : (
            <span className="text-sm sm:text-base text-gray-400 block truncate">
              {placeholder}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 ml-2">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Clear selection"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          )}
          <FaChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 max-h-64 overflow-hidden">
          <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setHighlightedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 text-sm"
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-48">
            {isGrouped ? (
              filteredOptions.map((group, groupIndex) => (
                <div key={groupIndex}>
                  {group.label && (
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 sticky top-0">
                      {group.label}
                    </div>
                  )}
                  {(group.options || []).map((option, optionIndex) => {
                    const flatIndex = filteredOptions
                      .slice(0, groupIndex)
                      .reduce((acc, g) => acc + (g.options?.length || 0), 0) + optionIndex;
                    const isHighlighted = flatIndex === highlightedIndex;
                    const isSelected = option.value === value;

                    return (
                      <div
                        key={option.value}
                        onClick={() => handleSelect(option)}
                        className={`
                          px-4 py-3 cursor-pointer transition-colors text-sm
                          ${isSelected ? 'bg-primary-600 text-white font-medium' : ''}
                          ${isHighlighted && !isSelected ? 'bg-primary-50 text-primary-900' : ''}
                          ${!isSelected && !isHighlighted ? 'hover:bg-gray-50 text-gray-900' : ''}
                        `}
                        onMouseEnter={() => setHighlightedIndex(flatIndex)}
                      >
                        {option.label}
                      </div>
                    );
                  })}
                </div>
              ))
            ) : (
              filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => {
                  const isHighlighted = index === highlightedIndex;
                  const isSelected = option.value === value;

                  return (
                    <div
                      key={option.value}
                      onClick={() => handleSelect(option)}
                      className={`
                        px-4 py-3 cursor-pointer transition-colors text-sm
                        ${isSelected ? 'bg-primary-600 text-white font-medium' : ''}
                        ${isHighlighted && !isSelected ? 'bg-primary-50 text-primary-900' : ''}
                        ${!isSelected && !isHighlighted ? 'hover:bg-gray-50 text-gray-900' : ''}
                      `}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      {option.label}
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No options found
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;

