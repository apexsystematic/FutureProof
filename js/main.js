/* ═══════════════════════════════════════════
   CONTACT FORM HANDLER
════════════════════════════════════════════ */
(function(){
  var WEBHOOK_URL = 'https://hook.eu1.make.com/f67xuhtcyao2zm5dv4588bkgt5abr0od';

  document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    var btn = this.querySelector('button[type="submit"]');
    var statusEl = document.getElementById('contactFormStatus');
    var token = document.querySelector('[name="cf-turnstile-response"]');

    if (!token || !token.value) {
      statusEl.textContent = 'Please complete the security check.';
      statusEl.style.color = '#e74c3c';
      return;
    }

    var payload = {
      firstName: document.getElementById('fname').value.trim(),
      lastName:  document.getElementById('lname').value.trim(),
      email:     document.getElementById('email').value.trim(),
      message:   document.getElementById('message').value.trim(),
      source:    'homepage-contact',
      turnstileToken: token.value
    };

    btn.disabled = true;
    btn.textContent = 'Sending...';
    statusEl.textContent = '';

    try {
      var res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        statusEl.textContent = "Message sent. We'll respond within one business day.";
        statusEl.style.color = '#2ecc71';
        this.reset();
        turnstile.reset();
        plausible('Contact Form Submitted');
      } else {
        throw new Error('bad response');
      }
    } catch(err) {
      statusEl.textContent = 'Something went wrong. Please email us directly.';
      statusEl.style.color = '#e74c3c';
      turnstile.reset();
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send Message \u2192';
    }
  });
})();


/* ═══════════════════════════════════════════
   BURGER MENU · SCROLL ANIMATIONS · SAMPLE REPORT TABS & SCORES
════════════════════════════════════════════ */
(function(){

  /* ── BURGER MENU ── */
  var btn    = document.getElementById('hamburger');
  var menu   = document.getElementById('mobileMenu');
  var closer = document.getElementById('mobileClose');

  function openNav(){
    if(!menu) return;
    menu.style.display='flex';
    setTimeout(function(){ menu.style.opacity='1'; },10);
    if(btn) btn.classList.add('open');
    document.body.style.overflow='hidden';
  }
  function closeNav(){
    if(!menu) return;
    menu.style.opacity='0';
    if(btn) btn.classList.remove('open');
    document.body.style.overflow='';
    setTimeout(function(){ menu.style.display='none'; },300);
  }
  if(btn){ btn.addEventListener('click',function(){ (menu.style.opacity==='1')?closeNav():openNav(); }); }
  if(closer) closer.addEventListener('click',closeNav);
  document.querySelectorAll('.mobile-link').forEach(function(l){ l.addEventListener('click',closeNav); });

  /* ── SCROLL ANIMATIONS ── */
  function initAnims(){
    var sel='.what-card,.score-card,.highlight-box,.process-step,.price-card,.cred-card,.faq-item';
    var els=document.querySelectorAll(sel);
    if(!window.IntersectionObserver){
      els.forEach(function(el){ el.style.opacity='1'; el.style.transform='none'; });
      return;
    }
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.style.opacity='1';
          e.target.style.transform='translateY(0)';
          io.unobserve(e.target);
        }
      });
    },{threshold:0.1});
    els.forEach(function(el){
      el.style.opacity='0';
      el.style.transform='translateY(20px)';
      el.style.transition='opacity 0.6s ease, transform 0.6s ease';
      io.observe(el);
    });
  }
  (document.readyState==='loading')?document.addEventListener('DOMContentLoaded',initAnims):initAnims();

  /* ── SAMPLE REPORT: TABS ── */
  function initSampleTabs(){
    var tabs  = document.querySelectorAll('.smp-tab');
    var pages = document.querySelectorAll('.smp-page');

    if(!tabs.length) return;

    tabs.forEach(function(btn){
      btn.addEventListener('click', function(){
        var id = btn.getAttribute('data-tab');
        tabs.forEach(function(b){ b.classList.remove('active'); });
        pages.forEach(function(p){ p.classList.remove('active'); });
        btn.classList.add('active');
        var target = document.getElementById('smp-' + id);
        if(target) target.classList.add('active');
        if(id === 'scores') animateScores();
      });
    });
  }

  /* ── SAMPLE REPORT: SCORE ANIMATION ── */
  function animateScores(){
    countUp('smp-dri', 22, 1100);
    countUp('smp-prs', 55, 1100);
    setTimeout(function(){
      var db = document.getElementById('smp-dri-bar');
      var pb = document.getElementById('smp-prs-bar');
      if(db) db.style.width = '22%';
      if(pb) pb.style.width = '55%';
    }, 80);
  }

  function countUp(id, target, duration){
    var el = document.getElementById(id);
    if(!el) return;
    el.textContent = '0';
    var start = null;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(e * target);
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ── TRIGGER ON SCROLL INTO VIEW ── */
  function initScoreObserver(){
    if(!window.IntersectionObserver) { animateScores(); return; }
    var fired = false;
    var scoreSection = document.getElementById('smp-scores');
    if(!scoreSection) return;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting && !fired){
          fired = true;
          animateScores();
        }
      });
    }, { threshold: 0.3 });
    io.observe(scoreSection);
  }

  /* ── INIT ALL ── */
  function initSample(){
    initSampleTabs();
    initScoreObserver();
  }
  (document.readyState==='loading')?document.addEventListener('DOMContentLoaded',initSample):initSample();

})();


