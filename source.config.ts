import { defineConfig } from 'fumadocs-mdx/config';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkWikiLinks from './utils/remark-plugin/wikiLink';
import moveImageToRoot from './utils/remark-plugin/moveImageToRoot';
import remarkImageSize from './utils/remark-plugin/remarkImageSize';
import remarkGfm from 'remark-gfm';
import section from './utils/rehype-plugin/section';
import rehypeShiki from '@shikijs/rehype';

export default defineConfig({

    mdxOptions: {
        remarkPlugins: () => [
            remarkFrontmatter,
			remarkMdxFrontmatter,
			remarkWikiLinks,
			moveImageToRoot,
			remarkImageSize,
			remarkGfm,
        ],
        rehypePlugins: () => [
			section,
			[
				rehypeShiki,
				{
					theme: "catppuccin-mocha",
					colorReplacements: {
						"#1e1e2e": "#18181B",
					},
				},
			],
		],
    } 
  // global options
});