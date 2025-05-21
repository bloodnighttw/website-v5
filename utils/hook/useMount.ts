import { useEffect, useRef } from 'react';

export function useMount() {
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    return () => isMounted.current;
}