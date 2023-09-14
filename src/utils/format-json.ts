import { js_beautify } from "js-beautify";



export async function formatCode(text: string) {
    return js_beautify(text, {
        indent_size: 2,
    });
}