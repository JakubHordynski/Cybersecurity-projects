
function buildProceduralTickets(count) {
  var smsPool = [
    { key: 'smish_bank', fn: generateSmishingIncident },
    { key: 'smish_package', fn: generateSmishingPackageIncident },
    { key: 'smish_toll', fn: generateSmishingTollIncident },
    { key: 'smish_tax', fn: generateSmishingTaxIncident },
    { key: 'smish_crypto', fn: generateSmishingCryptoIncident },
    { key: 'smish_ceo_giftcard', fn: generateSmishingCeoGiftCardIncident },
    { key: 'clean_sms_bank', fn: generateCleanSmsBankIncident },
    { key: 'clean_sms_2fa', fn: generateCleanSms2FAIncident },
    { key: 'clean_sms_doctor', fn: generateCleanSmsDoctorIncident },
    { key: 'clean_sms_flight', fn: generateCleanSmsFlightIncident }
  ];

  var voicePool = [
    { key: 'vish_push', fn: generateVishingIncident },
    { key: 'vish_passreset', fn: generateVishingPassResetIncident },
    { key: 'vish_contractor', fn: generateVishingContractorIncident },
    { key: 'vish_hr_payroll', fn: generateVishingHRPayrollIncident },
    { key: 'vish_bank_fraud', fn: generateVishingBankFraudIncident },
    { key: 'clean_voice_it', fn: generateCleanVoiceITIncident },
    { key: 'clean_voice_facilities', fn: generateCleanVoiceFacilitiesIncident },
    { key: 'clean_voice_recruiter', fn: generateCleanVoiceRecruiterIncident },
    { key: 'clean_voice_cab', fn: generateCleanVoiceCabIncident }
  ];

  var qrPool = [
    { key: 'quish_mfa', fn: generateQuishingIncident },
    { key: 'quish_parking', fn: generateQuishingParkingIncident },
    { key: 'quish_wifi', fn: generateQuishingWifiIncident },
    { key: 'quish_badge', fn: generateQuishingBadgeIncident },
    { key: 'quish_edr_profile', fn: generateQuishingEdrIncident },
    { key: 'clean_qr_event', fn: generateCleanQREventIncident },
    { key: 'clean_qr_cafeteria', fn: generateCleanQRCafeteriaIncident },
    { key: 'clean_qr_visitor', fn: generateCleanQRVisitorIncident }
  ];

  var emailPool = [
    { key: 'spear_wire', fn: generateSpearIncident },
    { key: 'spear_oauth', fn: generateSpearOAuthIncident },
    { key: 'spear_typo_only', fn: generateSubtleTyposquatIncident },
    { key: 'spear_replyto_only', fn: generateSubtleReplyToIncident },
    { key: 'spear_mna_leak', fn: generateSubtleMnaIncident },
    { key: 'spear_rfp_quote', fn: generateSubtleVendorQuoteIncident },
    { key: 'spear_thread_hijack', fn: generateThreadHijackIncident },
    { key: 'spear_punycode_idn', fn: generatePunycodeHomographIncident },
    { key: 'spear_open_redirect', fn: generateOpenRedirectIncident },
    { key: 'spear_double_ext', fn: generateDoubleExtensionIncident },
    { key: 'spear_subdomain_netcraft', fn: generateNetcraftSubdomainIncident },
    { key: 'spear_github_pat', fn: generateSpearGithubPatIncident },
    { key: 'spear_svg_smuggling', fn: generateSpearSvgSmugglingIncident },
    { key: 'mass_quota', fn: generateMassPhishIncident },
    { key: 'mass_hr', fn: generateMassHrIncident },
    { key: 'mass_tax_rebate', fn: generateMassTaxIncident },
    { key: 'mass_voicemail_html', fn: generateMassVoicemailIncident },
    { key: 'clean_vendor', fn: generateCleanVendorIncident },
    { key: 'clean_it', fn: generateCleanITIncident },
    { key: 'clean_hr', fn: generateCleanHRIncident },
    { key: 'clean_procurement', fn: generateCleanProcurementIncident },
    { key: 'clean_legal_policy', fn: generateCleanLegalIncident },
    { key: 'clean_ugly_tracking', fn: generateCleanUglyTrackingIncident },
    { key: 'clean_exec_iphone', fn: generateCleanExecMobileIncident },
    { key: 'clean_github_depend', fn: generateCleanGithubDependabotIncident }
  ];

  function getUnusedItem(pool) {
    var available = pool.filter(function(item) { return !historyRegistry.has(item.key); });
    if (available.length === 0) {
      pool.forEach(function(item) { historyRegistry.delete(item.key); });
      available = pool;
    }
    var chosen = pick(available);
    historyRegistry.add(chosen.key);
    return chosen;
  }

  var selected = [];
  selected.push(getUnusedItem(smsPool));
  selected.push(getUnusedItem(voicePool));
  selected.push(getUnusedItem(qrPool));
  selected.push(getUnusedItem(emailPool));
  selected.push(getUnusedItem(emailPool));

  for (var k = selected.length - 1; k > 0; k--) {
    var rj = Math.floor(R() * (k + 1));
    var rtemp = selected[k];
    selected[k] = selected[rj];
    selected[rj] = rtemp;
  }

  var shuffledReporters = REPORTERS.slice();
  for (var s = shuffledReporters.length - 1; s > 0; s--) {
    var sj = Math.floor(R() * (s + 1));
    var stemp = shuffledReporters[s];
    shuffledReporters[s] = shuffledReporters[sj];
    shuffledReporters[sj] = stemp;
  }

  var tickets = [];
  for (var tIdx = 0; tIdx < count; tIdx++) {
    var rep = shuffledReporters[tIdx % shuffledReporters.length];
    var ticketNum = rn(1000, 9999);
    var id = 'INC-' + ticketNum;
    tickets.push(selected[tIdx].fn(id, rep));
  }

  return tickets;
}

// =========================================================================
// SMS / SMISHING & CLEAN CELLULAR SCENARIOS
// =========================================================================

function generateSmishingIncident(id, rep) {
  var shortcode = pick(['+44 7911 123456', '+1 (555) 019-2834', '88201']);
  var fakeDom = pick(PHISH_DOMAINS);
  return {
    id: id,
    channel: 'CHANNEL: CELLULAR SMS',
    attackCategory: 'SMISHING',
    severity: 'MEDIUM',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(10, 40) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.004 / T1598 (Smishing / SMS Deception)',
    subject: 'Reported SMS: Suspicious Corporate Visa Debit Verification',
    senderDisplay: shortcode,
    senderEmail: shortcode + ' (SMS Originator)',
    authSummary: 'SMS Gateway Route: Inbound via Twilio Virtual Carrier Number (P2P SMS)',
    date: 'Wed, 04 Nov 2026 10:31:00 +0100',
    to: 'Employee Mobile Device (' + rep.name + ')',
    bodyParagraphs: [
      '[ENTERPRISE BANK ALERT] A debit of $1,420.00 at BESTBUY-ONLINE was attempted on corporate card ending in ' + rn(1000, 9999) + '.',
      'If this was NOT authorized by you, prevent terminal processing immediately by logging into fraud protection: https://' + fakeDom + '/dispute-pos'
    ],
    linkDisplay: 'https://' + fakeDom + '/dispute-pos',
    linkTarget: 'https://' + fakeDom + '/dispute-pos',
    attachment: null,
    signature: 'Direct SMS Cellular Feed // Operator Log',
    disclaimer: 'Reported via Employee Mobile Endpoint Security Agent.',
    flags: {
      from: ['Sender Identity (Smoking Gun)', 1, 'Virtual Carrier SMS: Sent from an unverified mobile number / P2P virtual SIM.'],
      auth: ['Carrier Gateway', 1, 'No A2P Short Code: Lacks legitimate verified banking short code verification.'],
      subject: ['Pretext & Urgency', 1, 'Financial Panic: Falsely claims an unauthorized $1,420 charge to trigger panic.'],
      body: ['Content Coercion', 1, 'Coercive Call to Action: Pressures employee to click external dispute link immediately.'],
      link: ['Weaponized Link Target (Smoking Gun)', 1, "Smishing URL: Directs to fake bank landing page ('" + fakeDom + "')."]
    },
    rawRFC: `SMS_PDU_INBOUND_RECORD:\nSender-Address: ${shortcode}\nRouting-Gateway: Virtual-Cellular-P2P-Relay\nRecipient-IMSI: 26001099218491\nMessage: [ENTERPRISE BANK ALERT] Debit attempted...`,
    transportHops: [
      { node: 'smsc.virtual-telecom.net [198.51.100.77]', proto: 'SMPP 3.4', status: 'P2P_VIRTUAL_NUMBER' },
      { node: 'cellular-gw.enterprise.corp [10.4.0.5]', proto: 'Enterprise MDM Agent', status: 'INBOUND_LOGGED' }
    ]
  };
}

function generateSmishingPackageIncident(id, rep) {
  var shortcode = pick(['+1 (555) 349-1102', '+44 7700 900143']);
  var fakeDom = pick(PHISH_DOMAINS);
  return {
    id: id,
    channel: 'CHANNEL: CELLULAR SMS',
    attackCategory: 'SMISHING',
    severity: 'MEDIUM',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(5, 35) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.004 (Smishing / Package Delivery Lure)',
    subject: 'Reported SMS: Urgent Courier Redelivery Address Fee Notice',
    senderDisplay: shortcode,
    senderEmail: shortcode + ' (Cellular Inbound)',
    authSummary: 'SMS Gateway: Unregistered international virtual long-code (P2P)',
    date: 'Wed, 04 Nov 2026 11:05:00 +0100',
    to: 'Employee Mobile Device (' + rep.name + ')',
    bodyParagraphs: [
      '[EXPRESS COURIER] Your parcel delivery #GB-89410 has been halted due to missing street number records.',
      'Update shipping details and settle the $2.30 redelivery surcharge within 12h to prevent warehouse return: https://' + fakeDom + '/redelivery'
    ],
    linkDisplay: 'https://' + fakeDom + '/redelivery',
    linkTarget: 'https://' + fakeDom + '/redelivery',
    attachment: null,
    signature: 'Cellular Carrier Telemetry / SMS Agent Log',
    disclaimer: 'Reported via Corporate Mobile Device.',
    flags: {
      from: ['Sender Identity (Smoking Gun)', 1, 'Untrusted Mobile Origin: Sent from a generic mobile number rather than a recognized courier sender ID.'],
      auth: ['Carrier Gateway', 1, 'Unregistered Carrier: No registered enterprise brand identity on SMS trunk.'],
      subject: ['Pretext & Urgency', 1, 'Artificial Deadline: Imposes a 12-hour limit accompanied by fee payment threat.'],
      body: ['Fee Solicit Pattern', 1, 'Micro-Fee Card Harvesting: Lures victim to submit debit card coordinates under pretext of small shipping fee.'],
      link: ['Weaponized Link Target (Smoking Gun)', 1, "Smishing Endpoint: Link points to fraudulent payment capture domain '" + fakeDom + "'."]
    },
    rawRFC: `SMS_PDU_INBOUND_RECORD:\nSender-MSISDN: ${shortcode}\nGateway-Switch: Global-P2P-SMSC\nDelivery-Status: Forwarded-To-Handset`,
    transportHops: [
      { node: 'smsc.carrier-interconnect.com [203.0.113.88]', proto: 'SMPP v3.4', status: 'NON_REPUTABLE_ORIGIN' },
      { node: 'enterprise-mdm.corp [10.4.0.1]', proto: 'MDM Relay', status: 'TELEMETRY_CAPTURED' }
    ]
  };
}

function generateSmishingTollIncident(id, rep) {
  var shortcode = pick(['+1 (800) 919-4421', 'TOLL-PASS-ALERT']);
  var fakeDom = pick(PHISH_DOMAINS);
  return {
    id: id,
    channel: 'CHANNEL: CELLULAR SMS',
    attackCategory: 'SMISHING',
    severity: 'MEDIUM',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(10, 40) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.004 (Smishing / Toll Road Fine Lure)',
    subject: 'Reported SMS: Unpaid Highway Toll Balance Notice',
    senderDisplay: shortcode,
    senderEmail: shortcode + ' (SMS Originator)',
    authSummary: 'SMS Gateway: Unverified peer gateway',
    date: 'Wed, 04 Nov 2026 09:12:00 +0100',
    to: 'Employee Mobile Device (' + rep.name + ')',
    bodyParagraphs: [
      '[E-ZPASS TOLL] Your vehicle incurred an unpaid toll charge of $4.50 on Interstate 95. A $50.00 administrative late penalty applies in 24 hours.',
      'Settle your outstanding balance immediately to avoid vehicle registration suspension: https://' + fakeDom + '/toll-pay'
    ],
    linkDisplay: 'https://' + fakeDom + '/toll-pay',
    linkTarget: 'https://' + fakeDom + '/toll-pay',
    attachment: null,
    signature: 'Mobile Gateway Log #SMS-9941',
    disclaimer: 'Reported via Corporate MDM Telemetry.',
    flags: {
      from: ['Sender Identity (Smoking Gun)', 1, 'Virtual Carrier SMS: Sent from an unverified mobile sender identifier.'],
      auth: ['Carrier Gateway', 1, 'Unverified carrier peer with zero enterprise attestation.'],
      subject: ['Pretext & Urgency', 1, 'Penalty Threat: Claims small toll balance with registration suspension threat.'],
      link: ['Weaponized Link Target (Smoking Gun)', 1, "Credential Harvester: Directs to payment credential capture at '" + fakeDom + "'."]
    },
    rawRFC: `SMS_PDU_INBOUND_RECORD:\nSender-MSISDN: ${shortcode}\nGateway-Switch: Virtual-P2P-SMSC\nBody: [E-ZPASS TOLL] Unpaid toll charge...`,
    transportHops: [{ node: 'toll-sms.virtual [198.51.100.95]', proto: 'SMPP', status: 'UNVERIFIED_P2P' }]
  };
}

function generateSmishingTaxIncident(id, rep) {
  var shortcode = pick(['+44 7860 991822', 'GOV-REBATE']);
  var fakeDom = pick(PHISH_DOMAINS);
  return {
    id: id,
    channel: 'CHANNEL: CELLULAR SMS',
    attackCategory: 'SMISHING',
    severity: 'MEDIUM',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(10, 40) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.004 (Smishing / Government Tax Rebate)',
    subject: 'Reported SMS: Fiscal Revenue Office Cost-of-Living Grant',
    senderDisplay: shortcode,
    senderEmail: shortcode + ' (SMS Originator)',
    authSummary: 'SMS Gateway: External cellular gateway',
    date: 'Wed, 04 Nov 2026 09:44:00 +0100',
    to: 'Employee Mobile Device (' + rep.name + ')',
    bodyParagraphs: [
      '[REVENUE OFFICE] You are pre-approved for an energy cost-of-living financial grant of $350.00.',
      'Claim your direct disbursement by linking your debit card before midnight: https://' + fakeDom + '/gov-grant'
    ],
    linkDisplay: 'https://' + fakeDom + '/gov-grant',
    linkTarget: 'https://' + fakeDom + '/gov-grant',
    attachment: null,
    signature: 'Mobile Gateway Log #SMS-1120',
    disclaimer: 'Reported via Corporate MDM Telemetry.',
    flags: {
      from: ['Sender Identity (Smoking Gun)', 1, 'Virtual Carrier SMS: Government rebates are never disbursed via random mobile SMS.'],
      auth: ['Carrier Gateway', 1, 'Unverified carrier peer with zero state attestation.'],
      subject: ['Pretext & Urgency', 1, 'Financial Greed Lure: Free grant prompt designed to harvest debit card data.'],
      link: ['Weaponized Link Target (Smoking Gun)', 1, "Credential Harvester: Directs to phishing site '" + fakeDom + "'."]
    },
    rawRFC: `SMS_PDU_INBOUND_RECORD:\nSender-MSISDN: ${shortcode}\nGateway-Switch: Virtual-P2P-SMSC\nBody: [REVENUE OFFICE] Energy grant...`,
    transportHops: [{ node: 'gov-sms.virtual [198.51.100.22]', proto: 'SMPP', status: 'UNVERIFIED_P2P' }]
  };
}

