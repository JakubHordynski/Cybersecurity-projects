
function sanitizeHopStatus(rawStatus, proto) {
  if (!rawStatus) return '250 2.0.0 OK';
  var p = (proto || '').toUpperCase();
  if (p.indexOf('SMPP') > -1 || p.indexOf('MDM') > -1) return 'SMPP_DELIVER_SM_OK';
  if (p.indexOf('SIP') > -1 || p.indexOf('SCCP') > -1 || p.indexOf('PBX') > -1) return 'SIP_200_OK_RTP';
  return '250 2.0.0 OK (Queued)';
}

function renderQueue() {
  var list = document.getElementById('queueList');
  list.innerHTML = TICKETS.map(function(t) {
    var isActive = t.id === currentTicketId;
    var statusBadge = '';
    if (t.status === 'pending') {
      statusBadge = '<span class="badge badge-pending">Pending</span>';
    } else if (t.status === 'quarantined') {
      statusBadge = '<span class="badge badge-quarantined">Escalated</span>';
    } else {
      statusBadge = '<span class="badge badge-clean">Closed Clean</span>';
    }

    var sevClass = t.severity === 'HIGH' ? 'badge-sev-high' : 'badge-sev-med';

    return `
      <li class="queue-item ${isActive ? 'active' : ''}" onclick="selectTicket('${t.id}')">
        <div class="queue-item-meta">
          <span class="queue-ticket-id">${t.id}</span>
          <span class="badge ${sevClass}">SEV-${t.severity}</span>
        </div>
        <div class="queue-item-subj">${t.subject}</div>
        <div class="queue-item-sender">${t.senderDisplay}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
          <span class="badge" style="background:rgba(255,255,255,0.05); color:var(--text-muted); font-size:0.65rem;">${t.channel}</span>
          ${statusBadge}
        </div>
      </li>
    `;
  }).join('');

  var allDone = TICKETS.every(function(t){ return t.status !== 'pending'; });
  var curRep = document.getElementById('currentShiftReportNum');
  if (curRep) curRep.textContent = currentDay;
  document.getElementById('shiftCompleteBanner').style.display = allDone ? 'block' : 'none';
}

