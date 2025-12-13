import { useCallback, useRef } from "react";

export const useDebounce = (fn, delay) => {
    const timeRef = useRef(null);
    const fnRef = useRef(fn);
    fnRef.current = fn;

    const debouncedFn = useCallback(
        (...args) => {
            if (timeRef.current) clearTimeout(timeRef.current);
            timeRef.current = setTimeout(() => {
                fnRef.current(...args);
            }, delay);
        },[delay]);

    const cancel = useCallback(() => {
        if (timeRef.current) clearTimeout(timeRef.current);
        timeRef.current = null;
    }, []);
    return [debouncedFn,cancel];
}