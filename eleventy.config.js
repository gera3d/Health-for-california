export default function (eleventyConfig) {
  // Configure dev server to be accessible on network
  eleventyConfig.setServerOptions({
    host: "0.0.0.0",
    port: 8080
  });

  // Copy static assets to output
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");

  // Watch for CSS changes
  eleventyConfig.addWatchTarget("src/css/");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    // Use Nunjucks as default
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
