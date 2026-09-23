/**
 * Patches compiled SPA copy that this deploy repo cannot regenerate.
 * Contact truth: +91 9152727387, info@theaccessoryconsultant.com.
 * Owner-confirmed offer: MOQ from 50 units per design, about 18-day
 * CAD-to-delivery, NDAs for private label and OEM.
 * Case-study highlights are left unchanged.
 */
(function () {
  var PHONE_FROM = "+91 (0) 123 456 7890";
  var PHONE_TO = "+91 9152727387";
  var EMAIL_FROM = "info@jewelcraft.com";
  var EMAIL_TO = "info@theaccessoryconsultant.com";

  var PHRASES = [
    ["NDA available on request", "NDAs are available for private-label and OEM programs"],
    [
      "Free consultation · NDA available · MOQ from 50 units",
      "Free consultation · NDAs for private label and OEM · MOQ from 50 units per design",
    ],
    [
      "Our minimum order quantity varies by product type, starting as low as 50 pieces for silver jewelry and 25 pieces for gold jewelry, making us perfect for startups and small businesses.",
      "MOQ starts from 50 units. Exact MOQ can depend on style complexity, materials, and stones; we confirm this when quoting.",
    ],
    [
      "Production timelines range from 2-4 weeks for simple designs to 6-8 weeks for complex custom pieces, including sample approval and quality control processes.",
      "Typical CAD-to-delivery is about 18 days. Timelines depend on design complexity, materials, stones, sampling revisions, and order size. International shipping time to the US (or other countries) is separate from factory CAD-to-delivery and is confirmed once destination and method are known.",
    ],
    [
      "Production timelines vary based on complexity, quantity, and material requirements.",
      "About 18 days from CAD to delivery.",
    ],
    [
      "Flexible minimum order quantities accommodating both small startups and large enterprises.",
      "MOQ from 50 units per design.",
    ],
    ["MOQ 50 units, delivery in as few as 18 days", "MOQ from 50 units per design, about 18-day CAD-to-delivery"],
    ["MOQ 50 units, turnaround in as few as 18 days", "MOQ from 50 units per design, about 18-day CAD-to-delivery"],
    ["MOQ 50 units, 18-day turnaround", "MOQ from 50 units per design, about 18-day CAD-to-delivery"],
  ];

  function patchText(node) {
    var value = node.nodeValue;
    if (!value) return;
    var next = value.split(PHONE_FROM).join(PHONE_TO).split(EMAIL_FROM).join(EMAIL_TO);
    for (var i = 0; i < PHRASES.length; i++) {
      if (next.indexOf(PHRASES[i][0]) !== -1) next = next.split(PHRASES[i][0]).join(PHRASES[i][1]);
    }
    next = next.replace(/MOQ from 50 units(?! per design)/g, "MOQ from 50 units per design");
    if (next !== value) node.nodeValue = next;
  }

  function setText(el, value) {
    if (!el || el.textContent === value) return;
    el.textContent = value;
  }

  function alignClaims(scope) {
    var root = scope && scope.querySelectorAll ? scope : document;

    var moqCards = root.querySelectorAll('[data-testid="spec-minimum-order"] .font-medium');
    for (var i = 0; i < moqCards.length; i++) setText(moqCards[i], "50 units");

    var moqStats = root.querySelectorAll('[data-testid="capability-moq"]');
    for (var m = 0; m < moqStats.length; m++) {
      setText(moqStats[m].querySelector(".text-5xl"), "50");
      setText(moqStats[m].querySelector("p"), "Units per design");
    }

    var turnarounds = root.querySelectorAll('[data-testid="capability-turnaround"]');
    for (var t = 0; t < turnarounds.length; t++) {
      setText(turnarounds[t].querySelector(".text-5xl"), "~18");
      setText(turnarounds[t].querySelector("p"), "Days, CAD-to-delivery");
    }

    var timelines = root.querySelectorAll('[data-testid="spec-production-time"] .flex');
    for (var r = 0; r < timelines.length; r++) {
      var label = timelines[r].querySelector(".text-muted-foreground");
      var value = timelines[r].querySelector(".font-medium");
      if (!label || !value) continue;
      var name = label.textContent.trim();
      if (name === "Small Orders" || name === "Large Orders") setText(value, "~18 days");
    }

    var batches = root.querySelectorAll("[data-testid^='timeline-']");
    for (var b = 0; b < batches.length; b++) {
      setText(batches[b].querySelector(".text-3xl"), "~18");
      var unit = batches[b].querySelector(".text-sm");
      if (unit && (unit.textContent === "Weeks" || unit.textContent === "Timeline")) setText(unit, "Days");
    }
  }

  function needsPatch(text) {
    if (!text) return false;
    if (text.indexOf("123 456 7890") !== -1 || text.indexOf("jewelcraft.com") !== -1) return true;
    if (text.indexOf("NDA available") !== -1 || text.indexOf("MOQ from 50 units") !== -1) return true;
    if (text.indexOf("MOQ 50 units") !== -1 || text.indexOf("25 pieces for gold") !== -1) return true;
    if (text.indexOf("2-4 weeks") !== -1 || text.indexOf("6-8 weeks") !== -1) return true;
    if (text.indexOf("Flexible minimum order") !== -1) return true;
    if (text.indexOf("Production timelines vary") !== -1) return true;
    return false;
  }

  function patchTree(root) {
    if (!root) return;
    if (root.nodeType === 3) {
      patchText(root);
      return;
    }
    if (root.nodeType !== 1) return;
    var text = root.textContent || "";
    if (!needsPatch(text) && !root.querySelector("[data-testid='spec-minimum-order'], [data-testid='capability-moq'], [data-testid='capability-turnaround'], [data-testid='spec-production-time'], [data-testid^='timeline-']")) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) patchText(node);
    alignClaims(root);
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
      alignClaims(document.body);
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
