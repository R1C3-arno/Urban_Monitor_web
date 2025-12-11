// GraphRenderer.jsx
const renderSpiderWeb = (nodes, edges) => {
    // 1. Draw all nodes as small gray circles
    nodes.forEach(node => {
        map.addLayer({
            id: `node-${node.id}`,
            type: 'circle',
            paint: {
                'circle-radius': 6,
                'circle-color': '#9CA3AF',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#FFFFFF'
            }
        });
    });

    // 2. Draw all edges as thin gray lines
    edges.forEach(edge => {
        map.addLayer({
            id: `edge-${edge.id}`,
            type: 'line',
            paint: {
                'line-color': '#D1D5DB',
                'line-width': 1,
                'line-opacity': 0.4
            }
        });
    });
};

// ✅ User sees complete graph structure