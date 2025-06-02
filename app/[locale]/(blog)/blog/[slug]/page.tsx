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
	params: Promise<{ slug: string, locale: string }>;
}): Promise<Metadata> {

	const { slug, locale } = await params;
	const allPosts = locale == "zh" ? allPostWithZhPriority : allPostWithEnPriority;
	const post = allPosts.find((it) => it.slug === slug)!;
	const description = post.description;

	return {
		title: post.title,
		description,
		alternates: {
			languages: {
				zh: `${BASE_URL}/zh/blog/${post.slug}`,
				en: `${BASE_URL}/en/blog/${post.slug}`,
			}
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

async function getMdx(content: { slug: string, translate?: boolean }) {
	if (content.translate) {
		return await import(`@/contents/posts/translate/${content.slug}.mdx`);
	} else {
		return await import(`@/contents/posts/${content.slug}.mdx`);
	}
}

export default async function Blog({
	params,
}: {
	params: Promise<{ slug: string, locale: string }>;
}) {
	const { slug, locale } = await params;
	const allPosts = locale == "zh" ? allPostWithZhPriority : allPostWithEnPriority;

	const content = allPosts.find((it) => it.slug === slug);

	if (!content) return <div>404</div>;

	const { default: Content } = await getMdx(content);

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
				<Part className="bg-bprimary page-enter">
					{ locale === content.lang || <Warning title={t("Warning")} message={t("warningMessage")}/>}
					<article>
						<Content />
					</article>
				</Part>
			</Layout>

			<Part className="bg-dotted">
				<Comments />
			</Part>
		</div>
	);
}
