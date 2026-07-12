import { useState, useCallback, useEffect } from 'react';
import { Mission, Recommendation, Payload, GroundStation, Satellite, CommunicationWindow, Task } from '../data/mockData';
import { z } from 'zod';


// ==================== NOTIFICATION HOOK ====================
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export const useNotification = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 3000) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: Toast = { id, message, type, duration };
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
};

// ==================== MISSIONS HOOK ====================
export const useMissions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const addMission = useCallback((mission: Mission) => {
    setMissions((prev) => [mission, ...prev]);
  }, []);

  const updateMission = useCallback((id: string, updates: Partial<Mission>) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m))
    );
  }, []);

  const deleteMission = useCallback((id: string) => {
    setMissions((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const duplicateMission = useCallback((id: string) => {
    const mission = missions.find((m) => m.id === id);
    if (mission) {
      const newMission: Mission = {
        ...mission,
        id: `MIS-${Date.now()}`,
        name: `${mission.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addMission(newMission);
      return newMission;
    }
  }, [missions, addMission]);

  return {
    missions,
    setMissions,
    selectedMission,
    setSelectedMission,
    addMission,
    updateMission,
    deleteMission,
    duplicateMission,
  };
};

// ==================== FILTER HOOK ====================
export interface MissionFilters {
  priority?: string;
  status?: string;
  satellite?: string;
  type?: string;
  dateRange?: { start: string; end: string };
  searchTerm?: string;
}

export const useMissionFilter = (missions: Mission[]) => {
  const [filters, setFilters] = useState<MissionFilters>({});

  const filteredMissions = useCallback(() => {
    return missions.filter((mission) => {
      if (filters.priority && mission.priority !== filters.priority) return false;
      if (filters.status && mission.status !== filters.status) return false;
      if (filters.satellite && mission.satellite !== filters.satellite) return false;
      if (filters.type && mission.type !== filters.type) return false;

      if (filters.dateRange) {
        const missionDate = new Date(mission.startTime);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        if (missionDate < startDate || missionDate > endDate) return false;
      }

      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        return (
          mission.name.toLowerCase().includes(term) ||
          mission.missionId.toLowerCase().includes(term) ||
          mission.objective.toLowerCase().includes(term)
        );
      }

      return true;
    });
  }, [missions, filters]);

  const updateFilters = useCallback((newFilters: Partial<MissionFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    filters,
    filteredMissions: filteredMissions(),
    updateFilters,
    clearFilters,
  };
};

// ==================== PAGINATION HOOK ====================
export const usePagination = (items: any[], itemsPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = useCallback((page: number) => {
    const pageNum = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNum);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

// ==================== SORTING HOOK ====================
export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export const useSorting = <T extends Record<string, any>>(items: T[], defaultKey?: string) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: defaultKey || '',
    direction: 'asc',
  });

  const sortedItems = useCallback(() => {
    if (!sortConfig.key) return items;

    const sorted = [...items].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === bVal) return 0;

      const comparison = aVal < bVal ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [items, sortConfig]);

  const toggleSort = useCallback((key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  return {
    sortConfig,
    sortedItems: sortedItems(),
    toggleSort,
  };
};

// ==================== MODAL HOOK ====================
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any>(null);

  const openModal = useCallback((modalData?: any) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setData(null), 300); // Wait for animation
  }, []);

  return {
    isOpen,
    data,
    openModal,
    closeModal,
  };
};

// ==================== LOCAL STORAGE HOOK ====================
export const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(error);
      }
    },
    [key]
  );

  return [storedValue, setValue];
};

// ==================== RESOURCE PREDICTION HOOK ====================
export interface ResourcePrediction {
  predictedBattery: number;
  predictedMemory: number;
  predictedPower: number;
  predictedRisk: 'Low' | 'Medium' | 'High' | 'Critical';
}

export const useResourcePrediction = (
  missionDuration: number,
  payloadCount: number,
  communicationCount: number
) => {
  const calculatePrediction = useCallback((): ResourcePrediction => {
    const baseBattery = 100;
    const basePower = 500;
    const baseMemory = 1000;

    const batteryDrain = missionDuration * 0.5 + payloadCount * 10 + communicationCount * 5;
    const powerConsumption = basePower + payloadCount * 85 + communicationCount * 50;
    const memoryUsage = baseMemory + payloadCount * 200 + communicationCount * 100;

    const predictedBattery = Math.max(0, baseBattery - batteryDrain);
    const predictedPower = powerConsumption;
    const predictedMemory = Math.min(100, (memoryUsage / 5000) * 100);

    let predictedRisk: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
    if (predictedBattery < 20) predictedRisk = 'Critical';
    else if (predictedBattery < 40) predictedRisk = 'High';
    else if (predictedBattery < 60) predictedRisk = 'Medium';

    return {
      predictedBattery: Math.round(predictedBattery),
      predictedMemory: Math.round(predictedMemory),
      predictedPower: Math.round(predictedPower),
      predictedRisk,
    };
  }, [missionDuration, payloadCount, communicationCount]);

  return calculatePrediction();
};

// ==================== FORM VALIDATION HOOK ====================
export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema: z.ZodSchema
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const validate = useCallback((): boolean => {
    try {
      validationSchema.parse(values);
      setErrors({});
      return true;
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        (error as z.ZodError<any>).errors.forEach((err: any) => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [values, validationSchema]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    setValues,
  };
};

// ==================== CONFLICT DETECTION HOOK ====================
export const useConflictDetection = (tasks: Task[]) => {
  const detectConflicts = useCallback(() => {
    const conflicts: Array<{ task1: Task; task2: Task }> = [];

    for (let i = 0; i < tasks.length; i++) {
      for (let j = i + 1; j < tasks.length; j++) {
        const task1 = tasks[i];
        const task2 = tasks[j];

        // Check if same satellite
        if (task1.satellite === task2.satellite) {
          const task1Start = new Date(task1.startTime).getTime();
          const task1End = new Date(task1.endTime).getTime();
          const task2Start = new Date(task2.startTime).getTime();
          const task2End = new Date(task2.endTime).getTime();

          // Check time overlap
          if (!(task1End <= task2Start || task2End <= task1Start)) {
            conflicts.push({ task1, task2 });
          }
        }
      }
    }

    return conflicts;
  }, [tasks]);

  const getConflictingTasks = useCallback(() => {
    const conflicts = detectConflicts();
    const conflictingTaskIds = new Set<string>();
    conflicts.forEach(({ task1, task2 }) => {
      conflictingTaskIds.add(task1.id);
      conflictingTaskIds.add(task2.id);
    });
    return conflictingTaskIds;
  }, [detectConflicts]);

  return {
    detectConflicts,
    getConflictingTasks,
  };
};

// ==================== OPTIMIZATION HOOK ====================
export interface OptimizationConstraints {
  batteryThreshold: number;
  maxPayloadUsage: number;
  memoryLimit: number;
  communicationPriority: 'High' | 'Medium' | 'Low';
  powerBudget: number;
  missionPriorityWeight: number;
}

export const useOptimization = (missions: Mission[], constraints: OptimizationConstraints) => {
  const calculateOptimizationScore = useCallback(() => {
    let violations = 0;
    let suggestions: string[] = [];
    let score = 100;

    // Check battery threshold
    const avgBattery = missions.reduce((acc, m) => acc + 50, 0) / missions.length;
    if (avgBattery < constraints.batteryThreshold) {
      violations++;
      suggestions.push('Reduce mission duration to preserve battery');
      score -= 15;
    }

    // Check memory usage
    const avgMemory = missions.reduce((acc, m) => acc + m.payload.length * 20, 0) / missions.length;
    if (avgMemory > constraints.memoryLimit) {
      violations++;
      suggestions.push('Reduce payload quantity per mission');
      score -= 20;
    }

    // Check power budget
    const avgPower = missions.reduce((acc, m) => acc + m.payload.length * 85, 0) / missions.length;
    if (avgPower > constraints.powerBudget) {
      violations++;
      suggestions.push('Optimize payload power consumption');
      score -= 15;
    }

    // Communication optimization
    const criticalMissions = missions.filter((m) => m.priority === 'Critical');
    if (constraints.communicationPriority === 'High' && criticalMissions.length > 5) {
      suggestions.push('Prioritize communication windows for critical missions');
    }

    // Mission priority optimization
    const highPriorityMissions = missions.filter((m) => m.priority === 'High' || m.priority === 'Critical');
    if (highPriorityMissions.length > 0) {
      suggestions.push('Schedule high-priority missions during peak power generation');
    }

    return {
      score: Math.max(0, score),
      violations,
      suggestions,
    };
  }, [missions, constraints]);

  return {
    calculateOptimizationScore,
  };
};

// ==================== EXPORT HOOK ====================
export const useExport = () => {
  const exportToCSV = useCallback((data: any[], filename: string) => {
    if (!data || data.length === 0) {
      console.error('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const rows = data.map((item) => headers.map((header) => JSON.stringify(item[header] || '')).join(','));

    const csv = [headers.join(','), ...rows].join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `${filename}.csv`);
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, []);

  const exportToJSON = useCallback((data: any, filename: string) => {
    const json = JSON.stringify(data, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(json));
    element.setAttribute('download', `${filename}.json`);
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, []);

  const printData = useCallback((content: string) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }
  }, []);

  return {
    exportToCSV,
    exportToJSON,
    printData,
  };
};

// ==================== THEME HOOK ====================
export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkMode', true);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(!isDarkMode);
  }, [isDarkMode, setIsDarkMode]);

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDarkMode]);

  return { isDarkMode, toggleTheme };
};

// ==================== SEARCH HOOK ====================
export interface SearchResults {
  missions: Mission[];
  satellites: Satellite[];
  groundStations: GroundStation[];
  payloads: Payload[];
  recommendations: Recommendation[];
}

export const useSearch = (
  missions: Mission[],
  satellites: Satellite[],
  groundStations: GroundStation[],
  payloads: Payload[],
  recommendations: Recommendation[]
) => {
  const [searchTerm, setSearchTerm] = useState('');

  const results = useCallback((): SearchResults => {
    const term = searchTerm.toLowerCase();

    return {
      missions: missions.filter(
        (m) =>
          m.name.toLowerCase().includes(term) ||
          m.missionId.toLowerCase().includes(term) ||
          m.objective.toLowerCase().includes(term)
      ),
      satellites: satellites.filter((s) => s.name.toLowerCase().includes(term)),
      groundStations: groundStations.filter((gs) => gs.name.toLowerCase().includes(term)),
      payloads: payloads.filter((p) => p.name.toLowerCase().includes(term)),
      recommendations: recommendations.filter(
        (r) => r.title.toLowerCase().includes(term) || r.description.toLowerCase().includes(term)
      ),
    };
  }, [searchTerm, missions, satellites, groundStations, payloads, recommendations]);

  return {
    searchTerm,
    setSearchTerm,
    results: results(),
  };
};
