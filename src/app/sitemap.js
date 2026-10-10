export const dynamic = "force-static";
import fs from "fs";
import path from "path";

const sitemap = () => {
  const base_url =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const fetch_last_modified_date = (page_path) => {
    const file_path = path.join(process.cwd(), "src/app", page_path);
    const { mtime } = fs.statSync(file_path);

    return mtime;
  };

  return [
    {
      url: base_url,
      priority: 1.0,
      changeFrequency: "weekly",
      lastModified: fetch_last_modified_date("page.jsx"),
    },
    {
      priority: 0.9,
      url: `${base_url}/events`,
      changeFrequency: "monthly",
      lastModified: fetch_last_modified_date("(routes)/events/page.jsx"),
    },
    {
      priority: 0.8,
      url: `${base_url}/team`,
      changeFrequency: "yearly",
      lastModified: fetch_last_modified_date("(routes)/team/page.jsx"),
    },
    {
      priority: 0.7,
      changeFrequency: "yearly",
      url: `${base_url}/developers`,
      lastModified: fetch_last_modified_date("(routes)/developers/page.jsx"),
    },
    {
      priority: 0.8,
      url: `${base_url}/registration`,
      changeFrequency: "monthly",
      lastModified: new Date(),
    },
    {
      priority: 0.6,
      url: `${base_url}/feedback`,
      changeFrequency: "monthly",
      lastModified: new Date(),
    },
  ];
};

export default sitemap;