function generateSmishingCryptoIncident(id, rep) {
  var shortcode = pick(['+1 (555) 902-1144', '+44 7911 441029']);
  var fakeDom = pick(PHISH_DOMAINS);
  return {
    id: id,
    channel: 'CHANNEL: CELLULAR SMS',
    attackCategory: 'SMISHING',
    severity: 'MEDIUM',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(8, 30) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.004 (Smishing / Crypto Asset Security Lockout)',
    subject: 'Reported SMS: Cold Storage Wallet Security Alert',
    senderDisplay: shortcode,
    senderEmail: shortcode + ' (SMS Originator)',
    authSummary: 'SMS Gateway: External virtual mobile peer',
    date: 'Wed, 04 Nov 2026 11:14:00 +0100',
    to: 'Employee Mobile Device (' + rep.name + ')',
    bodyParagraphs: [
      '[COINVAULT SECURITY] An unauthorized outbound transfer of 3.4 BTC was initiated from your hardware custody profile.',
      'If you initiated this transaction, reply 1. If unauthorized, lock your vault immediately: https://' + fakeDom + '/wallet-lock'
    ],
    linkDisplay: 'https://' + fakeDom + '/wallet-lock',
    linkTarget: 'https://' + fakeDom + '/wallet-lock',
    attachment: null,
    signature: 'Mobile Gateway Log #SMS-8812',
    disclaimer: 'Forwarded via Corporate MDM Telemetry.',
    flags: {
      from: ['Sender Identity (Smoking Gun)', 1, 'Virtual Carrier SMS: Sent from an unverified mobile number.'],
      auth: ['Carrier Gateway', 1, 'Unverified carrier peer with zero enterprise attestation.'],
      subject: ['Pretext & Urgency', 1, 'Cryptocurrency Panic: Falsely claims a large BTC transfer to force immediate click.'],
      link: ['Weaponized Link Target (Smoking Gun)', 1, "Credential Harvester: Directs to fake wallet login at '" + fakeDom + "'."]
    },
    rawRFC: `SMS_PDU_INBOUND_RECORD:\nSender-MSISDN: ${shortcode}\nBody: [COINVAULT SECURITY] Unauthorized outbound transfer...`,
    transportHops: [{ node: 'crypto-sms.virtual [198.51.100.14]', proto: 'SMPP', status: 'UNVERIFIED_P2P' }]
  };
}

function generateSmishingCeoGiftCardIncident(id, rep) {
  var shortcode = '+1 (646) 555-0183';
  return {
    id: id,
    channel: 'CHANNEL: CELLULAR SMS',
    attackCategory: 'SMISHING',
    severity: 'HIGH',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(4, 18) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.004 / T1656 (Executive Impersonation SMS / Gift Card Fraud)',
    subject: 'Reported SMS: Urgent Client Appreciation Gift Cards Request from CEO',
    senderDisplay: shortcode + ' (Unlisted Mobile)',
    senderEmail: shortcode + ' (Prepaid Burner SIM)',
    authSummary: 'SMS Gateway: Consumer P2P Prepaid Carrier · Zero Enterprise MDM Registration',
    date: 'Wed, 04 Nov 2026 11:30:00 +0100',
    to: 'Employee Mobile Device (' + rep.name + ')',
    bodyParagraphs: [
      'Hi ' + rep.name.split(' ')[0] + ', this is Catherine Stone (CEO). This is my new private mobile number. I am tied up in a board strategy session and cannot step out to call.',
      'I need you to quickly purchase 5 Apple Store gift cards ($200 each) for our visiting keynote partners. Scratch the backs, text me clear photos of the redemption codes within 45 minutes, and expense it tomorrow.'
    ],
    attachment: null,
    signature: 'Cellular Carrier Telemetry // P2P SMS Capture',
    disclaimer: 'Forwarded via Employee Mobile Endpoint.',
    flags: {
      from: ['Sender Identity (Smoking Gun)', 1, 'Unverified Burner Number: Claims to be the CEO texting from an unlisted personal mobile number.'],
      auth: ['Carrier Gateway', 1, 'Unregistered prepaid P2P SIM card outside corporate mobile directory.'],
      subject: ['Pretext & Urgency', 1, 'Executive Isolation Pretext: Claims to be stuck in a board meeting unable to take voice verification calls.'],
      body: ['Gift Card Solicitation (Smoking Gun)', 1, 'Classic BEC/Smishing Fraud: Requests immediate purchase of irreversible gift cards and photos of scratch-off codes.']
    },
    rawRFC: `SMS_PDU_INBOUND_RECORD:\nSender-MSISDN: ${shortcode}\nGateway-Switch: Prepaid-Burner-SMSC\nBody: Hi ${rep.name.split(' ')[0]}, this is Catherine Stone (CEO)...`,
    transportHops: [{ node: 'p2p-sms.carrier-prepaid.net [203.0.113.55]', proto: 'SMPP', status: 'P2P_UNVERIFIED' }]
  };
}

function generateCleanSmsBankIncident(id, rep) {
  var last4 = rn(1000, 9999);
  var amt = rn(15, 80) + '.00';
  return {
    id: id,
    channel: 'CHANNEL: CELLULAR SMS',
    attackCategory: 'CLEAN',
    severity: 'LOW',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(10, 35) + 'm ago',
    status: 'pending',
    isPhishing: false,
    mitreTechnique: 'Benign Cellular Notification (Legitimate)',
    subject: 'Reported SMS: Corporate Card Fraud Query from Short Code 72345',
    senderDisplay: '72345 (Verified Bank A2P Short Code)',
    senderEmail: '72345 (National Banking Gateway)',
    authSummary: 'Origin: Verified Carrier A2P Aggregator · Registered Entity: Chase Commercial Banking',
    date: 'Wed, 04 Nov 2026 10:14:00 +0100',
    to: 'Employee Mobile Device (' + rep.name + ')',
    bodyParagraphs: [
      '[CHASE CORP ALERT] Did you authorize $' + amt + ' at SHELL OIL on card ending ' + last4 + '? Reply YES or NO.',
      'We will NEVER ask for your password, PIN, or full card details via SMS or phone call.'
    ],
    attachment: null,
    signature: 'Carrier A2P Certified Log // Chase Commercial Fraud Desk',
    disclaimer: 'Forwarded via Corporate MDM Telemetry.',
    flags: {
      from: ['Sender Identity', 0, 'Verified 5-digit bank short code (72345) registered to legitimate banking trunk.'],
      auth: ['Carrier Gateway', 0, 'Tier-1 A2P mobile carrier verification with no virtual gateway redirect.'],
      subject: ['Pretext & Urgency', 0, 'Standard interactive fraud verification (YES/NO only, no links or callback lures).'],
      body: ['Security Hygiene', 0, 'Explicit security reminder confirming bank will never request passwords, PINs, or card numbers.']
    },
    rawRFC: `SMS_PDU_INBOUND_RECORD:\nShortCode: 72345 (Verified A2P)\nCarrier: Verizon Enterprise Wireless Gateway\nBody: [CHASE CORP ALERT] Did you authorize...`,
    transportHops: [
      { node: 'a2p-gw.chasebank.com [198.51.100.12]', proto: 'SMPP v3.4 Encrypted', status: 'REGISTERED_SHORTCODE' },
      { node: 'enterprise-mdm.corp [10.4.0.1]', proto: 'MDM Inbound Agent', status: 'VERIFIED' }
    ]
  };
}

function generateCleanSms2FAIncident(id, rep) {
  var code = rn(100000, 999999);
  return {
    id: id,
    channel: 'CHANNEL: CELLULAR SMS',
    attackCategory: 'CLEAN',
    severity: 'LOW',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(5, 20) + 'm ago',
    status: 'pending',
    isPhishing: false,
    mitreTechnique: 'Benign Cellular Verification (Legitimate)',
    subject: 'Reported SMS: Microsoft Azure MFA Verification Token',
    senderDisplay: '83921 (Microsoft Identity Short Code)',
    senderEmail: '83921 (Azure Verification Carrier)',
    authSummary: 'Origin: Microsoft Global Telephony Gateway · Short Code Attestation: VERIFIED_A2P',
    date: 'Wed, 04 Nov 2026 10:48:00 +0100',
    to: 'Employee Mobile Device (' + rep.name + ')',
    bodyParagraphs: [
      code + ' is your Microsoft Azure single-use security token. It expires in 5 minutes.',
      'Security warning: Do not share this code with anyone, including Microsoft support or IT personnel.'
    ],
    attachment: null,
    signature: 'Identity Platform Gateway // SMS Dispatch Record',
    disclaimer: 'Enterprise Identity Verification Feed.',
    flags: {
      from: ['Sender Identity', 0, 'Official Microsoft enterprise A2P verification short code.'],
      auth: ['Carrier Gateway', 0, 'Direct carrier route with zero third-party transit hops.'],
      subject: ['Pretext & Urgency', 0, 'Routine expected 2FA code without coercive threats.'],
      body: ['Security Hygiene', 0, 'Clear anti-fraud warning instructing employee never to disclose the code.']
    },
    rawRFC: `SMS_PDU_RECORD:\nSender: 83921\nTenant: Microsoft Azure Cloud Identity\nRouting: Direct Telco Peer`,
    transportHops: [
      { node: 'sms-mfa.microsoft.com [13.107.4.52]', proto: 'Direct SMPP', status: 'VERIFIED_ORIGIN' },
      { node: 'enterprise-mdm.corp [10.4.0.1]', proto: 'MDM Telemetry', status: 'BENIGN_LOG' }
    ]
  };
}

function generateCleanSmsDoctorIncident(id, rep) {
  return {
    id: id,
    channel: 'CHANNEL: CELLULAR SMS',
    attackCategory: 'CLEAN',
    severity: 'LOW',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(12, 40) + 'm ago',
    status: 'pending',
    isPhishing: false,
    mitreTechnique: 'Benign Occupational Health Reminder (Legitimate)',
    subject: 'Reported SMS: Annual Occupational Health Screening Appointment Reminder',
    senderDisplay: '61400 (Bupa Occupational Health)',
    senderEmail: '61400 (Healthcare A2P Short Code)',
    authSummary: 'Origin: Verified Healthcare A2P Short Code · Registered Entity: Bupa Corporate Clinic',
    date: 'Wed, 04 Nov 2026 09:05:00 +0100',
    to: 'Employee Mobile Device (' + rep.name + ')',
    bodyParagraphs: [
      '[BUPA HEALTH] Reminder: Your scheduled occupational vision & ergonomic checkup is tomorrow at 10:30 in Building A, Clinic Suite 2.',
      'Reply C to confirm attendance, or reschedule via your standard employee intranet wellness tab. No links or payments required.'
    ],
    attachment: null,
    signature: 'Carrier A2P Log // Healthcare Notification',
    disclaimer: 'Forwarded via Corporate MDM Telemetry.',
    flags: {
      from: ['Sender Identity', 0, 'Registered healthcare A2P short code (61400).'],
      auth: ['Carrier Gateway', 0, 'Verified carrier A2P trunk with zero external links.'],
      subject: ['Pretext & Urgency', 0, 'Routine appointment confirmation with no urgent pressure.'],
      body: ['Content Integrity', 0, 'Contains no hyperlinks and asks for zero personal or financial data.']
    },
    rawRFC: `SMS_PDU_RECORD:\nShortCode: 61400\nRegistered-Brand: Bupa Corporate Health\nBody: [BUPA HEALTH] Reminder: Your scheduled...`,
    transportHops: [{ node: 'a2p.bupa-health.org [198.51.100.30]', proto: 'SMPP v3.4', status: 'VERIFIED_A2P' }]
  };
}

function generateCleanSmsFlightIncident(id, rep) {
  return {
    id: id,
    channel: 'CHANNEL: CELLULAR SMS',
    attackCategory: 'CLEAN',
    severity: 'LOW',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(6, 25) + 'm ago',
    status: 'pending',
    isPhishing: false,
    mitreTechnique: 'Benign Corporate Travel Dispatch (Legitimate)',
    subject: 'Reported SMS: Lufthansa Gate Change Notification for Flight LH-1350',
    senderDisplay: 'LUFTHANSA (Verified Alphanumeric Sender ID)',
    senderEmail: 'LUFTHANSA (A2P Travel Gateway)',
    authSummary: 'Origin: Amadeus Global Travel Distribution A2P · Attestation: Verified Airline ID',
    date: 'Wed, 04 Nov 2026 11:02:00 +0100',
    to: 'Employee Mobile Device (' + rep.name + ')',
    bodyParagraphs: [
      '[LUFTHANSA] Flight LH-1350 to Frankfurt: Departure gate changed to Gate B14. Boarding begins at 14:25.',
      'Check airport monitors or your corporate Concur travel app for boarding pass updates.'
    ],
    attachment: null,
    signature: 'Amadeus A2P Travel Telemetry',
    disclaimer: 'Forwarded via Corporate MDM Telemetry.',
    flags: {
      from: ['Sender Identity', 0, 'Verified alphanumeric carrier sender ID registered to Lufthansa.'],
      auth: ['Carrier Gateway', 0, 'Direct Amadeus travel distribution gateway.'],
      subject: ['Pretext & Urgency', 0, 'Standard operational gate update with no links or fees.'],
      body: ['Content Integrity', 0, 'Informational update referring user to airport monitors or official Concur app.']
    },
    rawRFC: `SMS_PDU_RECORD:\nSender: LUFTHANSA\nGateway: Amadeus-Travel-A2P\nBody: [LUFTHANSA] Flight LH-1350 gate changed...`,
    transportHops: [{ node: 'sms.amadeus.net [195.81.200.10]', proto: 'SMPP v3.4', status: 'VERIFIED_A2P' }]
  };
}

// =========================================================================
// VOICE / VISHING & CLEAN PBX SCENARIOS
// =========================================================================

function generateVishingIncident(id, rep) {
  var callerID = pick(['+1 (800) 443-2190 (Spoofed)', '+44 20 7946 0912', 'Unknown Caller (VoIP)']);
  return {
    id: id,
    channel: 'CHANNEL: VOIP PBX',
    attackCategory: 'VISHING',
    severity: 'HIGH',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(2, 15) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.004 / T1656 (Voice Phishing / Helpdesk Impersonation)',
    subject: 'Reported Phone Call: IT Helpdesk Okta MFA Push Fatigue Inquiry',
    senderDisplay: callerID,
    senderEmail: callerID + ' (SIP Trunk Inbound)',
    authSummary: 'SIP Trunk Auth: Unauthenticated Inbound VoIP Gateway (Asterisk PBX / No STIR/SHAKEN)',
    date: 'Wed, 04 Nov 2026 11:15:30 +0100',
    to: rep.name + ' (Direct Desk Line)',
    bodyParagraphs: [
      '[AUDIO CALL RECORDING TRANSCRIPT - DURATION: 1m 48s]',
      'CALLER: "Hi ' + rep.name.split(' ')[0] + ', this is Brad from Corporate IT Tier-2 Support in Dublin. We are detecting continuous spam login anomalies on your Okta portal."',
      'REPORTER (' + rep.name.split(' ')[0] + '): "Oh, really? I didn\'t see any notification on my laptop."',
      'CALLER: "Right, we blocked the IP. But to finalize the cache flush, I just pushed an authentication prompt to your Okta Verify app. Could you tap \'Yes, it\'s me\' on your phone right now so we can reset your session token?"',
      'REPORTER: "Wait, IT security guidelines say we should never approve prompts we didn\'t trigger..."',
      'CALLER: "Normally yes, but this is an emergency security lockout override. If you don\'t approve in the next 60 seconds, your entire Active Directory account will be suspended until tomorrow."'
    ],
    attachment: null,
    signature: 'Telecom PBX Inbound CDR Record #SIP-99210',
    disclaimer: 'Enterprise Voice Recording Gateway. Classified internal dispatch.',
    flags: {
      from: ['Caller ID Identity (Smoking Gun)', 1, 'Spoofed VoIP Caller ID: Originating from an unverified external SIP trunk lacking STIR/SHAKEN attestation.'],
      auth: ['VoIP Protocol Headers', 1, 'Missing Caller Verification: SIP gateway shows unauthenticated Asterisk PBX user.'],
      subject: ['Pretext & Urgency', 1, 'MFA Fatigue / Push Fatigue Attack: Coercing user into approving an unsolicited Okta prompt.'],
      body: ['Social Engineering Coercion (Smoking Gun)', 1, "Direct Policy Violation: Impersonator demands employee violate rule ('tap Yes on your phone right now')."]
    },
    rawRFC: `INVITE sip:${rep.name.toLowerCase().replace(' ', '.')}@enterprise.corp SIP/2.0\nVia: SIP/2.0/UDP 198.51.100.44:5060;branch=z9hG4bK-vishing\nFrom: "Corporate IT Support" <sip:support@198.51.100.44>\nCall-ID: vishing-call-99214@asterisk-pbx\nCSeq: 102 INVITE\nSTIR-SHAKEN-Attestation: NONE (Unverified Trunk)`,
    transportHops: [
      { node: 'sip-gw02.external-carrier.net [198.51.100.44]', proto: 'SIP/2.0 UDP', status: 'STIR_SHAKEN_NONE' },
      { node: 'pbx-core.enterprise.corp [10.5.0.2]', proto: 'SIP over TLS', status: 'CALL_RECORDED' }
    ]
  };
}

