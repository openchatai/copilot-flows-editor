import { useEffect, useMemo, useState } from "react";
import type { ExtendedOperation, Method, Paths, Swagger, TransformedPath } from "./types/Swagger";

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

function getKeys(obj: Record<string, any>) {
    return Object.keys(obj)
}


function transformPaths(paths: Paths): TransformedPath[] {
    const trasnformedPaths = new Set<TransformedPath>();
    getKeys(paths).forEach((pathString) => {
        const endpoint = paths[pathString];
        const methods = new Set<ExtendedOperation>()
        endpoint && Object.keys(endpoint).forEach((method) => {
            const operation = endpoint[method as Method];
            operation && methods.add({
                ...operation,
                method
            });
        });
        trasnformedPaths.add({
            path: pathString,
            methods: Array.from(methods)
        });
    });
    console.log(trasnformedPaths)
    return Array.from(trasnformedPaths);
}