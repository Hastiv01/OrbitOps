// Extended Mock Data for OrbitOps UI Enhancement
// Provides data for all new sections across Dashboard, Mission Scheduler,
// Constraint Optimization, Ground Station Planner, Payload Planner, Reports, etc.

import { satellites, missions, groundStations, payloads, communicationWindows, recommendations } from './mockData';

// ==================== MISSION ALERTS ====================
export interface MissionAlert {
  id: string;
  type: 'Battery Low' | 'Communication Conflict' | 'Payload Delay' | 'Orbit Warning';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  message: string;
  satellite: string;
  mission?: string;
  timestamp: string;
  acknowledged: boolean;
}

export const missionAlerts: MissionAlert[] = [
  { id: 'ALT-001', type: 'Battery Low', severity: 'Critical', title: 'Battery Critical — SAT-008', message: 'SatelliteEight battery at 15%. Immediate action required. All non-essential payloads should be powered down.', satellite: 'SatelliteEight', mission: 'Mission Alpha 12', timestamp: new Date(Date.now() - 5 * 60000).toISOString(), acknowledged: false },
  { id: 'ALT-002', type: 'Communication Conflict', severity: 'High', title: 'Comm Window Overlap', message: 'SatelliteOne and SatelliteFive have overlapping communication windows at Kennedy Space Center between 14:00–14:20 UTC.', satellite: 'SatelliteOne', mission: 'Mission Alpha 3', timestamp: new Date(Date.now() - 18 * 60000).toISOString(), acknowledged: false },
  { id: 'ALT-003', type: 'Payload Delay', severity: 'Medium', title: 'Thermal Imaging Delay', message: 'Thermal Imaging payload on SatelliteTwo requires additional cooldown. Expected 25-minute delay to next acquisition cycle.', satellite: 'SatelliteTwo', mission: 'Mission Alpha 7', timestamp: new Date(Date.now() - 42 * 60000).toISOString(), acknowledged: true },
  { id: 'ALT-004', type: 'Orbit Warning', severity: 'High', title: 'Orbit Decay Detected', message: 'SatelliteFour showing 0.3 km altitude loss over the past 48 hours. Thruster correction recommended within 12 hours.', satellite: 'SatelliteFour', timestamp: new Date(Date.now() - 90 * 60000).toISOString(), acknowledged: false },
  { id: 'ALT-005', type: 'Battery Low', severity: 'Medium', title: 'Battery Below Threshold', message: 'SatelliteFour battery at 45%. Schedule reduced operations during eclipse period.', satellite: 'SatelliteFour', mission: 'Mission Alpha 22', timestamp: new Date(Date.now() - 120 * 60000).toISOString(), acknowledged: true },
  { id: 'ALT-006', type: 'Communication Conflict', severity: 'Low', title: 'Ground Station Busy', message: 'Baikonur Cosmodrome at maximum capacity. 3 pending communication requests queued.', satellite: 'SatelliteThree', timestamp: new Date(Date.now() - 200 * 60000).toISOString(), acknowledged: true },
  { id: 'ALT-007', type: 'Payload Delay', severity: 'High', title: 'Camera Calibration Required', message: 'Ultra HD Camera on SatelliteFive requires recalibration. Imaging missions delayed by approximately 45 minutes.', satellite: 'SatelliteFive', mission: 'Mission Alpha 15', timestamp: new Date(Date.now() - 15 * 60000).toISOString(), acknowledged: false },
  { id: 'ALT-008', type: 'Orbit Warning', severity: 'Low', title: 'Debris Proximity Notice', message: 'Tracked object passing within 5 km of SatelliteSeven in 6 hours. No maneuver required at this time.', satellite: 'SatelliteSeven', timestamp: new Date(Date.now() - 300 * 60000).toISOString(), acknowledged: true },
];

// ==================== TODAY'S MISSION SCHEDULE ====================
export interface ScheduledMission {
  id: string;
  mission: string;
  satellite: string;
  start: string;
  end: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Delayed';
}

export const todaysMissionSchedule: ScheduledMission[] = [
  { id: 'SCH-001', mission: 'Arctic Ice Sheet Monitoring', satellite: 'SatelliteOne', start: '06:00 UTC', end: '08:30 UTC', priority: 'Critical', status: 'Completed' },
  { id: 'SCH-002', mission: 'Global Telecom Relay Pass', satellite: 'SatelliteNine', start: '07:15 UTC', end: '09:45 UTC', priority: 'High', status: 'Completed' },
  { id: 'SCH-003', mission: 'Land Surface Analysis', satellite: 'SatelliteTwo', start: '09:00 UTC', end: '11:00 UTC', priority: 'Medium', status: 'In Progress' },
  { id: 'SCH-004', mission: 'Weather Prediction Sweep', satellite: 'SatelliteFive', start: '10:30 UTC', end: '13:00 UTC', priority: 'High', status: 'In Progress' },
  { id: 'SCH-005', mission: 'Military Recon Pass', satellite: 'SatelliteSix', start: '11:00 UTC', end: '12:30 UTC', priority: 'Critical', status: 'Scheduled' },
  { id: 'SCH-006', mission: 'Asteroid Tracking Observation', satellite: 'SatelliteThree', start: '13:00 UTC', end: '15:30 UTC', priority: 'Medium', status: 'Scheduled' },
  { id: 'SCH-007', mission: 'Environmental Disaster Assessment', satellite: 'SatelliteTen', start: '14:00 UTC', end: '16:00 UTC', priority: 'Critical', status: 'Scheduled' },
  { id: 'SCH-008', mission: 'GPS Data Collection', satellite: 'SatelliteSeven', start: '15:30 UTC', end: '17:00 UTC', priority: 'Low', status: 'Scheduled' },
  { id: 'SCH-009', mission: 'Climate Monitoring Research', satellite: 'SatelliteOne', start: '16:00 UTC', end: '18:30 UTC', priority: 'High', status: 'Delayed' },
  { id: 'SCH-010', mission: 'Aurora Research & Documentation', satellite: 'SatelliteFive', start: '19:00 UTC', end: '21:00 UTC', priority: 'Medium', status: 'Scheduled' },
];

