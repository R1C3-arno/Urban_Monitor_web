/**
 * DSA Data Structures
 * OOP: Strategy + Composite Patterns
 * Triển khai các cấu trúc dữ liệu từ backend
 */

import { Coordinate, TrafficNode, TrafficEdge } from './Models.js';

// ==================== KD-TREE (SPATIAL INDEXING) ====================

export class KDNode {
    constructor(point, depth = 0, id = null) {
        this.point = point; // Coordinate object
        this.id = id;
        this.depth = depth;
        this.left = null;
        this.right = null;
    }
}

export class KDTree {
    constructor(points = []) {
        this.root = null;
        this.allPoints = [];

        if (points.length > 0) {
            this.build(points);
        }
    }

    build(points) {
        this.allPoints = points;
        this.root = this._buildRec(points.map((p, i) => new KDNode(p.coords || p, 0, p.id || i)), 0);
    }

    _buildRec(points, depth) {
        if (points.length === 0) return null;

        const axis = depth % 2; // 0 for lng, 1 for lat
        const sorted = points.sort((a, b) => {
            const aVal = axis === 0 ? a.point.lng : a.point.lat;
            const bVal = axis === 0 ? b.point.lng : b.point.lat;
            return aVal - bVal;
        });

        const median = Math.floor(sorted.length / 2);
        const node = sorted[median];
        node.depth = depth;

        node.left = this._buildRec(sorted.slice(0, median), depth + 1);
        node.right = this._buildRec(sorted.slice(median + 1), depth + 1);

        return node;
    }

    /**
     * Find K nearest neighbors
     * @param {Coordinate} target
     * @param {number} k
     * @returns {Array} - K nearest points sorted by distance
     */
    findKNearest(target, k = 10) {
        const nearest = [];
        this._searchRec(this.root, target, k, nearest);
        return nearest
            .sort((a, b) => a.distance - b.distance)
            .slice(0, k)
            .map(item => item.node);
    }

    _searchRec(node, target, k, nearest) {
        if (!node) return;

        const distance = target.distanceTo(node.point);
        nearest.push({ node, distance });

        if (nearest.length > k) {
            nearest.sort((a, b) => b.distance - a.distance);
            nearest.pop();
        }

        const axis = node.depth % 2;
        const targetVal = axis === 0 ? target.lng : target.lat;
        const nodeVal = axis === 0 ? node.point.lng : node.point.lat;
        const axisDistance = Math.abs(targetVal - nodeVal);

        const nearerChild = targetVal < nodeVal ? node.left : node.right;
        const fartherChild = targetVal < nodeVal ? node.right : node.left;

        this._searchRec(nearerChild, target, k, nearest);

        if (nearest.length < k || axisDistance < nearest[0]?.distance) {
            this._searchRec(fartherChild, target, k, nearest);
        }
    }

    /**
     * Range search - find all points within radius
     */
    rangeSearch(target, radiusKm) {
        const result = [];
        this._rangeSearchRec(this.root, target, radiusKm, result);
        return result;
    }

    _rangeSearchRec(node, target, radius, result) {
        if (!node) return;

        const distance = target.distanceTo(node.point);
        if (distance <= radius) {
            result.push(node);
        }

        const axis = node.depth % 2;
        const targetVal = axis === 0 ? target.lng : target.lat;
        const nodeVal = axis === 0 ? node.point.lng : node.point.lat;
        const axisDistance = Math.abs(targetVal - nodeVal);

        if (axisDistance <= radius) {
            this._rangeSearchRec(node.left, target, radius, result);
            this._rangeSearchRec(node.right, target, radius, result);
        } else if (targetVal < nodeVal) {
            this._rangeSearchRec(node.left, target, radius, result);
        } else {
            this._rangeSearchRec(node.right, target, radius, result);
        }
    }
}

// ==================== GRAPH (TRAFFIC NETWORK) ====================

