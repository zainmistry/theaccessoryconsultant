(function () {
  var blogPostsPromise = null;

  function loadBlogPosts() {
    if (!blogPostsPromise) {
      blogPostsPromise = fetch("/assets/data/blog-posts.json").then(function (res) {
        if (!res.ok) {
          throw new Error("Failed to load blog posts");
        }
        return res.json();
      });
    }
    return blogPostsPromise;
  }

  function jsonResponse(data, status) {
    return new Response(JSON.stringify(data), {
      status: status || 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  var originalFetch = window.fetch.bind(window);

  window.fetch = function (input, init) {
    var url = typeof input === "string" ? input : input && input.url ? input.url : "";

    if (url === "/api/blog-posts") {
      return loadBlogPosts().then(function (posts) {
        return jsonResponse(posts);
      });
    }

    var postMatch = url.match(/^\/api\/blog-posts\/(\d+)$/);
    if (postMatch) {
      var postId = Number(postMatch[1]);
      return loadBlogPosts().then(function (posts) {
        var post = posts.find(function (item) {
          return item.id === postId;
        });
        return post ? jsonResponse(post) : jsonResponse({ error: "Blog post not found" }, 404);
      });
    }

    var relatedMatch = url.match(/^\/api\/blog-posts\/(\d+)\/related$/);
    if (relatedMatch) {
      var relatedId = Number(relatedMatch[1]);
      return loadBlogPosts().then(function (posts) {
        var current = posts.find(function (item) {
          return item.id === relatedId;
        });
        if (!current) {
          return jsonResponse({ error: "Blog post not found" }, 404);
        }
        var related = posts
          .filter(function (item) {
            return item.category === current.category && item.id !== current.id;
          })
          .slice(0, 4);
        return jsonResponse(related);
      });
    }

    return originalFetch(input, init);
  };
})();
