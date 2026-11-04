
function initShift() {
  TICKETS = buildProceduralTickets(5);
  currentTicketId = TICKETS[0].id;
  userTriageDecisions = {};
  taggedIoCs.clear();
  renderQueue();
  renderMailClient();
  renderInspector();
  updateHeaderStats();
}

function advanceShift() {
  closeShiftReportModal();
  currentDay++;
  document.getElementById('statDay').textContent = 'Day ' + currentDay;
  document.getElementById('shiftBadge').textContent = 'Shift Day ' + currentDay + ' · SOC Tier-1 Console';
  document.getElementById('nextDayNum').textContent = currentDay + 1;
  var curRep = document.getElementById('currentShiftReportNum');
  if (curRep) curRep.textContent = currentDay;
  document.getElementById('shiftCompleteBanner').style.display = 'none';
  initShift();
}

function selectTicket(id) {
  currentTicketId = id;
  taggedIoCs.clear();
  renderQueue();
  renderMailClient();
  renderInspector();
}

function proceedToNextTicket() {
  var next = TICKETS.find(function(t){ return t.status === 'pending'; });
  if (next) {
    selectTicket(next.id);
  } else {
    selectTicket(TICKETS[0].id);
  }
}

function switchDrawerTab(tab) {
  currentDrawerTab = tab;
  document.getElementById('tabRaw').className = 'tab-btn' + (tab === 'raw' ? ' active' : '');
  document.getElementById('tabPayload').className = 'tab-btn' + (tab === 'payload' ? ' active' : '');
  renderInspector();
}

