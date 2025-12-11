package com.urbanmonitor.domain.citizen.spatial;

import lombok.Data;

/**
 * KD-TREE NODE
 *
 * Represents a node in the KD-Tree
 *
 * STRUCTURE:
 * - point: 2D point with incident data
 * - axis: splitting dimension (0=x/lat, 1=y/lng)
 * - left: left subtree (values < split)
 * - right: right subtree (values >= split)
 */
@Data
public class KDNode {
    Point2D point;
    int axis; // 0 = latitude (x), 1 = longitude (y)
    KDNode left;
    KDNode right;

    public KDNode(Point2D point, int axis) {
        this.point = point;
        this.axis = axis;
        this.left = null;
        this.right = null;
    }
}