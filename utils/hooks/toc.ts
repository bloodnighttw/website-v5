import { useCallback, useSyncExternalStore } from "react";

const callbackMap: Record<string, () => void> = {};
let idCurrent = 0;

export function registerProgressCallback(callback: () => void) {
    const id = idCurrent.toString();
    callbackMap[id] = callback;
    idCurrent += 1;

    // return the id to allow unregistration
    return id;
}

export function unregisterProgressCallback(id: string) {
    delete callbackMap[id];
}

let progress = 0;

export function useProgress(){

    return useSyncExternalStore(
        (callback) => {
            const id = registerProgressCallback(callback);
            return () => unregisterProgressCallback(id);
        },
        () => progress,
        () => progress
    );
}

export function useSetProgress() {
    return useCallback((newProgress: number) => {
        progress = Math.max(0, Math.min(100, newProgress));
        Object.values(callbackMap).forEach(callback => callback());
    },[]);
}