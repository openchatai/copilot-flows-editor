import { useEffect, useState } from "react";

export function useStateOnChange<T>(defaultValue: T, onChange?: (value: T) => void) {

    const [value, setValue] = useState<T>(defaultValue);

    useEffect(() => {
        onChange?.(value);
    }, [value, onChange])

    return [value, setValue] as const;
}