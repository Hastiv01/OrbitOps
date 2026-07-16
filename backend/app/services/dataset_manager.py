import os
import pandas as pd
from typing import Dict, Any, List

class DatasetManager:
    """
    Manages synchronization between the database and the raw CSV datasets.
    """
    def __init__(self):
        self.base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../datasets/raw"))
        os.makedirs(self.base_dir, exist_ok=True)
        
    def _get_path(self, dataset_name: str) -> str:
        return os.path.join(self.base_dir, f"{dataset_name}.csv")
        
    def _read_dataset(self, dataset_name: str) -> pd.DataFrame:
        path = self._get_path(dataset_name)
        if not os.path.exists(path):
            return pd.DataFrame()
        return pd.read_csv(path)
        
    def _write_dataset(self, dataset_name: str, df: pd.DataFrame):
        path = self._get_path(dataset_name)
        df.to_csv(path, index=False)
        
    def append_record(self, dataset_name: str, record: Dict[str, Any]):
        """Append a single record to the dataset"""
        df = self._read_dataset(dataset_name)
        new_row = pd.DataFrame([record])
        if df.empty:
            df = new_row
        else:
            df = pd.concat([df, new_row], ignore_index=True)
        self._write_dataset(dataset_name, df)
        
    def update_record(self, dataset_name: str, key_column: str, key_value: Any, updates: Dict[str, Any]):
        """Update a record in the dataset matching the key"""
        df = self._read_dataset(dataset_name)
        if df.empty or key_column not in df.columns:
            return
            
        mask = df[key_column] == key_value
        if not mask.any():
            return
            
        for k, v in updates.items():
            if k in df.columns:
                df.loc[mask, k] = v
                
        self._write_dataset(dataset_name, df)
        
    def delete_record(self, dataset_name: str, key_column: str, key_value: Any):
        """Delete a record from the dataset"""
        df = self._read_dataset(dataset_name)
        if df.empty or key_column not in df.columns:
            return
            
        df = df[df[key_column] != key_value]
        self._write_dataset(dataset_name, df)
        
    # Helpers for specific entities
    
    def sync_mission(self, mission_dict: Dict[str, Any], action: str = "create"):
        # map db fields to csv fields
        record = {
            'mission_id': mission_dict.get('id', ''),
            'satellite_id': mission_dict.get('satellite_id', ''),
            'type': mission_dict.get('type', ''),
            'priority': mission_dict.get('priority', ''),
            'start_time': mission_dict.get('start_time', ''),
            'end_time': mission_dict.get('end_time', ''),
            'status': mission_dict.get('status', ''),
            'duration_hours': mission_dict.get('estimated_duration', 0) / 60.0
        }
        
        if action == "create":
            self.append_record('historical_missions', record)
        elif action == "update":
            self.update_record('historical_missions', 'mission_id', record['mission_id'], record)
        elif action == "delete":
            self.delete_record('historical_missions', 'mission_id', record['mission_id'])

    def sync_telemetry(self, telemetry_dict: Dict[str, Any]):
        # Telemetry is append only
        record = {
            'timestamp': telemetry_dict.get('timestamp', ''),
            'satellite_id': telemetry_dict.get('satellite_id', ''),
            'battery_level_pct': telemetry_dict.get('battery_level', 100),
            'temperature_c': telemetry_dict.get('temperature', 20),
            'signal_strength_dbm': telemetry_dict.get('signal_strength', -70),
            'power_consumption_w': telemetry_dict.get('power_consumption', 150)
        }
        self.append_record('telemetry', record)
        
dataset_manager = DatasetManager()
