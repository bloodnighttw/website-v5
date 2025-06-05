import {
	useEffect,
	useLayoutEffect,
	useMemo,
	useReducer,
	useRef,
	useState,
} from "react";

interface TocState {
	// the original height of the toc element
	heightDP: number[];
	onScreen: number[];
}

const TocInitialState: TocState = {
	heightDP: [0],
	onScreen: [],
};

export type TocAction =
	| {
			type: "initNew";
			payload: number; // height of the new line
	  } // init new line
	| { type: "add"; payload: number } // index of the element to add
	| { type: "remove"; payload: number }; // index of the element to remove

export function tocReducer(state: TocState, action: TocAction): TocState {
	switch (action.type) {
		case "initNew": {
			const lastHeight = state.heightDP[state.heightDP.length - 1];
			const newHeight = lastHeight + action.payload;

			console.debug("initNew", newHeight, state.heightDP);
			// add new height to heightDP
			return {
				...state,
				heightDP: [...state.heightDP, newHeight],
			};
		}
		case "add": {
			const idx = action.payload + 1;
			if (state.onScreen.includes(idx)) return state;

			// add idx to sorted onScreen
			const newOnScreen = [...state.onScreen, idx].sort((a, b) => a - b);
			return {
				...state,
				onScreen: newOnScreen,
			};
		}
		case "remove": {
			const idx = action.payload + 1;
			if (!state.onScreen.includes(idx)) {
				return state;
			}
			// remove idx from onScreen
			const newOnScreen = state.onScreen
				.filter((i) => i !== idx)
				.sort((a, b) => a - b);

			return {
				...state,
				onScreen: newOnScreen,
			};
		}
	}
	return state;
}

export function useToc() {
	const [state, dispatch] = useReducer(tocReducer, TocInitialState);

	const maxIdx = useMemo(()=>Math.max(...state.onScreen),[state.onScreen]);
	const minIdx = useMemo(()=>Math.min(...state.onScreen),[state.onScreen]);

	const mt = state.heightDP[minIdx - 1];
	const height = state.heightDP[maxIdx] - mt;

	return [mt, height, dispatch] as const;
}

export function useTocElement(
	dispatch: React.Dispatch<TocAction>,
	id: string,
	index: number,
) {
	const [onScreen, setOnScreen] = useState<boolean>(false);
	const ref = useRef<HTMLAnchorElement>(null);

	useLayoutEffect(() => {
		const element = ref.current;
		if (!element) return;

		const height = element.offsetHeight;
		dispatch({
			type: "initNew",
			payload: height,
		});
	}, [dispatch]);

	useEffect(() => {
		const onViewportChange = () => {

            const sectionElement = document.getElementById(id);
            if (!sectionElement) return;

			const rect = sectionElement.getBoundingClientRect();

			// Get viewport dimensions
			const viewportHeight =
				window.innerHeight || document.documentElement.clientHeight;

			// Element is out of screen if any of these conditions are true:
			const onViewport = !(
				rect.bottom < 64 || // Above the top edge (also includes the navbar)
				rect.top > viewportHeight // Below the bottom edge
			);

			if (onViewport) {
				setOnScreen(true);
				dispatch({ type: "add", payload: index });
			} else {
				setOnScreen(false);
				dispatch({ type: "remove", payload: index });
			}
		};

		onViewportChange();

		window.addEventListener("scroll", onViewportChange);
		window.addEventListener("resize", onViewportChange);

		return () => {
			window.removeEventListener("scroll", onViewportChange);
			window.removeEventListener("resize", onViewportChange);
		};
	}, [dispatch, id, index]);

	return [ref, onScreen] as const;
}
