
var currentDay = 1;
var totalTriagedLifetime = 0;
var totalCorrectLifetime = 0;
var TICKETS = [];
var currentTicketId = null;
var currentDrawerTab = 'raw';
var taggedIoCs = new Set();
var userTriageDecisions = {};
var historyRegistry = new Set();

var R = Math.random;
var pick = function(arr) { return arr[Math.floor(R() * arr.length)]; };
var rn = function(min, max) { return Math.floor(R() * (max - min)) + min; };

var REPORTERS = [
  { name: 'Elena Rostova', dept: 'Corporate Finance' },
  { name: 'Marcus Chen', dept: 'Cloud & DevOps' },
  { name: 'Sarah Kowalski', dept: 'Human Resources' },
  { name: 'David Cole', dept: 'Network Operations' },
  { name: 'Sophie Laurent', dept: 'Executive Office' },
  { name: 'Michael Novak', dept: 'Customer Success' },
  { name: 'Julian Vance', dept: 'Legal & Compliance' },
  { name: 'Priya Patel', dept: 'Product Engineering' },
  { name: 'Hannah Abbott', dept: 'Supply Chain & Logistics' },
  { name: 'Lucas Weber', dept: 'Internal Audit' }
];

var PHISH_DOMAINS = [
  'corp-portal-sso.xyz', 'adfs-login-verify.top', 'executive-direct-desk.net',
  'internal-sharepoint-auth.click', 'system-alerts-online.biz', 'okta-verify-token.cloud',
  'payroll-direct-service.co', 'sap-gateway-auth.info', 'secure-signon-hub.link',
  'aws-cloud-security.net', 'azure-tenant-verify.online', 'hr-benefits-portal.biz'
];

var FREE_MAILS = ['proton.me', 'gmail.com', 'outlook.com', 'icloud.com', 'mail.com'];

function getActiveTicket() {
  return TICKETS.find(function(t) { return t.id === currentTicketId; }) || TICKETS[0];
}

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
