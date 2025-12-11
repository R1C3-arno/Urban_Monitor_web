package com.urbanmonitor.domain.company.method2.algorithm.impl;


import com.urbanmonitor.domain.company.method2.algorithm.OptimizationStrategy;
import com.urbanmonitor.domain.company.method2.dto.OptimizationRequestDTO;
import com.urbanmonitor.domain.company.method2.dto.OptimizationResultDTO;
import com.urbanmonitor.domain.company.method2.dto.AlgorithmStepDTO;
import com.urbanmonitor.domain.company.method2.model.Branch;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.util.*;

@Slf4j
public class SupplyChainStrategy implements OptimizationStrategy {

    private final double demand;
    private final double holdingCost;
    private final double orderingCost;
    private final double distance;
    private List<AlgorithmStepDTO> steps = new ArrayList<>();

    public SupplyChainStrategy(double demand, double holdingCost, double orderingCost, double distance) {
        this.demand = demand;
        this.holdingCost = holdingCost;
        this.orderingCost = orderingCost;
        this.distance = distance;
    }

    @Override
    public String getName() {
        return "SupplyChain";
    }

    @Override
    public List<AlgorithmStepDTO> getSteps() {
        return steps;
    }

    /**
     * Binary search for optimal n
     */
    private int binarySearchOptimalN(int left, int right) {
        double minCost = Double.MAX_VALUE;
        int optimalN = 1;

        while (left <= right) {
            int mid = (left + right) / 2;
            double costAtMid = calculateTotalCost(mid);

            if (costAtMid < minCost) {
                minCost = costAtMid;
                optimalN = mid;
            }

            if (calculateTotalCost(mid + 1) < costAtMid) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return optimalN;
    }

    private double calculateTotalCost(int n) {
        double Q = demand / n;
        return (demand / Q) * orderingCost + (Q / 2) * holdingCost + n * 50;
    }

    @Override
    public OptimizationResultDTO optimize(Branch branch, OptimizationRequestDTO request) {
        long startTime = System.currentTimeMillis();

        int optimalN = binarySearchOptimalN(1, 20);
        double optimalQ = demand / optimalN;

        double setupTime = 1.0;
        double transportTime = distance / 50.0;
        double processingTime = optimalQ / 100.0;
        double leadTime = setupTime + transportTime + processingTime;

        double transportCost = optimalN * 50.0;
        double totalCost = calculateTotalCost(optimalN);
        double baselineCost = demand * 300.0 / 100.0;
        double costSavings = Math.max(0, baselineCost - totalCost);

        long computationTime = System.currentTimeMillis() - startTime;

        return OptimizationResultDTO.builder()
                .optimalQ(optimalQ)
                .reorderPoint(optimalQ * 0.5)
                .safetyStock(optimalQ * 0.3)
                .forecastedLeadTime(leadTime)
                .transportCost(transportCost)
                .costSavings(costSavings)
                .optimalShipments(optimalN)
                .setupTimeReduction(optimalN * 0.25)
                .recommendedDates(generateShippingSchedule(optimalN))
                .computationTimeMs(computationTime)
                .status("FEASIBLE")
                .strategy("supply-chain")
                .build();
    }

    private List<String> generateShippingSchedule(int n) {
        List<String> dates = new ArrayList<>();
        for (int i = 1; i <= n; i++) {
            int day = 1 + (i - 1) * (28 / n);
            dates.add("2024-01-" + day);
        }
        return dates;
    }
}

