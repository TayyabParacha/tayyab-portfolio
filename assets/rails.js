/*
  Faint tech-logo columns in the side margins that move with scrolling.
  Scroll down and they move one way, scroll up and they reverse. Each column
  gets a random logo order, spacing, size, speed and direction on every load.
*/
(function () {
  var ICONS = [
    "python", "django", "fastapi", "flask", "postgresql", "mongodb", "redis",
    "mysql", "sqlite", "docker", "githubactions", "github", "gitlab", "react",
    "javascript", "pandas", "numpy", "pytorch", "huggingface", "scikitlearn",
    "opencv", "jupyter", "selenium", "scrapy", "strapi", "jira"
  ];
  var CONTENT_W = 916;       // must match main's max-width + padding in style.css
  var MIN_GUTTER = 132;      // below this there is no room for a column

  var root = document.createElement("div");
  root.className = "rails";
  root.setAttribute("aria-hidden", "true");
  document.body.insertBefore(root, document.body.firstChild);

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var columns = [];
  var current = window.scrollY, target = current, ticking = false;

  function rand(a, b) { return a + Math.random() * (b - a); }
  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function makeColumn(x, dir) {
    var col = document.createElement("div");
    col.className = "rail-col";
    col.style.left = x + "px";

    var track = document.createElement("div");
    track.className = "rail-track";

    var size = Math.round(rand(24, 38));
    // enough logos that one copy of the loop is taller than the screen
    var names = [], height = 0, pool = [];
    while (height < window.innerHeight * 1.3 || names.length < 8) {
      if (!pool.length) pool = shuffle(ICONS);
      names.push(pool.pop());
      height += size + 103;
    }
    var html = "";
    names.forEach(function (n) {
      var gap = Math.round(rand(56, 150));
      var nudge = Math.round(rand(-14, 14));
      html += '<img src="assets/icons/' + n + '.svg" alt="" style="width:' + size +
        'px;height:' + size + 'px;margin:' + gap + 'px 0 0 ' + nudge + 'px">';
    });
    track.innerHTML = html + html; // duplicated so the loop is seamless
    col.appendChild(track);
    root.appendChild(col);

    return {
      track: track,
      half: 0,
      speed: rand(0.18, 0.6),
      dir: dir,
      phase: rand(0, 2000)
    };
  }

  function build() {
    root.innerHTML = "";
    columns = [];
    var vw = document.documentElement.clientWidth;
    var gutter = (vw - CONTENT_W) / 2;
    if (gutter < MIN_GUTTER) { root.style.display = "none"; return; }
    root.style.display = "block";

    var perSide = gutter >= 360 ? 4 : gutter >= 250 ? 3 : 2;
    var step = gutter / (perSide + 1);
    for (var k = 1; k <= perSide; k++) {
      var jitter = rand(-step * 0.18, step * 0.18);
      var dir = k % 2 === 1 ? 1 : -1;  // neighbouring columns move in opposite directions
      columns.push(makeColumn(step * k + jitter - 17, dir));        // left side, outer to inner
      columns.push(makeColumn(vw - step * k + jitter - 17, -dir));  // right side mirrors it
    }
    measure();
    render(current);
  }

  function measure() {
    columns.forEach(function (c) { c.half = c.track.scrollHeight / 2 || 1; });
  }

  function render(y) {
    columns.forEach(function (c) {
      var travel = ((y * c.speed + c.phase) % c.half + c.half) % c.half;
      var offset = c.dir === 1 ? -travel : travel - c.half; // 1 = moves up as you scroll down
      c.track.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
    });
  }

  function loop() {
    current += (target - current) * 0.12; // gentle easing
    if (Math.abs(target - current) < 0.3) { current = target; ticking = false; }
    render(current);
    if (ticking) requestAnimationFrame(loop);
  }

  window.addEventListener("scroll", function () {
    target = window.scrollY;
    if (reduceMotion) { current = target; return; } // no movement for reduced motion
    if (!ticking) { ticking = true; requestAnimationFrame(loop); }
  }, { passive: true });

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 200);
  });
  window.addEventListener("load", measure);

  build();
})();
