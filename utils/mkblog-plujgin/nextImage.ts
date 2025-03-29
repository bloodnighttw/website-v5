import { ComponentProps, createElement, ReactNode } from "react";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import * as runtime from "react/jsx-runtime";
import Image from "next/image";
import { Content, MkblogPlugin } from "@mkblog/core";

declare module "@mkblog/core" {
	interface Content<T>{
		react: () => Promise<ReactNode>
	}
}


const nextImageTransform = {
	img: (props: ComponentProps<"img">) => {
		return createElement(Image, {
			...props as {src:string},
			loading: "eager",
			alt: props.alt ?? "image from bntw.dev",
		});
	},
};

export  const nextImagePlugin:MkblogPlugin = {
	init: () => {
		Content.prototype.react = async function() {
			const hast = await this.hast()
			return toJsxRuntime(hast,{...runtime, components:nextImageTransform})
		}
	}
}