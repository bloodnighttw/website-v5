"use client";

import { useReducer, useRef, useState } from "react";

type Action =
	| { type: "ADD"; payload: string } // remove by id
	| { type: "REMOVE"; payload: number } // remove by id
	| { type: "UPDATE"; payload: { id: number; text: string } } // update by id
	| { type: "CLEAR" };

interface State {
	maxId: number;
	todos: { id: number; text: string }[];
}

function reducer(state: State,action:Action): State{

	switch (action.type) {
		case "ADD":
			return {
				maxId: state.maxId+1,
				todos: [
					...state.todos,
					{
						id: state.maxId+1,
						text: action.payload,
					}
				],
			};
		case "REMOVE":
			return {
				...state,
				todos: state.todos.filter((todo) => todo.id !== action.payload),
			};
		case "UPDATE":
			return {
				...state,
				todos: state.todos.map((todo) =>
					todo.id === action.payload.id
						? { ...todo, text: action.payload.text }
						: todo
				),
			};
		case "CLEAR":
			return {
				...state,
				todos: [],
			};
	}
}

export function UpdateComponent({id,dispatch}:{id:number,dispatch:(action:Action)=>void}){

	const ref = useRef<HTMLInputElement>(null);
	const [open, setOpen] = useState(false);

	return <>
	{ open && <input className="border rounded px-2" ref={ref}/>}
		<button
			className="border rounded px-2"
			onClick={()=>{
				if(ref.current?.value){
					dispatch({
						type:"UPDATE",
						payload:{
							id,
							text:ref.current.value,
						}
					})
					setOpen(false);
				} else {
					setOpen(true);
				}
			}}
		>update</button>
	</>
}

export default function TODO(){

	const [state, dispatch] = useReducer(reducer, {
		maxId: 0,
		todos: [],
	});

	const ref = useRef<HTMLInputElement>(null);

	return <div className="*:not-first:mt-4">
		{state.todos.map((todo, idx) => (
			<div className="flex gap-2" key={todo.id} style={{
			}}>
				<span>
					{idx+1}.
				</span>
				<span>
					{todo.text}
				</span>
				<UpdateComponent dispatch={dispatch} id={todo.id}/>
				<button
					className="border rounded px-4" onClick={() => dispatch({type:"REMOVE", payload:todo.id})}
				>remove</button>
			</div>
		))}
		<div className="flex gap-2">
			<input className="border rounded" ref={ref}/>
			<button className="border rounded px-4" onClick={
				() => dispatch({type:"ADD", payload:(ref?.current?.value ?? "hello")})
			}>add</button>
			<button className="border rounded px-4" onClick={
				() => dispatch({type:"CLEAR"})
			}>clear</button>
		</div>
	</div>
}