import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

def generate_datasets():
    # Paths
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../datasets/raw"))
    os.makedirs(base_dir, exist_ok=True)
    
    # Constants
    NUM_SATELLITES = 20
    NUM_PAYLOADS = 40
    NUM_STATIONS = 15
    NUM_MISSIONS = 200
    DAYS_OF_TELEMETRY = 7
    
    # 1. Generate Satellites
    satellites = []
    orbits = ['LEO', 'MEO', 'GEO']
    for i in range(1, NUM_SATELLITES + 1):
        orbit = random.choice(orbits)
        alt = {'LEO': random.uniform(300, 1000), 'MEO': random.uniform(2000, 20000), 'GEO': 35786}[orbit]
        satellites.append({
            'satellite_id': f'SAT-{str(i).zfill(3)}',
            'name': f'Sat-{i}',
            'status': random.choices(['Active', 'Maintenance', 'Inactive'], weights=[0.8, 0.1, 0.1])[0],
            'orbit_type': orbit,
            'altitude_km': round(alt, 2),
            'inclination_deg': round(random.uniform(0, 98), 2),
            'launch_date': (datetime.now() - timedelta(days=random.randint(100, 3000))).strftime('%Y-%m-%d')
        })
    df_satellites = pd.DataFrame(satellites)
    df_satellites.to_csv(os.path.join(base_dir, 'satellites.csv'), index=False)
    
    # 2. Generate Payloads
    payloads = []
    types = ['Camera', 'Radar', 'Thermal Sensor', 'Spectrometer', 'Communication']
    for i in range(1, NUM_PAYLOADS + 1):
        ptype = random.choice(types)
        payloads.append({
            'payload_id': f'PAY-{str(i).zfill(3)}',
            'satellite_id': f'SAT-{str(random.randint(1, NUM_SATELLITES)).zfill(3)}',
            'name': f'{ptype} Payload {i}',
            'type': ptype,
            'power_draw_w': round(random.uniform(50, 300), 2),
            'data_rate_mbps': round(random.uniform(10, 500), 2),
            'status': random.choices(['Active', 'Standby', 'Maintenance'], weights=[0.7, 0.2, 0.1])[0]
        })
    df_payloads = pd.DataFrame(payloads)
    df_payloads.to_csv(os.path.join(base_dir, 'payloads.csv'), index=False)
    
    # 3. Generate Ground Stations
    stations = []
    for i in range(1, NUM_STATIONS + 1):
        stations.append({
            'station_id': f'GS-{str(i).zfill(3)}',
            'name': f'Ground Station {i}',
            'latitude': round(random.uniform(-90, 90), 4),
            'longitude': round(random.uniform(-180, 180), 4),
            'elevation_m': round(random.uniform(0, 3000), 1),
            'status': random.choices(['Operational', 'Maintenance', 'Offline'], weights=[0.85, 0.1, 0.05])[0]
        })
    df_stations = pd.DataFrame(stations)
    df_stations.to_csv(os.path.join(base_dir, 'ground_stations.csv'), index=False)
    
    # 4. Generate Telemetry (time-series for past 7 days)
    telemetry = []
    now = datetime.now()
    start_time = now - timedelta(days=DAYS_OF_TELEMETRY)
    
    for sat in satellites:
        sid = sat['satellite_id']
        # initial state
        battery = random.uniform(80, 100)
        temp = random.uniform(10, 50)
        
        current_time = start_time
        while current_time < now:
            # Random walk for battery and temp
            battery_delta = random.uniform(-2, 1.5) # Slight downward trend
            battery = max(0, min(100, battery + battery_delta))
            
            temp_delta = random.uniform(-5, 5)
            temp = max(-100, min(100, temp + temp_delta))
            
            signal_strength = max(0, min(100, random.gauss(85, 10)))
            
            telemetry.append({
                'timestamp': current_time.isoformat(),
                'satellite_id': sid,
                'battery_level_pct': round(battery, 2),
                'temperature_c': round(temp, 2),
                'signal_strength_dbm': round(-100 + (signal_strength * 0.6), 2), # -100 to -40
                'power_consumption_w': round(random.uniform(100, 500), 2)
            })
            current_time += timedelta(minutes=15)
            
    df_telemetry = pd.DataFrame(telemetry)
    df_telemetry.to_csv(os.path.join(base_dir, 'telemetry.csv'), index=False)
    
    # 5. Generate Historical Missions
    missions = []
    for i in range(1, NUM_MISSIONS + 1):
        m_start = now - timedelta(days=random.randint(1, 365))
        duration_hrs = random.uniform(1, 48)
        m_end = m_start + timedelta(hours=duration_hrs)
        
        status = random.choices(['Completed', 'Failed', 'Aborted'], weights=[0.85, 0.1, 0.05])[0]
        
        missions.append({
            'mission_id': f'MIS-{str(i).zfill(4)}',
            'satellite_id': f'SAT-{str(random.randint(1, NUM_SATELLITES)).zfill(3)}',
            'type': random.choice(['Earth Observation', 'Communication', 'Navigation', 'Scientific']),
            'priority': random.choices(['Low', 'Medium', 'High', 'Critical'], weights=[0.4, 0.3, 0.2, 0.1])[0],
            'start_time': m_start.isoformat(),
            'end_time': m_end.isoformat(),
            'status': status,
            'duration_hours': round(duration_hrs, 2)
        })
    df_missions = pd.DataFrame(missions)
    df_missions.to_csv(os.path.join(base_dir, 'historical_missions.csv'), index=False)
    
    # 6. Generate Communication Windows
    windows = []
    for i in range(1, 500):
        w_start = now + timedelta(hours=random.uniform(0, 72))
        duration_min = random.uniform(5, 30)
        w_end = w_start + timedelta(minutes=duration_min)
        
        windows.append({
            'window_id': f'WIN-{str(i).zfill(4)}',
            'satellite_id': f'SAT-{str(random.randint(1, NUM_SATELLITES)).zfill(3)}',
            'station_id': f'GS-{str(random.randint(1, NUM_STATIONS)).zfill(3)}',
            'start_time': w_start.isoformat(),
            'end_time': w_end.isoformat(),
            'duration_minutes': round(duration_min, 2),
            'visibility_score': round(random.uniform(0.5, 1.0), 2)
        })
    df_windows = pd.DataFrame(windows)
    df_windows.to_csv(os.path.join(base_dir, 'communication_windows.csv'), index=False)
    
    print(f"Generated realistic datasets in {base_dir}")

if __name__ == '__main__':
    generate_datasets()
