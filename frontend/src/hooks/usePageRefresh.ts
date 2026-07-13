import { useCallback, useState } from 'react';

export const usePageRefresh = (delayMs = 800) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (callback?: () => void | Promise<void>) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      if (callback) await callback();
      setLastUpdated(new Date());
    } catch {
      setError('Failed to refresh data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [delayMs]);

  const clearError = useCallback(() => setError(null), []);

  return { isLoading, lastUpdated, error, refresh, clearError };
};
