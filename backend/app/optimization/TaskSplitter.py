import logging
from typing import List, Dict

logger = logging.getLogger(__name__)

class TaskSplittingEngine:
    """
    Implements Task Splitting considering Constrained Space-Ground TT&C Resources (Paper 2).
    Breaks down long communication tasks into smaller segments that fit into available
    communication windows across multiple ground stations.
    """
    
    def split_task(self, task: Dict, windows: List[Dict]) -> List[Dict]:
        """
        Splits a single large TT&C task into smaller segments.
        task: dict with 'id', 'data_volume', 'priority'
        windows: list of available communication windows for the target satellite
        """
        logger.info(f"Splitting task {task['id']} with volume {task['data_volume']} GB")
        
        segments = []
        remaining_volume = task['data_volume']
        
        for w in windows:
            if remaining_volume <= 0:
                break
                
            # Assume window can handle dataCapacity GB
            capacity = w.get('dataCapacity', 10)
            
            transferred = min(capacity, remaining_volume)
            segments.append({
                "task_id": task['id'],
                "window_id": w['id'],
                "ground_station": w['groundStation'],
                "volume_transferred": transferred,
                "start_time": w['startTime'],
                "end_time": w['endTime']
            })
            
            remaining_volume -= transferred
            
        if remaining_volume > 0:
            logger.warning(f"Task {task['id']} could not be completely scheduled. Missing {remaining_volume} GB.")
            
        return segments