// ==================== ACTIVITY TIMELINE ====================
export interface ActivityEvent {
  id: string;
  type: 'mission' | 'alert' | 'system' | 'communication' | 'recommendation' | 'optimization';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

export const recentActivities: ActivityEvent[] = [
  { id: 'ACT-001', type: 'mission', title: 'Mission Alpha 5 completed', description: 'Earth observation mission completed successfully. 24 GB data collected.', timestamp: new Date(Date.now() - 3 * 60000).toISOString(), user: 'Operator Chen' },
  { id: 'ACT-002', type: 'alert', title: 'Battery alert acknowledged', description: 'SatelliteEight battery alert reviewed by ground control.', timestamp: new Date(Date.now() - 8 * 60000).toISOString(), user: 'Operator Müller' },
  { id: 'ACT-003', type: 'communication', title: 'Data downlink completed', description: 'SatelliteOne successfully downlinked 18.4 GB via Kennedy Space Center.', timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: 'ACT-004', type: 'optimization', title: 'Schedule optimized', description: 'AI optimizer reduced power consumption by 12% for next 6-hour window.', timestamp: new Date(Date.now() - 22 * 60000).toISOString(), user: 'AI System' },
  { id: 'ACT-005', type: 'recommendation', title: 'Recommendation applied', description: 'Task reordering recommendation applied to Mission Alpha 3.', timestamp: new Date(Date.now() - 35 * 60000).toISOString(), user: 'Operator Patel' },
  { id: 'ACT-006', type: 'system', title: 'Ground station maintenance', description: 'European Space Agency station completed scheduled antenna calibration.', timestamp: new Date(Date.now() - 55 * 60000).toISOString() },
  { id: 'ACT-007', type: 'mission', title: 'Mission Alpha 12 started', description: 'Navigation mission initiated on SatelliteThree.', timestamp: new Date(Date.now() - 68 * 60000).toISOString(), user: 'Operator Kim' },
  { id: 'ACT-008', type: 'alert', title: 'Orbit correction executed', description: 'SatelliteFour thruster burn completed. Altitude restored to nominal.', timestamp: new Date(Date.now() - 120 * 60000).toISOString(), user: 'Operator Johnson' },
  { id: 'ACT-009', type: 'communication', title: 'Comm window missed', description: 'Baikonur to SatelliteSix window missed due to antenna alignment issue.', timestamp: new Date(Date.now() - 180 * 60000).toISOString() },
  { id: 'ACT-010', type: 'system', title: 'System backup completed', description: 'Full telemetry database backup completed successfully.', timestamp: new Date(Date.now() - 240 * 60000).toISOString() },
];

// ==================== SYSTEM STATUS ====================
export interface SystemStatus {
  name: string;
  status: 'Operational' | 'Degraded' | 'Offline';
  uptime: string;
  latency: string;
}

export const systemStatus: SystemStatus[] = [
  { name: 'Mission Control Server', status: 'Operational', uptime: '99.98%', latency: '12ms' },
  { name: 'Telemetry Pipeline', status: 'Operational', uptime: '99.95%', latency: '8ms' },
  { name: 'Ground Network Link', status: 'Operational', uptime: '99.87%', latency: '24ms' },
  { name: 'AI Optimization Engine', status: 'Operational', uptime: '99.91%', latency: '45ms' },
  { name: 'Data Archive Storage', status: 'Degraded', uptime: '98.2%', latency: '156ms' },
  { name: 'Satellite Command Uplink', status: 'Operational', uptime: '99.99%', latency: '6ms' },
];

// ==================== WEATHER IMPACT ====================
export interface WeatherImpact {
  station: string;
  condition: 'Clear' | 'Cloudy' | 'Rainy' | 'Stormy';
  impact: 'None' | 'Low' | 'Medium' | 'High';
  forecast: string;
  affectedWindows: number;
}

export const weatherImpacts: WeatherImpact[] = [
  { station: 'Kennedy Space Center', condition: 'Clear', impact: 'None', forecast: 'Clear skies expected for the next 24 hours.', affectedWindows: 0 },
  { station: 'European Space Agency', condition: 'Cloudy', impact: 'Low', forecast: 'Partial cloud cover. Signal attenuation possible for optical downlinks.', affectedWindows: 2 },
  { station: 'Baikonur Cosmodrome', condition: 'Clear', impact: 'None', forecast: 'Stable atmospheric conditions. All operations nominal.', affectedWindows: 0 },
  { station: 'Indian Space Research Centre', condition: 'Rainy', impact: 'Medium', forecast: 'Monsoon activity. Recommend backup ground station for critical downlinks.', affectedWindows: 4 },
  { station: 'Guam Ground Station', condition: 'Stormy', impact: 'High', forecast: 'Tropical storm approaching. Station may go offline in 4–6 hours.', affectedWindows: 7 },
];

// ==================== SATELLITE HEALTH SUMMARY ====================
export interface SatelliteHealthSummary {
  id: string;
  name: string;
  batteryHealth: number;
  thermalStatus: 'Nominal' | 'Warning' | 'Critical';
  commStatus: 'Online' | 'Intermittent' | 'Offline';
  lastContact: string;
  nextContact: string;
  orbitStatus: 'Stable' | 'Decaying' | 'Correcting';
  velocity: number; // km/s
  coverageArea: number; // sq km
}

export const satelliteHealthSummaries: SatelliteHealthSummary[] = satellites.map(sat => ({
  id: sat.id,
  name: sat.name,
  batteryHealth: sat.batteryHealth,
  thermalStatus: sat.temperature > 55 ? 'Critical' : sat.temperature > 45 ? 'Warning' : 'Nominal',
  commStatus: sat.status === 'Active' ? 'Online' : sat.status === 'Maintenance' ? 'Intermittent' : 'Offline',
  lastContact: new Date(Date.now() - Math.random() * 30 * 60000).toISOString(),
  nextContact: new Date(Date.now() + Math.random() * 60 * 60000).toISOString(),
  orbitStatus: sat.id === 'SAT-004' ? 'Decaying' : 'Stable',
  velocity: sat.orbit === 'LEO' ? 7.66 + Math.random() * 0.2 : sat.orbit === 'MEO' ? 4.5 + Math.random() * 0.3 : 3.07,
  coverageArea: sat.orbit === 'LEO' ? 2000 + Math.floor(Math.random() * 3000) : sat.orbit === 'MEO' ? 15000 + Math.floor(Math.random() * 10000) : 120000 + Math.floor(Math.random() * 50000),
}));

// ==================== TELEMETRY DATA ====================
export interface TelemetryPoint {
  time: string;
  battery: number;
  temperature: number;
  signalStrength: number;
  cpuUsage: number;
  memoryUsage: number;
  powerConsumption: number;
}

export const generateTelemetryData = (satelliteName: string): TelemetryPoint[] => {
  const data: TelemetryPoint[] = [];
  for (let i = 23; i >= 0; i--) {
    data.push({
      time: `${String(23 - i).padStart(2, '0')}:00`,
      battery: 70 + Math.random() * 25,
      temperature: 30 + Math.random() * 20,
      signalStrength: -50 + Math.random() * 15,
      cpuUsage: 20 + Math.random() * 50,
      memoryUsage: 30 + Math.random() * 40,
      powerConsumption: 200 + Math.random() * 300,
    });
  }
  return data;
};

// ==================== SIGNAL STRENGTH CHART DATA ====================
export const generateSignalStrengthData = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    data.push({
      time: `${String(i).padStart(2, '0')}:00`,
      'Kennedy SC': -45 + Math.random() * 10,
      'ESA Paris': -50 + Math.random() * 12,
      'Baikonur': -48 + Math.random() * 11,
      'ISRC India': -55 + Math.random() * 15,
      'Guam GS': -52 + Math.random() * 13,
    });
  }
  return data;
};