function generateVishingPassResetIncident(id, rep) {
  var callerID = pick(['+1 (888) 019-3321', 'Private Number (VoIP Trunk)']);
  return {
    id: id,
    channel: 'CHANNEL: VOIP PBX',
    attackCategory: 'VISHING',
    severity: 'HIGH',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(5, 20) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.004 / T1598 (Vishing / Credential Extraction)',
    subject: 'Reported Phone Call: VPN Gateway Password Reset Verification',
    senderDisplay: callerID,
    senderEmail: callerID + ' (Inbound VoIP Trunk)',
    authSummary: 'SIP Trunk Auth: External unauthenticated trunk · STIR/SHAKEN Attestation: C (Unverified)',
    date: 'Wed, 04 Nov 2026 11:32:00 +0100',
    to: rep.name + ' (Direct Extension)',
    bodyParagraphs: [
      '[AUDIO CALL RECORDING TRANSCRIPT - DURATION: 1m 12s]',
      'CALLER: "Hello ' + rep.name.split(' ')[0] + ', calling from the Global Infrastructure Security Operations desk. We are doing an emergency credential purge on all VPN tunnels."',
      'REPORTER: "Okay, what do I need to do?"',
      'CALLER: "I just triggered a one-time verification SMS code to your registered mobile phone. Read me the 6 digits aloud so I can authorize your endpoint before the network cutoff in 3 minutes."',
      'REPORTER: "I thought security never asks for our MFA codes over the phone?"',
      'CALLER: "This is a Level-3 security override authorized by the CISO. If you refuse, I have to log you as non-compliant and disable your network token immediately."'
    ],
    attachment: null,
    signature: 'Telecom PBX Inbound CDR Record #SIP-44910',
    disclaimer: 'Enterprise PBX Recording System.',
    flags: {
      from: ['Caller ID Identity (Smoking Gun)', 1, 'Unverified Origin: Inbound call shows low attestation and unverified external carrier origin.'],
      auth: ['VoIP Protocol Headers', 1, 'STIR/SHAKEN Failure: Attestation level C indicates the service provider cannot verify caller identity.'],
      subject: ['Pretext & Urgency', 1, 'Critical Time Pressure: 3-minute cutoff threat to short-circuit critical evaluation.'],
      body: ['MFA Code Solicitation (Smoking Gun)', 1, "Golden Rule Violation: Impersonator directly demands verbal disclosure of a one-time MFA code ('Read me the 6 digits aloud')."]
    },
    rawRFC: `INVITE sip:${rep.name.toLowerCase().replace(' ', '.')}@enterprise.corp SIP/2.0\nVia: SIP/2.0/UDP 203.0.113.19:5060\nFrom: "Security Ops" <sip:secops@203.0.113.19>\nSTIR-SHAKEN-Attestation: C`,
    transportHops: [
      { node: 'voip-switch.external-carrier.net [203.0.113.19]', proto: 'SIP/2.0', status: 'ATTESTATION_LEVEL_C' },
      { node: 'pbx-core.enterprise.corp [10.5.0.2]', proto: 'Internal PBX', status: 'INSPECTION_RECORDED' }
    ]
  };
}

function generateVishingContractorIncident(id, rep) {
  var callerID = '+1 (415) 555-0148 (External VoIP)';
  return {
    id: id,
    channel: 'CHANNEL: VOIP PBX',
    attackCategory: 'VISHING',
    severity: 'HIGH',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(6, 22) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.004 / T1219 (Vishing / Unauthorized Remote Access Tool Install)',
    subject: 'Reported Phone Call: Siemens HVAC Telemetry Vendor Remote Desktop Request',
    senderDisplay: callerID,
    senderEmail: callerID + ' (SIP Trunk Inbound)',
    authSummary: 'SIP Trunk Auth: External VoIP Carrier · STIR/SHAKEN: NONE',
    date: 'Wed, 04 Nov 2026 10:15:00 +0100',
    to: rep.name + ' (Direct Extension)',
    bodyParagraphs: [
      '[AUDIO CALL RECORDING TRANSCRIPT - DURATION: 1m 25s]',
      'CALLER: "Morning ' + rep.name.split(' ')[0] + ', this is Greg from Siemens Building Diagnostics. We\'re seeing a firmware fault on the floor IoT controller routed through your VLAN."',
      'REPORTER: "I\'m in ' + rep.dept + ', I don\'t manage building sensors."',
      'CALLER: "Your workstation IP is acting as the local subnet bridge. I just need you to open a browser, go to fast-support-node.com, download the AnyDesk portable client, and read me the 9-digit session ID so I can patch the bridge."',
      'REPORTER: "I can\'t install remote desktop tools without an approved IT ticket."',
      'CALLER: "If we don\'t patch it in 5 minutes, the server room cooling loop will trip an emergency shutdown."'
    ],
    attachment: null,
    signature: 'Telecom PBX Inbound CDR Record #SIP-61209',
    disclaimer: 'Enterprise PBX Recording System.',
    flags: {
      from: ['Caller ID Identity (Smoking Gun)', 1, 'Unverified External VoIP: Third-party caller with no STIR/SHAKEN attestation.'],
      auth: ['VoIP Protocol Headers', 1, 'Missing STIR/SHAKEN signature on external SIP invite.'],
      subject: ['Pretext & Urgency', 1, 'Fake Cooling Emergency: Fabricates a server room shutdown threat to force compliance.'],
      body: ['Remote Access Tool Lure (Smoking Gun)', 1, 'RMM Installation Attempt: Pressures employee to download AnyDesk from an external URL and hand over workstation control.']
    },
    rawRFC: `INVITE sip:${rep.name.toLowerCase().replace(' ', '.')}@enterprise.corp SIP/2.0\nVia: SIP/2.0/UDP 185.220.101.30:5060\nFrom: "Siemens Diagnostics" <sip:diag@185.220.101.30>\nSTIR-SHAKEN-Attestation: NONE`,
    transportHops: [{ node: 'sip.external-voip.org [185.220.101.30]', proto: 'SIP/2.0', status: 'UNVERIFIED' }]
  };
}

function generateVishingHRPayrollIncident(id, rep) {
  var callerID = pick(['+1 (800) 555-0199 (Spoofed)', 'HR Direct Line (VoIP)']);
  return {
    id: id,
    channel: 'CHANNEL: VOIP PBX',
    attackCategory: 'VISHING',
    severity: 'HIGH',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(3, 15) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.004 / T1598 (Vishing / Payroll Direct Deposit Reroute)',
    subject: 'Reported Phone Call: HR Payroll Direct Deposit Account Modification',
    senderDisplay: callerID,
    senderEmail: callerID + ' (Inbound Trunk)',
    authSummary: 'SIP Trunk Auth: External PBX Route · STIR/SHAKEN: Level C',
    date: 'Wed, 04 Nov 2026 11:42:00 +0100',
    to: rep.name + ' (Direct Desk Line)',
    bodyParagraphs: [
      '[AUDIO CALL RECORDING TRANSCRIPT - DURATION: 1m 30s]',
      'CALLER: "Hi ' + rep.name.split(' ')[0] + ', this is Marcus from People & Culture payroll accounting."',
      'REPORTER: "Hello Marcus, how can I help?"',
      'CALLER: "We received an automated bounce-back on your direct deposit ACH routing number for this Friday\'s pay cycle. Could you read me your current checking account routing and account numbers right now, plus your SSN last 4 digits, so I can re-key your profile before the 13:00 cutoff?"',
      'REPORTER: "That\'s strange, my bank hasn\'t changed. I\'ll check Workday myself through the portal."',
      'CALLER: "The portal is locked for batch processing right now, you have to give it to me verbally."'
    ],
    attachment: null,
    signature: 'Internal PBX Call Detail Record #CDR-77892',
    disclaimer: 'Enterprise PBX Audio Recording.',
    flags: {
      from: ['Caller ID Identity (Smoking Gun)', 1, 'Spoofed VoIP Trunk: External number masquerading as internal payroll desk.'],
      auth: ['VoIP Protocol Headers', 1, 'STIR/SHAKEN Level C: Zero identity attestation from carrier.'],
      subject: ['Pretext & Urgency', 1, 'Payroll Diversion Lure: Claims direct deposit bounced to trick employee into revealing bank/SSN info.'],
      body: ['Banking Details Solicitation (Smoking Gun)', 1, 'Direct Financial Fraud: Solicits bank account, routing numbers, and SSN over a phone call.']
    },
    rawRFC: `INVITE sip:${rep.name.toLowerCase().replace(' ', '.')}@enterprise.corp SIP/2.0\nFrom: <sip:payroll@external-voip.net>\nSTIR-SHAKEN-Attestation: C`,
    transportHops: [{ node: 'voip-payroll.external [198.51.100.82]', proto: 'SIP/2.0', status: 'UNVERIFIED_TRUNK' }]
  };
}

function generateVishingBankFraudIncident(id, rep) {
  var callerID = '+44 20 7946 0018 (Spoofed Bank Line)';
  return {
    id: id,
    channel: 'CHANNEL: VOIP PBX',
    attackCategory: 'VISHING',
    severity: 'HIGH',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(4, 19) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.004 (Vishing / Corporate Treasury Safe-Account Fraud)',
    subject: 'Reported Phone Call: Barclays Commercial Fraud Desk Hardware Token Readout',
    senderDisplay: callerID,
    senderEmail: callerID + ' (SIP Trunk Inbound)',
    authSummary: 'SIP Trunk Auth: External VoIP Gateway · STIR/SHAKEN: C (Spoofed CLI)',
    date: 'Wed, 04 Nov 2026 10:55:00 +0100',
    to: rep.name + ' (Direct Extension)',
    bodyParagraphs: [
      '[AUDIO CALL RECORDING TRANSCRIPT - DURATION: 1m 38s]',
      'CALLER: "Good morning ' + rep.name.split(' ')[0] + ', calling from Barclays Commercial Treasury Fraud Prevention. We have intercepted a fraudulent SWIFT wire of £42,000 from your corporate operating account."',
      'REPORTER: "We haven\'t authorized any £42,000 wire today!"',
      'CALLER: "To reverse and recall the wire before settlement clears in 4 minutes, press the \'Sign\' button on your physical Barclays SmartCard reader and read me the 8-digit MAC response code displayed on the screen."',
      'REPORTER: "Wait, isn\'t the \'Sign\' function used to authorize a new outbound payment?"',
      'CALLER: "No, in recall mode it cancels the batch. Hurry, we have 90 seconds left on the SWIFT window."'
    ],
    attachment: null,
    signature: 'Telecom PBX Inbound CDR Record #SIP-88301',
    disclaimer: 'Enterprise PBX Audio Recording.',
    flags: {
      from: ['Caller ID Identity (Smoking Gun)', 1, 'Spoofed Bank CLI: Unverified external SIP trunk spoofing a bank number.'],
      auth: ['VoIP Protocol Headers', 1, 'STIR/SHAKEN Level C: Unauthenticated caller identity.'],
      subject: ['Pretext & Urgency', 1, 'SWIFT Recall Panic: 90-second countdown to stop critical thinking.'],
      body: ['Hardware Token Signing Trick (Smoking Gun)', 1, 'Transaction Signing Fraud: Tricks analyst into generating a cryptographic "Sign" code on their physical bank token to authorize the attacker\'s wire.']
    },
    rawRFC: `INVITE sip:${rep.name.toLowerCase().replace(' ', '.')}@enterprise.corp SIP/2.0\nFrom: "Barclays Fraud Desk" <sip:+442079460018@185.220.101.66>\nSTIR-SHAKEN-Attestation: C`,
    transportHops: [{ node: 'sip-spoof.external.net [185.220.101.66]', proto: 'SIP/2.0', status: 'SPOOFED_CLI' }]
  };
}

function generateCleanVoiceITIncident(id, rep) {
  return {
    id: id,
    channel: 'CHANNEL: VOIP PBX',
    attackCategory: 'CLEAN',
    severity: 'LOW',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(10, 45) + 'm ago',
    status: 'pending',
    isPhishing: false,
    mitreTechnique: 'Benign Internal Voice Call (Legitimate)',
    subject: 'Reported Phone Call: Internal IT Asset Desk Hardware Replacement Notice',
    senderDisplay: 'Ext 4012 - IT Logistics (Internal PBX)',
    senderEmail: 'Ext 4012 (Internal Cisco CallManager Extension)',
    authSummary: 'PBX Transport: Internal Cisco Unified Communications Manager (CUCM) · Mutual TLS · STIR/SHAKEN: A',
    date: 'Wed, 04 Nov 2026 09:35:00 +0100',
    to: rep.name + ' (Direct Desk Phone)',
    bodyParagraphs: [
      '[AUDIO CALL RECORDING TRANSCRIPT - DURATION: 0m 42s]',
      'CALLER (IT Tech Dave): "Hi ' + rep.name.split(' ')[0] + ', Dave from IT Asset Management on the 3rd floor. Calling to let you know your requested monitor dock and encrypted YubiKey replacement are ready at the service desk."',
      'REPORTER: "Great, do I need to bring anything?"',
      'CALLER: "Just bring your existing company badge for physical identity verification when you have a free moment today. We don\'t need any passwords or login tokens. Have a good one!"'
    ],
    attachment: null,
    signature: 'Internal PBX Call Detail Record #CDR-10841',
    disclaimer: 'Enterprise PBX Audio Recording.',
    flags: {
      from: ['Caller ID Identity', 0, 'Internal corporate 4-digit extension authenticated via company CUCM PBX.'],
      auth: ['VoIP Protocol Headers', 0, 'Full STIR/SHAKEN Level A attestation through internal mTLS SIP trunk.'],
      subject: ['Pretext & Urgency', 0, 'Non-urgent routine notification regarding hardware pick-up.'],
      body: ['Security Hygiene', 0, 'Caller explicitly notes no passwords or credentials are required and mandates physical badge verification.']
    },
    rawRFC: `INVITE sip:${rep.name.toLowerCase().replace(' ', '.')}@enterprise.corp SIP/2.0\nVia: SIP/2.0/TLS cucm-internal.corp:5061;branch=z9hG4bK-legit\nFrom: "Dave Miller - IT Asset Desk" <sip:4012@enterprise.corp>\nSTIR-SHAKEN-Attestation: A (Fully Verified Internal Extension)`,
    transportHops: [
      { node: 'cucm-internal.enterprise.corp [10.5.0.10]', proto: 'SIP over mTLS', status: 'INTERNAL_AUTHENTICATED' },
      { node: 'deskphone.enterprise.corp [10.5.2.45]', proto: 'Cisco SCCP/SIP', status: 'RECORDED' }
    ]
  };
}

function generateCleanVoiceFacilitiesIncident(id, rep) {
  return {
    id: id,
    channel: 'CHANNEL: VOIP PBX',
    attackCategory: 'CLEAN',
    severity: 'LOW',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(5, 30) + 'm ago',
    status: 'pending',
    isPhishing: false,
    mitreTechnique: 'Benign Internal Voice Call (Legitimate)',
    subject: 'Reported Phone Call: Facilities Desk HVAC Maintenance Scheduled Notice',
    senderDisplay: 'Ext 1104 - Facilities Operations (Internal)',
    senderEmail: 'Ext 1104 (Building Management Desk)',
    authSummary: 'PBX Transport: Internal Voice Trunk · STIR/SHAKEN: Level A (Verified Extension)',
    date: 'Wed, 04 Nov 2026 10:20:00 +0100',
    to: rep.name + ' (Direct Desk Line)',
    bodyParagraphs: [
      '[AUDIO CALL RECORDING TRANSCRIPT - DURATION: 0m 35s]',
      'CALLER (Facilities Lead Tom): "Hello ' + rep.name.split(' ')[0] + ', just giving floor wardens a quick heads-up that contractors will be servicing the Building C rooftop HVAC units between 13:00 and 14:00."',
      'REPORTER: "Understood, will there be noise disruptions?"',
      'CALLER: "Minimal fan noise only. No evacuation or room movement needed. Thanks for your time."'
    ],
    attachment: null,
    signature: 'Internal PBX Call Detail Record #CDR-44912',
    disclaimer: 'Enterprise PBX Audio Recording.',
    flags: {
      from: ['Caller ID Identity', 0, 'Internal building facilities extension (1104) on authenticated corporate trunk.'],
      auth: ['VoIP Protocol Headers', 0, 'Level A STIR/SHAKEN attestation confirming legitimate corporate phone.'],
      subject: ['Pretext & Urgency', 0, 'Informational building update with zero urgency or call-to-action.'],
      body: ['Content Integrity', 0, 'Pure operational communication with no requests for data or credentials.']
    },
    rawRFC: `INVITE sip:${rep.name.toLowerCase().replace(' ', '.')}@enterprise.corp SIP/2.0\nFrom: "Tom Ward - Facilities" <sip:1104@enterprise.corp>\nSTIR-SHAKEN-Attestation: A`,
    transportHops: [
      { node: 'cucm-internal.enterprise.corp [10.5.0.10]', proto: 'SIP mTLS', status: 'VERIFIED' }
    ]
  };
}

