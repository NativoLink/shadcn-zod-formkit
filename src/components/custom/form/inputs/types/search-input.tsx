// import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Search, X, Clock, TrendingUp, Loader2 } from 'lucide-react';
// import { cn } from '@/lib/utils';

// interface SearchInputProps {
//   value: string;
//   onChange: (value: string) => void;
//   onSearch?: (value: string) => void;
//   onBlur?: () => void;
//   label?: string;
//   placeholder?: string;
//   disabled?: boolean;
//   error?: string;
//   className?: string;
//   debounce?: number;
//   showHistory?: boolean;
//   maxHistoryItems?: number;
//   suggestions?: string[];
//   isLoading?: boolean;
//   clearable?: boolean;
//   highlightMatches?: boolean;
// }

// const STORAGE_KEY = 'search-history';

// // Fuzzy search helper
// const fuzzyMatch = (text: string, query: string): boolean => {
//   const textLower = text.toLowerCase();
//   const queryLower = query.toLowerCase();
  
//   let queryIndex = 0;
//   for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
//     if (textLower[i] === queryLower[queryIndex]) {
//       queryIndex++;
//     }
//   }
//   return queryIndex === queryLower.length;
// };

// // Highlight matching text
// const highlightText = (text: string, query: string): React.ReactNode => {
//   if (!query) return text;
  
//   const parts: React.ReactNode[] = [];
//   const textLower = text.toLowerCase();
//   const queryLower = query.toLowerCase();
  
//   let lastIndex = 0;
//   let queryIndex = 0;
  
//   for (let i = 0; i < text.length && queryIndex < queryLower.length; i++) {
//     if (textLower[i] === queryLower[queryIndex]) {
//       if (i > lastIndex) {
//         parts.push(text.slice(lastIndex, i));
//       }
//       parts.push(
//         <mark key={i} className="bg-yellow-200 font-semibold">
//           {text[i]}
//         </mark>
//       );
//       lastIndex = i + 1;
//       queryIndex++;
//     }
//   }
  
//   if (lastIndex < text.length) {
//     parts.push(text.slice(lastIndex));
//   }
  
//   return <>{parts}</>;
// };

// export function SearchInput({
//   value,
//   onChange,
//   onSearch,
//   onBlur,
//   label,
//   placeholder = 'Buscar...',
//   disabled = false,
//   error,
//   className,
//   debounce = 300,
//   showHistory = true,
//   maxHistoryItems = 5,
//   suggestions = [],
//   isLoading = false,
//   clearable = true,
//   highlightMatches = true,
// }: SearchInputProps) {
//   const [isFocused, setIsFocused] = useState(false);
//   const [searchHistory, setSearchHistory] = useState<string[]>([]);
//   const [selectedIndex, setSelectedIndex] = useState(-1);
//   const debounceTimerRef = useRef<NodeJS.Timeout>();

//   // Load search history from localStorage
//   useEffect(() => {
//     if (!showHistory) return;
    
//     try {
//       const stored = localStorage.getItem(STORAGE_KEY);
//       if (stored) {
//         setSearchHistory(JSON.parse(stored));
//       }
//     } catch (error) {
//       console.error('Failed to load search history:', error);
//     }
//   }, [showHistory]);

//   // Save to history
//   const saveToHistory = useCallback((searchTerm: string) => {
//     if (!showHistory || !searchTerm.trim()) return;
    
//     setSearchHistory(prev => {
//       const filtered = prev.filter(item => item !== searchTerm);
//       const updated = [searchTerm, ...filtered].slice(0, maxHistoryItems);
      
//       try {
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
//       } catch (error) {
//         console.error('Failed to save search history:', error);
//       }
      
//       return updated;
//     });
//   }, [showHistory, maxHistoryItems]);

//   // Clear history
//   const clearHistory = useCallback(() => {
//     setSearchHistory([]);
//     try {
//       localStorage.removeItem(STORAGE_KEY);
//     } catch (error) {
//       console.error('Failed to clear search history:', error);
//     }
//   }, []);

//   // Debounced search
//   useEffect(() => {
//     if (!onSearch) return;
    
//     if (debounceTimerRef.current) {
//       clearTimeout(debounceTimerRef.current);
//     }
    
//     debounceTimerRef.current = setTimeout(() => {
//       if (value.trim()) {
//         onSearch(value);
//       }
//     }, debounce);
    
//     return () => {
//       if (debounceTimerRef.current) {
//         clearTimeout(debounceTimerRef.current);
//       }
//     };
//   }, [value, debounce, onSearch]);

//   // Filter suggestions with fuzzy matching
//   const filteredSuggestions = useMemo(() => {
//     if (!value.trim()) return [];
    
//     return suggestions
//       .filter(s => fuzzyMatch(s, value))
//       .slice(0, 10);
//   }, [suggestions, value]);

//   // Show history when focused and no value
//   const showHistoryList = useMemo(() => {
//     return isFocused && !value && searchHistory.length > 0 && showHistory;
//   }, [isFocused, value, searchHistory.length, showHistory]);

