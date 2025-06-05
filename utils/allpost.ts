import { allPosts, allTranslates } from "@/.content-collections/generated";
import type { Post, Translate } from "content-collections";

// convert all translates to a map
const allTranslatesMap = new Map<string, Translate>(
	allTranslates.map((it) => [it.slug, it]),
);

export interface PostWithTranslaete extends Post {
	translate?: boolean;
	title: string;
	description: string;
	preview: string;
	slug: string;
	date: Date;
}

export const allPostWithZhPriority: PostWithTranslaete[] = allPosts
	.filter((post: Post) => {
		return post.draft !== true;
	})
	.sort((a, b) => {
		const dateA = a.date;
		const dateB = b.date;

		// Sort by date, most recent first
		return dateB.getTime() - dateA.getTime();
	})
	.map((post: Post): PostWithTranslaete => {
		const translate = allTranslatesMap.get(post.slug);
		const hasTranslate = translate !== undefined && translate.lang === "zh";

		let postModified: PostWithTranslaete = {
			...post,
		};

		if (hasTranslate) {
			postModified = {
				...postModified,
				title: translate.title,
				description: translate.description,
				translate: true,
				lang: translate.lang,
				toc: translate.toc,
			};
		}

		return postModified;
	});

export const allPostWithEnPriority: PostWithTranslaete[] = allPosts
	.filter((post: Post) => {
		return post.draft !== true;
	})
	.sort((a, b) => {
		const dateA = a.date;
		const dateB = b.date;

		// Sort by date, most recent first
		return dateB.getTime() - dateA.getTime();
	})
	.map((post: Post): PostWithTranslaete => {
		const translate = allTranslatesMap.get(post.slug);
		const hasTranslate = translate !== undefined && translate.lang === "en";

		let postModified: PostWithTranslaete = {
			...post,
		};

		if (hasTranslate) {
			postModified = {
				...postModified,
				title: translate.title,
				description: translate.description,
				translate: true,
				lang: translate.lang,
				toc: translate.toc,
			};
		}

		return postModified;
	});
