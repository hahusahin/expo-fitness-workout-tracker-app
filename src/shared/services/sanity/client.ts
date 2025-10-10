import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const config = {
  projectId: "yhk6aqt7",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
};

// Client for fetching data from the App
export const client = createClient(config);

const adminConfig = {
  ...config,
  token: process.env.SANITY_API_TOKEN,
};

// Admin level Client used for backend
export const adminClient = createClient(adminConfig);


// Image URL Builder
const builder = imageUrlBuilder(config);
export const urlFor = (source) => builder.image(source);
