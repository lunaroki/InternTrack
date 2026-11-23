import { useContext } from 'react';
import { AppDataContext } from '../contexts/AppDataContext';
import type { AppDataValue } from '../contexts/AppDataContext';

export function useAppData(): AppDataValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}