/**
 * Eleventy Configuration
 * Civil War Primary Sources & Party Realignment
 */

export default function(eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/bingsiteauth.xml": "bingsiteauth.xml" });
  eleventyConfig.addPassthroughCopy({ "src/llms.txt": "llms.txt" });
  eleventyConfig.addPassthroughCopy({ "src/llms-full.txt": "llms-full.txt" });

  // Watch for changes in assets
  eleventyConfig.addWatchTarget("src/assets/");

  // Add a filter for safe HTML output
  eleventyConfig.addFilter("safe", function(content) {
    return content;
  });

  // Add date formatting filter
  eleventyConfig.addFilter("dateFormat", function(date, format) {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  // Add ISO date filter for sitemap
  eleventyConfig.addFilter("isoDate", function(date) {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  });

  // Add a filter to get party badge class
  eleventyConfig.addFilter("partyClass", function(party) {
    const partyClassMap = {
      'Republican': 'badge-rep',
      'Republican Ticket': 'badge-rep',
      'Democrat': 'badge-dem',
      'Democratic': 'badge-dem',
      'Democratic Ticket': 'badge-dem',
      'Southern Democrat': 'badge-dem',
      "States' Rights Democrat": 'badge-third',
      'Constitutional Union': 'badge-third'
    };
    return partyClassMap[party] || 'badge-third';
  });

  // Custom collection for pages
  eleventyConfig.addCollection("pages", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/*.njk");
  });

  // Configure Nunjucks
  eleventyConfig.setNunjucksEnvironmentOptions({
    throwOnUndefined: false,
    autoescape: false
  });

  // Build configuration
  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
}
