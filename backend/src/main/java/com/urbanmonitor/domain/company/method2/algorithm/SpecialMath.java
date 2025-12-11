package com.urbanmonitor.domain.company.method2.algorithm;

public final class SpecialMath {

    private SpecialMath() {}

    /**
     * Approximation of inverse complementary error function.
     * Valid for 0 < x < 2
     */
    public static double erfcInv(double x) {
        if (x <= 0.0) return Double.POSITIVE_INFINITY;
        if (x >= 2.0) return Double.NEGATIVE_INFINITY;

        double pp = (x < 1.0) ? x : 2.0 - x;
        double t = Math.sqrt(-2.0 * Math.log(pp / 2.0));

        // Abramowitz and Stegun approximation
        double result = -0.70711 *
                ((2.30753 + t * 0.27061) /
                        (1.0 + t * (0.99229 + t * 0.04481)) - t);

        return (x < 1.0) ? result : -result;
    }
}
