// Comprehensive Mock Data for Satellite Mission Planning System

export interface Mission {
  id: string;
  name: string;
  missionId: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  type: 'Earth Observation' | 'Communication' | 'Navigation' | 'Scientific';
  satellite: string;
  orbit: string;
  payload: string[];
  startTime: string;
  endTime: string;
  estimatedDuration: number; // in minutes
  objective: string;
  status: 'Planning' | 'Scheduled' | 'Active' | 'Completed' | 'Failed' | 'Paused';
  notes?: string;
  completionPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface Satellite {
  id: string;
  name: string;
  status: 'Active' | 'Inactive' | 'Maintenance' | 'Decommissioned';
  orbit: string;
  altitude: number; // km
  inclination: number; // degrees
  batteryHealth: number; // percentage
  temperature: number; // celsius
  lastUpdate: string;
  groundStations: string[];
  currentPayloads: string[];
}

export interface Payload {
  id: string;
  name: string;
  type: 'Camera' | 'Radar' | 'Thermal Sensor' | 'Spectrometer' | 'Communication';
  status: 'Active' | 'Standby' | 'Error' | 'Maintenance';
  powerConsumption: number; // watts
  memoryUsage: number; // MB
  temperature: number; // celsius
  dataRate: number; // Mbps
  lastDataTransfer: string;
}

export interface GroundStation {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  status: 'Operational' | 'Maintenance' | 'Offline';
  connectedSatellites: number;
  availability: number; // percentage
  weather: 'Clear' | 'Cloudy' | 'Rainy' | 'Stormy';
  antennas: number;
  frequency: string;
}

export interface CommunicationWindow {
  id: string;
  satellite: string;
  groundStation: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  signalStrength: number; // dB
  status: 'Available' | 'Reserved' | 'Active' | 'Missed';
  dataCapacity: number; // GB
}

export interface Task {
  id: string;
  name: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  satellite: string;
  payload: string;
  startTime: string;
  endTime: string;
  status: 'Pending' | 'Active' | 'Completed' | 'Failed';
  conflictDetected: boolean;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  category: 'Battery' | 'Performance' | 'Scheduling' | 'Resource' | 'Risk';
  suggestedAction: string;
  impact: string;
  status: 'New' | 'Reviewed' | 'Applied' | 'Dismissed';
  createdAt: string;
}

// ==================== SATELLITES ====================
export const satellites: Satellite[] = [
  {
    id: 'SAT-001',
    name: 'SatelliteOne',
    status: 'Active',
    orbit: 'LEO',
    altitude: 400,
    inclination: 51.6,
    batteryHealth: 95,
    temperature: 42,
    lastUpdate: new Date().toISOString(),
    groundStations: ['GS-001', 'GS-002', 'GS-003'],
    currentPayloads: ['PAY-001', 'PAY-002'],
  },
  {
    id: 'SAT-002',
    name: 'SatelliteTwo',
    status: 'Active',
    orbit: 'LEO',
    altitude: 450,
    inclination: 45.0,
    batteryHealth: 88,
    temperature: 38,
    lastUpdate: new Date().toISOString(),
    groundStations: ['GS-002', 'GS-003'],
    currentPayloads: ['PAY-003', 'PAY-004'],
  },
  {
    id: 'SAT-003',
    name: 'SatelliteThree',
    status: 'Active',
    orbit: 'MEO',
    altitude: 8000,
    inclination: 55.0,
    batteryHealth: 92,
    temperature: 35,
    lastUpdate: new Date().toISOString(),
    groundStations: ['GS-001', 'GS-004'],
    currentPayloads: ['PAY-005'],
  },
  {
    id: 'SAT-004',
    name: 'SatelliteFour',
    status: 'Maintenance',
    orbit: 'GEO',
    altitude: 35786,
    inclination: 0.1,
    batteryHealth: 45,
    temperature: 32,
    lastUpdate: new Date().toISOString(),
    groundStations: ['GS-001', 'GS-002'],
    currentPayloads: [],
  },
  {
    id: 'SAT-005',
    name: 'SatelliteFive',
    status: 'Active',
    orbit: 'LEO',
    altitude: 380,
    inclination: 51.6,
    batteryHealth: 97,
    temperature: 40,
    lastUpdate: new Date().toISOString(),
    groundStations: ['GS-003', 'GS-004', 'GS-005'],
    currentPayloads: ['PAY-006', 'PAY-007', 'PAY-008'],
  },
  {
    id: 'SAT-006',
    name: 'SatelliteSix',
    status: 'Active',
    orbit: 'LEO',
    altitude: 420,
    inclination: 48.0,
    batteryHealth: 85,
    temperature: 44,
    lastUpdate: new Date().toISOString(),
    groundStations: ['GS-002', 'GS-004'],
    currentPayloads: ['PAY-009'],
  },
  {
    id: 'SAT-007',
    name: 'SatelliteSeven',
    status: 'Active',
    orbit: 'MEO',
    altitude: 12000,
    inclination: 56.0,
    batteryHealth: 90,
    temperature: 36,
    lastUpdate: new Date().toISOString(),
    groundStations: ['GS-005'],
    currentPayloads: ['PAY-010', 'PAY-011'],
  },
  {
    id: 'SAT-008',
    name: 'SatelliteEight',
    status: 'Inactive',
    orbit: 'LEO',
    altitude: 410,
    inclination: 52.0,
    batteryHealth: 15,
    temperature: 28,
    lastUpdate: new Date().toISOString(),
    groundStations: [],
    currentPayloads: [],
  },
  {
    id: 'SAT-009',
    name: 'SatelliteNine',
    status: 'Active',
    orbit: 'GEO',
    altitude: 35786,
    inclination: 0.05,
    batteryHealth: 96,
    temperature: 31,
    lastUpdate: new Date().toISOString(),
    groundStations: ['GS-001', 'GS-003', 'GS-005'],
    currentPayloads: ['PAY-012'],
  },
  {
    id: 'SAT-010',
    name: 'SatelliteTen',
    status: 'Active',
    orbit: 'LEO',
    altitude: 430,
    inclination: 50.0,
    batteryHealth: 93,
    temperature: 41,
    lastUpdate: new Date().toISOString(),
    groundStations: ['GS-002', 'GS-004'],
    currentPayloads: ['PAY-013', 'PAY-014'],
  },
];

// ==================== PAYLOADS ====================
export const payloads: Payload[] = [
  {
    id: 'PAY-001',
    name: 'High Resolution Camera',
    type: 'Camera',
    status: 'Active',
    powerConsumption: 85,
    memoryUsage: 450,
    temperature: 52,
    dataRate: 125,
    lastDataTransfer: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 'PAY-002',
    name: 'Radar Sensor',
    type: 'Radar',
    status: 'Standby',
    powerConsumption: 120,
    memoryUsage: 320,
    temperature: 48,
    dataRate: 90,
    lastDataTransfer: new Date(Date.now() - 20 * 60000).toISOString(),
  },
  {
    id: 'PAY-003',
    name: 'Thermal Imaging',
    type: 'Thermal Sensor',
    status: 'Active',
    powerConsumption: 95,
    memoryUsage: 280,
    temperature: 55,
    dataRate: 110,
    lastDataTransfer: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    id: 'PAY-004',
    name: 'Spectrometer',
    type: 'Spectrometer',
    status: 'Active',
    powerConsumption: 75,
    memoryUsage: 560,
    temperature: 50,
    dataRate: 85,
    lastDataTransfer: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: 'PAY-005',
    name: 'Communication Relay',
    type: 'Communication',
    status: 'Active',
    powerConsumption: 110,
    memoryUsage: 200,
    temperature: 45,
    dataRate: 200,
    lastDataTransfer: new Date(Date.now() - 1 * 60000).toISOString(),
  },
  {
    id: 'PAY-006',
    name: 'Ultra HD Camera',
    type: 'Camera',
    status: 'Active',
    powerConsumption: 100,
    memoryUsage: 650,
    temperature: 58,
    dataRate: 180,
    lastDataTransfer: new Date().toISOString(),
  },
  {
    id: 'PAY-007',
    name: 'Advanced Radar',
    type: 'Radar',
    status: 'Standby',
    powerConsumption: 130,
    memoryUsage: 380,
    temperature: 50,
    dataRate: 100,
    lastDataTransfer: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'PAY-008',
    name: 'IR Thermal',
    type: 'Thermal Sensor',
    status: 'Active',
    powerConsumption: 88,
    memoryUsage: 310,
    temperature: 52,
    dataRate: 95,
    lastDataTransfer: new Date(Date.now() - 8 * 60000).toISOString(),
  },
  {
    id: 'PAY-009',
    name: 'Data Logger',
    type: 'Spectrometer',
    status: 'Active',
    powerConsumption: 65,
    memoryUsage: 480,
    temperature: 46,
    dataRate: 75,
    lastDataTransfer: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: 'PAY-010',
    name: 'Link Amplifier',
    type: 'Communication',
    status: 'Active',
    powerConsumption: 105,
    memoryUsage: 180,
    temperature: 44,
    dataRate: 220,
    lastDataTransfer: new Date(Date.now() - 3 * 60000).toISOString(),
  },
  {
    id: 'PAY-011',
    name: 'Satellite Phone',
    type: 'Communication',
    status: 'Standby',
    powerConsumption: 45,
    memoryUsage: 100,
    temperature: 40,
    dataRate: 30,
    lastDataTransfer: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: 'PAY-012',
    name: 'Wide Angle Camera',
    type: 'Camera',
    status: 'Active',
    powerConsumption: 92,
    memoryUsage: 520,
    temperature: 54,
    dataRate: 140,
    lastDataTransfer: new Date(Date.now() - 4 * 60000).toISOString(),
  },
  {
    id: 'PAY-013',
    name: 'Atmospheric Sensor',
    type: 'Spectrometer',
    status: 'Active',
    powerConsumption: 72,
    memoryUsage: 410,
    temperature: 48,
    dataRate: 68,
    lastDataTransfer: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: 'PAY-014',
    name: 'Broadcast Transmitter',
    type: 'Communication',
    status: 'Active',
    powerConsumption: 115,
    memoryUsage: 220,
    temperature: 46,
    dataRate: 250,
    lastDataTransfer: new Date().toISOString(),
  },
];

// ==================== GROUND STATIONS ====================
export const groundStations: GroundStation[] = [
  {
    id: 'GS-001',
    name: 'Kennedy Space Center',
    country: 'United States',
    latitude: 28.6296,
    longitude: -80.6039,
    status: 'Operational',
    connectedSatellites: 5,
    availability: 98,
    weather: 'Clear',
    antennas: 8,
    frequency: '2.2 GHz',
  },
  {
    id: 'GS-002',
    name: 'European Space Agency',
    country: 'France',
    latitude: 48.8566,
    longitude: 2.3522,
    status: 'Operational',
    connectedSatellites: 6,
    availability: 97,
    weather: 'Cloudy',
    antennas: 6,
    frequency: '2.3 GHz',
  },
  {
    id: 'GS-003',
    name: 'Baikonur Cosmodrome',
    country: 'Kazakhstan',
    latitude: 45.9651,
    longitude: 63.3050,
    status: 'Operational',
    connectedSatellites: 5,
    availability: 95,
    weather: 'Clear',
    antennas: 7,
    frequency: '2.1 GHz',
  },
  {
    id: 'GS-004',
    name: 'Indian Space Research Centre',
    country: 'India',
    latitude: 13.0827,
    longitude: 80.2707,
    status: 'Operational',
    connectedSatellites: 4,
    availability: 92,
    weather: 'Rainy',
    antennas: 5,
    frequency: '2.2 GHz',
  },
  {
    id: 'GS-005',
    name: 'Guam Ground Station',
    country: 'United States',
    latitude: 13.4443,
    longitude: 144.7937,
    status: 'Operational',
    connectedSatellites: 4,
    availability: 99,
    weather: 'Stormy',
    antennas: 4,
    frequency: '2.25 GHz',
  },
];

// ==================== MISSIONS ====================
const generateMissions = (): Mission[] => {
  const missions: Mission[] = [];
  const types: Array<'Earth Observation' | 'Communication' | 'Navigation' | 'Scientific'> = [
    'Earth Observation',
    'Communication',
    'Navigation',
    'Scientific',
  ];
  const priorities: Array<'Low' | 'Medium' | 'High' | 'Critical'> = ['Low', 'Medium', 'High', 'Critical'];
  const statuses: Array<'Planning' | 'Scheduled' | 'Active' | 'Completed' | 'Failed' | 'Paused'> = [
    'Planning',
    'Scheduled',
    'Active',
    'Completed',
    'Failed',
    'Paused',
  ];

  const objectives = [
    'Land surface imaging and analysis',
    'Global telecommunications relay',
    'Climate monitoring and research',
    'Military surveillance and reconnaissance',
    'Weather forecasting and prediction',
    'Environmental disaster assessment',
    'GPS data collection and refinement',
    'Asteroid observation and tracking',
    'Aurora research and documentation',
    'Arctic ice sheet monitoring',
  ];

  for (let i = 1; i <= 100; i++) {
    const startTime = new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000);
    const duration = 60 + Math.floor(Math.random() * 480);
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

    missions.push({
      id: `MIS-${String(i).padStart(3, '0')}`,
      name: `Mission Alpha ${i}`,
      missionId: `ID-${String(i).padStart(5, '0')}`,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      type: types[Math.floor(Math.random() * types.length)],
      satellite: satellites[Math.floor(Math.random() * satellites.length)].name,
      orbit: ['LEO', 'MEO', 'GEO'][Math.floor(Math.random() * 3)],
      payload: [
        payloads[Math.floor(Math.random() * payloads.length)].name,
        payloads[Math.floor(Math.random() * payloads.length)].name,
      ],
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      estimatedDuration: duration,
      objective: objectives[Math.floor(Math.random() * objectives.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      notes: `Mission notes and objectives for alpha mission ${i}`,
      completionPercentage: Math.floor(Math.random() * 100),
      createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return missions;
};

export const missions: Mission[] = generateMissions();

// ==================== COMMUNICATION WINDOWS ====================
const generateCommunicationWindows = (): CommunicationWindow[] => {
  const windows: CommunicationWindow[] = [];

  for (let i = 0; i < 50; i++) {
    const startTime = new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000);
    const duration = 5 + Math.floor(Math.random() * 30);
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

    windows.push({
      id: `COM-${String(i + 1).padStart(3, '0')}`,
      satellite: satellites[Math.floor(Math.random() * satellites.length)].name,
      groundStation: groundStations[Math.floor(Math.random() * groundStations.length)].name,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration,
      signalStrength: -60 + Math.floor(Math.random() * 20),
      status: ['Available', 'Reserved', 'Active', 'Missed'][Math.floor(Math.random() * 4)] as any,
      dataCapacity: 5 + Math.floor(Math.random() * 95),
    });
  }

  return windows;
};

export const communicationWindows: CommunicationWindow[] = generateCommunicationWindows();

// ==================== TASKS ====================
const generateTasks = (): Task[] => {
  const tasks: Task[] = [];

  for (let i = 0; i < 50; i++) {
    const startTime = new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000);
    const duration = 30 + Math.floor(Math.random() * 240);
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

    tasks.push({
      id: `TASK-${String(i + 1).padStart(3, '0')}`,
      name: `Task ${i + 1}`,
      priority: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)] as any,
      satellite: satellites[Math.floor(Math.random() * satellites.length)].name,
      payload: payloads[Math.floor(Math.random() * payloads.length)].name,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      status: ['Pending', 'Active', 'Completed', 'Failed'][Math.floor(Math.random() * 4)] as any,
      conflictDetected: Math.random() > 0.7,
    });
  }

  return tasks;
};

export const tasks: Task[] = generateTasks();

// ==================== RECOMMENDATIONS ====================
export const recommendations: Recommendation[] = [
  {
    id: 'REC-001',
    title: 'Battery Critically Low',
    description: 'SAT-001 battery level is critically low at 15%. Recommend postponing high-power operations.',
    priority: 'Critical',
    category: 'Battery',
    suggestedAction: 'Reduce payload operations and enter power-saving mode',
    impact: 'Prevent mission failure due to power loss',
    status: 'New',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'REC-002',
    title: 'Communication Window Missed',
    description: 'GS-003 failed to establish contact during scheduled window. Check antenna alignment.',
    priority: 'High',
    category: 'Performance',
    suggestedAction: 'Manually check ground station antenna position and recalibrate',
    impact: 'Ensure critical data downlink',
    status: 'New',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'REC-003',
    title: 'Optimize Task Order',
    description: 'Current task schedule has inefficient transitions between payloads.',
    priority: 'Medium',
    category: 'Scheduling',
    suggestedAction: 'Reorder tasks to minimize power consumption transitions',
    impact: 'Save 15% power consumption and reduce mission time',
    status: 'Reviewed',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'REC-004',
    title: 'Increase Power Margin',
    description: 'Memory usage on SAT-005 is approaching critical levels.',
    priority: 'High',
    category: 'Resource',
    suggestedAction: 'Reduce data collection frequency or enable compression',
    impact: 'Prevent memory overflow and data loss',
    status: 'New',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'REC-005',
    title: 'Risk Analysis',
    description: 'Mission MIS-042 has overlapping communication windows with MIS-043.',
    priority: 'Medium',
    category: 'Risk',
    suggestedAction: 'Adjust MIS-043 start time by 15 minutes to avoid conflict',
    impact: 'Prevent communication interference and ensure mission success',
    status: 'Applied',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'REC-006',
    title: 'Weather Impact Alert',
    description: 'Severe weather conditions expected at GS-004 in 6 hours.',
    priority: 'High',
    category: 'Performance',
    suggestedAction: 'Reschedule communication windows to GS-001 or GS-002',
    impact: 'Maintain communication reliability',
    status: 'New',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'REC-007',
    title: 'Payload Maintenance Due',
    description: 'PAY-002 (Radar Sensor) has been operational for 1200 hours.',
    priority: 'Low',
    category: 'Performance',
    suggestedAction: 'Schedule maintenance check during next maintenance window',
    impact: 'Ensure payload longevity and optimal performance',
    status: 'Reviewed',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'REC-008',
    title: 'Satellite Handover Optimization',
    description: 'Handover between SAT-003 and SAT-005 can be optimized.',
    priority: 'Medium',
    category: 'Scheduling',
    suggestedAction: 'Adjust handover timing to maintain continuous coverage',
    impact: 'Improve mission coverage from 95% to 98%',
    status: 'New',
    createdAt: new Date().toISOString(),
  },
];

// ==================== BATTERY HISTORY ====================
export const generateBatteryHistory = () => {
  const history = [];
  const now = Date.now();
  for (let i = 95; i >= 50; i -= 5) {
    history.push({
      time: new Date(now - (95 - i) * 2 * 60 * 60 * 1000).toLocaleTimeString(),
      SAT001: i,
      SAT002: i + 2,
      SAT003: i - 3,
      SAT005: i + 5,
    });
  }
  return history;
};

// ==================== RESOURCE HISTORY ====================
export const generateResourceHistory = () => {
  const history = [];
  const now = Date.now();
  for (let i = 0; i < 24; i++) {
    history.push({
      time: `${i}:00`,
      battery: 85 - Math.random() * 20,
      memory: 45 + Math.random() * 30,
      cpu: 30 + Math.random() * 40,
      bandwidth: 50 + Math.random() * 35,
    });
  }
  return history;
};

// ==================== MISSION STATUS DISTRIBUTION ====================
export const getMissionStatusDistribution = () => {
  const distribution = {
    Planning: 0,
    Scheduled: 0,
    Active: 0,
    Completed: 0,
    Failed: 0,
    Paused: 0,
  };

  missions.forEach((mission) => {
    distribution[mission.status as keyof typeof distribution]++;
  });

  return Object.entries(distribution).map(([name, value]) => ({
    name,
    value,
  }));
};

// ==================== PAYLOAD USAGE ====================
export const getPayloadUsage = () => {
  return [
    { name: 'Camera', value: 35 },
    { name: 'Radar', value: 20 },
    { name: 'Thermal', value: 18 },
    { name: 'Spectrometer', value: 17 },
    { name: 'Communication', value: 10 },
  ];
};

// ==================== MISSION COMPLETION TREND ====================
export const getMissionCompletionTrend = () => {
  const trend = [];
  const now = Date.now();
  for (let i = 0; i < 12; i++) {
    trend.push({
      month: new Date(now - (11 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleString('default', { month: 'short' }),
      completed: 8 + Math.floor(Math.random() * 12),
      failed: 1 + Math.floor(Math.random() * 4),
    });
  }
  return trend;
};
