// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Telescope',
			description: 'Telescope is a web application that provides an intuitive interface for exploring log data.',
			logo: {
				src: './src/assets/telescope-logo.png',
				replacesTitle: false,
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/iamtelescope/telescope' }
			],
			favicon: '/favicon.png',
			customCss: [
				'./src/styles/custom.css',
			],
			components: {
				// Можем кастомизировать компоненты если нужно
			},
			tableOfContents: {
				minHeadingLevel: 2,
				maxHeadingLevel: 4,
			},
			sidebar: [
				{ label: 'Introduction', slug: 'index' },
				{
					label: 'Setup',
					items: [
						{ label: 'Development', slug: 'setup/development' },
						{ label: 'Configuration', slug: 'setup/config' },
					],
				},
				{
					label: 'Concepts',
					items: [
						{ label: 'Authentication & Authorization', slug: 'concepts/auth' },
						{ label: 'Data Sources', slug: 'concepts/source' },
						{ label: 'Querying Data', slug: 'concepts/querying' },
						{ label: 'Releases', slug: 'concepts/releases' },
					],
				},
				{
					label: 'User Interface',
					items: [
						{ label: 'Source Configuration', slug: 'ui/source' },
						{
							label: 'Data Explorer',
							items: [
								{ label: 'Overview', slug: 'ui/explorer' },
								{ label: 'Fields Input', slug: 'ui/explorer/fields' },
								{ label: 'Query Input', slug: 'ui/explorer/query' },
								{ label: 'Raw Query Input', slug: 'ui/explorer/raw_query' },
								{ label: 'Saved Views', slug: 'ui/explorer/saved_views' },
							],
						},
					],
				},
				{
					label: 'How-To Guides',
					items: [
						{ label: 'Demo Logs Setup', slug: 'howto/demologs' },
					],
				},
				{ label: 'Changelog', slug: 'changelog' },
			],
		}),
	],
});
