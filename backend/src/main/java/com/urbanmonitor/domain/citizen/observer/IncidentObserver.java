// IncidentObserver.java
package com.urbanmonitor.domain.citizen.observer;

import com.urbanmonitor.domain.citizen.entity.TrafficIncident;

/**
 * OBSERVER PATTERN
 * SOLID: ISP - Simple, focused interface
 */
public interface IncidentObserver {
    void onIncidentCreated(TrafficIncident incident);
    void onIncidentResolved(TrafficIncident incident);
    String getObserverName();
}