function generateCleanVoiceRecruiterIncident(id, rep) {
  return {
    id: id,
    channel: 'CHANNEL: VOIP PBX',
    attackCategory: 'CLEAN',
    severity: 'LOW',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(15, 45) + 'm ago',
    status: 'pending',
    isPhishing: false,
    mitreTechnique: 'Benign Internal HR Coordination Call (Legitimate)',
    subject: 'Reported Phone Call: Internal Talent Acquisition Interview Panel Confirmation',
    senderDisplay: 'Ext 2290 - Talent Acquisition (Internal PBX)',
    senderEmail: 'Ext 2290 (HR Recruiting Desk)',
    authSummary: 'PBX Transport: Internal Cisco CUCM · STIR/SHAKEN: Level A',
    date: 'Wed, 04 Nov 2026 09:50:00 +0100',
    to: rep.name + ' (Direct Extension)',
    bodyParagraphs: [
      '[AUDIO CALL RECORDING TRANSCRIPT - DURATION: 0m 38s]',
      'CALLER (HR Recruiter Nina): "Hi ' + rep.name.split(' ')[0] + ', Nina from Internal Recruiting. Just checking if you still have availability at 15:00 tomorrow to sit in on the technical panel interview for the Senior Engineer candidate?"',
      'REPORTER: "Yes, I saw the calendar invite in Outlook."',
      'CALLER: "Awesome, the candidate resume packet is already attached to that calendar event in Greenhouse. See you tomorrow!"'
    ],
    attachment: null,
    signature: 'Internal PBX Call Detail Record #CDR-55201',
    disclaimer: 'Enterprise PBX Audio Recording.',
    flags: {
      from: ['Caller ID Identity', 0, 'Verified internal HR extension (2290).'],
      auth: ['VoIP Protocol Headers', 0, 'Authenticated internal SIP trunk with Level A attestation.'],
      subject: ['Pretext & Urgency', 0, 'Normal scheduling coordination for an interview panel.'],
      body: ['Content Integrity', 0, 'Refers to existing Outlook calendar invite and official Greenhouse ATS with zero sensitive requests.']
    },
    rawRFC: `INVITE sip:${rep.name.toLowerCase().replace(' ', '.')}@enterprise.corp SIP/2.0\nFrom: "Nina Patel - HR" <sip:2290@enterprise.corp>\nSTIR-SHAKEN-Attestation: A`,
    transportHops: [{ node: 'cucm-internal.enterprise.corp [10.5.0.10]', proto: 'SIP mTLS', status: 'VERIFIED' }]
  };
}

function generateCleanVoiceCabIncident(id, rep) {
  return {
    id: id,
    channel: 'CHANNEL: VOIP PBX',
    attackCategory: 'CLEAN',
    severity: 'LOW',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(8, 30) + 'm ago',
    status: 'pending',
    isPhishing: false,
    mitreTechnique: 'Benign Release Engineering Call (Legitimate)',
    subject: 'Reported Phone Call: Change Advisory Board Production Freeze Reminder',
    senderDisplay: 'Ext 3105 - Release Management (Internal)',
    senderEmail: 'Ext 3105 (CAB Chair Desk)',
    authSummary: 'PBX Transport: Internal Voice Trunk · STIR/SHAKEN: Level A',
    date: 'Wed, 04 Nov 2026 10:40:00 +0100',
    to: rep.name + ' (Direct Extension)',
    bodyParagraphs: [
      '[AUDIO CALL RECORDING TRANSCRIPT - DURATION: 0m 32s]',
      'CALLER (Release Lead Viktor): "Hey ' + rep.name.split(' ')[0] + ', Viktor from Release Engineering. Quick reminder that our Q4 code freeze starts at 18:00 today. Make sure any non-blocking PRs are merged in GitLab before then."',
      'REPORTER: "Got it, we already merged our branch this morning."',
      'CALLER: "Perfect, thanks!"'
    ],
    attachment: null,
    signature: 'Internal PBX Call Detail Record #CDR-60112',
    disclaimer: 'Enterprise PBX Audio Recording.',
    flags: {
      from: ['Caller ID Identity', 0, 'Internal extension 3105 verified on corporate PBX.'],
      auth: ['VoIP Protocol Headers', 0, 'Full Level A internal attestation.'],
      subject: ['Pretext & Urgency', 0, 'Standard operational reminder about scheduled code freeze.'],
      body: ['Content Integrity', 0, 'No credentials, tokens, or external actions requested.']
    },
    rawRFC: `INVITE sip:${rep.name.toLowerCase().replace(' ', '.')}@enterprise.corp SIP/2.0\nFrom: "Viktor - Release Mgmt" <sip:3105@enterprise.corp>\nSTIR-SHAKEN-Attestation: A`,
    transportHops: [{ node: 'cucm-internal.enterprise.corp [10.5.0.10]', proto: 'SIP mTLS', status: 'VERIFIED' }]
  };
}

// =========================================================================
// QR / QUISHING & CLEAN QR SCENARIOS
// =========================================================================

function generateQuishingIncident(id, rep) {
  var fakeDom = pick(PHISH_DOMAINS);
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'QUISHING',
    severity: 'HIGH',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(5, 30) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.002 / T1556 (Quishing - QR Code MFA Interception)',
    subject: 'Mandatory Device Re-registration: Multi-Factor Authentication Migration',
    senderDisplay: 'Microsoft 365 Identity Security',
    senderEmail: 'mfa-security@' + fakeDom,
    authSummary: 'SPF: softfail · DKIM: none · DMARC: fail',
    date: 'Wed, 04 Nov 2026 11:02:14 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Hello ' + rep.name.split(' ')[0] + ',',
      'As part of our Zero-Trust corporate security policy, all mobile devices registered for Authenticator Push notifications must be re-enrolled before end of shift.',
      'To bypass standard email inspection filters and guarantee endpoint binding, scan the cryptographic QR matrix below with your mobile camera and authenticate your session:'
    ],
    qrPayload: 'https://' + fakeDom + '/mfa/enroll?device=' + rn(1000, 9999),
    attachment: null,
    signature: 'Identity Security Operations\nGlobal IT Identity Management',
    disclaimer: 'Enterprise Identity Security Division.',
    flags: {
      from: ['Sender Identity (Smoking Gun)', 1, "Imposter Host: '@" + fakeDom + "' is not an authorized enterprise identity domain."],
      auth: ['Technical Headers', 1, 'Authentication Failure: Missing DKIM signature with softfail SPF.'],
      subject: ['Pretext & Urgency', 1, 'Artificial Urgency: Imposes end-of-shift deadline to force compliance.'],
      body: ['Content Coercion', 1, 'Quishing Pattern: Explicitly tells the user to scan a QR code with their personal phone to evade computer filters.'],
      qr: ['Embedded QR Vector (Smoking Gun)', 1, "Stealth QR Code: Encodes link to '" + fakeDom + "' targeting mobile devices outside corporate endpoint controls."]
    },
    rawRFC: `Received: from vps49.qr-relay.com (194.67.210.15) by mx.enterprise.corp;\nAuthentication-Results: mx.enterprise.corp; spf=softfail; dmarc=fail\nFrom: "Microsoft 365 Identity Security" <mfa-security@${fakeDom}>`,
    transportHops: [
      { node: 'vps49.qr-relay.com [194.67.210.15]', proto: 'ESMTPSA', status: 'UNREGISTERED_ORIGIN' },
      { node: 'mx.enterprise.corp [10.0.0.10]', proto: 'Inbound OCR Parser', status: 'IMAGE_CONTENT_DETECTED' }
    ]
  };
}

function generateQuishingParkingIncident(id, rep) {
  var fakeDom = pick(PHISH_DOMAINS);
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'QUISHING',
    severity: 'MEDIUM',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(10, 45) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.002 (Quishing via Corporate Facility Pretext)',
    subject: 'Facility Notice: Campus Parking Pass Renewal & License Validation',
    senderDisplay: 'Corporate Facility Management',
    senderEmail: 'parking-services@' + fakeDom,
    authSummary: 'SPF: fail · DKIM: none · DMARC: fail',
    date: 'Wed, 04 Nov 2026 09:50:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Good morning ' + rep.name.split(' ')[0] + ',',
      'Security is updating the automated license plate recognition barrier gates at the campus underground garage.',
      'Scan the digital voucher code below with your smartphone camera to validate your vehicle permit and prevent gate lockout next week:'
    ],
    qrPayload: 'https://' + fakeDom + '/parking/renew?user=' + rep.name.toLowerCase().replace(' ', '.'),
    attachment: null,
    signature: 'Corporate Facilities & Physical Security',
    disclaimer: 'Automated Facility Dispatch.',
    flags: {
      from: ['Sender Identity (Smoking Gun)', 1, "Imposter Host: Facilities notices originate strictly from enterprise.corp, not '@" + fakeDom + "'."],
      auth: ['Technical Headers', 1, 'Authentication Failure: Missing cryptographic DKIM signature and failed SPF authorization.'],
      subject: ['Pretext & Urgency', 1, 'Physical Lockout Threat: Claims parking barrier lockout to prompt immediate reaction.'],
      body: ['Optical Evasion', 1, 'Out-of-Band Redirect: Instructs employee to scan an embedded optical matrix using smartphone.'],
      qr: ['Embedded QR Vector (Smoking Gun)', 1, "QR Smuggling: QR matrix resolves to external harvesting site '" + fakeDom + "'."]
    },
    rawRFC: `Received: from relay.facility-cloud.biz (185.100.85.12) by mx.enterprise.corp;\nAuthentication-Results: mx.enterprise.corp; spf=fail; dmarc=fail\nFrom: "Corporate Facility Management" <parking-services@${fakeDom}>`,
    transportHops: [
      { node: 'relay.facility-cloud.biz [185.100.85.12]', proto: 'TLS 1.2', status: 'ANOMALOUS_HOST' },
      { node: 'mx.enterprise.corp [10.0.0.10]', proto: 'Mail Gateway', status: 'UNVERIFIED_SENDER' }
    ]
  };
}

function generateQuishingWifiIncident(id, rep) {
  var fakeDom = pick(PHISH_DOMAINS);
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'QUISHING',
    severity: 'HIGH',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(5, 30) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.002 / T1027.006 (Quishing / Enterprise Guest Wi-Fi Profile)',
    subject: 'Campus IT Bulletin: Mandatory 802.1X Enterprise Wi-Fi Certificate Profile',
    senderDisplay: 'Campus Network Security Desk',
    senderEmail: 'wifi-support@' + fakeDom,
    authSummary: 'SPF: fail · DKIM: none · DMARC: fail',
    date: 'Wed, 04 Nov 2026 10:40:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Hello ' + rep.name.split(' ')[0] + ',',
      'IT is rotating the internal 802.1X corporate wireless root certificate across all corporate office floors tonight.',
      'To ensure your mobile handset maintains wireless internet connection tomorrow, scan the QR configuration profile below using your personal camera app to install the new device profile:'
    ],
    qrPayload: 'https://' + fakeDom + '/wifi/install-cert?user=' + rep.name.toLowerCase().replace(' ', '.'),
    attachment: null,
    signature: 'Network Operations Group\nCampus Infrastructure Team',
    disclaimer: 'Enterprise Network Broadcast.',
    flags: {
      from: ['Sender Identity (Smoking Gun)', 1, "Imposter Host: '@" + fakeDom + "' is an unauthorized external domain mimicking corporate Wi-Fi."],
      auth: ['Technical Headers', 1, 'Authentication Failure: Missing DKIM verification with failed SPF record.'],
      subject: ['Pretext & Urgency', 1, 'Connectivity Threat: Imposes threat of wireless disconnect to bypass caution.'],
      qr: ['Embedded QR Vector (Smoking Gun)', 1, "Malicious Mobile Profile: QR code prompts mobile download of rogue MDM/certificate profile from '" + fakeDom + "'."]
    },
    rawRFC: `Received: from relay.wifi-fake.biz (185.220.101.9) by mx.enterprise.corp;\nAuthentication-Results: mx.enterprise.corp; spf=fail; dmarc=fail\nFrom: "Campus Network Security Desk" <wifi-support@${fakeDom}>`,
    transportHops: [{ node: 'relay.wifi-fake.biz [185.220.101.9]', proto: 'TLS 1.2', status: 'ANOMALOUS_HOST' }]
  };
}

function generateQuishingBadgeIncident(id, rep) {
  var fakeDom = pick(PHISH_DOMAINS);
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'QUISHING',
    severity: 'HIGH',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(4, 25) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.002 / T1027.006 (Quishing / Digital Building Access Badge)',
    subject: 'Corporate Security: Mandatory Mobile NFC & Digital Access Badge Activation',
    senderDisplay: 'Global Physical Security Desk',
    senderEmail: 'access-control@' + fakeDom,
    authSummary: 'SPF: fail · DKIM: none · DMARC: fail',
    date: 'Wed, 04 Nov 2026 10:12:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Dear ' + rep.name.split(' ')[0] + ',',
      'Physical security is upgrading all turnstile biometric readers to support encrypted mobile NFC badges.',
      'Scan the secure provisioning matrix below using your smartphone camera to synchronize your employee pass before building reentry tomorrow:'
    ],
    qrPayload: 'https://' + fakeDom + '/badge/sync?user=' + rep.name.toLowerCase().replace(' ', '.'),
    attachment: null,
    signature: 'Global Physical Security & Facilities',
    disclaimer: 'Enterprise Security Directorate.',
    flags: {
      from: ['Sender Identity (Smoking Gun)', 1, "Imposter Host: Physical security notices originate from enterprise.corp, not '@" + fakeDom + "'."],
      auth: ['Technical Headers', 1, 'Authentication Failure: Missing cryptographic signature.'],
      subject: ['Pretext & Urgency', 1, 'Building Access Threat: Claims turnstile lockout to force immediate mobile action.'],
      qr: ['Embedded QR Vector (Smoking Gun)', 1, "Malicious QR Code: Encodes link to external harvesting host '" + fakeDom + "'."]
    },
    rawRFC: `Received: from mail.badge-secure.biz (185.220.101.90) by mx.enterprise.corp;\nAuthentication-Results: mx.enterprise.corp; spf=fail; dmarc=fail\nFrom: "Global Physical Security Desk" <access-control@${fakeDom}>`,
    transportHops: [{ node: 'mail.badge-secure.biz [185.220.101.90]', proto: 'TLS 1.2', status: 'ANOMALOUS_HOST' }]
  };
}

function generateQuishingEdrIncident(id, rep) {
  var fakeDom = pick(PHISH_DOMAINS);
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'QUISHING',
    severity: 'HIGH',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(6, 20) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.002 (Quishing / BYOD Mobile Intune Enrollment Lure)',
    subject: 'Action Required: Intune Mobile Device Management (MDM) Compliance Sync',
    senderDisplay: 'Endpoint Compliance Automation',
    senderEmail: 'mdm-enroll@intune-device-sync.co',
    authSummary: 'SPF: pass (intune-device-sync.co) · DKIM: pass · DMARC: pass',
    date: 'Wed, 04 Nov 2026 11:08:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Hi ' + rep.name.split(' ')[0] + ',',
      'Our automated compliance scanner detected that your mobile Teams and Outlook client certificate is out of sync with our 2026 Intune policy.',
      'Please scan the QR enrollment token below with your phone to re-validate your Microsoft 365 mobile session:'
    ],
    qrPayload: 'https://' + fakeDom + '/intune/reauth?u=' + rep.name.toLowerCase().replace(' ', '.'),
    attachment: null,
    signature: 'Enterprise Endpoint Engineering',
    disclaimer: 'Automated Compliance Notice.',
    flags: {
      from: ['Sender Identity (Smoking Gun)', 1, "Look-alike External Domain: Uses '@intune-device-sync.co' instead of internal enterprise.corp."],
      auth: ['Technical Headers', 0, 'SPF/DKIM pass for the attacker’s look-alike domain.'],
      qr: ['Embedded QR Vector (Smoking Gun)', 1, "Malicious QR Redirect: Directs mobile browser to '" + fakeDom + "' to harvest Microsoft 365 credentials."]
    },
    rawRFC: `Received: from mta.intune-device-sync.co (194.26.29.88) by mx.enterprise.corp;\nAuthentication-Results: mx.enterprise.corp; spf=pass; dkim=pass d=intune-device-sync.co; dmarc=pass\nFrom: "Endpoint Compliance Automation" <mdm-enroll@intune-device-sync.co>`,
    transportHops: [{ node: 'mta.intune-device-sync.co [194.26.29.88]', proto: 'TLS 1.3', status: 'EXTERNAL_DOMAIN' }]
  };
}

