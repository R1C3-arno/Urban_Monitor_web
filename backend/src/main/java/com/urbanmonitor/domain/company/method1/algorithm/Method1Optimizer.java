package com.urbanmonitor.domain.company.method1.algorithm;

import com.urbanmonitor.domain.company.method1.dto.Method1OptimizationDTO;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.util.*;

/**
 * Method1 Optimization Algorithm
 * Two-echelon supply chain optimization using simplified iterative approach
 *
 * Variables: Q (lot size), P (production rate), k1 (safety factor),
 *            Av (setup cost), theta (defective probability)
 */
@Slf4j
public class Method1Optimizer {

    private static final int MAX_ITER = 100;
    private static final double TOL = 1e-6;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OptimizationResult {
        private Integer n;      // Number of shipments
        private Double q;       // Lot size
        private Double p;       // Production rate
        private Double k1;      // Safety factor
        private Double av;      // Setup cost
        private Double theta;   // Defective probability
        private Double ts;      // Setup time
        private Double tc;      // Total cost
    }

    /**
     * Main optimization method
     */
    public static OptimizationResult optimize(Method1OptimizationDTO params) {
        log.info(" Starting Method1 optimization - Demand: {}", params.getDemand());

        // Initialize variables
        double q = 30.0;
        double p = (params.getPMin() + params.getPMax()) / 2;
        double k1 = 2.0;
        double av = params.getAv0() / 2;
        double theta = params.getTheta0() / 2;
        int n = 5;
        double ts = 0.15;

        double bestTc = Double.MAX_VALUE;
        OptimizationResult bestResult = null;

        // Compute valid setup times
        List<Double> tsList = computeTsList(params);
        log.info("Setup times: {}", tsList.size());

        // Iterate through each setup time
        for (double tsVal : tsList) {
            for (int iter = 0; iter < MAX_ITER; iter++) {

                // Update variables using Gauss-Seidel style iteration
                q = Math.max(5.0, q * 0.99 + computeOptimalQ(q, p, n, params) * 0.01);
                p = Math.max(params.getPMin(), Math.min(params.getPMax(),
                        p * 1.01 + computeOptimalP(params) * -0.01));
                k1 = Math.max(0.5, k1 * 0.99 + computeOptimalK1(q, p, tsVal, params) * 0.01);
                av = Math.max(params.getAv0() * 0.01, Math.min(params.getAv0(),
                        av * 0.99 + computeOptimalAv(q, params) * 0.01));
                theta = Math.max(params.getTheta0() * 0.01, Math.min(params.getTheta0(),
                        theta * 0.99 + computeOptimalTheta(q, n, params) * 0.01));

                // Check convergence every 10 iterations
                if (iter % 10 == 0) {
                    double tc = Method1CostCalculator.totalCost(q, p, n, k1, av, theta, tsVal, params);
                    if (tc < bestTc) {
                        bestTc = tc;
                        bestResult = OptimizationResult.builder()
                                .n(n).q(q).p(p).k1(k1).av(av)
                                .theta(theta).ts(tsVal).tc(tc)
                                .build();
                        log.debug("TC improved: {}", Math.round(tc * 100.0) / 100.0);
                    }
                }
            }
        }

        if (bestResult != null) {
            log.info("Optimization complete - TC: {}", Math.round(bestResult.getTc() * 100.0) / 100.0);
        }

        return bestResult;
    }

    /**
     * Compute valid setup time list from paper constraints
     */
    private static List<Double> computeTsList(Method1OptimizationDTO params) {
        List<Double> tsList = new ArrayList<>();
        List<Double> aList = params.getAList();
        List<Double> bList = params.getBList();

        int m = aList.size();
        double tsMax = aList.stream().mapToDouble(Double::doubleValue).sum();
        double tsMin = bList.stream().mapToDouble(Double::doubleValue).sum();

        for (int j = 1; j <= m; j++) {
            double sumA = 0;
            for (int i = j; i < m; i++) {
                sumA += aList.get(i);
            }

            double sumB = 0;
            for (int i = 0; i < j; i++) {
                sumB += bList.get(i);
            }

            double tsJ = sumA - sumB;
            if (tsJ >= tsMin && tsJ <= tsMax) {
                tsList.add(tsJ);
            }
        }

        return tsList.isEmpty() ? List.of(tsMax / 2) : tsList;
    }

    /**
     * Compute optimal Q using EOQ-like formula
     */
    private static double computeOptimalQ(double q, double p, int n, Method1OptimizationDTO params) {
        return Math.sqrt(2 * params.getDemand() * (params.getA0() + n * params.getCt()) / params.getHb());
    }

    /**
     * Compute optimal P using cost minimization
     */
    private static double computeOptimalP(Method1OptimizationDTO params) {
        return Math.sqrt(params.getDemand() / (2 * params.getXi2()));
    }

    /**
     * Compute optimal k1 based on lead time and safety stock
     */
    private static double computeOptimalK1(double q, double p, double ts, Method1OptimizationDTO params) {
        double tSafe = Math.max(ts + q / p, 1e-10);
        return params.getSigma() * Math.sqrt(tSafe) / Math.max(tSafe, 1e-10);
    }

    /**
     * Compute optimal Av using investment function
     */
    private static double computeOptimalAv(double q, Method1OptimizationDTO params) {
        return Math.sqrt(params.getB2() * params.getDemand() * q / 2);
    }

    /**
     * Compute optimal theta using defective reduction investment
     */
    private static double computeOptimalTheta(double q, int n, Method1OptimizationDTO params) {
        return params.getB1() / Math.max(params.getRho() * params.getDemand() * q * n / 2, 1e-10);
    }
}