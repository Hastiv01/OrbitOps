import React, { createContext, useContext, useCallback, useEffect } from 'react';
import {
  Mission,
  Satellite,
  Payload,
  GroundStation,
  CommunicationWindow,
  Task,
  Recommendation,
  missions as initialMissions,
  satellites,
  payloads,
  groundStations,
  communicationWindows as initialCommunicationWindows,
  tasks as initialTasks,
  recommendations as initialRecommendations,
} from '../data/mockData';
import { useMissions, useNotification, useMissionFilter, OptimizationConstraints } from '../hooks';
import {
  fetchMissions,
  createMission as apiCreateMission,
  updateMission as apiUpdateMission,
  deleteMission as apiDeleteMission,
  fetchSatellites,
  fetchPayloads,
  fetchGroundStations,
  fetchRecommendations,
} from '../services/api';

interface AppContextType {
  // Data
  missions: Mission[];
  satellites: Satellite[];
  payloads: Payload[];
  groundStations: GroundStation[];
  communicationWindows: CommunicationWindow[];
  tasks: Task[];
  recommendations: Recommendation[];
  constraints: OptimizationConstraints;

  // Mission Operations
  addMission: (mission: Mission) => void;
  updateMission: (id: string, updates: Partial<Mission>) => void;
  deleteMission: (id: string) => void;
  duplicateMission: (id: string) => Mission | undefined;
  selectedMission: Mission | null;
  setSelectedMission: (mission: Mission | null) => void;

  // Task Operations
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  // Recommendation Operations
  dismissRecommendation: (id: string) => void;
  applyRecommendation: (id: string) => void;

  // Filtering & Search
  filteredMissions: Mission[];
  updateMissionFilters: (filters: any) => void;
  clearMissionFilters: () => void;

  // Notifications
  toasts: any[];
  addToast: (message: string, type: 'success' | 'error' | 'info' | 'warning', duration?: number) => void;
  removeToast: (id: string) => void;

  // Settings
  updateConstraints: (constraints: OptimizationConstraints) => void;

  // Refresh Trigger
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Missions
  const [missionsList, setMissionsList] = React.useState<Mission[]>([]);
  const { filteredMissions, updateFilters, clearFilters } = useMissionFilter(missionsList);
  const [selectedMission, setSelectedMission] = React.useState<Mission | null>(null);

  // Infrastructure lists as state variables
  const [satellitesList, setSatellitesList] = React.useState<Satellite[]>(satellites);
  const [payloadsList, setPayloadsList] = React.useState<Payload[]>(payloads);
  const [groundStationsList, setGroundStationsList] = React.useState<GroundStation[]>(groundStations);

  // Tasks
  const [tasksList, setTasksList] = React.useState<Task[]>(initialTasks);

  // Recommendations
  const [recommendationsList, setRecommendationsList] = React.useState<Recommendation[]>(initialRecommendations);

  // Communication Windows
  const [commWindowsList, setCommWindowsList] = React.useState<CommunicationWindow[]>(initialCommunicationWindows);

  // Constraints
  const [constraints, setConstraints] = React.useState<OptimizationConstraints>({
    batteryThreshold: 20,
    maxPayloadUsage: 4,
    memoryLimit: 4000,
    communicationPriority: 'High',
    powerBudget: 1000,
    missionPriorityWeight: 0.5,
  });

  // Notifications
  const { toasts, addToast, removeToast } = useNotification();

