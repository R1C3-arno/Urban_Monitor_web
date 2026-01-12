package com.urbanmonitor.domain.company.method2.algorithm.dsa;

import lombok.extern.slf4j.Slf4j;

/**
 * Brent's Method: Root Finding Algorithm
 * Complexity: O(log n) with superlinear convergence
 *
 * Used in ALG-IR Stage 2 to solve:
 * marginalRevenue(x) = marginalCost(y + x)
 */
@Slf4j
public class BrentRootFinder {

    private static final double EPS = 1e-9;
    private static final int MAX_ITER = 100;

    @FunctionalInterface
    public interface Function {
        double evaluate(double x);
    }

    /**
     * Solve: f(x) = 0 in interval [a, b]
     *
     * @param f Function to solve
     * @param a Left boundary
     * @param b Right boundary
     * @return Root value
     * @throws IllegalArgumentException if root not bracketed
     */
    public static double solve(Function f, double a, double b) {
        log.debug("Brent solver: interval=[{}, {}]", a, b);

        double fa = f.evaluate(a);
        double fb = f.evaluate(b);

        // Check if root is bracketed
        if (fa * fb > 0) {
            throw new IllegalArgumentException(
                    String.format("Root not bracketed: f(%.6f)=%.6f, f(%.6f)=%.6f",
                            a, fa, b, fb)
            );
        }

        // Ensure |fa| < |fb|
        if (Math.abs(fa) < Math.abs(fb)) {
            // Swap a, b, fa, fb
            double temp = a; a = b; b = temp;
            temp = fa; fa = fb; fb = temp;
        }

        double c = a;
        double fc = fa;
        double d = 0;
        double e = 0;

        for (int iter = 0; iter < MAX_ITER; iter++) {
            // Check convergence
            if (Math.abs(fc) < EPS) {
                log.debug("Converged at iteration {}: root ≈ {}", iter, c);
                return c;
            }

            if (Math.abs(b - a) < EPS) {
                log.debug("Converged at iteration {}: interval collapsed", iter);
                return (a + b) / 2;
            }

            // inverse quadratic interpolation or bisection
            double s = chooseStep(a, b, c, fa, fb, fc, e, d);

            double fs = f.evaluate(s);
            d = e;
            e = s - a;

            // Update interval
            if (fa * fs < 0) {
                c = a; fc = fa;
                b = s; fb = fs;
            } else {
                a = s; fa = fs;
            }

            // Ensure |fa| < |fc|
            if (Math.abs(fa) < Math.abs(fc)) {
                double temp = a; a = c; c = temp;
                temp = fa; fa = fc; fc = temp;
            }
        }

        log.warn("Brent solver: max iterations reached");
        return (Math.abs(fc) < Math.abs(fb)) ? c : b;
    }

    /**
     * Choose step using inverse quadratic interpolation or bisection
     */
    private static double chooseStep(
            double a, double b, double c,
            double fa, double fb, double fc,
            double e, double d) {

        // Try inverse quadratic interpolation if safe
        if (Math.abs(e) >= EPS && Math.abs(fa) > Math.abs(fb)) {
            double q = fa / fc;
            double r = fb / fc;
            double p = (b - a) * q * (q - r) - (b - c) * (r - 1);
            double denom = (q - 1) * (r - 1) * (q - 1);

            if (Math.abs(denom) > EPS) {
                double s_cand = p / denom;

                if (Math.abs(s_cand) < Math.abs((b - a) / 2)) {
                    return a + s_cand;
                }
            }
        }

        // Fall back to bisection
        return (a + b) / 2;
    }
}