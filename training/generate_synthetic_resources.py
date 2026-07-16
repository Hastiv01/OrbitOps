import os
import random
import pandas as pd
import numpy as np

def generate_synthetic_resources():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../datasets/raw"))
    os.makedirs(base_dir, exist_ok=True)
    
    num_rows = 5000
    rows = []
    
    orbit_types = ['LEO', 'MEO', 'GEO', 'SSO']
    
    for _ in range(num_rows):
        orbit_type = random.choice(orbit_types)
        
        if orbit_type == 'LEO':
            orbit_altitude_km = random.uniform(300, 1000)
            inclination_deg = random.uniform(30, 98)
        elif orbit_type == 'MEO':
            orbit_altitude_km = random.uniform(2000, 20000)
            inclination_deg = random.uniform(45, 60)
        elif orbit_type == 'GEO':
            orbit_altitude_km = 35786.0
            inclination_deg = random.uniform(0, 5)
        else: # SSO
            orbit_altitude_km = random.uniform(500, 800)
            inclination_deg = random.uniform(97, 99)
            
        current_battery_percent = random.uniform(30, 100)
        previous_battery_percent = max(0, min(100, current_battery_percent + random.uniform(-8, 5)))
        
        solar_exposure_hours = random.uniform(0.5, 4.5)
        eclipse_duration_hours = random.uniform(0, 1.8)
        
        payload_count = random.randint(1, 5)
        payload_power_kw = payload_count * random.uniform(0.4, 1.2)
        power_consumption_kw = payload_power_kw + random.uniform(0.2, 0.6)
        previous_power_consumption_kw = max(0.1, power_consumption_kw + random.uniform(-0.4, 0.4))
        
        communication_duration_minutes = random.uniform(5, 60)
        communication_bandwidth_mbps = random.uniform(50, 450)
        
        onboard_memory_total_gb = 512.0
        onboard_memory_used_gb = random.uniform(10, 480)
        
        cpu_utilization_percent = random.uniform(10, 95)
        temperature_celsius = random.uniform(20, 80)
        mission_duration_hours = random.uniform(1, 10)
        
        # Physics-inspired target generation for battery
        drain = power_consumption_kw * mission_duration_hours * 6.5
        charge = solar_exposure_hours * 12.0
        remaining_battery_percent = max(0.0, min(100.0, current_battery_percent - drain + charge))
        
        # Risk target rules
        if remaining_battery_percent < 25.0 or temperature_celsius > 65.0 or cpu_utilization_percent > 85.0:
            mission_risk = 'HIGH'
        elif remaining_battery_percent < 45.0 or temperature_celsius > 50.0 or cpu_utilization_percent > 70.0:
            mission_risk = 'MEDIUM'
        else:
            mission_risk = 'LOW'
            
        # Health score rules
        if mission_risk == 'LOW':
            health_score = random.uniform(75, 100)
        elif mission_risk == 'MEDIUM':
            health_score = random.uniform(45, 75)
        else:
            health_score = random.uniform(10, 45)
            
        rows.append({
            "orbit_type": orbit_type,
            "orbit_altitude_km": round(orbit_altitude_km, 2),
            "inclination_deg": round(inclination_deg, 2),
            "current_battery_percent": round(current_battery_percent, 2),
            "solar_exposure_hours": round(solar_exposure_hours, 2),
            "eclipse_duration_hours": round(eclipse_duration_hours, 2),
            "payload_count": payload_count,
            "payload_power_kw": round(payload_power_kw, 2),
            "communication_duration_minutes": round(communication_duration_minutes, 2),
            "communication_bandwidth_mbps": round(communication_bandwidth_mbps, 2),
            "onboard_memory_used_gb": round(onboard_memory_used_gb, 2),
            "onboard_memory_total_gb": onboard_memory_total_gb,
            "cpu_utilization_percent": round(cpu_utilization_percent, 2),
            "temperature_celsius": round(temperature_celsius, 2),
            "mission_duration_hours": round(mission_duration_hours, 2),
            "previous_power_consumption_kw": round(previous_power_consumption_kw, 2),
            "previous_battery_percent": round(previous_battery_percent, 2),
            "power_consumption_kw": round(power_consumption_kw, 2),
            "remaining_battery_percent": round(remaining_battery_percent, 2),
            "mission_risk": mission_risk,
            "health_score": round(health_score, 2)
        })
        
    df = pd.DataFrame(rows)
    output_path = os.path.join(base_dir, 'satellite_resources.csv')
    df.to_csv(output_path, index=False)
    print(f"Successfully generated {num_rows} rows of synthetic satellite resource telemetry -> {output_path}")

if __name__ == '__main__':
    generate_synthetic_resources()
