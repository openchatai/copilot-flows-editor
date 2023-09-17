import { useEffect, useMemo, useState } from "react";
import { transformPaths } from "./utils/transformSwagger";
import type { Swagger } from "./types/Swagger";
// loads example swagger file
export function useLoadEndpoints() {
    const [endpoints, setEndpoints] = useState<Swagger>();

    async function fetchEndpoints() {
        const _ = await fetch("/example-swagger.json");
        const data: Swagger = await _.json();
        setEndpoints(data);
    }
    useEffect(() => {
        fetchEndpoints();
    }, []);
    const paths = useMemo(
        () => transformPaths(endpoints?.paths ?? {}) ?? [],
        [endpoints]
    );
    return { paths };
}