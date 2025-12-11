package com.urbanmonitor.domain.citizen.routing;

import com.urbanmonitor.domain.citizen.dto.RouteResponse;

import java.util.ArrayList;
import java.util.List;

/**
 * Path Geometry Utility
 * Generates smooth curved paths using Cubic Bezier interpolation
 */
public class PathGeometry {

    /**
     * ✅ Generate smooth path geometry from NodeDetail list (DTO SAFE)
     */
    public static List<double[]> generatePathGeometry(
            List<RouteResponse.NodeDetail> nodes
    ) {
        List<double[]> geometry = new ArrayList<>();

        if (nodes == null || nodes.isEmpty()) {
            return geometry;
        }

        if (nodes.size() == 1) {
            RouteResponse.NodeDetail node = nodes.get(0);
            geometry.add(new double[]{node.getLng(), node.getLat()});
            return geometry;
        }

        // Interpolate between each pair of nodes
        for (int i = 0; i < nodes.size() - 1; i++) {
            RouteResponse.NodeDetail current = nodes.get(i);
            RouteResponse.NodeDetail next = nodes.get(i + 1);

            // Generate 20 points per segment for smooth curve
            List<double[]> segmentPoints = interpolateSegment(current, next, 20);
            geometry.addAll(segmentPoints);
        }

        // Add final node
        RouteResponse.NodeDetail last = nodes.get(nodes.size() - 1);
        geometry.add(new double[]{last.getLng(), last.getLat()});

        return geometry;
    }

    /**
     * Interpolate points between two NodeDetail using Cubic Bezier curve
     */
    private static List<double[]> interpolateSegment(
            RouteResponse.NodeDetail start,
            RouteResponse.NodeDetail end,
            int numPoints
    ) {
        List<double[]> points = new ArrayList<>();

        double startLng = start.getLng();
        double startLat = start.getLat();
        double endLng = end.getLng();
        double endLat = end.getLat();

        // Calculate control points for Bezier curve
        double dx = endLng - startLng;
        double dy = endLat - startLat;
        double distance = Math.sqrt(dx * dx + dy * dy);

        // Curve intensity
        double offset = distance * 0.2;

        // Control points
        double ctrl1Lng = startLng + dx * 0.33 - dy * offset;
        double ctrl1Lat = startLat + dy * 0.33 + dx * offset;
        double ctrl2Lng = startLng + dx * 0.67 + dy * offset;
        double ctrl2Lat = startLat + dy * 0.67 - dx * offset;

        for (int i = 0; i < numPoints; i++) {
            double t = (double) i / numPoints;

            double lng = cubicBezier(t, startLng, ctrl1Lng, ctrl2Lng, endLng);
            double lat = cubicBezier(t, startLat, ctrl1Lat, ctrl2Lat, endLat);

            points.add(new double[]{lng, lat});
        }

        return points;
    }

    /**
     * Cubic Bezier helper
     */
    private static double cubicBezier(double t, double p0, double p1, double p2, double p3) {
        double u = 1 - t;
        double tt = t * t;
        double uu = u * u;
        double uuu = uu * u;
        double ttt = tt * t;

        return uuu * p0 + 3 * uu * t * p1 + 3 * u * tt * p2 + ttt * p3;
    }

    /**
     * ✅ Simple linear interpolation (DTO SAFE)
     */
    public static List<double[]> generateSimplePathGeometry(
            List<RouteResponse.NodeDetail> nodes,
            int pointsPerSegment
    ) {
        List<double[]> geometry = new ArrayList<>();

        if (nodes == null || nodes.isEmpty()) {
            return geometry;
        }

        for (int i = 0; i < nodes.size() - 1; i++) {
            RouteResponse.NodeDetail current = nodes.get(i);
            RouteResponse.NodeDetail next = nodes.get(i + 1);

            double startLng = current.getLng();
            double startLat = current.getLat();
            double endLng = next.getLng();
            double endLat = next.getLat();

            for (int j = 0; j < pointsPerSegment; j++) {
                double t = (double) j / pointsPerSegment;
                double lng = startLng + (endLng - startLng) * t;
                double lat = startLat + (endLat - startLat) * t;
                geometry.add(new double[]{lng, lat});
            }
        }

        RouteResponse.NodeDetail last = nodes.get(nodes.size() - 1);
        geometry.add(new double[]{last.getLng(), last.getLat()});

        return geometry;
    }
}
