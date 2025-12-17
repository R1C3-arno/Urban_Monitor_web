import { metricColors } from '../constants/utilityConfig';

export const getColorExpression = (selectedMetric) => {
    if (selectedMetric === 'water') {
        return [
            'step',
            ['get', 'point_count'],
            metricColors.water.low,
            10, metricColors.water.medium,
            30, metricColors.water.high
        ];
    } else if (selectedMetric === 'electricity') {
        return [
            'step',
            ['get', 'point_count'],
            metricColors.electricity.low,
            10, metricColors.electricity.medium,
            30, metricColors.electricity.high
        ];
    } else {
        return [
            'step',
            ['get', 'point_count'],
            metricColors.wifi.excellent,
            5, metricColors.wifi.good,
            10, metricColors.wifi.fair,
            20, metricColors.wifi.poor,
            40, metricColors.wifi.bad
        ];
    }
};