function generateCleanQREventIncident(id, rep) {
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'CLEAN',
    severity: 'LOW',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(10, 40) + 'm ago',
    status: 'pending',
    isPhishing: false,
    mitreTechnique: 'Benign Corporate Event Access Pass (Legitimate)',
    subject: 'Your Registered Attendee Badge & Agenda: Annual Tech Summit 2026',
    senderDisplay: 'Enterprise Events & Culture',
    senderEmail: 'events@enterprise.corp',
    authSummary: 'SPF: pass (10.0.1.20) · DKIM: pass (enterprise.corp) · DMARC: pass',
    date: 'Wed, 04 Nov 2026 09:10:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Hi ' + rep.name.split(' ')[0] + ',',
      'Your registration for this Thursday’s internal Tech Summit at the corporate auditorium is confirmed.',
      'Show the QR attendance voucher below at the welcome desk kiosk for physical lanyard printing. The code contains only your registration reference ID and does not solicit login credentials.'
    ],
    qrPayload: 'https://events.enterprise.corp/badge?id=' + rn(10000, 99999),
    attachment: null,
    signature: 'Internal Events Committee\nEnterprise Tech Summit 2026',
    disclaimer: 'Internal enterprise corporate memo.',
    flags: {
      from: ['Sender Identity', 0, 'Internal corporate event communications mailbox on enterprise.corp.'],
      auth: ['Technical Headers', 0, 'Full DKIM, SPF, and DMARC alignment on internal corporate IP.'],
      subject: ['Subject & Urgency', 0, 'Standard confirmation notice for an event the employee registered for.'],
      body: ['Content Integrity', 0, 'Explicitly informs recipient that QR badge is only for kiosk check-in with zero login solicitations.'],
      qr: ['Embedded QR Vector', 0, 'QR voucher points strictly to internal corporate events subdomain.']
    },
    rawRFC: `Received: from events-app.enterprise.corp (10.0.1.20) by mx.enterprise.corp;\nAuthentication-Results: mx.enterprise.corp; spf=pass; dkim=pass d=enterprise.corp; dmarc=pass\nFrom: "Enterprise Events & Culture" <events@enterprise.corp>`,
    transportHops: [
      { node: 'events-app.enterprise.corp [10.0.1.20]', proto: 'TLS 1.3', status: 'INTRANET_AUTHORIZED' },
      { node: 'mx.enterprise.corp [10.0.0.10]', proto: 'Inbound Gateway', status: 'DELIVERED' }
    ]
  };
}

function generateCleanQRCafeteriaIncident(id, rep) {
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'CLEAN',
    severity: 'LOW',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(12, 50) + 'm ago',
    status: 'pending',
    isPhishing: false,
    mitreTechnique: 'Benign Internal Hospitality Voucher (Legitimate)',
    subject: 'Team Appreciation Week: Complimentary Campus Barista Voucher',
    senderDisplay: 'Workplace Experience Team',
    senderEmail: 'workplace@enterprise.corp',
    authSummary: 'SPF: pass (10.0.1.22) · DKIM: pass (enterprise.corp) · DMARC: pass',
    date: 'Wed, 04 Nov 2026 08:45:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Good morning ' + rep.name.split(' ')[0] + ',',
      'To celebrate Q4 product milestones, Workplace Experience is treating all staff to complimentary specialty coffee at the Ground Floor Atrium Cafe all week.',
      'Simply scan the static POS voucher QR below at the cafe register. It does not open a browser or require any login:'
    ],
    qrPayload: 'https://intranet.enterprise.corp/cafe-pos/voucher-2026-q4',
    attachment: null,
    signature: 'Workplace Experience & Hospitality\nEnterprise HQ',
    disclaimer: 'Internal Campus Broadcast.',
    flags: {
      from: ['Sender Identity', 0, 'Verified internal workplace experience address on enterprise.corp.'],
      auth: ['Technical Headers', 0, 'Full internal SPF/DKIM alignment.'],
      subject: ['Subject & Urgency', 0, 'Friendly internal perk announcement with zero urgency.'],
      qr: ['Embedded QR Vector', 0, 'Resolves to internal intranet POS voucher path with no authentication prompt.']
    },
    rawRFC: `Received: from workplace-mail.enterprise.corp (10.0.1.22) by mx.enterprise.corp;\nAuthentication-Results: mx.enterprise.corp; spf=pass; dkim=pass d=enterprise.corp; dmarc=pass\nFrom: "Workplace Experience Team" <workplace@enterprise.corp>`,
    transportHops: [{ node: 'workplace-mail.enterprise.corp [10.0.1.22]', proto: 'TLS 1.3', status: 'INTERNAL_TRUSTED' }]
  };
}

function generateCleanQRVisitorIncident(id, rep) {
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'CLEAN',
    severity: 'LOW',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(7, 30) + 'm ago',
    status: 'pending',
    isPhishing: false,
    mitreTechnique: 'Benign Lobby Visitor Check-In Confirmation (Legitimate)',
    subject: 'Envoy Lobby Reception: Pre-Registered Visitor Pass Confirmation',
    senderDisplay: 'Front Desk Reception (Envoy)',
    senderEmail: 'reception-desk@enterprise.corp',
    authSummary: 'SPF: pass (10.0.1.25) · DKIM: pass (enterprise.corp) · DMARC: pass',
    date: 'Wed, 04 Nov 2026 09:30:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Hi ' + rep.name.split(' ')[0] + ',',
      'You have pre-registered an on-site visitor for today at 14:00 at the Main Lobby turnstile.',
      'Your guest can present this static check-in QR code at the lobby iPad kiosk to print their temporary escort sticker:'
    ],
    qrPayload: 'https://lobby.enterprise.corp/kiosk/checkin?pass=' + rn(10000, 99999),
    attachment: null,
    signature: 'Corporate Reception & Lobby Desk',
    disclaimer: 'Automated Lobby Kiosk Dispatch.',
    flags: {
      from: ['Sender Identity', 0, 'Verified internal reception address on enterprise.corp.'],
      auth: ['Technical Headers', 0, 'Full internal SPF/DKIM alignment.'],
      qr: ['Embedded QR Vector', 0, 'Points to internal lobby.enterprise.corp kiosk check-in endpoint.']
    },
    rawRFC: `Received: from lobby-kiosk.enterprise.corp (10.0.1.25) by mx.enterprise.corp;\nAuthentication-Results: mx.enterprise.corp; spf=pass; dkim=pass d=enterprise.corp; dmarc=pass\nFrom: "Front Desk Reception" <reception-desk@enterprise.corp>`,
    transportHops: [{ node: 'lobby-kiosk.enterprise.corp [10.0.1.25]', proto: 'TLS 1.3', status: 'INTERNAL_TRUSTED' }]
  };
}

// =========================================================================
// SUBTLE & ADVANCED EMAIL SCENARIOS (SPEAR, MASS, & HARD DECOYS)
// =========================================================================

function generateSubtleTyposquatIncident(id, rep) {
  var typoDomain = 'enterpr1se-corp.com';
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'SPEAR_PHISHING',
    severity: 'HIGH',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(3, 18) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.002 / T1583.001 (Homoglyph Typosquatting)',
    subject: 'Q4 Departmental Budget Forecast & Headcount Alignment',
    senderDisplay: 'Lauren Vance (VP of Corporate Strategy)',
    senderEmail: 'lauren.vance@' + typoDomain,
    authSummary: 'SPF: pass (' + typoDomain + ') · DKIM: pass (' + typoDomain + ') · DMARC: pass',
    date: 'Wed, 04 Nov 2026 10:15:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Hi ' + rep.name.split(' ')[0] + ',',
      'Ahead of Friday’s steering committee meeting, I have uploaded the revised headcount allocation sheet for ' + rep.dept + ' to our shared strategy drive.',
      'Please review column F and add any commentary before Thursday afternoon so we can lock the slide deck.'
    ],
    linkDisplay: 'https://docs.enterprise.corp/strategy/q4-headcount-sheet',
    linkTarget: 'https://docs.' + typoDomain + '/strategy/q4-headcount-sheet',
    attachment: null,
    signature: 'Lauren Vance\nVP of Corporate Strategy',
    disclaimer: 'Internal Strategy Planning.',
    flags: {
      from: ['Homoglyph Typosquatting (Smoking Gun)', 1, "Subtle Character Substitution: Uses digit '1' instead of 'i' in 'enterpr1se-corp.com'. Everything else in the email is calm and well-written."],
      auth: ['Technical Headers', 0, 'SPF and DKIM pass because the attacker registered the typosquatted domain and configured valid DNS records for it.'],
      subject: ['Subject & Urgency', 0, 'Realistic, low-pressure corporate subject line.'],
      link: ['Weaponized Link Target (Smoking Gun)', 1, "Typosquatted Destination: Resolves to 'docs.enterpr1se-corp.com' rather than 'enterprise.corp'."]
    },
    rawRFC: `Received: from mail.${typoDomain} (194.26.29.104) by mx.enterprise.corp with TLSv1.3;\nAuthentication-Results: mx.enterprise.corp; spf=pass smtp.mailfrom=${typoDomain}; dkim=pass d=${typoDomain}; dmarc=pass\nFrom: "Lauren Vance" <lauren.vance@${typoDomain}>`,
    transportHops: [{ node: 'mail.enterpr1se-corp.com [194.26.29.104]', proto: 'TLS 1.3', status: 'PASS' }]
  };
}

function generateSubtleReplyToIncident(id, rep) {
  var replyEvil = 'cfo.executive.desk@proton.me';
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'SPEAR_PHISHING',
    severity: 'HIGH',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(4, 21) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.002 / T1656 (BEC Reply-To Redirection)',
    subject: 'Confidential: Updated Aged Receivables & Vendor Liquidity Aging',
    senderDisplay: 'Sarah Mitchell (Chief Financial Officer)',
    senderEmail: 'sarah.mitchell@enterprise.corp (Display Spoof)',
    replyTo: replyEvil,
    authSummary: 'SPF: softfail · DKIM: none · DMARC: fail (p=none monitor mode)',
    date: 'Wed, 04 Nov 2026 11:12:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Hi ' + rep.name.split(' ')[0] + ',',
      'Could you reply to this email with a copy of our current aged vendor payables schedule and available operating cash balance as of this morning?',
      'I am preparing for the audit committee call at 14:00 and just need the raw figures by email reply. Thanks.'
    ],
    attachment: null,
    signature: 'Sarah Mitchell\nChief Financial Officer',
    disclaimer: 'Sent from my iPad.',
    flags: {
      from: ['Spoofed Display Header', 1, 'Forged RFC 5322 From header claiming to be sarah.mitchell@enterprise.corp without cryptographic alignment.'],
      replyto: ['Reply-To Redirection (Smoking Gun)', 1, "External Webmail Reply-To: Hitting 'Reply' sends confidential financial schedules to 'cfo.executive.desk@proton.me'."],
      auth: ['Technical Headers (Smoking Gun)', 1, 'SPF softfail and missing DKIM signature prove the message did not originate from enterprise.corp.'],
      body: ['Financial Data Reconnaissance', 1, 'Linkless BEC reconnaissance soliciting aged payables and bank balances to stage a subsequent wire fraud.']
    },
    rawRFC: `Received: from relay-out.mail-gateway.biz (185.190.140.88) by mx.enterprise.corp;\nAuthentication-Results: mx.enterprise.corp; spf=softfail; dkim=none; dmarc=fail\nFrom: "Sarah Mitchell (Chief Financial Officer)" <sarah.mitchell@enterprise.corp>\nReply-To: <${replyEvil}>`,
    transportHops: [{ node: 'relay-out.mail-gateway.biz [185.190.140.88]', proto: 'ESMTP', status: 'QUEUED' }]
  };
}

function generateSpearGithubPatIncident(id, rep) {
  var fakeDom = 'github-security-webhooks.co';
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'SPEAR_PHISHING',
    severity: 'HIGH',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(3, 16) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.002 / T1552.004 (Developer Credential & PAT Harvesting)',
    subject: '[GitHub Enterprise] Secret scanning alert: Exposed AWS Key in enterprise/core-api',
    senderDisplay: 'GitHub Enterprise Security',
    senderEmail: 'noreply@' + fakeDom,
    authSummary: 'SPF: pass (' + fakeDom + ') · DKIM: pass (' + fakeDom + ') · DMARC: pass',
    date: 'Wed, 04 Nov 2026 11:20:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Hey ' + rep.name.split(' ')[0] + ',',
      'GitHub secret scanning detected a high-entropy AWS_SECRET_ACCESS_KEY committed to branch `release/v4.2` in `enterprise/core-api`.',
      'Please authenticate via the repository security console below to revoke the exposed Personal Access Token (PAT) and sign the incident log:'
    ],
    linkDisplay: 'https://github.com/enterprise/core-api/security/secret-scanning/8941',
    linkTarget: 'https://sso.' + fakeDom + '/login/oauth?repo=enterprise/core-api',
    attachment: null,
    signature: 'GitHub Advanced Security Automated Scanner',
    disclaimer: 'You are receiving this because you have write access to enterprise/core-api.',
    flags: {
      from: ['Sender Identity (Smoking Gun)', 1, "Look-alike Domain: Official GitHub alerts come from '@github.com', never from '@github-security-webhooks.co'."],
      auth: ['Technical Headers', 0, 'SPF and DKIM pass on the attacker’s look-alike .co domain.'],
      link: ['Weaponized Link Target (Smoking Gun)', 1, "Deceptive Link: Anchor shows github.com, but routes to 'sso.github-security-webhooks.co'."]
    },
    rawRFC: `Received: from out.${fakeDom} (194.26.29.61) by mx.enterprise.corp;\nAuthentication-Results: mx.enterprise.corp; spf=pass; dkim=pass d=${fakeDom}; dmarc=pass\nFrom: "GitHub Enterprise Security" <noreply@${fakeDom}>`,
    transportHops: [{ node: 'out.github-security-webhooks.co [194.26.29.61]', proto: 'TLS 1.3', status: 'OK' }]
  };
}

function generateSpearSvgSmugglingIncident(id, rep) {
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'SPEAR_PHISHING',
    severity: 'HIGH',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(6, 24) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.001 / T1027.006 (Spearphishing Attachment / SVG Script Smuggling)',
    subject: 'Updated Network Topology & Firewall Diagram for Q4 PCI-DSS Audit',
    senderDisplay: 'External PCI Assessor (Coalfire)',
    senderEmail: 'assessor@coalfire-pci-audit.org',
    authSummary: 'SPF: softfail · DKIM: none · DMARC: fail',
    date: 'Wed, 04 Nov 2026 10:05:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Hi ' + rep.name.split(' ')[0] + ',',
      'Attached is the vector diagram of the cardholder data environment (CDE) segmentation boundary with our redline annotations.',
      'Open the attached `.svg` vector image in your browser and log in with your corporate credentials when prompted to decrypt the redline comments.'
    ],
    attachment: 'CDE_Network_Topology_Redline_2026.svg (412 KB)',
    signature: 'External PCI-DSS QSA Assessment Team',
    disclaimer: 'Audit Workpaper Dispatch.',
    flags: {
      from: ['Sender Identity (Smoking Gun)', 1, "Unverified Domain: Uses look-alike '@coalfire-pci-audit.org' with failing authentication."],
      auth: ['Technical Headers', 1, 'SPF softfail and missing DKIM signature.'],
      body: ['Credential Prompt inside Image Pretext', 1, 'Vector image files (.svg) never legitimately require corporate credentials to "decrypt" comments.'],
      attachment: ['SVG HTML/JS Smuggling Payload (Smoking Gun)', 1, 'Malicious .svg Attachment: SVG files are XML documents that can execute embedded JavaScript (<script>) in the browser to render fake login forms or smuggle malware.']
    },
    rawRFC: `Received: from mail.coalfire-pci-audit.org (185.140.50.44) by mx.enterprise.corp;\nAuthentication-Results: mx.enterprise.corp; spf=softfail; dmarc=fail\nX-Attachment-Name: CDE_Network_Topology_Redline_2026.svg`,
    transportHops: [{ node: 'mail.coalfire-pci-audit.org [185.140.50.44]', proto: 'ESMTP', status: 'OK' }]
  };
}

function generateMassVoicemailIncident(id, rep) {
  var fakeDom = pick(PHISH_DOMAINS);
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'MASS_PHISHING',
    severity: 'MEDIUM',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(9, 38) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.001 / T1027.006 (Mass Phishing / HTML Attachment Credential Harvester)',
    subject: 'Cisco Unity Connection: New Voice Message (0m 48s) from +1 (800) 555-0192',
    senderDisplay: 'Cisco Unity Voicemail Daemon',
    senderEmail: 'voicemail-daemon@' + fakeDom,
    authSummary: 'SPF: fail · DKIM: none · DMARC: fail',
    date: 'Wed, 04 Nov 2026 09:32:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'You have received an urgent voice message (Duration: 48 seconds) left on your extension.',
      'Open the attached HTML audio player (`Voicemail_Player_8841.shtml`) in your browser and sign in with your corporate email password to stream the recording.'
    ],
    attachment: 'Voicemail_Player_8841.shtml (68 KB)',
    signature: 'Cisco Unity Automated Messaging Bridge',
    disclaimer: 'Automated Voicemail Notification.',
    flags: {
      from: ['Sender Identity (Smoking Gun)', 1, "External Phishing Domain: Internal voicemail notifications never originate from '@" + fakeDom + "'."],
      auth: ['Technical Headers', 1, 'SPF and DMARC fail completely.'],
      attachment: ['HTML Credential Harvester Attachment (Smoking Gun)', 1, 'Suspicious .shtml/.html Attachment: Contains an offline JavaScript login form disguised as an audio player to steal credentials.']
    },
    rawRFC: `Received: from vps12.voice-relay.org (185.220.101.88) by mx.enterprise.corp;\nAuthentication-Results: mx.enterprise.corp; spf=fail; dmarc=fail\nX-Attachment-Name: Voicemail_Player_8841.shtml`,
    transportHops: [{ node: 'vps12.voice-relay.org [185.220.101.88]', proto: 'ESMTP', status: 'OK' }]
  };
}