//   // Show suggestions when focused and has value
//   const showSuggestionsList = useMemo(() => {
//     return isFocused && value && filteredSuggestions.length > 0;
//   }, [isFocused, value, filteredSuggestions.length]);

//   // Combined list for keyboard navigation
//   const displayItems = useMemo(() => {
//     if (showHistoryList) return searchHistory;
//     if (showSuggestionsList) return filteredSuggestions;
//     return [];
//   }, [showHistoryList, showSuggestionsList, searchHistory, filteredSuggestions]);

//   // Handle item selection
//   const handleItemClick = useCallback((item: string) => {
//     onChange(item);
//     saveToHistory(item);
//     setIsFocused(false);
//     setSelectedIndex(-1);
//     onSearch?.(item);
//   }, [onChange, saveToHistory, onSearch]);

//   // Handle keyboard navigation
//   const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
//     if (!displayItems.length) {
//       if (e.key === 'Enter' && value.trim()) {
//         saveToHistory(value);
//         onSearch?.(value);
//       }
//       return;
//     }

//     switch (e.key) {
//       case 'ArrowDown':
//         e.preventDefault();
//         setSelectedIndex(prev => 
//           prev < displayItems.length - 1 ? prev + 1 : prev
//         );
//         break;
//       case 'ArrowUp':
//         e.preventDefault();
//         setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
//         break;
//       case 'Enter':
//         e.preventDefault();
//         if (selectedIndex >= 0) {
//           handleItemClick(displayItems[selectedIndex]);
//         } else if (value.trim()) {
//           saveToHistory(value);
//           onSearch?.(value);
//         }
//         break;
//       case 'Escape':
//         setIsFocused(false);
//         setSelectedIndex(-1);
//         break;
//     }
//   }, [displayItems, selectedIndex, value, handleItemClick, saveToHistory, onSearch]);

//   // Handle clear
//   const handleClear = useCallback(() => {
//     onChange('');
//     setSelectedIndex(-1);
//   }, [onChange]);

//   return (
//     <div className={cn('space-y-2', className)}>
//       {label && <Label>{label}</Label>}

//       <div className="relative">
//         {/* Input with icons */}
//         <div className="relative">
//           {isLoading ? (
//             <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
//           ) : (
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//           )}
          
//           <Input
//             type="search"
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             onFocus={() => setIsFocused(true)}
//             onBlur={() => {
//               setTimeout(() => setIsFocused(false), 200);
//               onBlur?.();
//             }}
//             onKeyDown={handleKeyDown}
//             placeholder={placeholder}
//             disabled={disabled}
//             className={cn(
//               'pl-10',
//               clearable && value && 'pr-10',
//               error && 'border-red-500 focus-visible:ring-red-500'
//             )}
//           />

//           {/* Clear button */}
//           {clearable && value && !disabled && (
//             <button
//               type="button"
//               onClick={handleClear}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               <X className="h-4 w-4" />
//             </button>
//           )}
//         </div>

//         {/* History dropdown */}
//         {showHistoryList && (
//           <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
//             <div className="px-3 py-2 border-b bg-gray-50 flex items-center justify-between">
//               <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
//                 <Clock className="h-3 w-3" />
//                 <span>Búsquedas recientes</span>
//               </div>
//               <button
//                 type="button"
//                 onClick={clearHistory}
//                 className="text-xs text-gray-500 hover:text-gray-700 underline"
//               >
//                 Limpiar
//               </button>
//             </div>
//             {searchHistory.map((item, index) => (
//               <button
//                 key={`${item}-${index}`}
//                 type="button"
//                 onClick={() => handleItemClick(item)}
//                 className={cn(
//                   'w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors',
//                   index === selectedIndex && 'bg-gray-100'
//                 )}
//               >
//                 <div className="flex items-center gap-2">
//                   <Clock className="h-3 w-3 text-gray-400" />
//                   <span>{item}</span>
//                 </div>
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Suggestions dropdown */}
//         {showSuggestionsList && (
//           <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
//             <div className="px-3 py-2 border-b bg-gray-50 flex items-center gap-2 text-xs font-medium text-gray-600">
//               <TrendingUp className="h-3 w-3" />
//               <span>Sugerencias</span>
//             </div>
//             {filteredSuggestions.map((suggestion, index) => (
//               <button
//                 key={`${suggestion}-${index}`}
//                 type="button"
//                 onClick={() => handleItemClick(suggestion)}
//                 className={cn(
//                   'w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors',
//                   index === selectedIndex && 'bg-gray-100'
//                 )}
//               >
//                 <div className="flex items-center gap-2">
//                   <Search className="h-3 w-3 text-gray-400" />
//                   <span>
//                     {highlightMatches ? highlightText(suggestion, value) : suggestion}
//                   </span>
//                 </div>
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Error message */}
//         {error && (
//           <p className="text-sm text-red-500 mt-1">{error}</p>
//         )}
//       </div>
//     </div>
//   );
// }
