import random
import logging
from datetime import datetime, timedelta
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.base import Base
from app.database.session import engine, AsyncSessionLocal

# Import models
from app.models.infrastructure import Satellite, Payload, GroundStation
from app.models.mission import Mission

logger = logging.getLogger("uvicorn")

async def init_db():
    try:
        # 1. Create tables
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        # 2. Seed data if empty
        async with AsyncSessionLocal() as session:
            # Check if already seeded
            result = await session.execute(select(func.count(Satellite.id)))
            count = result.scalar()
            if count > 0:
                logger.info("Database already seeded.")
                return

            logger.info("Database is empty. Starting seeding...")

            # Seed Payloads
            payload_data = [
                {"id": "PAY-001", "name": "High Resolution Camera", "type": "Camera", "status": "Active", "power_consumption": 85.0, "memory_usage": 450.0, "temperature": 52.0, "data_rate": 125.0, "last_data_transfer": datetime.now().isoformat()},
                {"id": "PAY-002", "name": "Radar Sensor", "type": "Radar", "status": "Standby", "power_consumption": 120.0, "memory_usage": 320.0, "temperature": 48.0, "data_rate": 90.0, "last_data_transfer": datetime.now().isoformat()},
                {"id": "PAY-003", "name": "Thermal Imaging", "type": "Thermal Sensor", "status": "Active", "power_consumption": 95.0, "memory_usage": 280.0, "temperature": 55.0, "data_rate": 110.0, "last_data_transfer": datetime.now().isoformat()},
                {"id": "PAY-004", "name": "Spectrometer", "type": "Spectrometer", "status": "Active", "power_consumption": 75.0, "memory_usage": 560.0, "temperature": 50.0, "data_rate": 85.0, "last_data_transfer": datetime.now().isoformat()},
                {"id": "PAY-005", "name": "Communication Relay", "type": "Communication", "status": "Active", "power_consumption": 110.0, "memory_usage": 200.0, "temperature": 45.0, "data_rate": 200.0, "last_data_transfer": datetime.now().isoformat()},
                {"id": "PAY-006", "name": "Ultra HD Camera", "type": "Camera", "status": "Active", "power_consumption": 100.0, "memory_usage": 650.0, "temperature": 58.0, "data_rate": 180.0, "last_data_transfer": datetime.now().isoformat()},
                {"id": "PAY-007", "name": "Advanced Radar", "type": "Radar", "status": "Standby", "power_consumption": 130.0, "memory_usage": 380.0, "temperature": 50.0, "data_rate": 100.0, "last_data_transfer": datetime.now().isoformat()},
                {"id": "PAY-008", "name": "IR Thermal", "type": "Thermal Sensor", "status": "Active", "power_consumption": 88.0, "memory_usage": 310.0, "temperature": 52.0, "data_rate": 95.0, "last_data_transfer": datetime.now().isoformat()},
                {"id": "PAY-009", "name": "Data Logger", "type": "Spectrometer", "status": "Active", "power_consumption": 65.0, "memory_usage": 480.0, "temperature": 46.0, "data_rate": 75.0, "last_data_transfer": datetime.now().isoformat()},
                {"id": "PAY-010", "name": "Link Amplifier", "type": "Communication", "status": "Active", "power_consumption": 105.0, "memory_usage": 180.0, "temperature": 44.0, "data_rate": 220.0, "last_data_transfer": datetime.now().isoformat()},
                {"id": "PAY-011", "name": "Satellite Phone", "type": "Communication", "status": "Standby", "power_consumption": 45.0, "memory_usage": 100.0, "temperature": 40.0, "data_rate": 30.0, "last_data_transfer": datetime.now().isoformat()},
                {"id": "PAY-012", "name": "Wide Angle Camera", "type": "Camera", "status": "Active", "power_consumption": 92.0, "memory_usage": 520.0, "temperature": 54.0, "data_rate": 140.0, "last_data_transfer": datetime.now().isoformat()},
                {"id": "PAY-013", "name": "Atmospheric Sensor", "type": "Spectrometer", "status": "Active", "power_consumption": 72.0, "memory_usage": 410.0, "temperature": 48.0, "data_rate": 68.0, "last_data_transfer": datetime.now().isoformat()},
                {"id": "PAY-014", "name": "Broadcast Transmitter", "type": "Communication", "status": "Active", "power_consumption": 115.0, "memory_usage": 220.0, "temperature": 46.0, "data_rate": 250.0, "last_data_transfer": datetime.now().isoformat()}
            ]
            
            payloads = []
            for p in payload_data:
                payload = Payload(**p)
                session.add(payload)
                payloads.append(payload)
            
            # Seed Ground Stations
            gs_data = [
                {"id": "GS-001", "name": "Kennedy Space Center", "country": "United States", "latitude": 28.6296, "longitude": -80.6039, "status": "Operational", "connected_satellites": 5, "availability": 98.0, "weather": "Clear", "antennas": 8, "frequency": "2.2 GHz"},
                {"id": "GS-002", "name": "European Space Agency", "country": "France", "latitude": 48.8566, "longitude": 2.3522, "status": "Operational", "connected_satellites": 6, "availability": 97.0, "weather": "Cloudy", "antennas": 6, "frequency": "2.3 GHz"},
                {"id": "GS-003", "name": "Baikonur Cosmodrome", "country": "Kazakhstan", "latitude": 45.9651, "longitude": 63.3050, "status": "Operational", "connected_satellites": 5, "availability": 95.0, "weather": "Clear", "antennas": 7, "frequency": "2.1 GHz"},
                {"id": "GS-004", "name": "Indian Space Research Centre", "country": "India", "latitude": 13.0827, "longitude": 80.2707, "status": "Operational", "connected_satellites": 4, "availability": 92.0, "weather": "Rainy", "antennas": 5, "frequency": "2.2 GHz"},
                {"id": "GS-005", "name": "Guam Ground Station", "country": "United States", "latitude": 13.4443, "longitude": 144.7937, "status": "Operational", "connected_satellites": 4, "availability": 99.0, "weather": "Stormy", "antennas": 4, "frequency": "2.25 GHz"},
                {"id": "GS-006", "name": "Canberra DSN", "country": "Australia", "latitude": -35.4032, "longitude": 149.0644, "status": "Operational", "connected_satellites": 4, "availability": 96.0, "weather": "Clear", "antennas": 6, "frequency": "2.3 GHz"},
                {"id": "GS-007", "name": "Svalbard SvalSat", "country": "Norway", "latitude": 78.2232, "longitude": 15.4078, "status": "Operational", "connected_satellites": 7, "availability": 99.0, "weather": "Clear", "antennas": 10, "frequency": "2.1 GHz"},
                {"id": "GS-008", "name": "Hartebeesthoek", "country": "South Africa", "latitude": -25.2542, "longitude": 28.0889, "status": "Operational", "connected_satellites": 3, "availability": 93.0, "weather": "Cloudy", "antennas": 4, "frequency": "2.2 GHz"},
                {"id": "GS-009", "name": "McMurdo Station", "country": "Antarctica", "latitude": -77.8419, "longitude": 166.6863, "status": "Operational", "connected_satellites": 6, "availability": 88.0, "weather": "Clear", "antennas": 3, "frequency": "2.0 GHz"},
                {"id": "GS-010", "name": "Tanegashima", "country": "Japan", "latitude": 30.3989, "longitude": 130.9708, "status": "Operational", "connected_satellites": 4, "availability": 97.0, "weather": "Clear", "antennas": 5, "frequency": "2.25 GHz"},
                {"id": "GS-011", "name": "Weilheim", "country": "Germany", "latitude": 47.8403, "longitude": 11.1428, "status": "Operational", "connected_satellites": 3, "availability": 96.0, "weather": "Cloudy", "antennas": 5, "frequency": "2.3 GHz"},
                {"id": "GS-012", "name": "Santiago", "country": "Chile", "latitude": -33.4489, "longitude": -70.6693, "status": "Operational", "connected_satellites": 2, "availability": 90.0, "weather": "Clear", "antennas": 4, "frequency": "2.15 GHz"},
                {"id": "GS-013", "name": "Maspalomas", "country": "Spain", "latitude": 27.9575, "longitude": -15.5895, "status": "Operational", "connected_satellites": 3, "availability": 94.0, "weather": "Clear", "antennas": 5, "frequency": "2.2 GHz"},
                {"id": "GS-014", "name": "Dongara", "country": "Australia", "latitude": -29.2511, "longitude": 114.9311, "status": "Operational", "connected_satellites": 2, "availability": 91.0, "weather": "Clear", "antennas": 3, "frequency": "2.1 GHz"},
                {"id": "GS-015", "name": "Kourou", "country": "French Guiana", "latitude": 5.2394, "longitude": -52.7683, "status": "Operational", "connected_satellites": 4, "availability": 95.0, "weather": "Rainy", "antennas": 6, "frequency": "2.3 GHz"}
            ]
            for g in gs_data:
                session.add(GroundStation(**g))
                
            # Seed Satellites
            sat_data = [
                {"id": "SAT-001", "name": "SatelliteOne", "status": "Active", "orbit": "LEO", "altitude": 400.0, "inclination": 51.6, "battery_health": 95.0, "temperature": 42.0, "last_update": datetime.now().isoformat(), "ground_station_ids": "GS-001,GS-002,GS-003"},
                {"id": "SAT-002", "name": "SatelliteTwo", "status": "Active", "orbit": "LEO", "altitude": 450.0, "inclination": 45.0, "battery_health": 88.0, "temperature": 38.0, "last_update": datetime.now().isoformat(), "ground_station_ids": "GS-002,GS-003"},
                {"id": "SAT-003", "name": "SatelliteThree", "status": "Active", "orbit": "MEO", "altitude": 8000.0, "inclination": 55.0, "battery_health": 92.0, "temperature": 35.0, "last_update": datetime.now().isoformat(), "ground_station_ids": "GS-001,GS-004"},
                {"id": "SAT-004", "name": "SatelliteFour", "status": "Maintenance", "orbit": "GEO", "altitude": 35786.0, "inclination": 0.1, "battery_health": 45.0, "temperature": 32.0, "last_update": datetime.now().isoformat(), "ground_station_ids": "GS-001,GS-002"},
                {"id": "SAT-005", "name": "SatelliteFive", "status": "Active", "orbit": "LEO", "altitude": 380.0, "inclination": 51.6, "battery_health": 97.0, "temperature": 40.0, "last_update": datetime.now().isoformat(), "ground_station_ids": "GS-003,GS-004,GS-005"},
                {"id": "SAT-006", "name": "SatelliteSix", "status": "Active", "orbit": "LEO", "altitude": 420.0, "inclination": 48.0, "battery_health": 85.0, "temperature": 44.0, "last_update": datetime.now().isoformat(), "ground_station_ids": "GS-002,GS-004"},
                {"id": "SAT-007", "name": "SatelliteSeven", "status": "Active", "orbit": "MEO", "altitude": 12000.0, "inclination": 56.0, "battery_health": 90.0, "temperature": 36.0, "last_update": datetime.now().isoformat(), "ground_station_ids": "GS-005"},
                {"id": "SAT-008", "name": "SatelliteEight", "status": "Inactive", "orbit": "LEO", "altitude": 410.0, "inclination": 52.0, "battery_health": 15.0, "temperature": 28.0, "last_update": datetime.now().isoformat(), "ground_station_ids": ""},
                {"id": "SAT-009", "name": "SatelliteNine", "status": "Active", "orbit": "GEO", "altitude": 35786.0, "inclination": 0.05, "battery_health": 96.0, "temperature": 31.0, "last_update": datetime.now().isoformat(), "ground_station_ids": "GS-001,GS-003,GS-005"},
                {"id": "SAT-010", "name": "SatelliteTen", "status": "Active", "orbit": "LEO", "altitude": 430.0, "inclination": 50.0, "battery_health": 93.0, "temperature": 41.0, "last_update": datetime.now().isoformat(), "ground_station_ids": "GS-002,GS-004"}
            ]
            
            # Add auto-generated satellites 11 to 20
            sat_names_map = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty']
            orbits_pool = ['LEO', 'MEO', 'GEO']
            for i in range(10):
                num = i + 11
                orbit = orbits_pool[i % 3]
                altitudes = {"LEO": 380.0 + i * 15.0, "MEO": 7500.0 + i * 200.0, "GEO": 35786.0}
                sat_dict = {
                    "id": f"SAT-{str(num).zfill(3)}",
                    "name": f"Satellite{sat_names_map[i]}",
                    "status": "Maintenance" if (i % 7 == 0) else "Active",
                    "orbit": orbit,
                    "altitude": altitudes[orbit],
                    "inclination": 45.0 + i * 2.0,
                    "battery_health": float(55 + random.randint(0, 39)),
                    "temperature": float(35 + random.randint(0, 14)),
                    "last_update": datetime.now().isoformat(),
                    "ground_station_ids": f"GS-{str((i % 15) + 1).zfill(3)},GS-{str(((i + 3) % 15) + 1).zfill(3)}"
                }
                sat_data.append(sat_dict)

            satellites = []
            for s in sat_data:
                sat = Satellite(**s)
                session.add(sat)
                satellites.append(sat)
                
            await session.commit() # Save so we can link payloads
            
            # Link payloads to satellites
            sat_payload_links = {
                "SAT-001": ["PAY-001", "PAY-002"],
                "SAT-002": ["PAY-003", "PAY-004"],
                "SAT-003": ["PAY-005"],
                "SAT-005": ["PAY-006", "PAY-007", "PAY-008"],
                "SAT-006": ["PAY-009"],
                "SAT-007": ["PAY-010", "PAY-011"],
                "SAT-009": ["PAY-012"],
                "SAT-010": ["PAY-013", "PAY-014"],
            }
            for i in range(10):
                num = i + 11
                sat_payload_links[f"SAT-{str(num).zfill(3)}"] = [f"PAY-{str((i % 14) + 1).zfill(3)}"]
                
            for sat_id, payload_ids in sat_payload_links.items():
                for p_id in payload_ids:
                    res = await session.execute(select(Payload).where(Payload.id == p_id))
                    payload = res.scalar()
                    if payload:
                        payload.satellite_id = sat_id
            
            # Seed 100 Missions
            types = ['Earth Observation', 'Communication', 'Navigation', 'Scientific']
            priorities = ['Low', 'Medium', 'High', 'Critical']
            statuses = ['Planning', 'Scheduled', 'Active', 'Completed', 'Failed', 'Paused']
            objectives = [
                'Land surface imaging and analysis',
                'Global telecommunications relay',
                'Climate monitoring and research',
                'Military surveillance and reconnaissance',
                'Weather forecasting and prediction',
                'Environmental disaster assessment',
                'GPS data collection and refinement',
                'Asteroid observation and tracking',
                'Aurora research and documentation',
                'Arctic ice sheet monitoring'
            ]
            
            for i in range(1, 101):
                start_time = datetime.now() + timedelta(days=random.uniform(0, 30))
                duration = 60 + random.randint(0, 479)
                end_time = start_time + timedelta(minutes=duration)
                
                selected_sat = random.choice(satellites)
                
                # Select random payloads
                associated_payloads = [random.choice(payload_data)["name"], random.choice(payload_data)["name"]]
                
                mission_dict = {
                    "id": f"MIS-{str(i).zfill(3)}",
                    "mission_id": f"ID-{str(i).zfill(5)}",
                    "name": f"Mission Alpha {i}",
                    "priority": random.choice(priorities),
                    "type": random.choice(types),
                    "satellite_id": selected_sat.id,
                    "orbit": random.choice(['LEO', 'MEO', 'GEO']),
                    "payload_ids": ",".join(associated_payloads),
                    "start_time": start_time.isoformat(),
                    "end_time": end_time.isoformat(),
                    "estimated_duration": duration,
                    "objective": random.choice(objectives),
                    "status": random.choice(statuses),
                    "notes": f"Mission notes and objectives for alpha mission {i}",
                    "completion_percentage": random.randint(0, 99),
                    "created_at": (datetime.now() - timedelta(days=random.uniform(0, 60))).isoformat(),
                    "updated_at": datetime.now().isoformat()
                }
                session.add(Mission(**mission_dict))
                
            await session.commit()
            logger.info("Database seeding successfully completed.")
    except Exception as e:
        logger.error("\n" + "="*80)
        logger.error("WARNING: Could not connect to PostgreSQL database or run initialization.")
        logger.error(f"Error details: {e}")
        logger.error("Please configure your Supabase/PostgreSQL connection string (DATABASE_URL) in .env")
        logger.error("="*80 + "\n")
