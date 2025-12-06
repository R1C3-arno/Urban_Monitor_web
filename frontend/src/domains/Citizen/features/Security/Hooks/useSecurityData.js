import { useEffect, useState } from "react";
import { createReportDataSource } from "../Services/createReportDataSource.js";
import { mapReportsToMarkers } from "../Services/mapReportsToMarkers.js";

export const useSecurityData = ({
                                    useMock = true,
                                    autoFetch = true,
                                    onReportClick,
                                }) => {
    const [reports, setReports] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const dataSource = createReportDataSource(useMock);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await dataSource.getReports();
            setReports(data);
            setMarkers(mapReportsToMarkers(data, onReportClick));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (autoFetch) fetchData();
    }, []);

    return { reports, markers, loading, error };
};
