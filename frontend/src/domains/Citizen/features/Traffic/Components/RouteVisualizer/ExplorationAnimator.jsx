// ExplorationAnimator.jsx
const animateExplorationSteps = (steps) => {
    let currentStep = 0;

    const interval = setInterval(() => {
        if (currentStep >= steps.length) {
            clearInterval(interval);
            drawFinalPath(); // Move to Phase 3
            return;
        }

        const step = steps[currentStep];

        switch (step.action) {
            case 'START':
                highlightNode(step.node, '#EF4444', 14); // Red, large
                break;

            case 'VISIT':
                // Mark as explored (Dijkstra = blue, A* = green)
                highlightNode(step.node, algorithm === 'Dijkstra' ? '#3B82F6' : '#10B981', 8);
                break;

            case 'PROCESS':
                // Show current processing node with pulse
                pulseNode(step.node, '#FBBF24', 12);
                break;

            case 'SKIP':
                // Gray out skipped nodes (A* efficiency)
                highlightNode(step.node, '#6B7280', 6);
                break;
        }

        // Show step info
        showStepInfo(step);

        currentStep++;
    }, 80); // 80ms = smooth 12.5 FPS
};

// ✅ User sees algorithm "thinking"
// ✅ Dijkstra explores more nodes (blue cloud)
// ✅ A* is more focused (green arrow)