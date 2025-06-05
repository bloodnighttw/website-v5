import "server-only";

import "@/app/content.css";
import Comments from "@/components/modules/comments";
import { Metadata } from "next";
import Part from "@/components/shared/part";
import ArticleInfoPanel from "@/components/modules/posts/article/article-info-panel";
import Layout from "@/components/modules/posts/article/layout";
import Warning from "@/components/modules/posts/article/warning";
import { getTranslations } from "next-intl/server";
import { BASE_URL } from "@/utils/constant";
import { allPostWithEnPriority, allPostWithZhPriority } from "@/utils/allpost";
import { posts } from "@/.source";
import components from "@/components/shared/MDXComponents";

export async function generateStaticParams() {
	return allPostWithZhPriority.map((post) => {
		return {
			slug: post.slug,
		};
	});
}

export const dynamicParams = false;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
	const { slug, locale } = await params;
	const allPosts =
		locale == "zh" ? allPostWithZhPriority : allPostWithEnPriority;
	const post = allPosts.find((it) => it.slug === slug)!;
	const description = post.description;

	return {
		title: post.title,
		description,
		alternates: {
			languages: {
				zh: `${BASE_URL}/zh/blog/${post.slug}`,
				en: `${BASE_URL}/en/blog/${post.slug}`,
			},
		},
		openGraph: {
			title: post.title,
			description: "",
			type: "article",
			images: post.preview
				? [
						{
							url: post.preview,
							alt: post.title,
						},
					]
				: [],
		},
		twitter: {
			title: post.title,
			description,
			site: "@bloodnighttw",
			card: "summary_large_image",
			images: post.preview
				? [
						{
							url: post.preview,
							alt: post.title,
						},
					]
				: [],
		},
	};
}

async function getMdx(content: { slug: string; translate?: boolean }) {
	const path = content.translate
		? `translate/${content.slug}.mdx`
		: `${content.slug}.mdx`;

	const mdxFromDocs = posts.find((doc) => {
		return doc._file.path === path;
	});

	return mdxFromDocs!.body;
}

export default async function Blog({
	params,
}: {
	params: Promise<{ slug: string; locale: string }>;
}) {
	const { slug, locale } = await params;
	const allPosts =
		locale == "zh" ? allPostWithZhPriority : allPostWithEnPriority;

	const content = allPosts.find((it) => it.slug === slug);

	if (!content) return <div>404</div>;

	const Content = await getMdx(content);

	const t = await getTranslations("Blog");

	const timeWithFormat = new Intl.DateTimeFormat("zh", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(content.date);

	return (
		<div className="page-enter">
			<ArticleInfoPanel content={content} />
			<Layout tocArray={content.toc} publishAt={timeWithFormat}>
				{locale === content.lang || (
					<Warning
						title={t("Warning")}
						message={t("warningMessage")}
					/>
				)}
				<Content components={components} />
			</Layout>

			<Part className="bg-dotted">
				<Comments />
			</Part>
		</div>
	);
}
