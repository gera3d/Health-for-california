export default function(eleventyConfig) {
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