export class TrafficGraph {
    constructor(nodes = [], edges = []) {
        this.nodes = new Map();
        this.edges = new Map();
        this.kdTree = null;
        this.adjacencyList = new Map();

        nodes.forEach(node => this.addNode(node));
        edges.forEach(edge => this.addEdge(edge));

        this._buildKDTree();
    }

    addNode(node) {
        if (node instanceof TrafficNode) {
            this.nodes.set(node.id, node);
            if (!this.adjacencyList.has(node.id)) {
                this.adjacencyList.set(node.id, []);
            }
        }
    }

    addEdge(edge) {
        if (edge instanceof TrafficEdge) {
            this.edges.set(edge.id, edge);

            const fromList = this.adjacencyList.get(edge.fromNodeId) || [];
            fromList.push(edge.toNodeId);
            this.adjacencyList.set(edge.fromNodeId, fromList);

            if (edge.bidirectional) {
                const toList = this.adjacencyList.get(edge.toNodeId) || [];
                toList.push(edge.fromNodeId);
                this.adjacencyList.set(edge.toNodeId, toList);
            }
        }
    }

    getNode(nodeId) {
        return this.nodes.get(nodeId);
    }

    getEdge(edgeId) {
        return this.edges.get(edgeId);
    }

    getAdjacent(nodeId) {
        return (this.adjacencyList.get(nodeId) || [])
            .map(id => this.nodes.get(id))
            .filter(Boolean);
    }

    _buildKDTree() {
        const nodesArray = Array.from(this.nodes.values());
        this.kdTree = new KDTree(nodesArray);
    }

    /**
     * Find nearest node using KD-Tree
     */
    findNearestNode(coord) {
        if (!this.kdTree) return null;
        const result = this.kdTree.findKNearest(coord, 1);
        return result.length > 0 ? result[0] : null;
    }

    /**
     * Find K nearest nodes
     */
    findKNearestNodes(coord, k = 10) {
        if (!this.kdTree) return [];
        return this.kdTree.findKNearest(coord, k);
    }

    /**
     * BFS - Breadth First Search
     */
    bfs(startNodeId) {
        const visited = new Set();
        const queue = [startNodeId];
        const result = [];

        while (queue.length > 0) {
            const nodeId = queue.shift();
            if (visited.has(nodeId)) continue;

            visited.add(nodeId);
            result.push(nodeId);

            const adjacent = this.getAdjacent(nodeId);
            adjacent.forEach(node => {
                if (!visited.has(node.id)) {
                    queue.push(node.id);
                }
            });
        }

        return result;
    }

    /**
     * DFS - Depth First Search
     */
    dfs(startNodeId) {
        const visited = new Set();
        const result = [];

        const traverse = (nodeId) => {
            if (visited.has(nodeId)) return;
            visited.add(nodeId);
            result.push(nodeId);

            const adjacent = this.getAdjacent(nodeId);
            adjacent.forEach(node => traverse(node.id));
        };

        traverse(startNodeId);
        return result;
    }

    get size() {
        return {
            nodes: this.nodes.size,
            edges: this.edges.size,
        };
    }

    toJSON() {
        return {
            nodes: Array.from(this.nodes.values()).map(n => n.toJSON()),
            edges: Array.from(this.edges.values()).map(e => e.toJSON()),
            size: this.size,
        };
    }
}

// ==================== PRIORITY QUEUE (For Dijkstra/A*) ====================

export class PriorityQueue {
    constructor() {
        this.heap = [];
    }

    push(item, priority) {
        this.heap.push({ item, priority });
        this._bubbleUp(this.heap.length - 1);
    }

    pop() {
        if (this.heap.length === 0) return null;
        const result = this.heap[0];
        const end = this.heap.pop();

        if (this.heap.length > 0) {
            this.heap[0] = end;
            this._sinkDown(0);
        }

        return result.item;
    }

    peek() {
        return this.heap.length > 0 ? this.heap[0].item : null;
    }

    _bubbleUp(idx) {
        while (idx > 0) {
            const parentIdx = Math.floor((idx - 1) / 2);
            if (this.heap[idx].priority >= this.heap[parentIdx].priority) break;

            [this.heap[idx], this.heap[parentIdx]] = [this.heap[parentIdx], this.heap[idx]];
            idx = parentIdx;
        }
    }

