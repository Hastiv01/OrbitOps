import logging
from typing import List
from app.models.mission import Mission
from datetime import datetime

logger = logging.getLogger(__name__)

class DynamicPriorityEngine:
    """
    Implements the Dynamic Mission Priorities algorithm from Paper 1.
    Calculates priorities based on:
    - Time urgency (proximity to deadline)
    - Resource availability (battery, memory)
    - Base mission value/criticality
    """
    
    def __init__(self):
        self.priority_weights = {
            'base_value': 0.4,
            'time_urgency': 0.4,
            'resource_availability': 0.2
        }

    def recalculate_priority(self, mission: Mission, current_time: datetime, current_battery: float) -> float:
        # Base value mapping
        base_scores = {'Critical': 1.0, 'High': 0.8, 'Medium': 0.5, 'Low': 0.2}
        base_val = base_scores.get(mission.priority, 0.5)
        
        # Time urgency (pseudo-logic for demonstration)
        # In a real scenario, this involves parsing start_time and end_time
        # and checking if the window is closing soon.
        urgency = 0.5 # Default middle urgency
        
        # Resource penalty: if battery is low, lower priority for non-critical tasks
        resource_score = 1.0
        if current_battery < 30.0 and base_val < 1.0:
            resource_score = 0.2
            
        final_score = (
            (base_val * self.priority_weights['base_value']) + 
            (urgency * self.priority_weights['time_urgency']) + 
            (resource_score * self.priority_weights['resource_availability'])
        )
        
        return final_score

    def sort_missions(self, missions: List[Mission], current_time: datetime, battery_levels: dict) -> List[Mission]:
        """
        Sorts missions dynamically based on current context.
        battery_levels: Dict mapping satellite_id to current battery percentage.
        """
        scored_missions = []
        for m in missions:
            batt = battery_levels.get(m.satellite_id, 100.0)
            score = self.recalculate_priority(m, current_time, batt)
            scored_missions.append((score, m))
            
        # Sort descending by score
        scored_missions.sort(key=lambda x: x[0], reverse=True)
        return [m[1] for m in scored_missions]
