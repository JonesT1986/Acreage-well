/* AcreageWell cookieless tracking. No cookies, no fingerprinting, no PII.
   Logs two event types to your endpoint:
     e:"view"       -> a page was viewed        {e,p,r,t}
     e:"call_click" -> a Call button was tapped {e,p,num,t}
   'p' = page path (which town), 'num' = number tapped (which operator/territory),
   't' = timestamp, 'r' = referrer host. Aggregate call_click by 'num' for a
   per-territory demand heatmap. NOTE: a tap is call INTENT, not a completed call.
   Set ENDPOINT to your n8n/Vercel logger to turn tracking on; blank = off. */
(function () {
  var ENDPOINT = ""; // e.g. "https://towniq.app.n8n.cloud/webhook/aw-hit"
  if (!ENDPOINT) return;
  function send(ev) {
    try { navigator.sendBeacon(ENDPOINT, JSON.stringify(ev)); } catch (e) {}
  }
  // page view
  send({
    e: "view",
    p: location.pathname,
    r: document.referrer ? new URL(document.referrer).hostname : "",
    t: Date.now()
  });
  // call intent: capture taps on any tel: link (survives the dialer handoff via sendBeacon)
  document.addEventListener("click", function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href^="tel:"]') : null;
    if (!a) return;
    send({
      e: "call_click",
      p: location.pathname,
      num: a.getAttribute("href").replace("tel:", ""),
      t: Date.now()
    });
  }, true);
})();
