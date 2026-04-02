import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { SEED_TRANSACTIONS } from '../data/mockData';

const AppContext = createContext();

const initialState = {
  transactions: [],
  role: 'admin',
  theme: 'dark',
  filters: { type: 'all', category: 'all', search: '', month: 'all' },
  sortConfig: { key: 'date', dir: 'desc' },
  activeTab: 'dashboard',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };

    case 'ADD_TRANSACTION': {
      const updated = [action.payload, ...state.transactions];
      localStorage.setItem('zorvyn_txs', JSON.stringify(updated));
      return { ...state, transactions: updated };
    }

    case 'EDIT_TRANSACTION': {
      const updated = state.transactions.map((t) =>
        t.id === action.payload.id ? action.payload : t
      );
      localStorage.setItem('zorvyn_txs', JSON.stringify(updated));
      return { ...state, transactions: updated };
    }

    case 'DELETE_TRANSACTION': {
      const updated = state.transactions.filter((t) => t.id !== action.payload);
      localStorage.setItem('zorvyn_txs', JSON.stringify(updated));
      return { ...state, transactions: updated };
    }

    case 'SET_ROLE':
      return { ...state, role: action.payload };

    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };

    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case 'SET_SORT':
      return { ...state, sortConfig: action.payload };

    case 'SET_TAB':
      return { ...state, activeTab: action.payload };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('zorvyn_txs');
      dispatch({
        type: 'SET_TRANSACTIONS',
        payload: saved ? JSON.parse(saved) : SEED_TRANSACTIONS,
      });
    } catch {
      dispatch({ type: 'SET_TRANSACTIONS', payload: SEED_TRANSACTIONS });
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