  // Refresh Trigger
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);
  const triggerRefresh = useCallback(() => setRefreshTrigger(prev => prev + 1), []);

  // Helper to safely extract arrays from API responses
  const extractArray = <T,>(data: any): T[] | null => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
      // Look for an array property inside the response object
      const keys = Object.keys(data);
      for (const key of keys) {
        if (Array.isArray(data[key])) return data[key];
      }
    }
    return null;
  };

  const loadBackendData = useCallback(async () => {
    try {
      const [missionsRes, satellitesRes, payloadsRes, groundStationsRes, recommendationsRes] = await Promise.all([
        fetchMissions(),
        fetchSatellites(),
        fetchPayloads(),
        fetchGroundStations(),
        fetchRecommendations().catch(() => ({ data: [] })), // Catch if backend recommendations fail
      ]);
      
      const missionsArr = extractArray<Mission>(missionsRes.data);
      const satellitesArr = extractArray<Satellite>(satellitesRes.data);
      const payloadsArr = extractArray<Payload>(payloadsRes.data);
      const groundStationsArr = extractArray<GroundStation>(groundStationsRes.data);
      const recommendationsArr = extractArray<Recommendation>(recommendationsRes.data);

      setMissionsList(missionsArr || initialMissions);
      if (satellitesArr) setSatellitesList(satellitesArr);
      if (payloadsArr) setPayloadsList(payloadsArr);
      if (groundStationsArr) setGroundStationsList(groundStationsArr);
      
      if (recommendationsArr && recommendationsArr.length > 0) {
          setRecommendationsList(recommendationsArr);
      }
    } catch (err) {
      console.error('Failed to load database content, falling back to local mocks:', err);
      setMissionsList(initialMissions);
    }
  }, []);

  // Load backend data on mount and when refreshTrigger changes
  useEffect(() => {
    loadBackendData();
  }, [loadBackendData, refreshTrigger]);

  // Mission Operations
  const addMission = useCallback(
    async (mission: Mission) => {
      try {
        const res = await apiCreateMission(mission);
        const savedMission = res.data || mission;
        setMissionsList((prev) => [savedMission, ...prev]);
        addToast(`Mission "${savedMission.name}" created successfully`, 'success');
      } catch (err) {
        console.error('Failed to add mission to database:', err);
        setMissionsList((prev) => [mission, ...prev]);
        addToast(`Mission "${mission.name}" created locally (backend offline)`, 'warning');
      }
      triggerRefresh();
    },
    [addToast, triggerRefresh]
  );

  const updateMission = useCallback(
    async (id: string, updates: Partial<Mission>) => {
      try {
        const res = await apiUpdateMission(id, updates);
        const updatedMission = res.data;
        setMissionsList((prev) =>
          prev.map((m) => (m.id === id ? { ...m, ...updatedMission } : m))
        );
        addToast('Mission updated successfully', 'success');
      } catch (err) {
        console.error('Failed to update mission in database:', err);
        setMissionsList((prev) =>
          prev.map((m) => (m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m))
        );
        addToast('Mission updated locally (backend offline)', 'warning');
      }
      triggerRefresh();
    },
    [addToast, triggerRefresh]
  );

  const deleteMission = useCallback(
    async (id: string) => {
      const missionName = missionsList.find((m) => m.id === id)?.name;
      try {
        await apiDeleteMission(id);
        setMissionsList((prev) => prev.filter((m) => m.id !== id));
        addToast(`Mission "${missionName}" deleted successfully`, 'success');
      } catch (err) {
        console.error('Failed to delete mission from database:', err);
        setMissionsList((prev) => prev.filter((m) => m.id !== id));
        addToast(`Mission "${missionName}" deleted locally (backend offline)`, 'warning');
      }
      triggerRefresh();
    },
    [missionsList, addToast, triggerRefresh]
  );

  const duplicateMission = useCallback(
    (id: string) => {
      const mission = missionsList.find((m) => m.id === id);
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
    },
    [missionsList, addMission]
  );

  // Task Operations
  const addTask = useCallback(
    (task: Task) => {
      setTasksList((prev) => [task, ...prev]);
      addToast(`Task "${task.name}" added successfully`, 'success');
      generateRecommendations();
    },
    [addToast]
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      setTasksList((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
      addToast('Task updated successfully', 'success');
      generateRecommendations();
    },
    [addToast]
  );

  const deleteTask = useCallback(
    (id: string) => {
      const taskName = tasksList.find((t) => t.id === id)?.name;
      setTasksList((prev) => prev.filter((t) => t.id !== id));
      addToast(`Task "${taskName}" deleted successfully`, 'success');
      generateRecommendations();
    },
    [tasksList, addToast]
  );

  // Recommendation Operations
  const dismissRecommendation = useCallback(
    (id: string) => {
      setRecommendationsList((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'Dismissed' as any } : r))
      );
    },
    []
  );

  const applyRecommendation = useCallback(
    (id: string) => {
      setRecommendationsList((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'Applied' as any } : r))
      );
      addToast('Recommendation applied successfully', 'success');
    },
    [addToast]
  );

  // Generate recommendations based on current state
  const generateRecommendations = useCallback(() => {
    const newRecommendations: Recommendation[] = [];

    // Check battery levels
    if (missionsList.length > 0) {
      const lowBatteryMissions = missionsList.filter((m) => m.status === 'Active' && m.completionPercentage > 70);
      if (lowBatteryMissions.length > 0 && !recommendationsList.find((r) => r.title === 'Battery Critically Low')) {
        newRecommendations.push({
          id: `REC-${Date.now()}`,
          title: 'Battery Critically Low',
          description: `${lowBatteryMissions.length} active mission(s) are consuming high power.`,
          priority: 'High',
          category: 'Battery',
          suggestedAction: 'Reduce payload operations or reschedule non-critical tasks',
          impact: 'Prevent mission failure due to power loss',
          status: 'New',
          createdAt: new Date().toISOString(),
        });
      }
    }

    // Check for scheduling conflicts
    const conflicts = findTaskConflicts();
    if (conflicts.length > 0 && !recommendationsList.find((r) => r.title === 'Task Scheduling Conflicts')) {
      newRecommendations.push({
        id: `REC-${Date.now() + 1}`,
        title: 'Task Scheduling Conflicts',
        description: `${conflicts.length} task(s) have scheduling conflicts that need resolution.`,
        priority: 'High',
        category: 'Scheduling',
        suggestedAction: 'Review and reschedule overlapping tasks',
        impact: 'Ensure all tasks can be executed without conflicts',
        status: 'New',
        createdAt: new Date().toISOString(),
      });
    }

    if (newRecommendations.length > 0) {
      setRecommendationsList((prev) => [...newRecommendations, ...prev]);
    }
  }, [missionsList, recommendationsList]);

  const findTaskConflicts = useCallback(() => {
    const conflicts: Array<{ task1: Task; task2: Task }> = [];

    for (let i = 0; i < tasksList.length; i++) {
      for (let j = i + 1; j < tasksList.length; j++) {
        const task1 = tasksList[i];
        const task2 = tasksList[j];

        if (task1.satellite === task2.satellite) {
          const task1Start = new Date(task1.startTime).getTime();
          const task1End = new Date(task1.endTime).getTime();
          const task2Start = new Date(task2.startTime).getTime();
          const task2End = new Date(task2.endTime).getTime();

          if (!(task1End <= task2Start || task2End <= task1Start)) {
            conflicts.push({ task1, task2 });
          }
        }
      }
    }

    return conflicts;
  }, [tasksList]);

  const updateConstraints = useCallback((newConstraints: OptimizationConstraints) => {
    setConstraints(newConstraints);
    addToast('Constraints updated successfully', 'success');
  }, [addToast]);

  // Initialize recommendations periodically
  useEffect(() => {
    const interval = setInterval(() => {
      generateRecommendations();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [generateRecommendations]);

  const value: AppContextType = {
    // Data
    missions: missionsList,
    satellites: satellitesList,
    payloads: payloadsList,
    groundStations: groundStationsList,
    communicationWindows: commWindowsList,
    tasks: tasksList,
    recommendations: recommendationsList,
    constraints,

    // Mission Operations
    addMission,
    updateMission,
    deleteMission,
    duplicateMission,
    selectedMission,
    setSelectedMission,

    // Task Operations
    addTask,
    updateTask,
    deleteTask,

    // Recommendation Operations
    dismissRecommendation,
    applyRecommendation,

    // Filtering & Search
    filteredMissions,
    updateMissionFilters: updateFilters,
    clearMissionFilters: clearFilters,

    // Notifications
    toasts,
    addToast,
    removeToast,

    // Settings
    updateConstraints,

    // Refresh Trigger
    refreshTrigger,
    triggerRefresh,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
