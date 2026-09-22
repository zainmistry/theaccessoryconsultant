/**
 * Replaces contact-page placeholder NAP left in the compiled SPA bundle.
 * The React source is not in this deploy repo, so the strings cannot be
 * regenerated. Footer copy is the source of truth:
 *   +91 9152727387
 *   info@theaccessoryconsultant.com
 */
(function () {
  var PHONE_FROM = "+91 (0) 123 456 7890";
  var PHONE_TO = "+91 9152727387";
  var EMAIL_FROM = "info@jewelcraft.com";
  var EMAIL_TO = "info@theaccessoryconsultant.com";

  function patchText(node) {
    var value = node.nodeValue;
    if (!value) return;
    if (value.indexOf(PHONE_FROM) === -1 && value.indexOf(EMAIL_FROM) === -1) return;
    node.nodeValue = value.split(PHONE_FROM).join(PHONE_TO).split(EMAIL_FROM).join(EMAIL_TO);
  }

  function patchTree(root) {
    if (!root) return;
    if (root.nodeType === 3) {
      patchText(root);
      return;
    }
    if (root.nodeType !== 1) return;
    var text = root.textContent || "";
    if (text.indexOf("123 456 7890") === -1 && text.indexOf("jewelcraft.com") === -1) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) patchText(node);
  }

  function applyRouteMeta() {
    var routes = window.__SEO_ROUTES__;
    if (!routes) return;
    var path = window.location.pathname || "/";
    if (path.length > 1 && path.charAt(path.length - 1) === "/") path = path.slice(0, -1);
    var meta = routes[path];
    if (!meta) return;
    if (meta.title) document.title = meta.title;
    setMeta("name", "description", meta.description);
    setMeta("name", "robots", meta.robots);
    setMeta("property", "og:title", meta.title);
    setMeta("property", "og:description", meta.description);
    setMeta("property", "og:url", meta.canonical);
    setMeta("name", "twitter:title", meta.title);
    setMeta("name", "twitter:description", meta.description);
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && meta.canonical) canonical.setAttribute("href", meta.canonical);
  }

  function setMeta(attr, key, value) {
    if (!value) return;
    var node = document.querySelector('meta[' + attr + '="' + key + '"]');
    if (node) node.setAttribute("content", value);
  }

  function watchHistory() {
    var pushState = history.pushState;
    var replaceState = history.replaceState;
    history.pushState = function () {
      var result = pushState.apply(this, arguments);
      applyRouteMeta();
      return result;
    };
    history.replaceState = function () {
      var result = replaceState.apply(this, arguments);
      applyRouteMeta();
      return result;
    };
    window.addEventListener("popstate", applyRouteMeta);
  }

  function start() {
    applyRouteMeta();
    watchHistory();
    patchTree(document.body);
    var observer = new MutationObserver(function (records) {
      for (var i = 0; i < records.length; i++) {
        var record = records[i];
        if (record.type === "characterData") {
          patchText(record.target);
          continue;
        }
        var added = record.addedNodes;
        for (var j = 0; j < added.length; j++) patchTree(added[j]);
      }
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