export const signalStrengthData = generateSignalStrengthData();

// ==================== RESOURCE FORECAST ====================
export interface ForecastPoint {
  time: string;
  actual: number;
  predicted: number;
  lowerBound: number;
  upperBound: number;
}

export const generateForecast = (baseLine: number, trend: number): ForecastPoint[] => {
  const data: ForecastPoint[] = [];
  for (let i = 0; i < 48; i++) {
    const isHistorical = i < 24;
    const value = baseLine + trend * i + (Math.random() - 0.5) * 8;
    data.push({
      time: `${String(i % 24).padStart(2, '0')}:00${i >= 24 ? ' +1d' : ''}`,
      actual: isHistorical ? value : 0,
      predicted: value + (isHistorical ? 0 : (Math.random() - 0.5) * 5),
      lowerBound: value - 5 - Math.random() * 3,
      upperBound: value + 5 + Math.random() * 3,
    });
  }
  return data;
};

export const batteryForecast = generateForecast(85, -0.3);
export const powerForecast = generateForecast(65, 0.1);
export const memoryForecast = generateForecast(55, 0.4);
export const bandwidthForecast = generateForecast(70, -0.1);
export const storageForecast = generateForecast(60, 0.5);

// ==================== SUBSYSTEM HEALTH ====================
export interface SubsystemHealth {
  name: string;
  value: number;
  unit: string;
  status: 'Nominal' | 'Warning' | 'Critical';
  trend: 'up' | 'down' | 'stable';
}

export const subsystemHealth: SubsystemHealth[] = [
  { name: 'Solar Panel Efficiency', value: 94.2, unit: '%', status: 'Nominal', trend: 'stable' },
  { name: 'Power Generation', value: 1240, unit: 'W', status: 'Nominal', trend: 'up' },
  { name: 'Power Consumption', value: 980, unit: 'W', status: 'Warning', trend: 'up' },
  { name: 'Avg Temperature', value: 42.5, unit: '°C', status: 'Nominal', trend: 'stable' },
  { name: 'CPU Usage', value: 67, unit: '%', status: 'Nominal', trend: 'down' },
];

// ==================== RESOURCE UTILIZATION TABLE ====================
export interface ResourceUtilization {
  satellite: string;
  battery: number;
  memory: number;
  storage: number;
  power: number;
  bandwidth: number;
  cpu: number;
  risk: 'Low' | 'Medium' | 'High' | 'Critical';
}

export const resourceUtilization: ResourceUtilization[] = satellites.map(sat => ({
  satellite: sat.name,
  battery: sat.batteryHealth,
  memory: 30 + Math.floor(Math.random() * 50),
  storage: 40 + Math.floor(Math.random() * 40),
  power: 45 + Math.floor(Math.random() * 40),
  bandwidth: 20 + Math.floor(Math.random() * 60),
  cpu: 25 + Math.floor(Math.random() * 50),
  risk: sat.batteryHealth < 30 ? 'Critical' : sat.batteryHealth < 50 ? 'High' : sat.batteryHealth < 75 ? 'Medium' : 'Low',
}));

// ==================== RECOMMENDATION DETAILS ====================
export interface RecommendationDetail {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string;
  whyGenerated: string;
  expectedBenefit: string;
  affectedMission: string;
  affectedSatellite: string;
  confidenceScore: number;
  estimatedResourceSaving: string;
  estimatedBatterySaving: string;
  estimatedTimeSaving: string;
  suggestedAction: string;
  status: 'New' | 'Reviewed' | 'Applied' | 'Dismissed';
  createdAt: string;
  appliedAt?: string;
  appliedBy?: string;
}

