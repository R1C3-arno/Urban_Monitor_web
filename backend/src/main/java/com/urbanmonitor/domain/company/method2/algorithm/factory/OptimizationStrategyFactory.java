package com.urbanmonitor.domain.company.method2.algorithm.factory;

import com.urbanmonitor.domain.company.method2.algorithm.DemandModel;
import com.urbanmonitor.domain.company.method2.algorithm.OptimizationStrategy;
import com.urbanmonitor.domain.company.method2.algorithm.impl.ALGIRStrategy;
import com.urbanmonitor.domain.company.method2.algorithm.impl.SupplyChainStrategy;
import com.urbanmonitor.domain.company.method2.algorithm.impl.HybridStrategy;
import com.urbanmonitor.domain.company.method2.model.Branch;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

/**
 * Factory Pattern
 */
@Slf4j
@Component
public class OptimizationStrategyFactory {

    /**
     * Create ALG-IR strategy
     */
    public OptimizationStrategy createALGIRStrategy(
            double Q, double m, double M,
            double a, double b, double delta) {

        DemandModel demand = new DemandModel(a, b, delta, "uniform");
        log.info("Created ALG-IR strategy: Q={}, m={}, M={}", Q, m, M);
        return new ALGIRStrategy(Q, m, M, demand);
    }

    /**
     * Create Supply Chain strategy
     */
    public OptimizationStrategy createSupplyChainStrategy(
            double demand, double holdingCost,
            double orderingCost, double distance) {

        log.info("Created Supply Chain strategy: demand={}, distance={}", demand, distance);
        return new SupplyChainStrategy(demand, holdingCost, orderingCost, distance);
    }

    /**
     * Create Hybrid strategy (both combined)
     */
    public OptimizationStrategy createHybridStrategy(Branch branch) {
        // Use default parameters
        OptimizationStrategy algIR = createALGIRStrategy(
                1000,           // Q: initial inventory
                30,             // m: min price
                40,             // M: max price
                100,            // a: demand intercept
                1.0,            // b: price elasticity
                0.2             // delta: fluctuation range
        );

        OptimizationStrategy supplyChain = createSupplyChainStrategy(
                branch.getDemand(),
                5.0,            // holding cost
                150.0,          // ordering cost
                branch.getDistance()
        );

        log.info("Created Hybrid strategy for branch: {}", branch.getName());
        return new HybridStrategy(algIR, supplyChain);
    }


    public OptimizationStrategy createStrategy(String strategyName, Branch branch) {
        switch (strategyName.toLowerCase()) {
            case "alg-ir":
                return createALGIRStrategy(1000, 30, 40, 100, 1.0, 0.2);

            case "supply-chain":
                return createSupplyChainStrategy(
                        branch.getDemand(), 5.0, 150.0, branch.getDistance()
                );

            case "hybrid":
            default:
                return createHybridStrategy(branch);
        }
    }
}