# 🛡️ SOC Communications Triage Workbench

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![MITRE ATT&CK](https://img.shields.io/badge/MITRE%20ATT%26CK-v15%20Aligned-ef4444.svg)](https://attack.mitre.org/)
[![NIST SP 800-61r2](https://img.shields.io/badge/NIST-SP%20800--61r2-10b981.svg)](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)
[![Architecture](https://img.shields.io/badge/Architecture-Vanilla%20ES6%20Modular-8b5cf6.svg)]()
[![Development](https://img.shields.io/badge/Methodology-AI--Augmented%20%2F%20Vibe--Coded-f59e0b.svg)]()

An interactive, multi-channel **Security Operations Center (SOC) Incident Response & Phishing Triage Simulator** designed to mirror real-world **Tier-1 / Tier-2 analyst workflows**.

Unlike traditional security awareness quizzes that rely on obvious spelling errors and cartoonish spam tropes, **SOC Communications Triage Workbench** models **modern adversarial evasion tradecraft** across **Email, Cellular SMS (Smishing), VoIP PBX Audio Transcripts (Vishing), and Optical QR Matrices (Quishing)**—alongside realistic, suspicious-looking legitimate business traffic ("Hard Decoys").

---

## 🧠 Project Genesis & Authorship (Domain Expertise + AI-Augmented Engineering)

This project was built using a modern **AI-Augmented Engineering ("Vibe Coding")** workflow, combining **human cybersecurity domain direction** with **LLM-assisted front-end implementation**:

* **Security Architecture, Threat Modeling & QA (Human-Led):**
  * **Attack Taxonomy & Evasion Design:** Researched, selected, and curated real-world phishing tactics and adversary tradecraft (inspired by threat intelligence advisories from Netcraft, financial fraud alerts, and red/blue team case studies).
  * **SOC Workflow Realism:** Audited and iteratively redesigned the simulator mechanics to eliminate artificial "game spoilers" (such as pre-labeled channel tags or giveaway gateway statuses) so that every incident requires genuine forensic inspection.
  * **"Smoking Gun" Evaluation Philosophy:** Replaced rigid "click-everything" quiz logic with an authentic SOC triage model where identifying **1–2 definitive Indicators of Compromise (IoCs)** and accurately classifying the attack vector suffices to justify quarantine.
  * **Edge-Case Calibration:** Directed the inclusion of subtle, single-indicator attacks (`SPF/DKIM: pass` on look-alike domains, Thread Hijacking, IDN Punycode) paired with high-friction benign decoys (ugly ESP tracking links, terse executive mobile messages).
* **Front-End Implementation & Code Generation (LLM-Assisted):**
  * Rapid UI prototyping, DOM rendering logic, CSS grid styling, and procedural JavaScript state management were generated and refactored iteratively via LLM pair-programming under strict architectural constraints.

---

## 🎯 The Problem It Solves

In a production enterprise environment, 99% of commodity spam (`SPF: fail` + broken grammar) is automatically dropped at the Secure Email Gateway (Proofpoint, Mimecast, Microsoft Defender for Office 365). 

The incidents that actually land in a **human SOC analyst's queue** are the **ambiguous edge cases**:
1. **Advanced Evasion Attacks:** Adversaries register their own look-alike domains with valid `SPF`, `DKIM`, and `DMARC` records, compromise a trusted vendor's mailbox to reply inside an existing email thread (**Thread Hijacking**), or abuse legitimate SaaS infrastructure (`sendgrid.net`, Open Redirects).
2. **False-Positive Traps (Hard Benign Decoys):** Legitimate corporate communications that *look* suspicious at first glance—such as a Gartner conference pass routed through a Salesforce Marketing Cloud click-tracking URL (`click.e.gartner.com`) or a brief, urgent request sent from a VP's iPhone. Quarantining these causes real operational disruption.

**SOC Communications Triage Workbench** trains analysts to look past surface-level heuristics and perform **evidence-based header, URI, and context correlation**.

---

## ✨ Key Workbench Capabilities

### 🖥️ 1. Authentic 3-Pane SIEM / SOAR Console Layout
* **Column 1 — Shift Incident Queue:** Displays 5 user-reported tickets per shift with neutral transmission channel tags (`CHANNEL: INBOUND EMAIL`, `CHANNEL: CELLULAR SMS`, `CHANNEL: VOIP PBX`), severity classifications, and reporting department metadata.
* **Column 2 — Artifact Inspection Dock:** Renders rich email envelopes, cellular SMS captures, recorded VoIP call transcripts, and optical QR matrices. Includes a live bottom **URI & Header Inspector Bar** that reveals underlying target URLs, Punycode translations, and decoded QR payloads on hover.
* **Column 3 — Forensics & Telemetry Drawer:**
  * **Raw Headers & Transport Tab:** Displays raw `RFC 822` email headers, `SMPP` SMS PDU records, and `SIP/2.0 INVITE` VoIP headers (`STIR/SHAKEN` attestation levels). Suspicious header lines are directly clickable as IoC evidence.
  * **Transport & Gateway Hops Tab:** Shows neutral MTA hop telemetry (IP addresses, reverse DNS pointers, TLS cipher suites, and SMTP/SIP response codes) without spoiling the verdict.

### 🔍 2. "Smoking Gun" Forensic Evaluation Engine
* **Evidence-Based Escalation:** The **Escalate Threat (IoC)** button remains locked until the analyst pins at least one Indicator of Compromise *and* selects a specific attack taxonomy (`SPEAR_PHISHING`, `MASS_PHISHING`, `QUISHING`, `SMISHING`, or `VISHING`).
* **Real-World Scoring Logic:** You do not need to highlight every single paragraph in a malicious message. Pinning **at least one valid Smoking Gun** (e.g., an IDN Punycode domain `xn--`, a forged `Reply-To` header, or a `.pdf.iso` double extension) + selecting the right attack category yields a verified triage call.
* **Business Impact Feedback:** Quarantining benign executive or partner traffic triggers a **False Positive Operational Impact** warning, reinforcing the balance between security and business continuity.

### 🔄 3. Stateful Anti-Repetition Procedural Engine
* **Balanced Multi-Channel Shifts:** Every 5-ticket shift is procedurally assembled to guarantee cross-channel variety: **1 Cellular SMS**, **1 VoIP Call Transcript**, **1 QR-Code Artifact**, and **2 Inbound Emails**.
* **36+ Curated Scenarios & History Registry:** A stateful `historyRegistry` tracks seen scenario archetypes across shifts, ensuring zero immediate repetitions as you progress from Day 1 onward.
* **End-of-Shift Handover Report:** Completing all 5 tickets triggers a comprehensive **SOC Shift Handover Log** modal summarizing shift accuracy, verified calls, and lifetime triage metrics.

---

## 🗺️ Implemented Threat Taxonomy & MITRE ATT&CK Matrix

| Vector Category | MITRE ATT&CK ID | Simulated Adversary Tradecraft & Indicators |
| :--- | :--- | :--- |
| **Spear Phishing & BEC** | `T1566.002` / `T1586.002` | **Thread Hijacking (Account Takeover):** Compromised Deloitte auditor account replying inside a 3-day-old email thread with passing `SPF/DKIM`, swapping ACH wire instructions (`Received:` header reveals anomalous geo-IP login). |
| **IDN Homograph Spoofing** | `T1036.005` | **Cyrillic Punycode Substitution:** Visual domain appears as `оkta-security.com`, while raw DNS and RFC 822 headers expose `xn--kta-security-0kbe.com`. |
| **Subdomain & Open Redirects** | `T1583.001` / `T1566.002` | **Netcraft Subdomain Prefixing** (`login.microsoftonline.com.sso-tenant.account-session-check.com`) and **Open Redirect Abuse** (`sso.enterprise.corp/oauth/redirect?next=https://...`). |
| **Weaponized Attachments** | `T1566.001` / `T1027.006` | **Double Extensions** (`DHL_Commercial_Invoice_884120.pdf.iso`), **SVG Script Smuggling** (`.svg` vector diagrams with embedded JS login prompts), and **HTML Smuggling** (`.shtml` voicemail players). |
| **OAuth & Developer Lures** | `T1528` / `T1552.004` | **Illicit OAuth Consent Grants** requesting `Mail.ReadWrite` scopes and fake **GitHub Secret Scanning** alerts harvesting Personal Access Tokens (PAT). |
| **Reply-To Hijacking & Typosquatting** | `T1656` | Linkless BEC reconnaissance from the CFO with `Reply-To:` routed to `proton.me`, and subtle digit typosquatting (`enterpr1se-corp.com`) with passing `SPF/DKIM`. |
| **Quishing (QR Phishing)** | `T1566.002` | Optical QR matrices bypassing text link scanners under pretexts of **Microsoft 365 MFA re-binding**, **802.1X Wi-Fi root certificates**, **Intune MDM sync**, and **NFC building badges**. |
| **Vishing (Voice Phishing)** | `T1566.004` / `T1219` | Recorded PBX call transcripts featuring **Okta MFA Push Fatigue**, **Barclays SmartCard `Sign` token manipulation**, **unauthorized AnyDesk RMM installation**, and **HR payroll direct-deposit rerouting** (`STIR/SHAKEN: C / NONE`). |
| **Smishing (SMS Phishing)** | `T1566.004` | P2P virtual carrier SMS lures: **Corporate Visa fraud alerts**, **E-ZPass highway toll penalties**, **CEO Apple gift card requests**, **customs redelivery micro-fees**, and **cold-wallet BTC lockouts**. |
| **Hard Benign Decoys (Clean)** | *N/A (Benign Traffic)* | Authentic **Salesforce/Gartner click-tracking URLs** (`click.e.gartner.com` with valid `d=gartner.com` DKIM), **VP iPhone messages** (`10.0.1.8` internal Exchange), **GitHub Dependabot PRs**, **A2P short-code 2FA/bank SMS**, and **STIR/SHAKEN Level-A internal PBX calls**. |

---

## 🗂️ Repository Structure

The application is architected in clean, modular **Vanilla ES6 JavaScript and CSS3** with zero external runtime dependencies or build-tool overhead:

```text
soc-email-triage-workbench/
├── index.html          # Semantic 3-column application shell & modal markup
├── css/
│   └── styles.css      # Dark-mode SOC stylesheet, CSS variables & responsive layout
├── js/
│   ├── state.js        # Global shift state, employee directory & anti-repetition registry
│   ├── scenarios.js    # 36+ multi-channel procedural incident generators
│   ├── ui.js           # DOM rendering engine (Queue, Client, URI Inspector, RFC 822, Post-Mortem)
│   └── app.js          # Event delegation controller, triage evaluation & shift lifecycle
├── package.json        # Project metadata & optional local server script
└── README.md           # Documentation, methodology & MITRE ATT&CK reference
```

---

## 🚀 Live Demo & Local Installation

### 🌐 Option 1: Live Interactive Demo (GitHub Pages)
Run the workbench directly in your browser without installing anything:
> 🔗 **[Launch SOC Communications Triage Workbench](https://<YOUR-GITHUB-USERNAME>.github.io/<YOUR-REPO-NAME>/)**  
> *(Replace `<YOUR-GITHUB-USERNAME>` and `<YOUR-REPO-NAME>` with your repository URL once GitHub Pages is enabled)*

### 💻 Option 2: Run Locally
```bash
# 1. Clone the repository
git clone https://github.com/<YOUR-GITHUB-USERNAME>/<YOUR-REPO-NAME>.git

# 2. Enter the project folder
cd <YOUR-REPO-NAME>

# 3. Open index.html directly in any modern browser, or start a local static server:
npx serve .
```

---

## 🕹️ Analyst Operating Manual (How to Triage)

1. **Select an Incident:** Click any pending ticket (`INC-XXXX`) in the left-hand **Shift Queue**.
2. **Analyze the Artifact & Telemetry:**
   * Inspect the sender identity, subject, and message body in the center pane.
   * **Hover** over hyperlinks, QR codes, attachments, or header badges to inspect their true destination in the bottom **URI & Header Inspector Bar**.
   * Check the right-hand **Raw Headers & Transport** tab for `SPF/DKIM/DMARC` alignment, `Reply-To` mismatches, `Received:` originating IPs, or `STIR/SHAKEN` voice attestation levels.
3. **Tag Evidence (IoCs):** Click directly on any suspicious element in the message viewer **or** click suspicious header lines inside the Raw RFC 822 stream to highlight them as an **Indicator of Compromise (IoC)**.
4. **Execute Triage Decision:**
   * **If Benign:** Ensure no false-positive IoCs are tagged and click **Mark as Benign (Clean)**.
   * **If Malicious:** Pin at least **1 valid Smoking Gun IoC**, select the exact attack type from the dropdown (`Spear Phishing / BEC`, `Mass Phishing`, `Quishing`, `Smishing`, or `VISHING`), and click **Escalate Threat (IoC)**.
5. **Review Post-Mortem & Handover:** Read the **NIST 800-61** forensic breakdown after each ticket. Once all 5 tickets in a shift are resolved, review your **Shift Handover Report** and click **Clock Out & Begin Next Day**.

---

## 🔮 Future Roadmap

* **Interactive Sandbox Detonation Tab:** Simulated dynamic analysis output (process tree, DNS queries, and mutex creation) for attachment-based scenarios.
* **SIEM Log Query Mini-Console:** Ability to run quick KQL/SPL-style lookups on sender IP addresses or hashes against simulated threat intelligence feeds.
* **Custom Scenario Builder (JSON Import):** Allow SOC leads and educators to import custom JSON scenario packs for internal team training.

---

## 📄 License

Distributed under the **MIT License**. Free for portfolio showcase, academic use, and internal Blue Team / SOC analyst training.