export const recommendationDetails: RecommendationDetail[] = [
  { id: 'RD-001', title: 'Battery Critically Low', description: 'SAT-008 battery level is critically low at 15%.', priority: 'Critical', category: 'Battery', whyGenerated: 'Battery telemetry dropped below 20% threshold for SatelliteEight. Current drain rate suggests complete depletion within 4 orbits.', expectedBenefit: 'Prevent mission failure and extend satellite operational life by 72 hours.', affectedMission: 'Mission Alpha 12', affectedSatellite: 'SatelliteEight', confidenceScore: 96, estimatedResourceSaving: '340W power reduction', estimatedBatterySaving: '18% recovery over 6 hours', estimatedTimeSaving: '0 min (immediate action)', suggestedAction: 'Reduce payload operations and enter power-saving mode', status: 'New', createdAt: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: 'RD-002', title: 'Communication Window Optimization', description: 'GS-003 failed to establish contact during scheduled window.', priority: 'High', category: 'Performance', whyGenerated: 'Antenna misalignment detected at Baikonur Cosmodrome during last 3 contact attempts. Signal-to-noise ratio dropped 8 dB below nominal.', expectedBenefit: 'Restore reliable communication for 4 satellites dependent on this station.', affectedMission: 'Mission Alpha 3', affectedSatellite: 'SatelliteOne', confidenceScore: 89, estimatedResourceSaving: '12% bandwidth recovery', estimatedBatterySaving: '5% from fewer retry attempts', estimatedTimeSaving: '35 min per orbit pass', suggestedAction: 'Manually check ground station antenna position and recalibrate', status: 'New', createdAt: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: 'RD-003', title: 'Optimize Task Order', description: 'Current task schedule has inefficient transitions between payloads.', priority: 'Medium', category: 'Scheduling', whyGenerated: 'Analysis of the next 12-hour schedule identified 6 payload transitions that require full power cycling. Reordering can eliminate 4 of these transitions.', expectedBenefit: 'Reduce power consumption by 15% and free 45 minutes of operational time.', affectedMission: 'Mission Alpha 7', affectedSatellite: 'SatelliteTwo', confidenceScore: 92, estimatedResourceSaving: '15% power reduction', estimatedBatterySaving: '8% over 12 hours', estimatedTimeSaving: '45 min', suggestedAction: 'Reorder tasks to minimize power consumption transitions', status: 'Reviewed', createdAt: new Date(Date.now() - 24 * 3600000).toISOString() },
  { id: 'RD-004', title: 'Increase Memory Margin', description: 'Memory usage on SAT-005 is approaching critical levels.', priority: 'High', category: 'Resource', whyGenerated: 'SatelliteFive onboard memory has reached 87% capacity. At current data collection rate, memory will be full within 3 orbits. No downlink window available for 5 hours.', expectedBenefit: 'Prevent data loss and maintain continuous mission operations.', affectedMission: 'Mission Alpha 15', affectedSatellite: 'SatelliteFive', confidenceScore: 94, estimatedResourceSaving: '400 MB freed', estimatedBatterySaving: '3% from reduced write operations', estimatedTimeSaving: '0 min (prevent 2-hour recovery)', suggestedAction: 'Reduce data collection frequency or enable compression', status: 'New', createdAt: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: 'RD-005', title: 'Weather-Based Rerouting', description: 'Severe weather at ISRC India affecting communications.', priority: 'High', category: 'Risk', whyGenerated: 'Monsoon weather system over India causing 12 dB signal attenuation. 4 scheduled downlinks to ISRC in next 8 hours at risk.', expectedBenefit: 'Maintain 100% communication reliability for critical downlinks.', affectedMission: 'Mission Alpha 22', affectedSatellite: 'SatelliteSix', confidenceScore: 87, estimatedResourceSaving: '8% bandwidth efficiency', estimatedBatterySaving: '2% from fewer retransmissions', estimatedTimeSaving: '20 min per affected window', suggestedAction: 'Reroute communications to Kennedy SC or Baikonur', status: 'New', createdAt: new Date(Date.now() - 60 * 60000).toISOString() },
  { id: 'RD-006', title: 'Satellite Handover Optimization', description: 'Handover between SAT-003 and SAT-005 can be optimized.', priority: 'Medium', category: 'Scheduling', whyGenerated: 'Current handover gap is 8 minutes. By adjusting SAT-003 deactivation by 3 minutes, coverage gap reduces to under 1 minute.', expectedBenefit: 'Improve mission coverage from 95% to 99.2%.', affectedMission: 'Mission Alpha 9', affectedSatellite: 'SatelliteThree', confidenceScore: 91, estimatedResourceSaving: '5% improved utilization', estimatedBatterySaving: '1% from optimized transitions', estimatedTimeSaving: '7 min coverage improvement', suggestedAction: 'Adjust handover timing to maintain continuous coverage', status: 'Applied', createdAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(), appliedAt: new Date(Date.now() - 1 * 24 * 3600000).toISOString(), appliedBy: 'Operator Patel' },
  { id: 'RD-007', title: 'Payload Maintenance Due', description: 'PAY-002 (Radar Sensor) has been operational for 1200 hours.', priority: 'Low', category: 'Performance', whyGenerated: 'Scheduled maintenance threshold reached. Sensor calibration drift detected at 0.3% — within tolerance but trending upward.', expectedBenefit: 'Ensure payload longevity and prevent degraded data quality.', affectedMission: 'Mission Alpha 18', affectedSatellite: 'SatelliteOne', confidenceScore: 78, estimatedResourceSaving: 'N/A', estimatedBatterySaving: 'N/A', estimatedTimeSaving: 'Prevent 4-hour emergency maintenance', suggestedAction: 'Schedule maintenance check during next maintenance window', status: 'Reviewed', createdAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString() },
  { id: 'RD-008', title: 'Power Budget Rebalancing', description: 'Constellation power budget unbalanced across LEO fleet.', priority: 'Medium', category: 'Resource', whyGenerated: 'SAT-001 and SAT-005 are carrying 65% of the LEO workload while SAT-002 and SAT-010 are underutilized. Redistributing tasks would balance power consumption.', expectedBenefit: 'Extend constellation average battery life by 12% and reduce individual satellite wear.', affectedMission: 'Multiple missions', affectedSatellite: 'LEO Fleet', confidenceScore: 85, estimatedResourceSaving: '12% power balance improvement', estimatedBatterySaving: '12% fleet average', estimatedTimeSaving: '0 min (fleet longevity)', suggestedAction: 'Redistribute upcoming tasks across underutilized satellites', status: 'New', createdAt: new Date(Date.now() - 4 * 3600000).toISOString() },
];

