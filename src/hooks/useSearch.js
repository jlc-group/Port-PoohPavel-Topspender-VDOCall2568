import { useState, useCallback } from 'react';
import { searchCustomers } from '@utils/api';
import { calculateMatchScore, normalizeThaiTextClient, phonesMatch, normalizePhoneNumber } from '@utils/dataMasking';
import { LOADING_STATES, ERROR_MESSAGES, TAB_TYPES } from '@utils/constants';

export const useSearch = (topSpenderData, vdoCallData) => {
  const [searchPhone, setSearchPhone] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isCombinedSearch, setIsCombinedSearch] = useState(false);
  const [loading, setLoading] = useState(LOADING_STATES.IDLE);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(TAB_TYPES.TOP_SPENDER);
  const [dynamicHeaderTitle, setDynamicHeaderTitle] = useState(null);

  // Client-side text normalization
  const normalizeThaiTextClient = (text) => {
    if (!text) return '';
    return text.toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[่้๊๋]/g, '') // Remove Thai tone marks
      .replace(/[ัิ]/g, '')   // Remove Thai vowels
      .trim();
  };

  // Client-side match scoring (for offline search)
  const calculateClientMatchScore = (searchTerm, item) => {
    const normalizedSearch = normalizeThaiTextClient(searchTerm);
    let score = 0;

    // Phone number matching with flexible matching
    if (item.เบอรโทร && phonesMatch(searchTerm, item.เบอรโทร)) {
      const search = normalizePhoneNumber(searchTerm);
      const customer = normalizePhoneNumber(item.เบอรโทร);

      if (search.original === customer.original || search.normalized === customer.normalized) {
        score += 15; // Exact or normalized exact match
      } else if (search.original.length >= 4 || search.normalized.length >= 4) {
        score += 8; // Partial match
      }
    }

    // Name matching
    const firstName = normalizeThaiTextClient(item.ชื่อ);
    const lastName = normalizeThaiTextClient(item.นามสกุล);
    const fullName = normalizeThaiTextClient(`${item.ชื่อ} ${item.นามสกุล}`);

    if (fullName === normalizedSearch) {
      score += 15;
    } else if (firstName === normalizedSearch) {
      score += 12;
    } else if (lastName === normalizedSearch) {
      score += 12;
    } else if (firstName.includes(normalizedSearch) && normalizedSearch.length >= 2) {
      score += 8;
    } else if (lastName.includes(normalizedSearch) && normalizedSearch.length >= 2) {
      score += 8;
    } else if (fullName.includes(normalizedSearch) && normalizedSearch.length >= 2) {
      score += 6;
    }

    return score;
  };

  const handleSearch = useCallback(async () => {
    if (!searchPhone.trim()) {
      setSearchResults(null);
      setIsCombinedSearch(false);
      setDynamicHeaderTitle(null);
      return;
    }

    setLoading(LOADING_STATES.LOADING);
    setError('');

    try {
      // Use combined search endpoint
      const result = await searchCustomers(searchPhone);

      if (result.success) {
        // Handle combined search results
        const combinedResults = [];
        if (result.data.topSpender) {
          combinedResults.push({ ...result.data.topSpender, type: TAB_TYPES.TOP_SPENDER });
        }
        if (result.data.vdoCall) {
          combinedResults.push({ ...result.data.vdoCall, type: TAB_TYPES.VDO_CALL });
        }

        // Smart tab switching logic
        const hasTopSpender = combinedResults.some(item => item.type === TAB_TYPES.TOP_SPENDER);
        const hasVDOCall = combinedResults.some(item => item.type === TAB_TYPES.VDO_CALL);

        if (hasTopSpender && !hasVDOCall) {
          // Only Top Spender results found
          setActiveTab(TAB_TYPES.TOP_SPENDER);
          setDynamicHeaderTitle('สิทธิ์ TopSpender');
        } else if (hasVDOCall && !hasTopSpender) {
          // Only VDO Call results found
          setActiveTab(TAB_TYPES.VDO_CALL);
          setDynamicHeaderTitle('สิทธิ์ VDO Call');
        } else if (hasTopSpender && hasVDOCall) {
          // Results found in both systems
          setDynamicHeaderTitle('สิทธิ์ TopSpender สิทธิ์ VDO Call');
        }

        setSearchResults(combinedResults.length > 0 ? combinedResults : []);
        setIsCombinedSearch(true);
        setLoading(LOADING_STATES.SUCCESS);
      } else {
        setSearchResults([]);
        setIsCombinedSearch(false);
        setDynamicHeaderTitle(null);
        setError(result.error || ERROR_MESSAGES.NO_RESULTS);
        setLoading(LOADING_STATES.ERROR);
      }
    } catch (err) {
      setError(ERROR_MESSAGES.SEARCH_ERROR + ': ' + err.message);
      setSearchResults([]);
      setIsCombinedSearch(false);
      setDynamicHeaderTitle(null);
      setLoading(LOADING_STATES.ERROR);
    }
  }, [searchPhone]);

  const clearSearch = useCallback(() => {
    setSearchPhone('');
    setSearchResults(null);
    setIsCombinedSearch(false);
    setDynamicHeaderTitle(null);
    setError('');
    setActiveTab(TAB_TYPES.TOP_SPENDER);
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setSearchPhone('');
    setSearchResults(null);
    setIsCombinedSearch(false);
    setDynamicHeaderTitle(null);
  }, []);

  const handleSearchInputChange = useCallback((value) => {
    setSearchPhone(value);
    setError(''); // Clear error when user starts typing
  }, []);

  // Get current data based on search and tab state
  const getCurrentData = useCallback(() => {
    if (searchResults !== null && isCombinedSearch) {
      return searchResults; // Show server search results directly
    }

    // Only apply client-side filtering when not using server search results
    if (searchPhone.trim() && !isCombinedSearch) {
      const allData = activeTab === TAB_TYPES.TOP_SPENDER ? topSpenderData : vdoCallData;
      return allData
        .map(item => ({ item, score: calculateClientMatchScore(searchPhone, item) }))
        .filter(match => match.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(match => match.item);
    }

    return activeTab === TAB_TYPES.TOP_SPENDER ? topSpenderData : vdoCallData;
  }, [searchResults, isCombinedSearch, searchPhone, activeTab, topSpenderData, vdoCallData]);

  return {
    // State
    searchPhone,
    searchResults,
    activeTab,
    dynamicHeaderTitle,
    loading,
    error,
    isCombinedSearch,

    // Computed
    currentData: getCurrentData(),
    hasSearchResults: searchResults && searchResults.length > 0,
    isLoading: loading === LOADING_STATES.LOADING,
    hasError: !!error,

    // Actions
    setSearchPhone: handleSearchInputChange,
    handleSearch,
    clearSearch,
    setActiveTab: handleTabChange,
    setError,
  };
};