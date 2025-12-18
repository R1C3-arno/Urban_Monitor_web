package com.urbanmonitor.domain.citizen.emergency.repository;

import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyLocationRepository extends 
        JpaRepository<EmergencyLocation, Long>,
        JpaSpecificationExecutor<EmergencyLocation> {

    List<EmergencyLocation> findByEmergencyType(EmergencyType type);
    List<EmergencyLocation> findByStatus(EmergencyStatus status);
    List<EmergencyLocation> findByEmergencyTypeAndStatus(EmergencyType type, EmergencyStatus status);
}