function generateCleanGithubDependabotIncident(id, rep) {
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'CLEAN',
    severity: 'LOW',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(10, 35) + 'm ago',
    status: 'pending',
    isPhishing: false,
    mitreTechnique: 'Benign Automated DevSecOps Notification (Legitimate)',
    subject: '[GitHub] Dependabot bumped lodash from 4.17.20 to 4.17.21 in /services/billing',
    senderDisplay: 'GitHub Dependabot',
    senderEmail: 'notifications@github.com',
    authSummary: 'SPF: pass (out-21.smtp.github.com) · DKIM: pass (github.com) · DMARC: pass',
    date: 'Wed, 04 Nov 2026 09:18:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Dependabot opened Pull Request #412 in `enterprise/billing-service` to patch a known prototype pollution dependency advisory.',
      'You can inspect the diff and CI pipeline status directly on GitHub:'
    ],
    linkDisplay: 'https://github.com/enterprise/billing-service/pull/412',
    linkTarget: 'https://github.com/enterprise/billing-service/pull/412',
    attachment: null,
    signature: 'GitHub, Inc. · 88 Colin P Kelly Jr St, San Francisco, CA',
    disclaimer: 'You are subscribed to this repository.',
    flags: {
      from: ['Sender Identity', 0, 'Authentic notifications@github.com address.'],
      auth: ['Technical Headers', 0, 'Full SPF, DKIM (d=github.com), and DMARC pass from verified GitHub IP range.'],
      link: ['Link Routing', 0, 'Points directly to https://github.com with no redirect or look-alike characters.']
    },
    rawRFC: `Received: from out-21.smtp.github.com (192.30.252.204) by mx.enterprise.corp with TLSv1.3;\nAuthentication-Results: mx.enterprise.corp; spf=pass smtp.mailfrom=github.com; dkim=pass d=github.com; dmarc=pass\nFrom: "GitHub Dependabot" <notifications@github.com>`,
    transportHops: [{ node: 'out-21.smtp.github.com [192.30.252.204]', proto: 'TLS 1.3', status: 'OK' }]
  };
}

function generateSubtleMnaIncident(id, rep) {
  var fakeDom = 'enterprise-investor-relations.co';
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'SPEAR_PHISHING',
    severity: 'HIGH',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(5, 20) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.002 / T1583.001 (Spearphishing / Look-alike Domain)',
    subject: 'Project Horizon: Restricted M&A Disclosure Memorandum',
    senderDisplay: 'Corporate Investor Relations & M&A',
    senderEmail: 'ir-notices@' + fakeDom,
    authSummary: 'SPF: pass (' + fakeDom + ') · DKIM: pass (' + fakeDom + ') · DMARC: pass',
    date: 'Wed, 04 Nov 2026 11:25:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Strictly Private & Confidential ' + rep.name.split(' ')[0] + ',',
      'The board of directors has finalized non-disclosure terms regarding the acquisition of Horizon Cloud Systems.',
      'As a designated insider under regulatory compliance guidelines, please inspect the bound non-disclosure agreement on the investor portal link below.'
    ],
    linkDisplay: 'https://investor.enterprise.corp/mna/nda-review',
    linkTarget: 'https://investor.' + fakeDom + '/mna/nda-review',
    attachment: null,
    signature: 'Office of the General Counsel\nGlobal Mergers & Acquisitions Committee',
    disclaimer: 'STRICTLY PRIVILEGED AND CONFIDENTIAL.',
    flags: {
      from: ['Sender Identity (Smoking Gun)', 1, "Look-alike TLD: The domain ends in '.co' (enterprise-investor-relations.co) instead of the genuine 'enterprise.corp'. Attacker registered SPF/DKIM to bypass gates."],
      auth: ['Technical Headers', 0, 'SPF/DKIM pass on attacker’s own registered look-alike domain. Always verify the domain itself, not just pass indicators.'],
      subject: ['Subject & Urgency', 0, 'Professional executive M&A tone without broken syntax or obvious panics.'],
      link: ['Weaponized Link Target (Smoking Gun)', 1, "Mismatched URI: Display link shows 'enterprise.corp', destination targets fake domain ending in '.co'."]
    },
    rawRFC: `Received: from mail.${fakeDom} by mx.enterprise.corp with TLSv1.3;\nAuthentication-Results: mx.enterprise.corp; spf=pass smtp.mailfrom=${fakeDom}; dkim=pass d=${fakeDom}; dmarc=pass`,
    transportHops: [{ node: 'mail.enterprise-investor-relations.co [185.190.140.22]', proto: 'TLS 1.3', status: 'REGISTERED_LOOKALIKE' }]
  };
}

function generateSubtleVendorQuoteIncident(id, rep) {
  var fakeDom = pick(PHISH_DOMAINS);
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'SPEAR_PHISHING',
    severity: 'HIGH',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(5, 30) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.002 (Spearphishing / Request for Proposal Lure)',
    subject: 'Counter-Proposal: Annual Enterprise Cloud Licensing RFP #2026-99',
    senderDisplay: 'Amazon Web Services Strategic Accounts',
    senderEmail: 'proposals@' + fakeDom,
    authSummary: 'SPF: fail · DKIM: none · DMARC: fail',
    date: 'Wed, 04 Nov 2026 11:15:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Hi ' + rep.name.split(' ')[0] + ',',
      'Following up on the Q4 cloud infrastructure RFP renewal, our enterprise pricing desk has approved an 18% tier discount on committed EC2 reserved capacity.',
      'Please find the negotiated licensing rate schedule linked below for your review before our follow-up sync tomorrow morning.'
    ],
    linkDisplay: 'https://aws.amazon.com/enterprise/pricing/quote-2026-99',
    linkTarget: 'https://' + fakeDom + '/aws/quote-review',
    attachment: null,
    signature: 'AWS Enterprise Strategic Accounts Desk\nAmazon Web Services EMEA',
    disclaimer: 'Commercial In Confidence.',
    flags: {
      from: ['Sender Identity (Smoking Gun)', 1, "Deceptive Host: AWS proposals originate from '@amazon.com', never from external domain '@" + fakeDom + "'."],
      auth: ['Technical Headers (Smoking Gun)', 1, 'Authentication Failure: Missing cryptographic DKIM signature and failed SPF authorization.'],
      subject: ['Pretext & Urgency', 0, 'Natural corporate B2B proposal follow-up without obvious threats.'],
      link: ['Weaponized Link Target (Smoking Gun)', 1, "Deceptive Link: Anchor shows aws.amazon.com, but directs to credential harvesting host '" + fakeDom + "'."]
    },
    rawRFC: `Received: from relay.${fakeDom} by mx.enterprise.corp;\nAuthentication-Results: mx.enterprise.corp; spf=fail; dmarc=fail`,
    transportHops: [{ node: 'relay.aws-phish.biz [194.26.29.50]', proto: 'TLS 1.2', status: 'UNVERIFIED_HOST' }]
  };
}

function generateThreadHijackIncident(id, rep) {
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'SPEAR_PHISHING',
    severity: 'HIGH',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(3, 19) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.002 / T1586.002 (Thread Hijacking via Compromised Partner Mailbox)',
    subject: 'Re: Q4 External Audit Deliverables & Tax Schedule',
    senderDisplay: 'Martin Lindqvist (Deloitte External Audit)',
    senderEmail: 'mlindqvist@deloitte-audit-partner.com',
    authSummary: 'SPF: pass · DKIM: pass (deloitte-audit-partner.com) · DMARC: pass',
    date: 'Wed, 04 Nov 2026 11:38:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Hi ' + rep.name.split(' ')[0] + ',',
      'Apologies for the late follow-up on our thread from Friday. We had to revise the remittance routing numbers and adjustment figures in the final audit schedule.',
      'Please use the updated OneDrive vault link below to download the revised ACH wire instructions and sign in with your corporate credentials to acknowledge receipt.'
    ],
    threadQuote: {
      meta: 'On Fri, 30 Oct 2026 at 16:12, ' + rep.name + ' <' + rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp> wrote:',
      text: 'Hi Martin, thanks for sending over the preliminary Q4 tax schedule. Everything looks aligned on our end. Let me know once the final sign-off sheet is ready next week.'
    },
    linkDisplay: 'https://deloitte-my.sharepoint.com/:b:/r/personal/mlindqvist/Q4_Revised_ACH_Instructions',
    linkTarget: 'https://onedrive-auth-share-portal.top/deloitte/login?doc=Q4_Revised_ACH',
    attachment: null,
    signature: 'Martin Lindqvist, CPA\nSenior Audit Manager · External Assurance',
    disclaimer: 'This message is a continuation of an existing thread.',
    flags: {
      from: ['Compromised Vendor Account', 0, 'The sender address is a legitimate partner mailbox that was compromised (Account Takeover).'],
      auth: ['Technical Headers', 0, 'SPF and DKIM pass because the attacker sent the email directly from the vendor’s compromised mail server.'],
      subject: ['Thread Hijacking Context', 0, 'Replied inside an existing, authentic email conversation to build instant trust.'],
      body: ['Bank Routing Change Lure (Smoking Gun)', 1, 'Classic BEC indicator: Abruptly claims wire/ACH routing numbers had to be revised mid-thread.'],
      link: ['Weaponized Link Target (Smoking Gun)', 1, "Deceptive Link: Anchor mimics SharePoint, but actual target resolves to 'onedrive-auth-share-portal.top'."]
    },
    rawRFC: `Received: from mail.deloitte-audit-partner.com (198.51.100.14) by mx.enterprise.corp with TLSv1.3;\nReceived: from [197.210.70.88] (unknown-isp-lagos.net) by smtp.deloitte-audit-partner.com (Authenticated sender: mlindqvist);\nAuthentication-Results: mx.enterprise.corp; spf=pass; dkim=pass d=deloitte-audit-partner.com; dmarc=pass\nIn-Reply-To: <thread-88219@enterprise.corp>`,
    transportHops: [
      { node: 'client-ip [197.210.70.88]', proto: 'compromised SMTP Auth', status: 'GEO_ANOMALY_LOGIN' },
      { node: 'mail.deloitte-audit-partner.com [198.51.100.14]', proto: 'TLS 1.3', status: 'SPF_DKIM_PASS' }
    ]
  };
}

function generatePunycodeHomographIncident(id, rep) {
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'SPEAR_PHISHING',
    severity: 'HIGH',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(4, 22) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.002 / T1036.005 (IDN Homograph / Punycode Spoofing)',
    subject: 'Okta Identity: Hardware Security Key Certificate Renewal',
    senderDisplay: 'Okta Identity Operations',
    senderEmail: 'no-reply@оkta-security.com (IDN: xn--kta-security-0kbe.com)',
    authSummary: 'SPF: pass (xn--kta-security-0kbe.com) · DKIM: pass · DMARC: pass',
    date: 'Wed, 04 Nov 2026 10:18:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Hi ' + rep.name.split(' ')[0] + ',',
      'Your FIDO2 WebAuthn security key certificate associated with your enterprise Okta profile is scheduled for annual cryptographic rotation.',
      'Please complete the 30-second token re-binding check via the identity dashboard below to ensure uninterrupted SSO access.'
    ],
    linkDisplay: 'https://enterprise.оkta-security.com/sso/token-refresh',
    linkTarget: 'https://enterprise.xn--kta-security-0kbe.com/sso/token-refresh',
    attachment: null,
    signature: 'Okta Automated Identity Services',
    disclaimer: 'System generated notice.',
    flags: {
      from: ['IDN Punycode Homograph (Smoking Gun)', 1, "Cyrillic 'о' substitutes Latin 'o': The real domain in DNS is 'xn--kta-security-0kbe.com'."],
      auth: ['Technical Headers', 0, 'SPF/DKIM pass for the punycode domain itself.'],
      subject: ['Subject & Urgency', 0, 'Calm, technical phrasing without obvious grammatical flaws.'],
      link: ['Weaponized Link Target (Smoking Gun)', 1, "Punycode URI: Hovering or inspecting the raw URL reveals 'xn--kta-security-0kbe.com'."]
    },
    rawRFC: `Received: from mta.xn--kta-security-0kbe.com (185.220.101.74) by mx.enterprise.corp;\nAuthentication-Results: mx.enterprise.corp; spf=pass smtp.mailfrom=xn--kta-security-0kbe.com; dkim=pass d=xn--kta-security-0kbe.com;\nFrom: "Okta Identity Operations" <no-reply@xn--kta-security-0kbe.com>`,
    transportHops: [
      { node: 'mta.xn--kta-security-0kbe.com [185.220.101.74]', proto: 'TLS 1.3', status: 'IDN_PUNYCODE_DOMAIN' }
    ]
  };
}

function generateOpenRedirectIncident(id, rep) {
  var fakeDom = pick(PHISH_DOMAINS);
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'SPEAR_PHISHING',
    severity: 'HIGH',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(6, 28) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.002 (Trusted Domain Open Redirect Abuse)',
    subject: 'Shared Confluence Workspace: Q4 Architecture & API Keys Review',
    senderDisplay: 'Atlassian Confluence Notifications',
    senderEmail: 'confluence-notify@atlassian-cloud-mail.co',
    authSummary: 'SPF: pass (sendgrid.net) · DKIM: pass (sendgrid.net) · DMARC: fail (alignment mismatch)',
    date: 'Wed, 04 Nov 2026 11:08:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Hi ' + rep.name.split(' ')[0] + ',',
      'Marcus Chen mentioned you in the restricted Confluence page "Production API Gateway & Vault Secrets Rotation".',
      'Click the link below to view the inline comment in Confluence:'
    ],
    linkDisplay: 'https://sso.enterprise.corp/login?service=confluence&continue=page-8941',
    linkTarget: 'https://sso.enterprise.corp/oauth/redirect?next=https://' + fakeDom + '/atlassian-harvest',
    attachment: null,
    signature: 'Atlassian Confluence Automated Workspace',
    disclaimer: 'Sent by Atlassian Cloud.',
    flags: {
      from: ['Sender Identity (Smoking Gun)', 1, "Look-alike TLD: Uses '@atlassian-cloud-mail.co' instead of official '@atlassian.com'."],
      auth: ['DMARC Alignment Failure (Smoking Gun)', 1, 'SPF/DKIM pass for generic sendgrid.net, but DMARC fails because it does not align with the visible From domain.'],
      link: ['Open Redirect Abuse (Smoking Gun)', 1, "Open Redirect Parameter: While the URL starts with 'sso.enterprise.corp', the '?next=' parameter redirects the browser to '" + fakeDom + "'."]
    },
    rawRFC: `Received: from o1.ptr.sendgrid.net (167.89.101.4) by mx.enterprise.corp;\nAuthentication-Results: mx.enterprise.corp; spf=pass smtp.mailfrom=sendgrid.net; dkim=pass d=sendgrid.net; dmarc=fail (p=none dis=none) header.from=atlassian-cloud-mail.co`,
    transportHops: [
      { node: 'o1.ptr.sendgrid.net [167.89.101.4]', proto: 'TLS 1.3', status: 'DMARC_ALIGNMENT_FAIL' }
    ]
  };
}

