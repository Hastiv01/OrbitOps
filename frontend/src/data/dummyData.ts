import type { CommunicationWindow, GroundStation, Mission, Payload, Recommendation, ResourceData } from '../types';

export const missions: Mission[] = [
  {
    id: 'M-101',
    name: 'Earth Observation Survey',
    satellite: 'Astra-7',
    priority: 'Critical',
    status: 'In Progress',
    startTime: '08:00',
    endTime: '14:30',
    progress: 72,
    description: 'High-resolution imaging over the Pacific corridor.',
    payload: 'Optical Imager',
    region: 'Pacific',
  },
  {
    id: 'M-102',
    name: 'Climate Monitoring Sweep',
    satellite: 'Nova-2',
    priority: 'High',
    status: 'Scheduled',
    startTime: '10:15',
    endTime: '16:45',
    progress: 34,
    description: 'Atmospheric sampling and thermal mapping.',
    payload: 'Spectrometer',
    region: 'Arctic',
  },
  {
    id: 'M-103',
    name: 'Communication Relay Pass',
    satellite: 'Orion-4',
    priority: 'Medium',
    status: 'Delayed',
    startTime: '12:00',
    endTime: '13:30',
    progress: 55,
    description: 'Relay uplink for oceanic network nodes.',
    payload: 'Relay Array',
    region: 'Atlantic',
  },
];

export const communicationWindows: CommunicationWindow[] = [
  {
    id: 'CW-01',
    station: 'Svalbard Ground Station',
    satellite: 'Astra-7',
    startTime: '07:40',
    endTime: '08:15',
    window: '09m',
    status: 'Open',
  },
  {
    id: 'CW-02',
    station: 'Kourou Relay',
    satellite: 'Nova-2',
    startTime: '10:30',
    endTime: '11:10',
    window: '12m',
    status: 'Upcoming',
  },
  {
    id: 'CW-03',
    station: 'McMurdo Base',
    satellite: 'Orion-4',
    startTime: '13:20',
    endTime: '14:00',
    window: '08m',
    status: 'Closed',
  },
];

export const groundStations: GroundStation[] = [
  {
    id: 'GS-01',
    name: 'Svalbard',
    location: 'Norway',
    availability: '98%',
    latency: '16ms',
    capacity: 'High',
  },
  {
    id: 'GS-02',
    name: 'Kourou',
    location: 'French Guiana',
    availability: '91%',
    latency: '22ms',
    capacity: 'Medium',
  },
  {
    id: 'GS-03',
    name: 'McMurdo',
    location: 'Antarctica',
    availability: '94%',
    latency: '19ms',
    capacity: 'High',
  },
];

export const payloads: Payload[] = [
  {
    id: 'PL-01',
    name: 'Optical Imager',
    type: 'Imaging',
    status: 'Operational',
    utilization: 78,
    power: '320W',
  },
  {
    id: 'PL-02',
    name: 'Spectrometer',
    type: 'Environmental',
    status: 'Standby',
    utilization: 54,
    power: '180W',
  },
  {
    id: 'PL-03',
    name: 'Relay Array',
    type: 'Communication',
    status: 'Cooling',
    utilization: 61,
    power: '245W',
  },
];

export const resourceData: ResourceData[] = [
  { name: 'Mon', battery: 84, memory: 68, storage: 71, power: 62 },
  { name: 'Tue', battery: 81, memory: 70, storage: 73, power: 65 },
  { name: 'Wed', battery: 78, memory: 73, storage: 75, power: 68 },
  { name: 'Thu', battery: 74, memory: 72, storage: 77, power: 71 },
  { name: 'Fri', battery: 76, memory: 69, storage: 76, power: 70 },
  { name: 'Sat', battery: 80, memory: 67, storage: 74, power: 67 },
];

export const recommendations: Recommendation[] = [
  {
    id: 'R-01',
    title: 'Rebalance battery load',
    description: 'Shift non-critical payload usage to preserve 6% headroom for tomorrow.',
    risk: 'High',
    category: 'Battery',
    confidence: 92,
  },
  {
    id: 'R-02',
    title: 'Advance imaging window',
    description: 'Move the imaging sequence earlier to avoid expected weather interference.',
    risk: 'Medium',
    category: 'Mission',
    confidence: 86,
  },
  {
    id: 'R-03',
    title: 'Increase relay redundancy',
    description: 'Open a backup relay path for the Atlantic corridor link.',
    risk: 'Low',
    category: 'Communication',
    confidence: 78,
  },
];

export const satellites = [
  { name: 'Astra-7', health: 94, orbit: 'LEO 540km' },
  { name: 'Nova-2', health: 88, orbit: 'SSO 550km' },
  { name: 'Orion-4', health: 91, orbit: 'GEO 35786km' },
];
