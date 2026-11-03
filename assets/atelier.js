/* Count confirmed numerals once. Does not touch forms. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function paint(el, value) {
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    el.textContent = prefix + value + suffix;
  }

  function run(el) {
    if (!el || el.nodeType !== 1 || el.dataset.counted) return;
    if (!el.hasAttribute("data-count")) return;
    el.dataset.counted = "1";
    var end = Number(el.getAttribute("data-count"));
    if (reduce || !isFinite(end)) {
      paint(el, end);
      return;
    }
    var start = performance.now();
    function step(now) {
      var p = Math.min(1, (now - start) / 500);
      var eased = 1 - Math.pow(1 - p, 3);
      paint(el, Math.round(end * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function scan(root) {
    if (!root || !root.querySelectorAll) return;
    var nodes = root.querySelectorAll("[data-count]");
    for (var i = 0; i < nodes.length; i++) run(nodes[i]);
  }

  function start() {
    scan(document);
    var observer = new MutationObserver(function (records) {
      for (var i = 0; i < records.length; i++) {
        var added = records[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var node = added[j];
          if (!node || node.nodeType !== 1) continue;
          if (node.hasAttribute && node.hasAttribute("data-count")) run(node);
          scan(node);
        }
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
