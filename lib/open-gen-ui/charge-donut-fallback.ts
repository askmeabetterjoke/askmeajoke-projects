/** Runs inside the websandbox iframe when Chart.js init never executed. */
export const CHARGE_STATUS_DONUT_FALLBACK = `(function studioChargeDonutFallback(){
  var canvas = document.querySelector("canvas");
  if (!canvas) return;
  if (typeof Chart !== "undefined") {
    try { if (Chart.getChart(canvas)) return; } catch (e) {}
  }
  var ctx = canvas.getContext("2d");
  if (!ctx) return;
  if (!canvas.style.minHeight) canvas.style.minHeight = "220px";
  var w = canvas.width = canvas.clientWidth || 320;
  var h = canvas.height = canvas.clientHeight || 220;
  var cx = w / 2;
  var cy = h / 2 + 6;
  var r = Math.min(w, h) * 0.32;
  var ir = r * 0.58;
  var slices = [
    { v: 62, c: "#111318" },
    { v: 14, c: "#6b7280" },
    { v: 8, c: "#9ca3af" },
    { v: 16, c: "#d1d5db" }
  ];
  var total = slices.reduce(function (a, s) { return a + s.v; }, 0);
  var start = -Math.PI / 2;
  ctx.clearRect(0, 0, w, h);
  slices.forEach(function (s) {
    var ang = (s.v / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, start, start + ang);
    ctx.arc(cx, cy, ir, start + ang, start, true);
    ctx.closePath();
    ctx.fillStyle = s.c;
    ctx.fill();
    start += ang;
  });
  var labels = ["Approved", "Pending", "Flagged", "Over-Limit"];
  ctx.font = "11px system-ui,sans-serif";
  ctx.fillStyle = "#374151";
  var lx = 12;
  var ly = h - 52;
  slices.forEach(function (s, i) {
    ctx.fillStyle = s.c;
    ctx.fillRect(lx, ly, 10, 10);
    ctx.fillStyle = "#374151";
    ctx.fillText(labels[i] + " " + s.v + "%", lx + 14, ly + 9);
    ly += 14;
  });
})();`;
