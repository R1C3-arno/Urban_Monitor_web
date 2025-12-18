package com.urbanmonitor.domain.citizen.incidentdetection.observer;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * OBSERVER PATTERN - Concrete Observer
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class LoggingIncidentObserver implements IncidentObserver {

    private final IncidentEventPublisher publisher;

    @PostConstruct
    public void init() {
        publisher.subscribe(this);
    }

    @Override
    public void onIncidentEvent(IncidentEvent event) {
        switch (event.getType()) {
            case CREATED -> log.info("Incident created: {} - {}",
                event.getIncident().getId(), event.getIncident().getTitle());
            case UPDATED -> log.info("Incident updated: {}",
                event.getIncident().getId());
            case VALIDATED -> log.info("Incident validated: {}",
                event.getIncident().getId());
            case REJECTED -> log.info("Incident rejected: {}",
                event.getIncident().getId());
            case DELETED -> log.info("Incident deleted: {}",
                event.getIncident().getId());
        }
    }
}