function generateDoubleExtensionIncident(id, rep) {
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'SPEAR_PHISHING',
    severity: 'HIGH',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(5, 25) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.001 / T1036.007 (Spearphishing Attachment / Double Extension)',
    subject: 'Signed Customs Commercial Invoice & Waybill #DHL-884120',
    senderDisplay: 'DHL Express Customs Clearance',
    senderEmail: 'customs-paperwork@dhl-global-forwarding.co',
    authSummary: 'SPF: softfail · DKIM: none · DMARC: fail',
    date: 'Wed, 04 Nov 2026 10:02:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Good day ' + rep.name.split(' ')[0] + ',',
      'Please find attached the commercial invoice and export declaration for B2B shipment #DHL-884120 arriving at your regional facility.',
      'Kindly open the attached PDF declaration and sign off on the harmonized tariff code so the courier can clear customs today.'
    ],
    attachment: 'DHL_Commercial_Invoice_884120.pdf.iso (2.8 MB)',
    signature: 'DHL Global Forwarding · Import/Export Desk',
    disclaimer: 'Customs Documentation Dispatch.',
    flags: {
      from: ['Sender Identity (Smoking Gun)', 1, "Deceptive Domain: Uses '.co' look-alike ('dhl-global-forwarding.co') instead of official '@dhl.com'."],
      auth: ['Technical Headers', 1, 'SPF softfail and no DKIM signature.'],
      attachment: ['Double Extension Payload (Smoking Gun)', 1, "Masquerading File Extension: Named '.pdf.iso'—Windows hides the real '.iso' disk image extension, which mounts a rogue executable."]
    },
    rawRFC: `Received: from mail.dhl-global-forwarding.co (185.140.50.19) by mx.enterprise.corp;\nAuthentication-Results: mx.enterprise.corp; spf=softfail; dmarc=fail\nX-Attachment-Name: DHL_Commercial_Invoice_884120.pdf.iso`,
    transportHops: [
      { node: 'mail.dhl-global-forwarding.co [185.140.50.19]', proto: 'ESMTP', status: 'ATTACHMENT_ISO_IMAGE' }
    ]
  };
}

function generateNetcraftSubdomainIncident(id, rep) {
  var rootEvil = 'account-session-check.com';
  var fullSpoof = 'login.microsoftonline.com.sso-tenant.' + rootEvil;
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'SPEAR_PHISHING',
    severity: 'HIGH',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(4, 30) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.002 / T1583.001 (Subdomain Brand Prefixing)',
    subject: 'Azure Active Directory: Conditional Access Policy Update',
    senderDisplay: 'Enterprise Identity Protection',
    senderEmail: 'no-reply@' + rootEvil,
    authSummary: 'SPF: pass (' + rootEvil + ') · DKIM: pass (' + rootEvil + ') · DMARC: pass',
    date: 'Wed, 04 Nov 2026 10:50:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Hello ' + rep.name.split(' ')[0] + ',',
      'Your department’s Azure AD Conditional Access profile was updated to require periodic session token validation when connecting from hybrid networks.',
      'Please verify your current workstation session via the Microsoft Online endpoint below:'
    ],
    linkDisplay: 'https://login.microsoftonline.com/common/reauth',
    linkTarget: 'https://' + fullSpoof + '/oauth2/v2.0/authorize',
    attachment: null,
    signature: 'Cloud Identity & Access Management',
    disclaimer: 'Automated Directory Notice.',
    flags: {
      from: ['Sender Identity (Smoking Gun)', 1, "Unrelated Root Domain: Sent from '@" + rootEvil + "', which is not a Microsoft or corporate domain."],
      auth: ['Technical Headers', 0, 'SPF/DKIM pass for the attacker’s registered root domain.'],
      link: ['Subdomain Masquerading (Smoking Gun)', 1, "Netcraft Subdomain Trick: 'login.microsoftonline.com' is merely a subdomain prefix inside the attacker's actual root domain '" + rootEvil + "'."]
    },
    rawRFC: `Received: from out.${rootEvil} (194.26.29.71) by mx.enterprise.corp;\nAuthentication-Results: mx.enterprise.corp; spf=pass smtp.mailfrom=${rootEvil}; dkim=pass d=${rootEvil}; dmarc=pass`,
    transportHops: [
      { node: 'out.account-session-check.com [194.26.29.71]', proto: 'TLS 1.3', status: 'EXTERNAL_DOMAIN_PASS' }
    ]
  };
}

function generateSpearIncident(id, rep) {
  var amt = rn(28000, 75000).toLocaleString('en-US') + '.00';
  var fakeDom = pick(PHISH_DOMAINS);
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'SPEAR_PHISHING',
    severity: 'HIGH',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(2, 20) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.002 / T1656 (Spearphishing Link & Impersonation)',
    subject: 'Urgent Escrow Wire Authorization: Project Gemini Closing Tranche',
    senderDisplay: 'Sarah Mitchell (Chief Financial Officer)',
    senderEmail: 'sarah.mitchell@' + fakeDom,
    authSummary: 'SPF: softfail (185.190.141.22) · DKIM: pass (' + fakeDom + ') · DMARC: fail',
    date: 'Wed, 04 Nov 2026 10:45:12 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Hi ' + rep.name.split(' ')[0] + ',',
      'I am currently participating in an off-site M&A board review and cannot take voice calls.',
      'We have an immediate settlement tranche of $' + amt + ' required to satisfy closing escrow terms prior to 15:00 today.',
      'Please inspect the escrow authorization schedule below and queue the transfer. I will retroactively countersign the dual-custody authorization in SAP directly upon my return.'
    ],
    linkDisplay: 'https://enterprise.corp/finance/escrow-schedule?id=9921',
    linkTarget: 'https://' + fakeDom + '/auth/verify?session=' + rn(10000, 99999),
    attachment: null,
    signature: 'Sarah Mitchell\nChief Financial Officer\nEnterprise Holdings Group',
    disclaimer: 'STRICTLY CONFIDENTIAL: Intended exclusively for designated recipient.',
    flags: {
      from: ['Sender Identity (Smoking Gun)', 1, "Imposter Host: The sender uses external domain '@" + fakeDom + "' instead of enterprise.corp."],
      auth: ['Technical Headers', 1, 'DMARC Failure: DKIM/SPF domain alignment fails against visible RFC 5322 From address.'],
      subject: ['Pretext & Urgency', 1, 'Coercive Urgency: Imposes arbitrary cutoff to bypass standard AP dual controls.'],
      body: ['Policy Circumvention', 1, "Asks employee to defer mandatory dual-custody approval ('retroactive sign-off')."],
      link: ['Weaponized Link Target (Smoking Gun)', 1, "Deceptive URI: Display shows enterprise.corp, underlying target routes to '" + fakeDom + "'."]
    },
    rawRFC: `Received: from vps981.external-relay.net (185.190.141.22) by mx.enterprise.corp;\nAuthentication-Results: mx.enterprise.corp; spf=softfail; dkim=pass d=${fakeDom}; dmarc=fail\nFrom: "Sarah Mitchell (Chief Financial Officer)" <sarah.mitchell@${fakeDom}>\nSubject: Urgent Escrow Wire Authorization`,
    transportHops: [
      { node: 'vps981.external-relay.net [185.190.141.22]', proto: 'ESMTPSA', status: 'UNTRUSTED_ASN' },
      { node: 'mx.enterprise.corp [10.0.0.10]', proto: 'TLS 1.2 ECDHE_RSA', status: 'SPF_SOFTFAIL' }
    ]
  };
}

function generateSpearOAuthIncident(id, rep) {
  var fakeDom = pick(PHISH_DOMAINS);
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'SPEAR_PHISHING',
    severity: 'HIGH',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(4, 25) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1528 / T1566.002 (Steal Application Access Token / Consent Grant)',
    subject: 'Action Required: Legal Discovery Document Review - Case Ref #8921-CV',
    senderDisplay: 'Baker & Vance Legal Counsel',
    senderEmail: 'discovery-notices@' + fakeDom,
    authSummary: 'SPF: softfail (192.241.18.99) · DKIM: none · DMARC: fail',
    date: 'Wed, 04 Nov 2026 11:20:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Attention ' + rep.name + ',',
      'External counsel has provisioned privileged discovery deposition transcripts concerning our pending intellectual property litigation.',
      'To review the case bundle, grant read permissions through the enterprise Microsoft 365 OAuth tenant application below within 24 hours.'
    ],
    linkDisplay: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=89410',
    linkTarget: 'https://' + fakeDom + '/oauth/consent-grant?scope=Mail.ReadWrite',
    attachment: null,
    signature: 'Litigation Practice Group\nBaker & Vance LLP',
    disclaimer: 'Privileged Attorney-Client Work Product Communication.',
    flags: {
      from: ['Sender Identity (Smoking Gun)', 1, "Untrusted Origin: Notice originates from non-whitelisted counsel domain '@" + fakeDom + "'."],
      auth: ['Technical Headers', 1, 'Authentication Failure: Missing DKIM verification with softfail SPF record.'],
      subject: ['Pretext & Urgency', 1, 'Legal Coercion: Threat of legal consequence used to provoke hasty authorization.'],
      body: ['Illicit Consent Pattern', 1, 'Illicit OAuth Grant: Solicits full application consent permissions rather than standard portal viewing.'],
      link: ['Weaponized Link Target (Smoking Gun)', 1, "Deceptive Redirect: Link routes to unauthorized app consent grant targeting Mail.ReadWrite scopes."]
    },
    rawRFC: `Received: from mail.counsel-relay.biz (192.241.18.99) by mx.enterprise.corp;\nAuthentication-Results: mx.enterprise.corp; spf=softfail; dmarc=fail\nFrom: "Baker & Vance Legal Counsel" <discovery-notices@${fakeDom}>`,
    transportHops: [
      { node: 'mail.counsel-relay.biz [192.241.18.99]', proto: 'TLS 1.2', status: 'DMARC_FAIL' },
      { node: 'mx.enterprise.corp [10.0.0.10]', proto: 'Perimeter Filter', status: 'FLAGGED_UNTRUSTED' }
    ]
  };
}

function generateMassPhishIncident(id, rep) {
  var freeMail = pick(FREE_MAILS);
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'MASS_PHISHING',
    severity: 'MEDIUM',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(15, 60) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.002 (Mass Spearphishing Link)',
    subject: 'Action Required: Mailbox quota exceeded - 98% storage consumed',
    senderDisplay: 'IT Helpdesk Administrator',
    senderEmail: 'admin-it-helpdesk@' + freeMail,
    authSummary: 'SPF: pass (consumer webmail) · DKIM: pass (' + freeMail + ') · DMARC: none',
    date: 'Wed, 04 Nov 2026 09:20:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Dear Employee,',
      'Your corporate Microsoft 365 mailbox has exceeded standard storage parameters. Incoming messages are currently queued in suspension.',
      'To validate your account and retain incoming unread emails, authenticate your password using the mailbox expansion portal below within 24 hours.'
    ],
    linkDisplay: 'https://outlook.office365.com/mail/expand-quota',
    linkTarget: 'http://185.220.101.4/storage-fix?user=' + rep.name.toLowerCase().replace(' ', '.'),
    attachment: null,
    signature: 'IT Service Center Automated Daemon',
    disclaimer: 'Enterprise System Notification.',
    flags: {
      from: ['Sender Identity (Smoking Gun)', 1, 'Free Webmail Sender: IT communications will never originate from ' + freeMail + '.'],
      auth: ['Technical Headers', 1, 'Header Misalignment: Originates from a personal public email provider.'],
      subject: ['Pretext & Urgency', 1, 'Generic Threat: Generic quota panic designed to induce rash action.'],
      body: ['Content Coercion', 1, 'Generic Greeting: Does not know employee name; solicits password submission.'],
      link: ['Weaponized Link Target (Smoking Gun)', 1, 'Direct IP Link: Link points to raw unencrypted HTTP IP (185.220.101.4).']
    },
    rawRFC: `Received: from mail-relay.consumer.net by mx.enterprise.corp;\nAuthentication-Results: mx.enterprise.corp; spf=pass smtp.mailfrom=${freeMail}; dmarc=none\nFrom: "IT Helpdesk Administrator" <admin-it-helpdesk@${freeMail}>`,
    transportHops: [
      { node: 'mail-relay.consumer.net [209.85.220.41]', proto: 'ESMTPS', status: 'CONSUMER_WEBMAIL' },
      { node: 'mx.enterprise.corp [10.0.0.10]', proto: 'Cloud Gateway', status: 'HEADER_MISMATCH' }
    ]
  };
}

function generateMassHrIncident(id, rep) {
  var fakeDom = pick(PHISH_DOMAINS);
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'MASS_PHISHING',
    severity: 'MEDIUM',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(10, 45) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.002 (Mass Phishing Link)',
    subject: 'Q4 Employee Performance Bonus & Compensation Schedule Release',
    senderDisplay: 'HR Payroll Communications',
    senderEmail: 'payroll-updates@' + fakeDom,
    authSummary: 'SPF: fail · DKIM: none · DMARC: fail',
    date: 'Wed, 04 Nov 2026 10:10:00 +0100',
    to: 'all-employees@enterprise.corp',
    bodyParagraphs: [
      'Valued Staff Member,',
      'The compensation committee has finalized fourth-quarter merit bonus allocations across all regional offices.',
      'To review your individual compensation adjustment letter and confirm current direct deposit account numbers, authenticate through the portal before close of business.'
    ],
    linkDisplay: 'https://enterprise.corp/hr/bonus-2026',
    linkTarget: 'https://' + fakeDom + '/payroll/login?token=q4bonus',
    attachment: null,
    signature: 'Human Resources & Total Rewards',
    disclaimer: 'Confidential Internal Distribution.',
    flags: {
      from: ['Sender Identity (Smoking Gun)', 1, "Imposter Domain: Corporate payroll notices never originate from '@" + fakeDom + "'."],
      auth: ['Technical Headers', 1, 'SPF & DKIM Failure: Sending host fails SPF authorization and has no valid DKIM.'],
      subject: ['Pretext & Urgency', 1, 'Financial Greed Lure: Broad bonus promise designed to maximize click-through rate.'],
      body: ['Content Coercion', 1, 'Generic Salutation: Mass-blast message lacking personalized recipient attributes.'],
      link: ['Weaponized Link Target (Smoking Gun)', 1, "Phishing Landing Page: Anchor leads directly to external credential harvester '" + fakeDom + "'."]
    },
    rawRFC: `Received: from host-194.marketing-vps.org (194.26.29.11) by mx.enterprise.corp;\nAuthentication-Results: mx.enterprise.corp; spf=fail; dmarc=fail\nFrom: "HR Payroll Communications" <payroll-updates@${fakeDom}>`,
    transportHops: [
      { node: 'host-194.marketing-vps.org [194.26.29.11]', proto: 'ESMTP', status: 'SPF_FAIL' },
      { node: 'mx.enterprise.corp [10.0.0.10]', proto: 'Proofpoint Filter', status: 'SUSPICIOUS_CONTENT' }
    ]
  };
}

function generateMassTaxIncident(id, rep) {
  var fakeDom = pick(PHISH_DOMAINS);
  var amt = rn(420, 1250) + '.00';
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'MASS_PHISHING',
    severity: 'MEDIUM',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(10, 45) + 'm ago',
    status: 'pending',
    isPhishing: true,
    mitreTechnique: 'T1566.002 (Mass Phishing Link / Tax Refund)',
    subject: 'IRS Electronic Direct Deposit Notification: Payment Pending Confirmation',
    senderDisplay: 'Internal Revenue Service Portal',
    senderEmail: 'rebates@' + fakeDom,
    authSummary: 'SPF: fail · DKIM: none · DMARC: fail',
    date: 'Wed, 04 Nov 2026 10:25:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Valued Taxpayer,',
      'The treasury disbursement office has registered an uncollected fiscal refund of $' + amt + ' under your taxpayer identity record.',
      'To verify your commercial routing transit number and release the electronic ACH transfer, submit identity confirmation within 48 hours.'
    ],
    linkDisplay: 'https://www.irs.gov/refunds/claim-ach-transfer',
    linkTarget: 'https://' + fakeDom + '/irs/direct-deposit',
    attachment: null,
    signature: 'Internal Revenue Service\nDepartment of the Treasury',
    disclaimer: 'Official Taxpayer Electronic Dispatch.',
    flags: {
      from: ['Sender Identity (Smoking Gun)', 1, "Fake Government Host: Genuine IRS notices originate from '@irs.gov', not external host '@" + fakeDom + "'."],
      auth: ['Technical Headers', 1, 'Authentication Failure: Missing DKIM verification with failed SPF record.'],
      subject: ['Pretext & Urgency', 1, 'Broad Greed Lure: Unsolicited tax refund designed to induce hasty submission of bank details.'],
      link: ['Weaponized Link Target (Smoking Gun)', 1, "Credential Harvester: Directs to phishing landing page '" + fakeDom + "'."]
    },
    rawRFC: `Received: from vps89.irs-phish.net by mx.enterprise.corp;\nAuthentication-Results: mx.enterprise.corp; spf=fail; dmarc=fail`,
    transportHops: [{ node: 'vps89.irs-phish.net [185.220.101.44]', proto: 'TLS 1.2', status: 'UNVERIFIED_HOST' }]
  };
}

