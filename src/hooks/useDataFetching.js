import { useState, useEffect } from 'react';
import { fetchTopSpenderData, fetchVDOCallData, fetchRegisteredUsers, handleApiError } from '@utils/api';
import { LOADING_STATES, ERROR_MESSAGES } from '@utils/constants';

export const useDataFetching = () => {
  const [topSpenderData, setTopSpenderData] = useState([]);
  const [vdoCallData, setVdoCallData] = useState([]);
  const [registeredUsersData, setRegisteredUsersData] = useState([]);
  const [loading, setLoading] = useState(LOADING_STATES.IDLE);
  const [error, setError] = useState('');

  const fetchAllData = async () => {
    setLoading(LOADING_STATES.LOADING);
    setError('');

    try {
      const [topSpenderResponse, vdoCallResponse, registeredUsersResponse] = await Promise.all([
        fetchTopSpenderData(),
        fetchVDOCallData(),
        fetchRegisteredUsers().catch(() => ({ data: [] })), // Admin endpoint might not exist
      ]);

      if (topSpenderResponse.success) {
        setTopSpenderData(topSpenderResponse.data || []);
      }

      if (vdoCallResponse.success) {
        setVdoCallData(vdoCallResponse.data || []);
      }

      if (registeredUsersResponse.data) {
        setRegisteredUsersData(registeredUsersResponse.data);
      }

      setLoading(LOADING_STATES.SUCCESS);
    } catch (err) {
      const errorMessage = handleApiError(err, ERROR_MESSAGES.NETWORK_ERROR);
      setError(errorMessage);
      setLoading(LOADING_STATES.ERROR);
    }
  };

  const refetchData = (dataType) => {
    switch (dataType) {
      case 'topSpender':
        return fetchTopSpenderData()
          .then(response => {
            if (response.success) setTopSpenderData(response.data || []);
            return response;
          })
          .catch(err => {
            setError(handleApiError(err));
            throw err;
          });
      case 'vdoCall':
        return fetchVDOCallData()
          .then(response => {
            if (response.success) setVdoCallData(response.data || []);
            return response;
          })
          .catch(err => {
            setError(handleApiError(err));
            throw err;
          });
      case 'registeredUsers':
        return fetchRegisteredUsers()
          .then(response => {
            if (response.data) setRegisteredUsersData(response.data);
            return response;
          })
          .catch(err => {
            setError(handleApiError(err));
            throw err;
          });
      default:
        return fetchAllData();
    }
  };

  const clearError = () => setError('');

  const getAllData = () => ({
    topSpender: topSpenderData,
    vdoCall: vdoCallData,
    registeredUsers: registeredUsersData,
    total: topSpenderData.length + vdoCallData.length,
  });

  return {
    // Data
    topSpenderData,
    vdoCallData,
    registeredUsersData,
    allData: getAllData(),

    // State
    loading,
    error,

    // Actions
    fetchAllData,
    refetchData,
    clearError,

    // Computed
    isLoading: loading === LOADING_STATES.LOADING,
    hasError: !!error,
    hasData: topSpenderData.length > 0 || vdoCallData.length > 0,
  };
};