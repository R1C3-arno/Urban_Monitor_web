package com.urbanmonitor.domain.company.method1.algorithm;

import com.urbanmonitor.domain.company.method1.dto.Method1OptimizationDTO;
import lombok.extern.slf4j.Slf4j;

/**
 * Cost Calculation Engine
 * Implements paper formulas for vendor, buyer, and total cost
 */
@Slf4j
public class Method1CostCalculator {

    /**
     * Calculate vendor cost
     * TCv = T1 + T2 + T3 + T4 + T5 + T6
     */
    public static double vendorCost(double q, double p, int n,
                                    double av, double theta,
                                    Method1OptimizationDTO params) {
        double cp = params.getXi1() * p + params.getXi2() / p;

        double t1 = av * params.getDemand() / (n * q);
        double t2 = params.getHv() * q / 2 * (n * (1 - params.getDemand() / p) - 1 + 2 * params.getDemand() / p);
        double t3 = params.getDemand() * cp;
        double t4 = params.getB1() * Math.log(Math.max(theta, 1e-10) / params.getTheta0());
        double t5 = params.getB2() * Math.log(params.getAv0() / Math.max(av, 1e-10));
        double t6 = params.getRho() * params.getDemand() * theta * n * q / 2;

        return t1 + t2 + t3 + t4 + t5 + t6;
    }

    /**
     * Calculate buyer cost
     * TCb = T1 + T2 + T3 + T4 + T5
     */
    public static double buyerCost(double q, double p, int n, double k1, double ts,
                                   Method1OptimizationDTO params) {

        double tSafe = Math.max(ts + q / p, 1e-10);

        // T1: Ordering cost
        double t1 = (params.getA0() + n * params.getCt()) * params.getDemand() / (n * q);

        // T2: Holding cost with safety stock
        double t2 = params.getHb() * (q / 2 + k1 * params.getSigma() * Math.sqrt(tSafe));

        // E(x1 - R1)+ : Expected backorder for first batch
        double ex1 = (params.getSigma() / 2) * Math.sqrt(tSafe) *
                (Math.sqrt(1 + k1 * k1) - k1);

        // E(x2 - R2)+ : Expected backorder for subsequent batches
        double ex2 = (params.getSigma() / 2) * Math.sqrt(params.getTt()) *
                (Math.sqrt(1 + k1 * k1 * tSafe / params.getTt()) -
                        k1 * Math.sqrt(tSafe / params.getTt()));

        // T3: Backorder cost for first batch
        double t3 = params.getDemand() * params.getPi() / (n * q) * ex1;

        // T4: Backorder cost for subsequent batches
        double t4 = params.getDemand() * params.getPi() * (n - 1) / (n * q) * ex2;

        // T5: Crashing cost (simplified to 0 for now)
        double t5 = 0.0;

        return t1 + t2 + t3 + t4 + t5;
    }

    /**
     * Calculate total cost
     * TC = TCv + TCb
     */
    public static double totalCost(double q, double p, int n, double k1,
                                   double av, double theta, double ts,
                                   Method1OptimizationDTO params) {
        double vendorCost = vendorCost(q, p, n, av, theta, params);
        double buyerCost = buyerCost(q, p, n, k1, ts, params);
        return vendorCost + buyerCost;
    }
}