function generateCleanUglyTrackingIncident(id, rep) {
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'CLEAN',
    severity: 'LOW',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(8, 35) + 'm ago',
    status: 'pending',
    isPhishing: false,
    mitreTechnique: 'Benign SaaS Partner Notification with ESP Click-Tracking (Legitimate)',
    subject: 'Your Gartner Annual IT Symposium Research Briefing Pass',
    senderDisplay: 'Gartner Client Services (via Salesforce Marketing Cloud)',
    senderEmail: 'events@gartner.com',
    authSummary: 'SPF: pass (exacttarget.com) · DKIM: pass (gartner.com) · DMARC: pass',
    date: 'Wed, 04 Nov 2026 09:55:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Hi ' + rep.name.split(' ')[0] + ',',
      'Thank you for registering for the Gartner Executive Cloud Briefing using your enterprise seat allocation.',
      'You can download the PDF slide deck from yesterday’s keynote session directly via the link below. No login or password entry is required to view the public slides.'
    ],
    linkDisplay: 'https://www.gartner.com/en/conferences/keynote-slides-2026.pdf',
    linkTarget: 'https://click.e.gartner.com/?qs=8941029384109283019283',
    attachment: null,
    signature: 'Gartner Executive Programs\nStamford, CT',
    disclaimer: 'You are receiving this because your enterprise holds an active Gartner research seat.',
    flags: {
      from: ['Sender Identity', 0, 'Official gartner.com address verified by cryptographic DKIM.'],
      auth: ['Technical Headers', 0, 'DMARC passes because DKIM is cryptographically signed by d=gartner.com, even though Salesforce (exacttarget.com) dispatched the mail.'],
      body: ['Content Integrity', 0, 'Provides research slides with zero credential harvesting or urgent payment demands.'],
      link: ['ESP Tracking Subdomain (Benign)', 0, "'click.e.gartner.com' is a legitimate subdomain of gartner.com used for standard Salesforce Marketing Cloud click telemetry."]
    },
    rawRFC: `Received: from mta4.exacttarget.com (136.147.182.10) by mx.enterprise.corp with TLSv1.3;\nAuthentication-Results: mx.enterprise.corp; spf=pass smtp.mailfrom=bounce.e.gartner.com; dkim=pass d=gartner.com; dmarc=pass\nFrom: "Gartner Client Services" <events@gartner.com>`,
    transportHops: [
      { node: 'mta4.exacttarget.com [136.147.182.10]', proto: 'TLS 1.3', status: 'AUTHORIZED_ESP_RELAY' },
      { node: 'mx.enterprise.corp [10.0.0.10]', proto: 'Gateway', status: 'DMARC_PASS' }
    ]
  };
}

function generateCleanExecMobileIncident(id, rep) {
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'CLEAN',
    severity: 'LOW',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(5, 20) + 'm ago',
    status: 'pending',
    isPhishing: false,
    mitreTechnique: 'Benign Executive Mobile Correspondence (Legitimate)',
    subject: 'Quick favor before the 14:00 board sync',
    senderDisplay: 'Robert Hastings (VP of Operations)',
    senderEmail: 'robert.hastings@enterprise.corp',
    authSummary: 'SPF: pass (10.0.1.8) · DKIM: pass (enterprise.corp) · DMARC: pass',
    date: 'Wed, 04 Nov 2026 11:40:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      rep.name.split(' ')[0] + ' —',
      'I am walking into Conference Room 4B right now and my tablet battery just died.',
      'Could you print 3 hard copies of the Q3 capacity slide deck from our internal shared drive and drop them off at Room 4B before 14:00? Thanks.',
      'Sent from my iPhone'
    ],
    attachment: null,
    signature: 'Robert Hastings · VP Operations',
    disclaimer: 'Internal Corporate Exchange Mobile Sync.',
    flags: {
      from: ['Sender Identity', 0, 'Authentic internal corporate address (robert.hastings@enterprise.corp).'],
      auth: ['Technical Headers', 0, 'Authenticated internal Exchange ActiveSync hop (10.0.1.8) with full SPF/DKIM/DMARC pass.'],
      subject: ['Subject & Urgency', 0, 'While phrased like a "quick favor", it is a normal physical office request with zero external links or financial requests.'],
      body: ['Physical In-Office Request', 0, 'Asks only to bring printed slides to an internal conference room—no gift cards, wire transfers, or passwords.']
    },
    rawRFC: `Received: from exch-activesync.enterprise.corp (10.0.1.8) by mx.enterprise.corp with TLSv1.3;\nAuthentication-Results: mx.enterprise.corp; spf=pass; dkim=pass d=enterprise.corp; dmarc=pass\nX-Mailer: iPhone Mail (21F90)\nFrom: "Robert Hastings" <robert.hastings@enterprise.corp>`,
    transportHops: [
      { node: 'exch-activesync.enterprise.corp [10.0.1.8]', proto: 'Exchange ActiveSync mTLS', status: 'VERIFIED_CORPORATE_DEVICE' }
    ]
  };
}

function generateCleanProcurementIncident(id, rep) {
  var ref = rn(10000, 99999);
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'CLEAN',
    severity: 'LOW',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(10, 45) + 'm ago',
    status: 'pending',
    isPhishing: false,
    mitreTechnique: 'Benign Corporate Procurement Order (Legitimate)',
    subject: 'Approved Purchase Order #PO-' + ref + ': Ergonomic Office Equipment',
    senderDisplay: 'Corporate Procurement Desk',
    senderEmail: 'procurement@enterprise.corp',
    authSummary: 'SPF: pass (10.0.1.18) · DKIM: pass (enterprise.corp) · DMARC: pass',
    date: 'Wed, 04 Nov 2026 09:45:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Hello ' + rep.name.split(' ')[0] + ',',
      'Purchase Order #PO-' + ref + ' for ergonomic peripherals submitted on behalf of ' + rep.dept + ' has received final budgetary approval.',
      'The vendor fulfillment status is visible on the internal ERP portal. No action or re-submission is necessary.'
    ],
    linkDisplay: 'https://erp.enterprise.corp/procurement/orders/PO-' + ref,
    linkTarget: 'https://erp.enterprise.corp/procurement/orders/PO-' + ref,
    attachment: null,
    signature: 'Corporate Sourcing & Procurement\nEnterprise Operations Center',
    disclaimer: 'Internal enterprise commercial memo.',
    flags: {
      from: ['Sender Identity', 0, 'Authentic internal procurement address on enterprise.corp.'],
      auth: ['Technical Headers', 0, 'Full internal SPF/DKIM alignment.'],
      subject: ['Pretext & Urgency', 0, 'Standard routine confirmation of an approved purchase order.'],
      link: ['Link Routing', 0, 'Directs to authenticated internal corporate ERP portal.']
    },
    rawRFC: `Received: from erp-mail.enterprise.corp (10.0.1.18) by mx.enterprise.corp;\nAuthentication-Results: mx.enterprise.corp; spf=pass; dkim=pass d=enterprise.corp; dmarc=pass`,
    transportHops: [{ node: 'erp-mail.enterprise.corp [10.0.1.18]', proto: 'TLS 1.3', status: 'INTERNAL_TRUSTED' }]
  };
}

function generateCleanLegalIncident(id, rep) {
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'CLEAN',
    severity: 'LOW',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(15, 50) + 'm ago',
    status: 'pending',
    isPhishing: false,
    mitreTechnique: 'Benign Corporate Compliance Memo (Legitimate)',
    subject: 'Quarterly Reminder: Annual Code of Conduct & Insider Trading Policy',
    senderDisplay: 'Legal & Regulatory Compliance Desk',
    senderEmail: 'compliance@enterprise.corp',
    authSummary: 'SPF: pass (10.0.1.12) · DKIM: pass (enterprise.corp) · DMARC: pass',
    date: 'Wed, 04 Nov 2026 08:50:00 +0100',
    to: 'all-staff@enterprise.corp',
    bodyParagraphs: [
      'Dear Colleagues,',
      'As we enter the quiet trading window prior to quarterly earnings announcements, please review the corporate insider trading guidelines on the legal intranet.',
      'This notice is informational. No credential re-authentication, forms, or downloads are required.'
    ],
    linkDisplay: 'https://intranet.enterprise.corp/legal/policies/insider-trading',
    linkTarget: 'https://intranet.enterprise.corp/legal/policies/insider-trading',
    attachment: null,
    signature: 'Legal, Ethics & Compliance Group\nEnterprise Holdings Corp',
    disclaimer: 'Internal confidential employee memo.',
    flags: {
      from: ['Sender Identity', 0, 'Internal corporate legal department mailbox on enterprise.corp.'],
      auth: ['Technical Headers', 0, 'Full internal SPF and organizational DKIM signature.'],
      subject: ['Pretext & Urgency', 0, 'Routine quarterly compliance reminder with zero rush.'],
      body: ['Security Hygiene', 0, 'Explicitly clarifies that no credentials, downloads, or forms are needed.'],
      link: ['Link Routing', 0, 'Resolves to verified corporate intranet policy documentation.']
    },
    rawRFC: `Received: from legal-mail.enterprise.corp (10.0.1.12) by mx.enterprise.corp;\nAuthentication-Results: mx.enterprise.corp; spf=pass; dkim=pass d=enterprise.corp; dmarc=pass`,
    transportHops: [{ node: 'legal-mail.enterprise.corp [10.0.1.12]', proto: 'TLS 1.3', status: 'INTERNAL_TRUSTED' }]
  };
}

function generateCleanITIncident(id, rep) {
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'CLEAN',
    severity: 'LOW',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(10, 50) + 'm ago',
    status: 'pending',
    isPhishing: false,
    mitreTechnique: 'Benign Administrative Broadcast (Legitimate)',
    subject: 'Scheduled Core Switch Maintenance: Saturday 03:00 - 05:00 CET',
    senderDisplay: 'IT Infrastructure Change Advisory',
    senderEmail: 'it-change-advisory@enterprise.corp',
    authSummary: 'SPF: pass (internal 10.0.1.15) · DKIM: pass (enterprise.corp) · DMARC: pass',
    date: 'Wed, 04 Nov 2026 08:30:00 +0100',
    to: 'all-staff@enterprise.corp',
    bodyParagraphs: [
      'Team,',
      'Please be aware that Network Operations will be upgrading line cards on our primary internal data center switch this Saturday.',
      'Zero credential actions, profile reinstalls, or manual verifications are requested. Access to intranet wikis may experience intermittent latency.'
    ],
    linkDisplay: 'https://intranet.enterprise.corp/kb/changes/89410',
    linkTarget: 'https://intranet.enterprise.corp/kb/changes/89410',
    attachment: null,
    signature: 'Change Advisory Board\nRef: RFC-89410',
    disclaimer: 'Internal enterprise broadcast. Verified TLS transport.',
    flags: {
      from: ['Sender Identity', 0, 'Authoritative company internal domain.'],
      auth: ['Technical Headers', 0, 'Internal relay SPF pass with organizational DKIM signature.'],
      subject: ['Subject & Urgency', 0, 'Low-pressure informational maintenance notice.'],
      body: ['Content Integrity', 0, 'Explicit guidance stating no credentials or downloads are required.'],
      link: ['Link Routing', 0, 'Resolves to private corporate intranet.']
    },
    rawRFC: `Received: from mail-internal.enterprise.corp (10.0.1.15) by mx.enterprise.corp with TLSv1.3;\nAuthentication-Results: mx.enterprise.corp; spf=pass; dkim=pass d=enterprise.corp; dmarc=pass\nFrom: "IT Infrastructure Change Advisory" <it-change-advisory@enterprise.corp>`,
    transportHops: [
      { node: 'core-relay-01.enterprise.corp [10.0.1.15]', proto: 'mTLS Internal', status: 'INTERNAL_AUTHENTICATED' },
      { node: 'mx.enterprise.corp [10.0.0.10]', proto: 'SpamTitan Filter', status: 'CLEAN' }
    ]
  };
}

function generateCleanVendorIncident(id, rep) {
  var invRef = rn(40000, 99999);
  var amt = rn(1200, 8500).toLocaleString('en-US') + '.50';
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'CLEAN',
    severity: 'LOW',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(8, 45) + 'm ago',
    status: 'pending',
    isPhishing: false,
    mitreTechnique: 'Benign Commercial Vendor Invoice (Legitimate)',
    subject: 'Monthly Service Statement & Invoice #INV-' + invRef,
    senderDisplay: 'Datadog Cloud Observability Accounts',
    senderEmail: 'billing@datadoghq.com',
    authSummary: 'SPF: pass (198.2.138.40) · DKIM: pass (datadoghq.com) · DMARC: pass',
    date: 'Wed, 04 Nov 2026 09:15:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Hello ' + rep.name.split(' ')[0] + ',',
      'Your monthly billing statement for cloud infrastructure metrics and telemetry retention (Invoice #INV-' + invRef + ') in the amount of $' + amt + ' has been processed.',
      'This payment will be automatically debited via our agreed standing corporate credit terms on the 15th. No manual transfer or credential input is required.'
    ],
    linkDisplay: 'https://app.datadoghq.com/billing/invoices/INV-' + invRef,
    linkTarget: 'https://app.datadoghq.com/billing/invoices/INV-' + invRef,
    attachment: null,
    signature: 'Datadog Financial Operations\nAccounts Receivable Department',
    disclaimer: 'Enterprise SaaS Commercial Receipt.',
    flags: {
      from: ['Sender Identity', 0, 'Genuine vendor domain on datadoghq.com.'],
      auth: ['Technical Headers', 0, 'Cryptographic DKIM alignment matching datadoghq.com with passing SPF.'],
      subject: ['Subject & Urgency', 0, 'Standard routine billing statement with no coercive payment deadlines.'],
      body: ['Content Integrity', 0, 'Confirms automatic debit via standing terms; requests no sensitive data or credentials.'],
      link: ['Link Routing', 0, 'Navigates strictly to the genuine app.datadoghq.com vendor portal.']
    },
    rawRFC: `Received: from mail.datadoghq.com (198.2.138.40) by mx.enterprise.corp with TLSv1.3;\nAuthentication-Results: mx.enterprise.corp; spf=pass smtp.mailfrom=datadoghq.com; dkim=pass d=datadoghq.com; dmarc=pass\nFrom: "Datadog Cloud Observability Accounts" <billing@datadoghq.com>`,
    transportHops: [
      { node: 'mail.datadoghq.com [198.2.138.40]', proto: 'TLS 1.3', status: 'VERIFIED_SENDER' },
      { node: 'mx.enterprise.corp [10.0.0.10]', proto: 'Enterprise Mail Gateway', status: 'DELIVERED_CLEAN' }
    ]
  };
}

function generateCleanHRIncident(id, rep) {
  return {
    id: id,
    channel: 'CHANNEL: INBOUND EMAIL',
    attackCategory: 'CLEAN',
    severity: 'LOW',
    reporter: rep.name + ' (' + rep.dept + ')',
    department: rep.dept,
    reportedAgo: rn(10, 40) + 'm ago',
    status: 'pending',
    isPhishing: false,
    mitreTechnique: 'Benign Administrative Notice (Legitimate)',
    subject: 'Open Enrollment Period: Health & Dental Benefits Selection 2027',
    senderDisplay: 'People & Culture Benefits Desk',
    senderEmail: 'benefits@enterprise.corp',
    authSummary: 'SPF: pass (10.0.2.14) · DKIM: pass (enterprise.corp) · DMARC: pass',
    date: 'Wed, 04 Nov 2026 09:40:00 +0100',
    to: rep.name.toLowerCase().replace(' ', '.') + '@enterprise.corp',
    bodyParagraphs: [
      'Hi ' + rep.name.split(' ')[0] + ',',
      'Annual open enrollment for corporate health, dental, and retirement matching opens next Monday on the standard HR Workday portal.',
      'If you do not wish to modify your current policy allocations, no action or re-submission is necessary. Review your existing tiers at your convenience on the intranet.'
    ],
    linkDisplay: 'https://workday.enterprise.corp/benefits/overview',
    linkTarget: 'https://workday.enterprise.corp/benefits/overview',
    attachment: null,
    signature: 'People Operations / Benefits\nEnterprise Global Services',
    disclaimer: 'Internal confidential employee memo.',
    flags: {
      from: ['Sender Identity', 0, 'Verified internal HR mailbox on enterprise.corp.'],
      auth: ['Technical Headers', 0, 'DKIM signature and SPF aligned directly to corporate identity.'],
      subject: ['Subject & Urgency', 0, 'Annual recurring benefits notice without coercive rush.'],
      body: ['Content Integrity', 0, 'Explicitly notes that existing plans roll over and credentials are not solicited.'],
      link: ['Link Routing', 0, 'Navigates strictly to the enterprise Workday SSO endpoint.']
    },
    rawRFC: `Received: from hr-portal.enterprise.corp (10.0.2.14) by mx.enterprise.corp;\nAuthentication-Results: mx.enterprise.corp; spf=pass; dkim=pass d=enterprise.corp; dmarc=pass\nFrom: "People & Culture Benefits Desk" <benefits@enterprise.corp>`,
    transportHops: [
      { node: 'hr-app01.enterprise.corp [10.0.2.14]', proto: 'TLS 1.3', status: 'INTRANET_AUTHORIZED' },
      { node: 'mx.enterprise.corp [10.0.0.10]', proto: 'Enterprise Mail Gateway', status: 'DELIVERED' }
    ]
  };
}
