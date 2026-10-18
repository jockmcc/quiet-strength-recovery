(() => {
  'use strict';
  let timer = null, remaining = 120, deadline = 0;
  function stop() { clearInterval(timer); timer = null; }
  function screen(family = false) {
    stop(); remaining = 120;
    return `<main class="support-now-page"><a class="btn secondary" href="#home">← Back to my app</a><header class="support-now-heading"><div class="eyebrow">${family ? 'Quiet Sisters Recovery' : 'Quiet Strength Recovery'}</div><h1>Support me now.</h1><p>You do not have to solve everything in this moment. Choose one small step that feels useful.</p></header><a class="support-emergency" href="#urgent"><strong>Need urgent human help?</strong><span>Open emergency and crisis contacts. You do not need a passcode.</span></a><section class="support-now-grid"><article class="card"><div class="eyebrow">01 · Come back to the room</div><h2>Notice what is around you.</h2><p>If it feels comfortable, rest your feet on the floor. Look around and name:</p><ol class="grounding-list"><li><strong>5</strong> things you can see</li><li><strong>4</strong> things you can feel</li><li><strong>3</strong> things you can hear</li><li><strong>2</strong> things you can smell</li><li><strong>1</strong> thing you can taste, or one kind sentence to yourself</li></ol><p class="small-note">Skip anything that does not feel helpful. You can keep your eyes open and breathe normally.</p></article><article class="card"><div class="eyebrow">02 · Make a little space</div><h2>${family ? 'Pause before responding.' : 'Give the next choice some time.'}</h2><p>${family ? 'You can give yourself a moment before a difficult conversation or decision.' : 'If an urge is pulling at you, try a short pause and reach towards support.'}</p><div class="support-timer" id="supportTimer" role="timer" aria-label="Two-minute pause" aria-live="off">2:00</div><div class="toolbar"><button class="btn" id="supportTimerStart" type="button">Start two-minute pause</button><button class="btn secondary" id="supportTimerReset" type="button">Reset</button></div><p id="supportTimerMessage" role="status">You can stop whenever you need to.</p></article><article class="card"><div class="eyebrow">03 · Reach towards someone</div><h2>You can ask for company.</h2><p>Try: “I'm having a difficult moment. Could you stay with me or talk for a few minutes?”</p><div class="toolbar"><a class="btn" href="#support">My private support map</a><a class="btn secondary" href="#resources">Support & meetings</a></div><p class="small-note">Your personal map stays behind your passcode. This app does not contact anyone automatically.</p></article><article class="card"><div class="eyebrow">04 · One useful next step</div><h2>Keep it small.</h2><p>${family ? 'Find a comfortable place, step away from an argument if safe, or contact somebody who supports you.' : 'Move to a comfortable place, get a glass of water, or contact somebody who supports your recovery.'}</p><div class="toolbar"><a class="btn secondary" href="${family ? '#sos' : '#grounding'}">More grounding tools</a><a class="btn secondary" href="${family ? '#scripts' : '#urges'}">${family ? 'Find words for a boundary' : 'Open my urge tool'}</a></div></article></section><p class="support-now-note">These are optional tools from lived experience. In immediate danger or a medical emergency, use emergency services rather than waiting for a timer.</p>${family ? '<button class="quick-exit" id="supportQuickExit" type="button">Quick Exit</button>' : ''}</main>`;
  }
  function bind(root) {
    const display = root.querySelector('#supportTimer');
    const start = root.querySelector('#supportTimerStart');
    const message = root.querySelector('#supportTimerMessage');
    const paint = () => { display.textContent = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`; };
    start?.addEventListener('click', () => {
      if (timer) { remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000)); stop(); paint(); start.textContent = 'Continue pause'; message.textContent = 'Paused. Take this at your own pace.'; return; }
      if (!remaining) remaining = 120;
      deadline = Date.now() + remaining * 1000;
      start.textContent = 'Pause timer'; message.textContent = 'There is no task to complete. Notice the room, or reach out to someone.';
      timer = setInterval(() => {
        remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000)); paint();
        if (!remaining) { stop(); start.textContent = 'Start again'; message.textContent = 'The pause has finished. What is one safe, useful next step?'; }
      }, 250);
    });
    root.querySelector('#supportTimerReset')?.addEventListener('click', () => { stop(); remaining = 120; paint(); start.textContent = 'Start two-minute pause'; message.textContent = 'You can stop whenever you need to.'; });
  }
  window.QSRSupport = { screen, bind, stop };
})();