// ==================== ANALYTICS DATA ====================
export const missionSuccessTrend = (() => {
  const data = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(Date.now() - i * 30 * 24 * 3600000);
    data.push({
      month: d.toLocaleString('default', { month: 'short' }),
      success: 75 + Math.floor(Math.random() * 20),
      failure: 2 + Math.floor(Math.random() * 8),
      partial: 3 + Math.floor(Math.random() * 5),
    });
  }
  return data;
})();

export const missionFailureAnalysis = [
  { reason: 'Power Loss', count: 12 },
  { reason: 'Comm Failure', count: 8 },
  { reason: 'Payload Error', count: 6 },
  { reason: 'Orbit Issue', count: 4 },
  { reason: 'Weather', count: 3 },
  { reason: 'Software Bug', count: 2 },
];

export const resourceUsageHeatmap = (() => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
  const data: Array<{ day: string; hour: string; value: number }> = [];
  days.forEach(day => {
    hours.forEach(hour => {
      data.push({ day, hour, value: Math.floor(Math.random() * 100) });
    });
  });
  return data;
})();

export const satelliteUtilization = satellites.map(s => ({
  name: s.name.replace('Satellite', 'SAT-'),
  utilization: 40 + Math.floor(Math.random() * 55),
  missions: Math.floor(Math.random() * 15) + 1,
}));

export const payloadUtilization = payloads.map(p => ({
  name: p.name.length > 15 ? p.name.substring(0, 12) + '...' : p.name,
  utilization: 30 + Math.floor(Math.random() * 60),
  hours: 100 + Math.floor(Math.random() * 900),
}));

export const groundStationUsage = groundStations.map(gs => ({
  name: gs.name.length > 15 ? gs.name.substring(0, 12) + '...' : gs.name,
  usage: gs.availability,
  connections: gs.connectedSatellites,
  windows: 5 + Math.floor(Math.random() * 20),
}));

export const missionTypeDistribution = [
  { name: 'Earth Observation', value: 35 },
  { name: 'Communication', value: 25 },
  { name: 'Navigation', value: 20 },
  { name: 'Scientific', value: 20 },
];

export const priorityDistribution = [
  { name: 'Critical', value: 15, color: '#ef4444' },
  { name: 'High', value: 30, color: '#f59e0b' },
  { name: 'Medium', value: 35, color: '#38bdf8' },
  { name: 'Low', value: 20, color: '#8b5cf6' },
];

export const riskDistribution = [
  { name: 'Low Risk', value: 45, color: '#10b981' },
  { name: 'Medium Risk', value: 30, color: '#f59e0b' },
  { name: 'High Risk', value: 18, color: '#ef4444' },
  { name: 'Critical Risk', value: 7, color: '#dc2626' },
];

export const batteryConsumptionTrend = (() => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    data.push({
      time: `${String(i).padStart(2, '0')}:00`,
      consumption: 60 + Math.random() * 30,
      generation: 50 + Math.random() * 40,
    });
  }
  return data;
})();

export const communicationTrend = (() => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    data.push({
      time: `${String(i).padStart(2, '0')}:00`,
      uplink: 20 + Math.random() * 60,
      downlink: 30 + Math.random() * 50,
    });
  }
  return data;
})();

// ==================== GROUND STATION PLANNER ====================
export interface GroundStationPlannerEntry {
  id: string;
  name: string;
  country: string;
  status: 'Operational' | 'Maintenance' | 'Offline' | 'Reserved';
  availability: number;
  latency: number;
  bandwidth: number;
  weather: 'Clear' | 'Cloudy' | 'Rainy' | 'Stormy';
  coverage: number;
  connectedSats: number;
  antennas: number;
  frequency: string;
  assignedMissions: string[];
  nextMaintenance: string;
}

