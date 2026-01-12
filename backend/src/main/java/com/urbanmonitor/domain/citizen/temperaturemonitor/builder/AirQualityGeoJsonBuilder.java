package com.urbanmonitor.domain.citizen.temperaturemonitor.builder;

import com.urbanmonitor.domain.citizen.temperaturemonitor.dto.AirQualityResponse;
import com.urbanmonitor.domain.citizen.temperaturemonitor.entity.AirQualityZone;

import java.util.List;


public interface AirQualityGeoJsonBuilder {

     //Build GeoJSON data by merging backend data with raw GeoJSON

    AirQualityResponse.GeoJsonData build(List<AirQualityZone> backendData);
}