function handleTokenHover(ev) {
  var bar = document.getElementById('uriStatusBar');
  if (!bar) return;
  var tok = ev.target.closest('.ioc-token');
  if (!tok) {
    resetUriInspectorBar();
    return;
  }
  bar.classList.add('uri-active');
  var t = getActiveTicket();
  var key = tok.dataset.key;

  if (key === 'link' && tok.dataset.href) {
    var disp = (t.linkDisplay || '').trim();
    var real = (tok.dataset.href || '').trim();
    var hostMatch = real.match(/^https?:\/\/([^\/:?#]+)/i);
    var host = hostMatch ? hostMatch[1] : real;
    var isPuny = host.indexOf('xn--') > -1;
    var mismatch = disp && disp !== real;
    bar.innerHTML = '<span><b>DESTINATION URI:</b> <span style="color:#fff; text-decoration:underline;">' + escapeHtml(real) + '</span></span>' +
      '<span class="uri-pill">' + (isPuny ? 'IDN PUNYCODE: ' + escapeHtml(host) : (mismatch ? 'HOST: ' + escapeHtml(host) : 'DIRECT URI')) + '</span>';
  } else if (key === 'qr' && (t.qrPayload || tok.dataset.href)) {
    var qrUri = t.qrPayload || tok.dataset.href;
    bar.innerHTML = '<span><b>DECODED QR MATRIX URI:</b> <span style="color:#fff; text-decoration:underline;">' + escapeHtml(qrUri) + '</span></span><span class="uri-pill">OPTICAL QR PAYLOAD</span>';
  } else if (key === 'attachment') {
    bar.innerHTML = '<span><b>ATTACHMENT STREAM:</b> <span style="color:#fff;">' + escapeHtml(t.attachment || '') + '</span></span><span class="uri-pill">FILE OBJECT</span>';
  } else if (key === 'from') {
    bar.innerHTML = '<span><b>RFC 5322 FROM ORIGIN:</b> <span style="color:#fff;">' + escapeHtml(t.senderEmail) + '</span></span><span class="uri-pill">HEADER: FROM</span>';
  } else if (key === 'replyto') {
    bar.innerHTML = '<span><b>RFC 5322 REPLY-TO TARGET:</b> <span style="color:#fff;">' + escapeHtml(t.replyTo || '') + '</span></span><span class="uri-pill">HEADER: REPLY-TO</span>';
  } else if (key === 'auth') {
    bar.innerHTML = '<span><b>AUTHENTICATION TELEMETRY:</b> <span style="color:#fff;">' + escapeHtml(t.authSummary) + '</span></span><span class="uri-pill">SPF / DKIM / DMARC</span>';
  } else {
    bar.innerHTML = '<span><b>ARTIFACT TOKEN [' + escapeHtml(key.toUpperCase()) + ']:</b> Click to tag or untag as an Indicator of Compromise (IoC).</span><span class="uri-pill">CLICK TO TAG</span>';
  }
}

function handleTokenClick(ev) {
  var clientCol = document.getElementById('clientColumn');
  if (clientCol.classList.contains('triage-locked')) return;

  var tok = ev.target.closest('.ioc-token');
  if (!tok) return;
  ev.preventDefault();

  var k = tok.dataset.key;
  if (taggedIoCs.has(k)) {
    taggedIoCs.delete(k);
  } else {
    taggedIoCs.add(k);
  }

  syncTaggedDOMTokens();
  updateIoCCounter();
}

function resolveTriage(userSaidPhish, explicitCat) {
  var t = getActiveTicket();
  var catSelect = document.getElementById('attackCategorySelect');
  var selectedCat = explicitCat || (catSelect ? catSelect.value : '');

  if (userSaidPhish && !selectedCat) {
    return;
  }

  var isVerdictCorrect = userSaidPhish === t.isPhishing;
  var isCategoryCorrect = !t.isPhishing ? (selectedCat === 'CLEAN') : (selectedCat === t.attackCategory);
  
  var taggedGoodFlags = 0;
  var taggedFalseAlarms = 0;
  taggedIoCs.forEach(function(k){
    if (t.flags[k]) {
      if (t.flags[k][1] === 1) taggedGoodFlags++;
      else taggedFalseAlarms++;
    }
  });

  var overallCorrect = false;
  if (t.isPhishing) {
    if (userSaidPhish && isCategoryCorrect && taggedGoodFlags >= 1) {
      overallCorrect = true;
    }
  } else {
    if (!userSaidPhish && taggedFalseAlarms === 0) {
      overallCorrect = true;
    }
  }

  t.status = userSaidPhish ? 'quarantined' : 'clean';
  userTriageDecisions[t.id] = {
    isPhish: userSaidPhish,
    chosenCategory: selectedCat,
    correct: overallCorrect,
    verdictCorrect: isVerdictCorrect,
    categoryCorrect: isCategoryCorrect,
    taggedCount: taggedGoodFlags,
    falseAlarmCount: taggedFalseAlarms
  };

  totalTriagedLifetime++;
  if (overallCorrect) totalCorrectLifetime++;

  renderQueue();
  renderMailClient();
  renderInspector();
  updateHeaderStats();

  var allDone = TICKETS.every(function(item){ return item.status !== 'pending'; });
  if (allDone) {
    setTimeout(openShiftReportModal, 450);
  }
}

function openShiftReportModal() {
  var modal = document.getElementById('shiftReportModal');
  var shiftCorrect = 0;
  var rowsHtml = TICKETS.map(function(t) {
    var dec = userTriageDecisions[t.id] || {};
    if (dec.correct) shiftCorrect++;
    var truthLabel = t.isPhishing ? t.attackCategory : 'CLEAN';
    var userLabel = dec.chosenCategory || (dec.isPhish ? 'ESCALATED' : 'CLEAN');
    var badge = dec.correct
      ? '<span class="badge badge-clean">VERIFIED</span>'
      : '<span class="badge badge-quarantined">DISCREPANCY</span>';
    return `
      <tr>
        <td style="font-family:var(--font-mono); color:var(--text-muted);">${t.id}</td>
        <td style="color:#fff; font-weight:500;">${escapeHtml(t.subject.slice(0, 44))}${t.subject.length > 44 ? '…' : ''}</td>
        <td style="font-family:var(--font-mono); font-size:0.74rem;">${truthLabel}</td>
        <td style="font-family:var(--font-mono); font-size:0.74rem;">${userLabel}</td>
        <td>${badge}</td>
      </tr>
    `;
  }).join('');

  document.getElementById('modalShiftTitle').textContent = 'Shift Day ' + currentDay + ' — Post-Shift Handover Report';
  var scoreBadge = document.getElementById('modalShiftScoreBadge');
  scoreBadge.textContent = shiftCorrect + ' / ' + TICKETS.length + ' Accurate';
  scoreBadge.className = 'badge ' + (shiftCorrect >= 4 ? 'badge-clean' : 'badge-pending');

  var accPct = Math.round((shiftCorrect / TICKETS.length) * 100);
  document.getElementById('modalShiftBody').innerHTML = `
    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:16px;">
      <div class="intel-card" style="margin:0;">
        <div style="font-size:0.72rem; color:var(--text-dim); font-family:var(--font-mono);">SHIFT ACCURACY</div>
        <div style="font-size:1.3rem; font-weight:700; color:#fff; margin-top:4px;">${accPct}%</div>
      </div>
      <div class="intel-card" style="margin:0;">
        <div style="font-size:0.72rem; color:var(--text-dim); font-family:var(--font-mono);">VERIFIED CALLS</div>
        <div style="font-size:1.3rem; font-weight:700; color:var(--status-green); margin-top:4px;">${shiftCorrect} / ${TICKETS.length}</div>
      </div>
      <div class="intel-card" style="margin:0;">
        <div style="font-size:0.72rem; color:var(--text-dim); font-family:var(--font-mono);">LIFETIME TRIAGED</div>
        <div style="font-size:1.3rem; font-weight:700; color:var(--accent-blue); margin-top:4px;">${totalTriagedLifetime}</div>
      </div>
    </div>
    <table class="handover-table">
      <thead>
        <tr>
          <th>Ticket</th>
          <th>Artifact Subject</th>
          <th>Ground Truth</th>
          <th>Analyst Call</th>
          <th>Outcome</th>
        </tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
    </table>
  `;
  modal.classList.add('open');
}

function closeShiftReportModal() {
  document.getElementById('shiftReportModal').classList.remove('open');
}

document.addEventListener('click', function(ev) {
  if (ev.target.closest('#artifactViewport') || ev.target.closest('#drawerContent')) {
    handleTokenClick(ev);
  }
});

document.addEventListener('mouseover', function(ev) {
  if (ev.target.closest('#artifactViewport') || ev.target.closest('#drawerContent')) {
    handleTokenHover(ev);
  }
});

// Boot the initial shift
initShift();
