import { useState, useCallback } from "react";
import { dsaService } from "@/domains/Citizen/features/Traffic/Services/DSAService.js";
import { routeMapper } from "@/domains/Citizen/features/Traffic/Mappers/routeMapper.js";

export const useRouteFinder = () => {
    const [route, setRoute] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nodes, setNodes] = useState([]);
    const [availableNodeIds, setAvailableNodeIds] = useState({
        start: null,
        end: null
    });

    // ✅ Helper: tìm cặp node CÓ ĐƯỜNG ĐI THẬT
    const findSafePair = async (nodes) => {
        for (let i = 0; i < nodes.length - 1; i++) {
            const a = nodes[i]?.id;
            const b = nodes[i + 1]?.id;

            if (!a || !b) continue;

            try {
                await dsaService.findRoute(a, b, "dijkstra");
                return { start: a, end: b };
            } catch {
                continue;
            }
        }
        return null;
    };

    // ✅ SEED GRAPH + AUTO DETECT NODE SAFE
    const seedGraph = useCallback(async (type = "enhanced") => {
        setLoading(true);
        setError(null);

        try {
            const result =
                type === "enhanced"
                    ? await dsaService.seedEnhancedGraph()
                    : await dsaService.seedSimpleGraph();

            const allNodes = await dsaService.getGraphNodes();
            setNodes(allNodes || []);

            if (!allNodes || allNodes.length < 2) {
                throw new Error("Graph has less than 2 nodes");
            }

            // ✅ TÌM CẶP NODE CÓ ĐƯỜNG ĐI THẬT
            const safePair = await findSafePair(allNodes);

            if (!safePair) {
                throw new Error("No valid connected node pair found in graph");
            }

            setAvailableNodeIds(safePair);

            console.log("✅ Safe auto-detected nodes:", safePair);

            return {
                ...result,
                detectedNodeIds: safePair
            };
        } catch (err) {
            console.error("❌ Seed error:", err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // ✅ FIND ROUTE BÌNH THƯỜNG
    const findRoute = useCallback(
        async (startId, endId, algorithm = "dijkstra") => {
            setLoading(true);
            setError(null);

            try {
                const rawData = await dsaService.findRoute(
                    startId,
                    endId,
                    algorithm
                );

                const routeModel = routeMapper.toDomain(rawData);

                if (!routeModel.isValid()) {
                    throw new Error("Invalid route received from backend");
                }

                setRoute(routeModel);
                console.log("✅ Route found:", routeModel);
                return routeModel;
            } catch (err) {
                setError(err.message);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // ✅ FIND ROUTE AUTO
    const findRouteAuto = useCallback(
        async (algorithm = "dijkstra") => {
            if (!availableNodeIds.start || !availableNodeIds.end) {
                const msg = "Please seed graph first";
                setError(msg);
                throw new Error(msg);
            }

            return findRoute(
                availableNodeIds.start,
                availableNodeIds.end,
                algorithm
            );
        },
        [availableNodeIds, findRoute]
    );

    const clearRoute = useCallback(() => {
        setRoute(null);
        setError(null);
    }, []);

    return {
        route,
        nodes,
        loading,
        error,
        availableNodeIds,
        seedGraph,
        findRoute,
        findRouteAuto,
        clearRoute
    };
};