export const groundStationPlannerData: GroundStationPlannerEntry[] = [
  { id: 'GSP-001', name: 'Kennedy Space Center', country: 'United States', status: 'Operational', availability: 98, latency: 12, bandwidth: 2400, weather: 'Clear', coverage: 85, connectedSats: 5, antennas: 8, frequency: '2.2 GHz', assignedMissions: ['Mission Alpha 1', 'Mission Alpha 5', 'Mission Alpha 12'], nextMaintenance: '2026-07-20' },
  { id: 'GSP-002', name: 'European Space Agency', country: 'France', status: 'Operational', availability: 97, latency: 18, bandwidth: 1800, weather: 'Cloudy', coverage: 78, connectedSats: 6, antennas: 6, frequency: '2.3 GHz', assignedMissions: ['Mission Alpha 2', 'Mission Alpha 8'], nextMaintenance: '2026-07-18' },
  { id: 'GSP-003', name: 'Baikonur Cosmodrome', country: 'Kazakhstan', status: 'Operational', availability: 95, latency: 22, bandwidth: 2000, weather: 'Clear', coverage: 82, connectedSats: 5, antennas: 7, frequency: '2.1 GHz', assignedMissions: ['Mission Alpha 3', 'Mission Alpha 9'], nextMaintenance: '2026-07-25' },
  { id: 'GSP-004', name: 'ISRC Sriharikota', country: 'India', status: 'Operational', availability: 92, latency: 28, bandwidth: 1600, weather: 'Rainy', coverage: 72, connectedSats: 4, antennas: 5, frequency: '2.2 GHz', assignedMissions: ['Mission Alpha 4'], nextMaintenance: '2026-07-22' },
  { id: 'GSP-005', name: 'Guam Ground Station', country: 'United States', status: 'Maintenance', availability: 45, latency: 35, bandwidth: 1200, weather: 'Stormy', coverage: 65, connectedSats: 2, antennas: 4, frequency: '2.25 GHz', assignedMissions: [], nextMaintenance: '2026-07-14' },
  { id: 'GSP-006', name: 'Canberra DSN', country: 'Australia', status: 'Operational', availability: 96, latency: 15, bandwidth: 2200, weather: 'Clear', coverage: 80, connectedSats: 4, antennas: 6, frequency: '2.3 GHz', assignedMissions: ['Mission Alpha 6', 'Mission Alpha 14'], nextMaintenance: '2026-08-01' },
  { id: 'GSP-007', name: 'Svalbard SvalSat', country: 'Norway', status: 'Operational', availability: 99, latency: 10, bandwidth: 2600, weather: 'Clear', coverage: 92, connectedSats: 7, antennas: 10, frequency: '2.1 GHz', assignedMissions: ['Mission Alpha 7', 'Mission Alpha 11', 'Mission Alpha 15'], nextMaintenance: '2026-08-05' },
  { id: 'GSP-008', name: 'Hartebeesthoek', country: 'South Africa', status: 'Operational', availability: 93, latency: 25, bandwidth: 1400, weather: 'Cloudy', coverage: 70, connectedSats: 3, antennas: 4, frequency: '2.2 GHz', assignedMissions: ['Mission Alpha 10'], nextMaintenance: '2026-07-28' },
  { id: 'GSP-009', name: 'McMurdo Station', country: 'Antarctica', status: 'Operational', availability: 88, latency: 45, bandwidth: 800, weather: 'Clear', coverage: 95, connectedSats: 6, antennas: 3, frequency: '2.0 GHz', assignedMissions: ['Mission Alpha 13', 'Mission Alpha 16'], nextMaintenance: '2026-09-01' },
  { id: 'GSP-010', name: 'Tanegashima', country: 'Japan', status: 'Operational', availability: 97, latency: 14, bandwidth: 2000, weather: 'Clear', coverage: 76, connectedSats: 4, antennas: 5, frequency: '2.25 GHz', assignedMissions: ['Mission Alpha 17'], nextMaintenance: '2026-07-30' },
  { id: 'GSP-011', name: 'Weilheim', country: 'Germany', status: 'Operational', availability: 96, latency: 16, bandwidth: 1900, weather: 'Cloudy', coverage: 75, connectedSats: 3, antennas: 5, frequency: '2.3 GHz', assignedMissions: ['Mission Alpha 18'], nextMaintenance: '2026-08-10' },
  { id: 'GSP-012', name: 'Santiago', country: 'Chile', status: 'Reserved', availability: 90, latency: 20, bandwidth: 1500, weather: 'Clear', coverage: 68, connectedSats: 2, antennas: 4, frequency: '2.15 GHz', assignedMissions: [], nextMaintenance: '2026-08-15' },
  { id: 'GSP-013', name: 'Maspalomas', country: 'Spain', status: 'Operational', availability: 94, latency: 19, bandwidth: 1700, weather: 'Clear', coverage: 73, connectedSats: 3, antennas: 5, frequency: '2.2 GHz', assignedMissions: ['Mission Alpha 19'], nextMaintenance: '2026-08-08' },
  { id: 'GSP-014', name: 'Dongara', country: 'Australia', status: 'Operational', availability: 91, latency: 24, bandwidth: 1300, weather: 'Clear', coverage: 71, connectedSats: 2, antennas: 3, frequency: '2.1 GHz', assignedMissions: ['Mission Alpha 20'], nextMaintenance: '2026-08-20' },
  { id: 'GSP-015', name: 'Kourou', country: 'French Guiana', status: 'Operational', availability: 95, latency: 21, bandwidth: 1800, weather: 'Rainy', coverage: 77, connectedSats: 4, antennas: 6, frequency: '2.3 GHz', assignedMissions: ['Mission Alpha 21', 'Mission Alpha 25'], nextMaintenance: '2026-08-12' },
];

// ==================== COMMUNICATION QUEUE ====================
export interface CommunicationQueueEntry {
  id: string;
  satellite: string;
  station: string;
  scheduledTime: string;
  duration: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  dataSize: string;
  status: 'Queued' | 'In Progress' | 'Completed' | 'Failed';
  type: 'Uplink' | 'Downlink';
}

export const communicationQueue: CommunicationQueueEntry[] = [
  { id: 'CQ-001', satellite: 'SatelliteOne', station: 'Kennedy Space Center', scheduledTime: new Date(Date.now() + 15 * 60000).toISOString(), duration: 12, priority: 'High', dataSize: '4.2 GB', status: 'Queued', type: 'Downlink' },
  { id: 'CQ-002', satellite: 'SatelliteFive', station: 'Svalbard SvalSat', scheduledTime: new Date(Date.now() + 30 * 60000).toISOString(), duration: 8, priority: 'Critical', dataSize: '6.8 GB', status: 'Queued', type: 'Downlink' },
  { id: 'CQ-003', satellite: 'SatelliteThree', station: 'Baikonur Cosmodrome', scheduledTime: new Date(Date.now() + 45 * 60000).toISOString(), duration: 15, priority: 'Medium', dataSize: '2.1 GB', status: 'Queued', type: 'Uplink' },
  { id: 'CQ-004', satellite: 'SatelliteTwo', station: 'ESA Paris', scheduledTime: new Date(Date.now() - 5 * 60000).toISOString(), duration: 10, priority: 'High', dataSize: '3.5 GB', status: 'In Progress', type: 'Downlink' },
  { id: 'CQ-005', satellite: 'SatelliteNine', station: 'Canberra DSN', scheduledTime: new Date(Date.now() + 60 * 60000).toISOString(), duration: 20, priority: 'Low', dataSize: '8.0 GB', status: 'Queued', type: 'Downlink' },
  { id: 'CQ-006', satellite: 'SatelliteSeven', station: 'McMurdo Station', scheduledTime: new Date(Date.now() - 30 * 60000).toISOString(), duration: 12, priority: 'Medium', dataSize: '1.8 GB', status: 'Completed', type: 'Uplink' },
  { id: 'CQ-007', satellite: 'SatelliteSix', station: 'Tanegashima', scheduledTime: new Date(Date.now() + 90 * 60000).toISOString(), duration: 15, priority: 'High', dataSize: '5.2 GB', status: 'Queued', type: 'Downlink' },
  { id: 'CQ-008', satellite: 'SatelliteTen', station: 'Hartebeesthoek', scheduledTime: new Date(Date.now() - 60 * 60000).toISOString(), duration: 8, priority: 'Low', dataSize: '0.9 GB', status: 'Failed', type: 'Uplink' },
];