    _sinkDown(idx) {
        while (true) {
            let swapIdx = null;
            const leftIdx = 2 * idx + 1;
            const rightIdx = 2 * idx + 2;

            if (leftIdx < this.heap.length && this.heap[leftIdx].priority < this.heap[idx].priority) {
                swapIdx = leftIdx;
            }

            if (rightIdx < this.heap.length &&
                this.heap[rightIdx].priority < (swapIdx !== null ? this.heap[leftIdx].priority : this.heap[idx].priority)) {
                swapIdx = rightIdx;
            }

            if (swapIdx === null) break;
            [this.heap[idx], this.heap[swapIdx]] = [this.heap[swapIdx], this.heap[idx]];
            idx = swapIdx;
        }
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    get size() {
        return this.heap.length;
    }
}

// ==================== LRU CACHE (For Route Caching) ====================

export class LRUCache {
    constructor(maxSize = 100) {
        this.maxSize = maxSize;
        this.cache = new Map();
    }

    get(key) {
        if (!this.cache.has(key)) return null;

        // Move to end (most recently used)
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);

        return value;
    }

    set(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.maxSize) {
            // Remove least recently used (first item)
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        this.cache.set(key, value);
    }

    has(key) {
        return this.cache.has(key);
    }

    clear() {
        this.cache.clear();
    }

    get size() {
        return this.cache.size;
    }

    getStats() {
        return {
            currentSize: this.cache.size,
            maxSize: this.maxSize,
            utilizationRate: (this.cache.size / this.maxSize) * 100,
        };
    }
}

// ==================== BLOOM FILTER (For Spam/Duplicate Detection) ====================

export class BloomFilter {
    constructor(size = 10000, hashFunctions = 3) {
        this.size = size;
        this.hashFunctions = hashFunctions;
        this.bitArray = new Uint8Array(Math.ceil(size / 8));
    }

    _hash(str, seed = 0) {
        let hash = seed;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash = hash & hash;
        }
        return Math.abs(hash) % this.size;
    }

    add(item) {
        const str = typeof item === 'string' ? item : JSON.stringify(item);
        for (let i = 0; i < this.hashFunctions; i++) {
            const index = this._hash(str, i);
            const byteIndex = Math.floor(index / 8);
            const bitIndex = index % 8;
            this.bitArray[byteIndex] |= (1 << bitIndex);
        }
    }

    mightContain(item) {
        const str = typeof item === 'string' ? item : JSON.stringify(item);
        for (let i = 0; i < this.hashFunctions; i++) {
            const index = this._hash(str, i);
            const byteIndex = Math.floor(index / 8);
            const bitIndex = index % 8;
            if (!(this.bitArray[byteIndex] & (1 << bitIndex))) {
                return false;
            }
        }
        return true;
    }

    getSize() {
        return this.size;
    }
}

// ==================== SEGMENT TREE (Range Queries) ====================

export class SegmentTree {
    constructor(arr) {
        this.n = arr.length;
        this.tree = new Array(4 * this.n).fill(0);
        if (this.n > 0) {
            this._build(arr, 0, 0, this.n - 1);
        }
    }

    _build(arr, node, start, end) {
        if (start === end) {
            this.tree[node] = arr[start];
        } else {
            const mid = Math.floor((start + end) / 2);
            this._build(arr, 2 * node + 1, start, mid);
            this._build(arr, 2 * node + 2, mid + 1, end);
            this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
        }
    }

    rangeSum(l, r) {
        return this._query(0, 0, this.n - 1, l, r);
    }

    _query(node, start, end, l, r) {
        if (r < start || end < l) return 0;
        if (l <= start && end <= r) return this.tree[node];

        const mid = Math.floor((start + end) / 2);
        return this._query(2 * node + 1, start, mid, l, r) +
            this._query(2 * node + 2, mid + 1, end, l, r);
    }
}