function renderMailClient() {
  var t = getActiveTicket();
  var isResolved = t.status !== 'pending';

  document.getElementById('activeTicketId').textContent = t.id;
  document.getElementById('activeSevBadge').textContent = 'SEV-' + t.severity;
  document.getElementById('activeSevBadge').className = 'badge ' + (t.severity === 'HIGH' ? 'badge-sev-high' : 'badge-sev-med');
  document.getElementById('activeVectorBadge').textContent = t.channel;
  document.getElementById('activeReporterMeta').textContent = 'Reported by: ' + t.reporter;

  var container = document.getElementById('artifactViewport');

  var headerCard = `
    <div class="mail-headers-card">
      <div class="hdr-k">SOURCE:</div>
      <div class="hdr-v">${t.senderDisplay} &lt;<span class="ioc-token" data-key="from">${t.senderEmail}</span>&gt;</div>

      ${t.replyTo ? `
        <div class="hdr-k">REPLY-TO:</div>
        <div class="hdr-v"><span class="ioc-token" data-key="replyto">${t.replyTo}</span></div>
      ` : ''}

      <div class="hdr-k">TARGET:</div>
      <div class="hdr-v">${t.to}</div>

      <div class="hdr-k">SECURITY:</div>
      <div class="hdr-v"><span class="ioc-token" data-key="auth">${t.authSummary}</span></div>

      <div class="hdr-k">TIMESTAMP:</div>
      <div class="hdr-v">${t.date}</div>
    </div>
  `;

  var bodyHTML = t.bodyParagraphs.map(function(p) {
    return `<p><span class="ioc-token" data-key="body">${p}</span></p>`;
  }).join('');

  if (t.qrPayload) {
    bodyHTML += `
      <div style="margin:20px 0; text-align:center;">
        <div class="ioc-token" data-key="qr" data-href="${t.qrPayload}" style="display:inline-block; background:#fff; padding:16px; border-radius:10px; border:2px solid var(--border-line);">
          <div style="width:130px; height:130px; background:repeating-linear-gradient(45deg, #000, #000 10px, #fff 10px, #fff 20px); border:4px solid #000; display:grid; place-items:center;">
            <span style="background:#000; color:#fff; font-family:var(--font-mono); font-size:0.65rem; padding:4px;">[ QR CODE ]</span>
          </div>
          <div style="font-family:var(--font-mono); font-size:0.7rem; color:#000; margin-top:6px; font-weight:600;">
            SCAN WITH AUTHENTICATOR (HOVER TO DECODE URI)
          </div>
        </div>
      </div>
    `;
  }

  if (t.linkDisplay) {
    var resolvedUrl = t.linkTarget || t.linkDisplay;
    bodyHTML += `
      <p style="margin:18px 0;">
        <a href="${escapeHtml(resolvedUrl)}" class="ioc-token" data-key="link" data-href="${escapeHtml(resolvedUrl)}" style="color:var(--accent-blue); text-decoration:none; font-weight:600; display:inline-flex; align-items:center; gap:6px; padding:4px 8px; background:rgba(59,130,246,0.08); border-radius:4px;">
          <span>🔗 ${escapeHtml(t.linkDisplay)}</span>
          <span style="font-size:0.75rem; opacity:0.8;">↗</span>
        </a>
      </p>
    `;
  }

  if (t.attachment) {
    bodyHTML += `
      <div class="attachment-card ioc-token" data-key="attachment" data-href="Attachment Payload: ${t.attachment}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        <span>${t.attachment}</span>
      </div>
    `;
  }

  if (t.threadQuote) {
    bodyHTML += `
      <div class="thread-history">
        <div class="thread-history-meta">${escapeHtml(t.threadQuote.meta)}</div>
        <div>${escapeHtml(t.threadQuote.text)}</div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="mail-subject-banner"><span class="ioc-token" data-key="subject">${t.subject}</span></div>
    ${headerCard}
    <div class="mail-body-content">
      ${bodyHTML}
      <div class="mail-signature">${t.signature ? t.signature.replace(/\n/g, '<br>') : ''}</div>
      <div class="mail-disclaimer">${t.disclaimer || ''}</div>
    </div>
    <div id="postMortemContainer"></div>
  `;

  var clientCol = document.getElementById('clientColumn');

  if (isResolved) {
    clientCol.classList.add('triage-locked');
    renderPostMortem();
    document.getElementById('decisionActionGroup').innerHTML = `
      <button class="btn btn-primary" onclick="proceedToNextTicket()">
        Next Ticket in Queue →
      </button>
    `;
    document.getElementById('decisionStatusLabel').textContent = 'Incident ticket triaged and closed.';
  } else {
    clientCol.classList.remove('triage-locked');
    document.getElementById('postMortemContainer').innerHTML = '';
    document.getElementById('decisionActionGroup').innerHTML = `
      <button class="btn btn-clean" id="btnMarkClean" onclick="resolveTriage(false, 'CLEAN')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        Mark as Benign (Clean)
      </button>
      <div style="display:flex; gap:6px; align-items:center;">
        <select id="attackCategorySelect" onchange="updateIoCCounter()" style="background:#090e17; border:1px solid var(--border-line); border-radius:6px; color:#fff; font-family:inherit; font-size:0.8rem; padding:8px;">
          <option value="">-- Select Attack Type --</option>
          <option value="SPEAR_PHISHING">Spear Phishing / BEC</option>
          <option value="MASS_PHISHING">Mass Phishing</option>
          <option value="QUISHING">Quishing (QR-Code)</option>
          <option value="SMISHING">Smishing (SMS Phishing)</option>
          <option value="VISHING">Vishing (Voice Phishing)</option>
        </select>
        <button class="btn btn-phish" id="btnEscalatePhish" disabled onclick="resolveTriage(true)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Escalate Threat (IoC)
        </button>
      </div>
    `;
    updateIoCCounter();
  }

  syncTaggedDOMTokens();
  resetUriInspectorBar();
}

function resetUriInspectorBar() {
  var bar = document.getElementById('uriStatusBar');
  if (!bar) return;
  bar.classList.remove('uri-active');
  bar.innerHTML = '<span><b>URI &amp; HEADER INSPECTOR:</b> Hover over any link, QR code, attachment, or header token (middle or right panel) to inspect destination &amp; click to tag IoC.</span><span class="uri-pill">IDLE</span>';
}

function syncTaggedDOMTokens() {
  document.querySelectorAll('.ioc-token').forEach(function(tok) {
    var k = tok.dataset.key;
    if (taggedIoCs.has(k)) {
      tok.classList.add('tagged');
    } else {
      tok.classList.remove('tagged');
    }
  });
}

function updateIoCCounter() {
  var count = taggedIoCs.size;
  var catSelect = document.getElementById('attackCategorySelect');
  var hasCategorySelected = catSelect && catSelect.value !== '';

  var statusMsg = `Tagged IoCs: <b>${count}</b>`;
  if (count === 0 && !hasCategorySelected) {
    statusMsg += ' (Tag ≥1 IoC and select Attack Type to escalate)';
  } else if (count === 0) {
    statusMsg += ' (Tag at least 1 IoC to escalate)';
  } else if (!hasCategorySelected) {
    statusMsg += ' (Select an Attack Type dropdown value to escalate)';
  }

  document.getElementById('decisionStatusLabel').innerHTML = statusMsg;
  var btnEsc = document.getElementById('btnEscalatePhish');
  if (btnEsc) {
    btnEsc.disabled = (count === 0 || !hasCategorySelected);
  }
}

function renderPostMortem() {
  var t = getActiveTicket();
  var decision = userTriageDecisions[t.id];
  if (!decision) return;

  var container = document.getElementById('postMortemContainer');

  var smokingGunsCaught = [];
  var otherIndicators = [];
  var fpTokens = [];
  var seenKeys = {};

  document.querySelectorAll('.ioc-token').forEach(function(tok) {
    var k = tok.dataset.key;
    if (seenKeys[k]) return;
    seenKeys[k] = true;

    var flagData = t.flags[k];
    if (!flagData) return;

    var isBad = flagData[1] === 1;
    var reason = flagData[2];
    var isTagged = taggedIoCs.has(k);

    tok.classList.remove('tagged');

    if (isBad) {
      if (isTagged) {
        tok.classList.add('eval-true');
        smokingGunsCaught.push(`<li><span class="badge badge-clean">SMOKING GUN IDENTIFIED</span> <b>${flagData[0]}:</b> ${reason}</li>`);
      } else {
        tok.classList.add('eval-miss');
        otherIndicators.push(`<li><span class="badge" style="background:rgba(255,255,255,0.08); color:var(--text-dim); border:1px solid var(--border-line);">ADDITIONAL CONTEXT</span> <b>${flagData[0]}:</b> ${reason}</li>`);
      }
    } else {
      if (isTagged) {
        tok.classList.add('eval-fp');
        fpTokens.push(`<li><span class="badge badge-pending">FALSE POSITIVE</span> <b>${flagData[0]}:</b> ${reason}</li>`);
      } else {
        tok.classList.add('eval-clean');
      }
    }
  });

  document.querySelectorAll('.ioc-token').forEach(function(tok) {
    var k = tok.dataset.key;
    var flagData = t.flags[k];
    if (!flagData) return;
    var isBad = flagData[1] === 1;
    var isTagged = taggedIoCs.has(k);
    tok.classList.remove('tagged');
    if (isBad) {
      if (isTagged) tok.classList.add('eval-true');
      else tok.classList.add('eval-miss');
    } else {
      if (isTagged) tok.classList.add('eval-fp');
      else tok.classList.add('eval-clean');
    }
  });

  var outcomeTitle = decision.correct ? '✓ Triage Classification Verified' : '✗ Assessment Discrepancy Identified';
  var assessmentNote = '';
  if (t.isPhishing) {
    if (decision.correct) {
      assessmentNote = `Operational Success: You identified a definitive smoking gun indicator justifying immediate threat escalation.`;
    } else if (!decision.verdictCorrect) {
      assessmentNote = `Critical Error: Malicious communication was incorrectly approved as benign traffic.`;
    } else if (!decision.categoryCorrect) {
      assessmentNote = `Classification Error: Threat was quarantined, but miscategorized (Identified as ${decision.chosenCategory} instead of ${t.attackCategory}).`;
    } else {
      assessmentNote = `Insufficient Evidence: Threat reported without pinning a verified Indicator of Compromise (IoC).`;
    }
  } else {
    if (decision.correct) {
      assessmentNote = `Accurately determined benign commercial / internal communication. Business continuity preserved.`;
    } else {
      assessmentNote = `False Positive Operational Impact: You quarantined legitimate business traffic (${t.subject}), disrupting executive or partner operations.`;
    }
  }

  container.innerHTML = `
    <div class="postmortem-container">
      <div class="postmortem-header ${decision.correct ? 'correct' : 'incorrect'}">
        <div>
          ${outcomeTitle}
          <span style="font-size:0.78rem; font-weight:400; margin-left:8px; opacity:0.9;">
            (Ground Truth: ${t.isPhishing ? 'MALICIOUS [' + t.attackCategory + ']' : 'BENIGN TRAFFIC'})
          </span>
        </div>
        <div class="badge ${decision.correct ? 'badge-clean' : 'badge-quarantined'}">
          NIST 800-61 TRIAGED
        </div>
      </div>
      <div class="postmortem-body">
        <div>
          <div style="font-size:0.84rem; color:#fff; margin-bottom:8px;">
            ${assessmentNote}
          </div>
          <div class="pm-sec-title">MITRE ATT&amp;CK CLASSIFICATION &amp; TAXONOMY</div>
          <div style="font-family:var(--font-mono); font-size:0.86rem; color:#fff; font-weight:600;">
            ${t.mitreTechnique}
          </div>
          <div style="font-size:0.78rem; color:var(--text-dim); margin-top:2px;">
            Your Classification: <b>${decision.chosenCategory}</b> ${decision.categoryCorrect ? '<span style="color:var(--status-green)">(Accurate)</span>' : '<span style="color:var(--status-red)">(Incorrect category)</span>'}
          </div>
        </div>

        <div>
          <div class="pm-sec-title">INDICATORS OF COMPROMISE (IoC) FORENSIC REVIEW</div>
          <ul class="pm-list">
            ${smokingGunsCaught.join('')}
            ${otherIndicators.join('')}
            ${fpTokens.join('')}
            ${smokingGunsCaught.length === 0 && otherIndicators.length === 0 && fpTokens.length === 0 ? '<li style="color:var(--text-dim)">No red flags identified (Verified benign traffic).</li>' : ''}
          </ul>
        </div>
      </div>
    </div>
  `;
}

function updateHeaderStats() {
  var shiftTriaged = Object.keys(userTriageDecisions).length;
  var acc = totalTriagedLifetime > 0 ? Math.round((totalCorrectLifetime / totalTriagedLifetime) * 100) : 100;
  var pending = TICKETS.length - shiftTriaged;

  document.getElementById('statTriaged').textContent = totalTriagedLifetime + ' (' + shiftTriaged + '/5 Today)';
  document.getElementById('statAccuracy').textContent = acc + '%';
  document.getElementById('statQueueCount').textContent = pending + ' Pending';
  document.getElementById('badgePendingCount').textContent = pending + ' Pending';
}

function decorateInteractiveRawRFC(rawText, t) {
  var lines = (rawText || 'No raw transport headers captured.').split('\n');
  return lines.map(function(line) {
    var esc = escapeHtml(line);
    var key = null;
    if (/^(From|Sender|Sender-Address|Sender-MSISDN|ShortCode):/i.test(line) && t.flags.from) {
      key = 'from';
    } else if (/^Reply-To:/i.test(line) && t.flags.replyto) {
      key = 'replyto';
    } else if (/^(Authentication-Results|Received|STIR-SHAKEN-Attestation|Routing-Gateway|Gateway-Switch|Via):/i.test(line) && t.flags.auth) {
      key = 'auth';
    } else if (/^X-Attachment-Name:/i.test(line) && t.flags.attachment) {
      key = 'attachment';
    } else if (/^Subject:/i.test(line) && t.flags.subject) {
      key = 'subject';
    }
    if (key) {
      var taggedClass = taggedIoCs.has(key) ? ' tagged' : '';
      return '<span class="ioc-token' + taggedClass + '" data-key="' + key + '" style="display:inline-block; width:100%;">' + esc + '</span>';
    }
    return esc;
  }).join('\n');
}

function renderInspector() {
  var t = getActiveTicket();
  var container = document.getElementById('drawerContent');

  if (currentDrawerTab === 'raw') {
    container.innerHTML = `
      <div style="margin-bottom:8px; font-family:var(--font-mono); font-size:0.74rem; color:var(--text-dim); display:flex; justify-content:space-between; align-items:center;">
        <span>RAW TRANSPORT STREAM &amp; RFC 822 HEADERS</span>
        <span style="color:var(--accent-blue); font-size:0.68rem;">[CLICKABLE IoCs]</span>
      </div>
      <pre class="raw-stream" id="rawStreamPre">${decorateInteractiveRawRFC(t.rawRFC, t)}</pre>
    `;
  } else {
    var hops = t.transportHops || [
      { node: 'gateway01.enterprise.corp [10.0.0.10]', proto: 'TLS 1.3', status: '250 2.0.0 OK' }
    ];

    var rows = hops.map(function(h, idx) {
      var neutralCode = sanitizeHopStatus(h.status, h.proto);
      return `
        <div class="intel-row">
          <div>
            <div style="font-weight:600; color:#fff; font-family:var(--font-mono); font-size:0.76rem;">Hop #${idx + 1}: ${escapeHtml(h.node)}</div>
            <div style="font-size:0.7rem; color:var(--text-dim);">Protocol: ${escapeHtml(h.proto)}</div>
          </div>
          <div style="font-family:var(--font-mono); font-size:0.71rem; color:var(--text-muted);">${escapeHtml(neutralCode)}</div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="intel-card">
        <div style="font-family:var(--font-mono); font-size:0.74rem; color:var(--text-dim); margin-bottom:8px;">MTA HOP TELEMETRY (NEUTRAL GATEWAY LOG)</div>
        ${rows}
      </div>
      <div style="font-size:0.75rem; color:var(--text-dim); line-height:1.5; padding:4px;">
        <b>Triage Protocol:</b> Inspect the MTA hop IP addresses, reverse DNS pointers, and Authentication-Results in the Raw Headers tab. You can click suspicious header lines directly in the Raw Headers view to tag them as IoCs.
      </div>
    `;
  }

  if (t.status !== 'pending') {
    renderPostMortem();
  }
}