// ==================== PAYLOAD PLANNER ====================
export interface PayloadPlannerEntry {
  id: string;
  name: string;
  type: string;
  status: 'Active' | 'Standby' | 'Maintenance' | 'Error' | 'Offline';
  temperature: number;
  power: number;
  storage: number;
  storageCapacity: number;
  assignedSatellite: string;
  assignedMission: string;
  lastActivated: string;
  operationalHours: number;
  nextMaintenance: string;
  dataCollected: number;
}

export const payloadPlannerData: PayloadPlannerEntry[] = payloads.map((p, i) => ({
  id: p.id,
  name: p.name,
  type: p.type,
  status: p.status as any,
  temperature: p.temperature,
  power: p.powerConsumption,
  storage: p.memoryUsage,
  storageCapacity: 1024,
  assignedSatellite: satellites[i % satellites.length].name,
  assignedMission: `Mission Alpha ${i + 1}`,
  lastActivated: new Date(Date.now() - Math.random() * 24 * 3600000).toISOString(),
  operationalHours: 200 + Math.floor(Math.random() * 1000),
  nextMaintenance: new Date(Date.now() + (7 + Math.random() * 30) * 24 * 3600000).toISOString(),
  dataCollected: Math.floor(Math.random() * 500),
}));

export interface PayloadHistoryEntry {
  id: string;
  payloadId: string;
  action: 'Activated' | 'Deactivated' | 'Calibrated' | 'Error' | 'Maintenance';
  timestamp: string;
  operator: string;
  notes: string;
}

export const payloadHistory: PayloadHistoryEntry[] = [
  { id: 'PH-001', payloadId: 'PAY-001', action: 'Activated', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), operator: 'Operator Chen', notes: 'Standard activation for imaging pass.' },
  { id: 'PH-002', payloadId: 'PAY-003', action: 'Calibrated', timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), operator: 'AI System', notes: 'Auto-calibration completed. Drift correction: 0.2%.' },
  { id: 'PH-003', payloadId: 'PAY-002', action: 'Deactivated', timestamp: new Date(Date.now() - 8 * 3600000).toISOString(), operator: 'Operator Müller', notes: 'Deactivated for power saving during eclipse.' },
  { id: 'PH-004', payloadId: 'PAY-005', action: 'Activated', timestamp: new Date(Date.now() - 12 * 3600000).toISOString(), operator: 'Operator Patel', notes: 'Communication relay pass initiated.' },
  { id: 'PH-005', payloadId: 'PAY-007', action: 'Error', timestamp: new Date(Date.now() - 18 * 3600000).toISOString(), operator: 'System', notes: 'Temperature sensor returned anomalous reading. Auto-shutdown triggered.' },
  { id: 'PH-006', payloadId: 'PAY-006', action: 'Maintenance', timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), operator: 'Operator Johnson', notes: 'Scheduled lens cleaning cycle completed.' },
  { id: 'PH-007', payloadId: 'PAY-009', action: 'Activated', timestamp: new Date(Date.now() - 30 * 3600000).toISOString(), operator: 'Operator Kim', notes: 'Data logger started for atmospheric science mission.' },
  { id: 'PH-008', payloadId: 'PAY-004', action: 'Calibrated', timestamp: new Date(Date.now() - 36 * 3600000).toISOString(), operator: 'AI System', notes: 'Spectrometer wavelength calibration. Accuracy: 99.7%.' },
];

// ==================== REPORT DATA ====================
export interface ReportEntry {
  id: string;
  name: string;
  category: 'Mission' | 'Resource' | 'Battery' | 'Communication' | 'Payload' | 'Optimization';
  generatedAt: string;
  generatedBy: string;
  format: 'PDF' | 'CSV' | 'JSON';
  size: string;
  period: string;
  status: 'Ready' | 'Generating' | 'Error';
}

export const reportHistory: ReportEntry[] = [
  { id: 'RPT-001', name: 'Weekly Mission Summary', category: 'Mission', generatedAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(), generatedBy: 'Operator Chen', format: 'PDF', size: '2.4 MB', period: 'Jul 1–7, 2026', status: 'Ready' },
  { id: 'RPT-002', name: 'Battery Health Report', category: 'Battery', generatedAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString(), generatedBy: 'AI System', format: 'PDF', size: '1.8 MB', period: 'Jul 1–7, 2026', status: 'Ready' },
  { id: 'RPT-003', name: 'Resource Utilization Export', category: 'Resource', generatedAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString(), generatedBy: 'Operator Müller', format: 'CSV', size: '0.5 MB', period: 'Jun 2026', status: 'Ready' },
  { id: 'RPT-004', name: 'Communication Log', category: 'Communication', generatedAt: new Date(Date.now() - 1 * 24 * 3600000).toISOString(), generatedBy: 'System', format: 'JSON', size: '3.1 MB', period: 'Jul 6–12, 2026', status: 'Ready' },
  { id: 'RPT-005', name: 'Payload Performance Analysis', category: 'Payload', generatedAt: new Date(Date.now() - 7 * 24 * 3600000).toISOString(), generatedBy: 'Operator Patel', format: 'PDF', size: '4.2 MB', period: 'Jun 2026', status: 'Ready' },
  { id: 'RPT-006', name: 'Optimization Results', category: 'Optimization', generatedAt: new Date(Date.now() - 4 * 3600000).toISOString(), generatedBy: 'AI System', format: 'PDF', size: '1.2 MB', period: 'Jul 13, 2026', status: 'Ready' },
];

// ==================== MISSION CALENDAR DATA ====================
export interface CalendarMission {
  id: string;
  name: string;
  date: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  satellite: string;
  status: 'Scheduled' | 'Active' | 'Completed';
}

