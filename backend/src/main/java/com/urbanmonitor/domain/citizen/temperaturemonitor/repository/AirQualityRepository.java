package com.urbanmonitor.domain.citizen.temperaturemonitor.repository;

import com.urbanmonitor.domain.citizen.temperaturemonitor.entity.AirQualityZone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AirQualityRepository
        extends JpaRepository<AirQualityZone, Long> {
}