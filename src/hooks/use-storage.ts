import { useEffect, useState } from "react";
import { getStorageValue, parse, setStorageValue } from "./helpers";


export function useLocalStorage<T>({
    key,
    initialValue,
    onChange,
}: {
    key: string;
    initialValue: T;
    onChange?: (value: T) => void;
}) {
    const [value, setValue] = useState<T>(() => getStorageValue(key, initialValue));
    const set: React.Dispatch<React.SetStateAction<T>> = (newValue) => {
        setValue(newValue);
        setStorageValue(key, newValue);
    };
    // when the ls changes we want to update our state
    useEffect(() => {
        function handleStorageChanges(ev: StorageEvent) {
            if (ev.key === key) {
                setValue(parse(ev.newValue || ''));
            }
        }
        window.addEventListener('storage', handleStorageChanges);
        return () => window.removeEventListener('storage', handleStorageChanges);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        onChange?.(value);
    }, [value, onChange]);
    return [value, set] as const;
}