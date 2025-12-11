package com.urbanmonitor.domain.company.method2.algorithm;

import org.apache.commons.math3.distribution.*;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;


/**
 * DemandModel: Price-dependent demand with fluctuations
 *
 * Formula: d_t = (a - b*p_t) * δ_t
 * where:
 *   - a: demand intercept
 *   - b: price elasticity
 *   - δ_t: multiplicative fluctuation factor
 *   - p_t: price at period t
 */
@Slf4j
@Getter
public class DemandModel {

    private final double a;
    private final double b;
    private final double delta;
    private final String distribution;
    private final RealDistribution dist;

    /**
     * Constructor
     *
     * @param a Demand intercept
     * @param b Price elasticity
     * @param delta Fluctuation range [1-Δ, 1+Δ]
     * @param distribution "uniform" or "truncnorm"
     */

    public DemandModel(double a, double b, double delta, String distribution) {
        this.a = a;
        this.b = b;
        this.delta = delta;
        this.distribution = distribution;

        if ("uniform".equals(distribution)) {
            // Uniform on [1-Δ, 1+Δ]
            this.dist = new UniformRealDistribution(1 - delta, 1 + delta);
        } else if ("truncnorm".equals(distribution)) {
            // Truncated Normal: mean=1, sigma=0.15
            // Approximated using Normal
            this.dist = new NormalDistribution(1.0, 0.15);
        } else {
            throw new IllegalArgumentException("Distribution must be 'uniform' or 'truncnorm'");
        }

        log.debug("DemandModel created: a={}, b={}, delta={}, distribution={}",
                a, b, delta, distribution);
    }

    /**
     * Expected demand (deterministic part)
     * E[d_t | p_t] = (a - b*p_t)
     */
    public double expectedDemand(double price) {
        return Math.max(0.0, a - b * price);
    }

    /**
     * Actual demand (sampled with fluctuation)
     * d_t = (a - b*p_t) * δ_t
     */
    public double actualDemand(double price) {
        double base = expectedDemand(price);
        double fluctuation = dist.sample();
        return base * fluctuation;
    }

    /**
     * Inverse CDF: F^{-1}(u) for u ∈ [0,1]
     * Used in optimization: finding critical price points
     */
    public double inverseCDF(double u) {
        if ("uniform".equals(distribution)) {
            // F^{-1}(u) = (1-Δ) + u * 2Δ
            return (1 - delta) + u * 2 * delta;
        } else {
            // For truncated normal (approximated)
            // Use inverse error function
            return 1.0 + 0.15 * SpecialMath.erfcInv(2 * u);
        }
    }

    /**
     * CDF: F(z)
     * Probability that δ_t ≤ z
     */
    public double cdf(double z) {
        if ("uniform".equals(distribution)) {
            double lower = 1 - delta;
            double upper = 1 + delta;
            if (z < lower) return 0.0;
            if (z > upper) return 1.0;
            return (z - lower) / (2 * delta);
        } else {
            // Truncated normal
            return dist.cumulativeProbability(z);
        }
    }

    /**
     * Validate parameters
     */
    public void validate() {
        if (a <= 0) throw new IllegalArgumentException("a must be positive");
        if (b <= 0) throw new IllegalArgumentException("b must be positive");
        if (delta <= 0 || delta > 1) throw new IllegalArgumentException("delta must be in (0, 1]");
    }
}