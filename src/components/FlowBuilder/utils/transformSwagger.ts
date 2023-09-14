import type { ExtendedOperation, Method, Paths, TransformedPath } from "../types/Swagger";

/** 
 * @description Transforms the paths object from the swagger file into a more usable format
 */
export function transformPaths(paths: Paths): TransformedPath[] {
    const trasnformedPaths = new Set<TransformedPath>();
    Object.keys(paths).forEach((pathString) => {
        const endpoint = paths[pathString];
        const methods = new Set<ExtendedOperation>()
        endpoint && Object.keys(endpoint).forEach((method) => {
            const operation = endpoint[method as Method];
            operation && methods.add({
                ...operation,
                method: method as Method
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