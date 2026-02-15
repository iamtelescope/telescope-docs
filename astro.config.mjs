// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import sitemap from "@astrojs/sitemap";

const enableGA = process.env.ENABLE_GA === "true";
const gaMeasurementId = process.env.GA_MEASUREMENT_ID;

const gaHead =
  enableGA && gaMeasurementId
    ? [
        {
          tag: "script",
          attrs: {
            async: true,
            src: `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`,
          },
        },
        {
          tag: "script",
          content: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaMeasurementId}');
        `,
        },
      ]
    : [];

// https://astro.build/config
export default defineConfig({
  site: "https://docs.iamtelescope.net",
  integrations: [
    starlight({
      title: "Telescope",
      description:
        "Telescope is a web application that provides an intuitive interface for exploring log data.",
      head: gaHead,
      logo: {
        src: "./src/assets/telescope-logo.png",
        replacesTitle: false,
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/iamtelescope/telescope",
        },
      ],
      favicon: "/favicon.png",
      customCss: ["./src/styles/custom.css"],
      components: {
        // Можем кастомизировать компоненты если нужно
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },
      sidebar: [
        { label: "Introduction", slug: "index" },
        {
          label: "Setup",
          items: [
            { label: "Development", slug: "setup/development" },
            { label: "Configuration", slug: "setup/config" },
          ],
        },
        {
          label: "Concepts",
          items: [
            { label: "Authentication & authorization", slug: "concepts/auth" },
            { label: "Connections", slug: "concepts/connection" },
            { label: "Data sources", slug: "concepts/source" },
            { label: "Severity rules", slug: "concepts/severity-rules" },
            { label: "Querying data", slug: "concepts/querying" },
            { label: "Releases", slug: "concepts/releases" },
          ],
        },
        {
          label: "User interface",
          items: [
            {
              label: "Connection configuration",
              items: [
                { label: "Overview", slug: "ui/connection" },
                { label: "Creating a ClickHouse connection", slug: "ui/connection/clickhouse" },
                { label: "Creating a Kubernetes connection", slug: "ui/connection/kubernetes" },
                { label: "Creating a Docker connection", slug: "ui/connection/docker" },
              ],
            },
            {
              label: "Source configuration",
              items: [
                { label: "Overview", slug: "ui/source" },
                { label: "Creating a ClickHouse source", slug: "ui/source/clickhouse" },
                { label: "Creating a Kubernetes source", slug: "ui/source/kubernetes" },
                { label: "Creating a Docker source", slug: "ui/source/docker" },
              ],
            },
            {
              label: "Data explorer",
              items: [
                { label: "Overview", slug: "ui/explorer" },
                { label: "Columns input", slug: "ui/explorer/columns" },
                { label: "Query input", slug: "ui/explorer/query" },
                { label: "Raw query input", slug: "ui/explorer/raw_query" },
                { label: "Saved views", slug: "ui/explorer/saved_views" },
              ],
            },
          ],
        },
        {
          label: "How-to guides",
          items: [
            { label: "Demo logs setup", slug: "howto/demologs" },
            { label: "Reading Kubernetes pod logs", slug: "howto/kubernetes" },
            { label: "Severity rules by example", slug: "howto/severity-rules" },
          ],
        },
        { label: "Changelog", slug: "changelog" },
      ],
    }),
    sitemap(),
  ],
});
