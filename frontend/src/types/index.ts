export interface Mission {
  id: string;
  name: string;
  satellite: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Delayed';
  startTime: string;
  endTime: string;
  progress: number;
  description: string;
  payload: string;
  region: string;
}

export interface CommunicationWindow {
  id: string;
  station: string;
  satellite: string;
  startTime: string;
  endTime: string;
  window: string;
  status: 'Open' | 'Upcoming' | 'Closed';
}

export interface GroundStation {
  id: string;
  name: string;
  location: string;
  availability: string;
  latency: string;
  capacity: string;
}

export interface Payload {
  id: string;
  name: string;
  type: string;
  status: string;
  utilization: number;
  power: string;
}

export interface ResourceData {
  name: string;
  battery: number;
  memory: number;
  storage: number;
  power: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  risk: 'High' | 'Medium' | 'Low';
  category: string;
  confidence: number;
}

export interface ThemeMode {
  mode: 'dark' | 'light';
}