export const generateCalendarMissions = (): CalendarMission[] => {
  const data: CalendarMission[] = [];
  const now = new Date();
  const priorities: Array<'Critical' | 'High' | 'Medium' | 'Low'> = ['Critical', 'High', 'Medium', 'Low'];
  const statuses: Array<'Scheduled' | 'Active' | 'Completed'> = ['Scheduled', 'Active', 'Completed'];
  for (let i = 0; i < 45; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), 1 + Math.floor(Math.random() * 28));
    data.push({
      id: `CAL-${String(i + 1).padStart(3, '0')}`,
      name: `Mission Alpha ${i + 1}`,
      date: d.toISOString().split('T')[0],
      priority: priorities[Math.floor(Math.random() * 4)],
      satellite: satellites[Math.floor(Math.random() * satellites.length)].name,
      status: d < now ? 'Completed' : statuses[Math.floor(Math.random() * 2)],
    });
  }
  return data;
};

export const calendarMissions = generateCalendarMissions();

// ==================== SCHEDULER DATA ====================
export interface SchedulerSlot {
  id: string;
  missionName: string;
  satellite: string;
  startHour: number;
  durationHours: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  hasConflict: boolean;
  conflictWith?: string;
}

export const schedulerSlots: SchedulerSlot[] = [
  { id: 'SL-001', missionName: 'Earth Observation Alpha', satellite: 'SatelliteOne', startHour: 2, durationHours: 3, priority: 'High', hasConflict: false },
  { id: 'SL-002', missionName: 'Comm Relay Beta', satellite: 'SatelliteNine', startHour: 4, durationHours: 2, priority: 'Critical', hasConflict: false },
  { id: 'SL-003', missionName: 'Weather Monitor', satellite: 'SatelliteFive', startHour: 6, durationHours: 4, priority: 'Medium', hasConflict: false },
  { id: 'SL-004', missionName: 'Recon Pass Gamma', satellite: 'SatelliteSix', startHour: 8, durationHours: 2, priority: 'Critical', hasConflict: true, conflictWith: 'SL-005' },
  { id: 'SL-005', missionName: 'Science Observation', satellite: 'SatelliteSix', startHour: 9, durationHours: 3, priority: 'Medium', hasConflict: true, conflictWith: 'SL-004' },
  { id: 'SL-006', missionName: 'GPS Collection', satellite: 'SatelliteSeven', startHour: 10, durationHours: 2, priority: 'Low', hasConflict: false },
  { id: 'SL-007', missionName: 'Thermal Mapping', satellite: 'SatelliteTwo', startHour: 12, durationHours: 3, priority: 'High', hasConflict: false },
  { id: 'SL-008', missionName: 'Data Downlink', satellite: 'SatelliteThree', startHour: 14, durationHours: 1, priority: 'High', hasConflict: false },
  { id: 'SL-009', missionName: 'Asteroid Track', satellite: 'SatelliteThree', startHour: 16, durationHours: 3, priority: 'Medium', hasConflict: false },
  { id: 'SL-010', missionName: 'Night Observation', satellite: 'SatelliteTen', startHour: 20, durationHours: 4, priority: 'Low', hasConflict: false },
];

// ==================== SYSTEM LOGS ====================
export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  source: string;
  message: string;
}

export const systemLogs: SystemLog[] = [
  { id: 'LOG-001', timestamp: new Date(Date.now() - 1 * 60000).toISOString(), level: 'INFO', source: 'TelemetryService', message: 'Telemetry data received from SatelliteOne. 847 data points processed.' },
  { id: 'LOG-002', timestamp: new Date(Date.now() - 3 * 60000).toISOString(), level: 'WARN', source: 'PowerMonitor', message: 'SatelliteFour battery below maintenance threshold (45%). Entering reduced mode.' },
  { id: 'LOG-003', timestamp: new Date(Date.now() - 5 * 60000).toISOString(), level: 'INFO', source: 'CommScheduler', message: 'Communication window CW-042 opened: SatelliteTwo ↔ ESA Paris.' },
  { id: 'LOG-004', timestamp: new Date(Date.now() - 8 * 60000).toISOString(), level: 'ERROR', source: 'GroundNetwork', message: 'Connection timeout to Guam Ground Station. Retry attempt 3 of 5.' },
  { id: 'LOG-005', timestamp: new Date(Date.now() - 12 * 60000).toISOString(), level: 'INFO', source: 'MissionEngine', message: 'Mission Alpha 5 status changed: Active → Completed.' },
  { id: 'LOG-006', timestamp: new Date(Date.now() - 15 * 60000).toISOString(), level: 'DEBUG', source: 'Optimizer', message: 'Optimization cycle #247 completed in 1.23s. Score: 87/100.' },
  { id: 'LOG-007', timestamp: new Date(Date.now() - 20 * 60000).toISOString(), level: 'INFO', source: 'PayloadCtrl', message: 'Ultra HD Camera (PAY-006) activated on SatelliteFive.' },
  { id: 'LOG-008', timestamp: new Date(Date.now() - 25 * 60000).toISOString(), level: 'WARN', source: 'OrbitDetermination', message: 'SatelliteFour altitude anomaly: -0.3 km deviation from nominal orbit.' },
  { id: 'LOG-009', timestamp: new Date(Date.now() - 30 * 60000).toISOString(), level: 'INFO', source: 'DataArchive', message: 'Backup cycle completed. 42.6 GB archived to cold storage.' },
  { id: 'LOG-010', timestamp: new Date(Date.now() - 45 * 60000).toISOString(), level: 'ERROR', source: 'PayloadCtrl', message: 'Advanced Radar (PAY-007) temperature sensor anomaly. Auto-shutdown initiated.' },
  { id: 'LOG-011', timestamp: new Date(Date.now() - 50 * 60000).toISOString(), level: 'INFO', source: 'AuthService', message: 'Operator Patel logged in from terminal MCC-04.' },
  { id: 'LOG-012', timestamp: new Date(Date.now() - 60 * 60000).toISOString(), level: 'INFO', source: 'CommScheduler', message: 'Daily communication schedule generated. 28 windows across 5 stations.' },
];