/* ═══════════════════════════════════════════
   FUTUREPROOF CHAT WIDGET
════════════════════════════════════════════ */
(function(){
  var FP_ENDPOINT = 'https://futureproof-webchatbot.apexsystematic.workers.dev';

  var WELCOME = 'Welcome. I\'m here to help you understand FutureProof and whether it\'s right for you.\n\nMost professionals know their job title\'s AI risk. That\'s almost useless — two people with the same title can have completely different exposure profiles based on what they actually do every day.\n\nFutureProof gives you your personal number.\n\nGet your free score in two minutes at futureproof.report — no email required. Or ask me anything.';

  var history = [];
  var isOpen = false;
  var isLoading = false;
  var summaryTimer = null;
  var SUMMARY_DELAY = 5 * 60 * 1000; // 5 minutes

  var panel     = document.getElementById('fp-panel');
  var launcher  = document.getElementById('fp-launcher');
  var closeBtn  = document.getElementById('fp-close');
  var msgs      = document.getElementById('fp-messages');
  var quickbar  = document.getElementById('fp-quickbar');
  var input     = document.getElementById('fp-input');
  var sendBtn   = document.getElementById('fp-send');
  var statusTxt = document.getElementById('fp-status-text');

  function addMsg(role, text) {
    var d = document.createElement('div');
    d.className = 'fp-msg fp-' + role;
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    var t = document.createElement('div');
    t.id = 'fp-typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(t);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function removeTyping() {
    var t = document.getElementById('fp-typing');
    if (t) t.remove();
  }

  function setLoading(val) {
    isLoading = val;
    sendBtn.disabled = val;
    statusTxt.textContent = val ? 'Thinking\u2026' : 'Online';
  }

  function sendMessage(text) {
    text = (text || input.value).trim();
    if (!text || isLoading) return;
    if (quickbar) quickbar.style.display = 'none';
    addMsg('user', text);
    history.push({ role: 'user', content: text });
    input.value = '';
    input.style.height = 'auto';
    setLoading(true);
    showTyping();
    fetch(FP_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history })
    })
    .then(function(res) {
      if (!res.ok) throw new Error('status ' + res.status);
      return res.json();
    })
    .then(function(data) {
      var reply = (data && data.content && data.content[0] && data.content[0].text)
        ? data.content[0].text
        : 'Something went wrong. Please try again.';
      removeTyping();
      addMsg('assistant', reply);
      history.push({ role: 'assistant', content: reply });
      // Reset inactivity timer — fires summary after 5 min of silence
      clearTimeout(summaryTimer);
      summaryTimer = setTimeout(function() {
        console.log('Summary timer fired. History length:', history.length);
        if (history.length > 0) {
          console.log('Sending to:', FP_ENDPOINT + '/summary');
          fetch(FP_ENDPOINT + '/summary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conversation: history })
          })
          .then(function(res) { console.log('Summary response status:', res.status); return res.json(); })
          .then(function(data) { console.log('Summary response:', data); })
          .catch(function(err) { console.error('Summary fetch error:', err); });
        }
      }, SUMMARY_DELAY);
    })
    .catch(function() {
      removeTyping();
      var e = document.createElement('div');
      e.className = 'fp-error';
      e.textContent = 'Connection error. Please try again.';
      msgs.appendChild(e);
    })
    .finally(function() { setLoading(false); });
  }

  launcher.addEventListener('click', function() {
    isOpen = !isOpen;
    panel.classList.toggle('fp-open', isOpen);
    if (isOpen && msgs.children.length === 0) addMsg('assistant', WELCOME);
    if (isOpen) setTimeout(function(){ input.focus(); }, 280);
  });

  closeBtn.addEventListener('click', function() {
    isOpen = false;
    panel.classList.remove('fp-open');
  });

  sendBtn.addEventListener('click', function() { sendMessage(); });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  input.addEventListener('input', function() {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 80) + 'px';
  });

  // Show nudge after 15 seconds if chat hasn't been opened
  var nudge = document.getElementById('fp-nudge');
  var nudgeTimer = setTimeout(function() {
    if (!isOpen) nudge.classList.add('fp-nudge-visible');
  }, 15000);

  // Hide nudge when launcher is clicked
  launcher.addEventListener('click', function() {
    nudge.classList.remove('fp-nudge-visible');
    clearTimeout(nudgeTimer);
  });

  if (quickbar) {
    quickbar.addEventListener('click', function(e) {
      var btn = e.target.closest('.fp-quick');
      if (btn) sendMessage(btn.dataset.q);
    });
  }
})();
