'use client';
import { useState, useEffect } from 'react';

export interface MetasConfig {
  global: number;
  DOCA: number;
  STAR: number;
  CASA: number;
  THERM: number;
}

export const DEFAULT_METAS: MetasConfig = {
  global: 520000,
  DOCA: 104000,
  STAR: 145000,
  CASA: 85000,
  THERM: 60000,
};

const STORAGE_KEY = 'melimetrics_metas_config_v1';

export function getStoredMetas(): MetasConfig {
  if (typeof window === 'undefined') return DEFAULT_METAS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return DEFAULT_METAS;
    const parsed = JSON.parse(data);
    return {
      global: Number(parsed.global) || DEFAULT_METAS.global,
      DOCA: Number(parsed.DOCA) || DEFAULT_METAS.DOCA,
      STAR: Number(parsed.STAR) || DEFAULT_METAS.STAR,
      CASA: Number(parsed.CASA) || DEFAULT_METAS.CASA,
      THERM: Number(parsed.THERM) || DEFAULT_METAS.THERM,
    };
  } catch {
    return DEFAULT_METAS;
  }
}

export function saveStoredMetas(newMetas: MetasConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMetas));
    window.dispatchEvent(new CustomEvent('metas-updated', { detail: newMetas }));
  } catch (err) {
    console.error('Erro ao salvar metas:', err);
  }
}

export function useMetas() {
  const [metas, setMetas] = useState<MetasConfig>(DEFAULT_METAS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setMetas(getStoredMetas());
    setIsLoaded(true);

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<MetasConfig>;
      if (customEvent.detail) {
        setMetas(customEvent.detail);
      } else {
        setMetas(getStoredMetas());
      }
    };

    window.addEventListener('metas-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('metas-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const updateMetas = (newMetas: MetasConfig) => {
    setMetas(newMetas);
    saveStoredMetas(newMetas);
  };

  return { metas, updateMetas, isLoaded };
}
