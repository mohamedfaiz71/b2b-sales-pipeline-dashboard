import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const LEADS = [
  { id: 1, name: "Sarah Mitchell", role: "Founder", company: "BloomCart", website: "bloomcart.com", location: "New York, US", size: "12 employees", industry: "E-commerce / Beauty", email: "sarah@bloomcart.com", issue: "Slow product pages, no upsell flow", status: "Meeting Scheduled", emailsSent: 2, replied: true },
  { id: 2, name: "James Thornton", role: "Marketing Manager", company: "PeakGear Store", website: "peakgear.co.uk", location: "London, UK", size: "28 employees", industry: "E-commerce / Sports", email: "james@peakgear.co.uk", issue: "Poor mobile UX, low add-to-cart rate", status: "Interested", emailsSent: 2, replied: true },
  { id: 3, name: "Priya Chandran", role: "Founder", company: "LuxeHome Co.", website: "luxehomeco.com", location: "Austin, US", size: "8 employees", industry: "E-commerce / Home Decor", email: "priya@luxehomeco.com", issue: "No landing page, direct-to-product links only", status: "Contacted", emailsSent: 1, replied: false },
  { id: 4, name: "Oliver Hayes", role: "CEO", company: "FreshKicks UK", website: "freshkicks.co.uk", location: "Manchester, UK", size: "35 employees", industry: "E-commerce / Fashion", email: "oliver@freshkicks.co.uk", issue: "High bounce rate on homepage", status: "Closed Won", emailsSent: 3, replied: true },
  { id: 5, name: "Maya Rodriguez", role: "Marketing Manager", company: "GreenRoots Shop", website: "greenrootsshop.com", location: "Miami, US", size: "18 employees", industry: "E-commerce / Organic Food", email: "maya@greenroots.com", issue: "Checkout abandonment, no recovery email", status: "Lead Generated", emailsSent: 0, replied: false },
  { id: 6, name: "Tom Wickfield", role: "Founder", company: "DeskHaven", website: "deskhaven.io", location: "Bristol, UK", size: "22 employees", industry: "E-commerce / Office", email: "tom@deskhaven.io", issue: "No social proof on product pages", status: "Follow-up Sent", emailsSent: 1, replied: false },
];

const PIPELINE_STAGES = ["Lead Generated", "Contacted", "Follow-up Sent", "Interested", "Meeting Scheduled", "Closed Won"];

const STATUS_COLORS = {
  "Lead Generated":    { bg: "#EFF6FF", text: "#2563EB", border: "#BFDBFE" },
  "Contacted":         { bg: "#F0FDF4", text: "#16A34A", border: "#BBF7D0" },
  "Follow-up Sent":    { bg: "#FFFBEB", text: "#D97706", border: "#FDE68A" },
  "Interested":        { bg: "#FFF7ED", text: "#EA580C", border: "#FED7AA" },
  "Meeting Scheduled": { bg: "#FDF4FF", text: "#9333EA", border: "#E9D5FF" },
  "Closed Won":        { bg: "#F0FDF4", text: "#15803D", border: "#86EFAC" },
};

const EMAIL_TEMPLATES = {
  cold: {
    label: "Cold Email",
    subject: "Quick idea for {{company}} — more conversions from existing traffic",
    body: `Hi {{name}},

I came across {{company}} and noticed that {{issue}} — a common challenge for growing e-commerce brands.

We help Shopify and WooCommerce stores like yours convert more of your existing traffic into paying customers through targeted landing page optimization and conversion rate audits.

For brands in the {{industry}} space, we've seen 20–35% improvement in add-to-cart rates within 60 days.

Would you be open to a 15-minute call this week to see if this could work for {{company}}?

Best,
Mohamed Faiz M
Business Development | Web Conversion Specialist`
  },
  followup1: {
    label: "Follow-up 1",
    subject: "Re: {{company}} — just checking in",
    body: `Hi {{name}},

I wanted to follow up on my previous email about improving conversions for {{company}}.

I completely understand if things are busy — I know running {{company}} takes up a lot of your time.

I put together a quick 2-minute loom video specifically looking at {{website}} with 3 actionable ideas you could implement this week. Happy to share it if useful.

Would a quick 15-minute chat work sometime this week?

Best,
Mohamed Faiz M`
  },
  followup2: {
    label: "Follow-up 2",
    subject: "Last note — {{company}} conversion ideas",
    body: `Hi {{name}},

I'll keep this short — this will be my last follow-up so I don't clutter your inbox.

We specialize in helping e-commerce brands like {{company}} fix the specific issue of {{issue}}, and I genuinely think there's a quick win here for you.

If the timing isn't right now, no worries at all. Feel free to reach out whenever it makes sense.

Wishing {{company}} continued growth!

Best,
Mohamed Faiz M`
  }
};

const CALL_ANALYSIS = {
  summary: "30-minute discovery call with James Thornton (PeakGear Store). James confirmed that mobile traffic accounts for 68% of visits but conversion rate is only 1.2% vs desktop at 3.8%. He expressed strong interest in a conversion audit and landing page redesign. Budget was confirmed at £2,000–£4,000 for initial project.",
  insights: [
    "Mobile UX is the primary pain point — 68% mobile traffic with 1.2% conversion",
    "Client uses Shopify Plus — compatible with proposed solution",
    "Decision maker is James directly — no approval chain needed",
    "Timeline: wants to launch before Q4 holiday season (Oct deadline)",
    "Budget confirmed: £2,000–£4,000 for initial scope"
  ],
  objections: [
    { objection: "We tried an agency before and it didn't work", response: "Acknowledged past experience; proposed a small paid audit first to prove value before full engagement" },
    { objection: "How quickly can we see results?", response: "Shared case study: similar brand saw 28% lift in add-to-cart within 45 days" },
    { objection: "Is the price negotiable?", response: "Offered a phased approach — audit first at lower cost, then full project if satisfied" }
  ],
  nextSteps: ["Send proposal document by Friday", "Include 2 case studies from similar e-commerce brands", "Schedule follow-up call for next Tuesday"]
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function fillTemplate(template, lead) {
  return template
    .replace(/{{name}}/g, lead.name.split(" ")[0])
    .replace(/{{company}}/g, lead.company)
    .replace(/{{website}}/g, lead.website)
    .replace(/{{issue}}/g, lead.issue)
    .replace(/{{industry}}/g, lead.industry);
}

function Badge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS["Lead Generated"];
  return (
    <span style={{
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      borderRadius: 6, padding: "2px 9px", fontSize: 11, fontWeight: 700,
      fontFamily: "'DM Mono', monospace", letterSpacing: 0.3, whiteSpace: "nowrap"
    }}>{status}</span>
  );
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "📊 Overview", short: "Overview" },
  { id: "leads", label: "🎯 Lead Database", short: "Leads" },
  { id: "email", label: "📧 Email Templates", short: "Emails" },
  { id: "crm", label: "🔄 CRM Pipeline", short: "CRM" },
  { id: "call", label: "🤝 Call Analysis", short: "Call" },
  { id: "results", label: "📈 Results", short: "Results" },
];

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────
function OverviewTab() {
  const stats = [
    { icon: "🎯", value: "100", label: "Leads Generated", sub: "via Apollo.io filters" },
    { icon: "📧", value: "72", label: "Emails Sent", sub: "Cold + 2 follow-ups" },
    { icon: "💬", value: "28", label: "Replies Received", sub: "38.9% reply rate" },
    { icon: "📅", value: "12", label: "Meetings Booked", sub: "via Calendly links" },
    { icon: "✅", value: "3", label: "Deals Closed", sub: "£8,500 pipeline value" },
  ];

  const tools = [
    { name: "Apollo.io", role: "Lead Generation", desc: "Filtered 100+ e-commerce founders & marketing managers in US/UK (10–50 employees)", color: "#FF6B35" },
    { name: "Lavender AI", role: "Email Personalization", desc: "AI-scored and improved cold email copy. Personalized each outreach based on website issues", color: "#7C3AED" },
    { name: "Fireflies.ai", role: "Call Intelligence", desc: "Recorded mock discovery calls, extracted objections, insights, and next steps automatically", color: "#0EA5E9" },
    { name: "HubSpot CRM", role: "Pipeline Management", desc: "Tracked all 100 leads across 6 pipeline stages from first contact to closed deal", color: "#FF7A59" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: "#6B7C8E", fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>PROJECT BRIEF</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0D1B2A", marginBottom: 10, fontFamily: "'Clash Display', sans-serif" }}>
          AI-Powered B2B Lead Generation & Sales Pipeline
        </h2>
        <p style={{ fontSize: 14, color: "#4A5568", lineHeight: 1.75, background: "#F8FAFC", padding: "14px 16px", borderRadius: 12, borderLeft: "3px solid #00C896" }}>
          Built a complete business development pipeline targeting small e-commerce brands (10–50 employees) in the US & UK, selling Website Conversion Optimization services. Used AI tools across every stage — from finding leads to closing deals — simulating a real BDE workflow.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: "#FFFFFF", borderRadius: 14, padding: "16px 14px", border: "1px solid #E8EDF2", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#0D1B2A", fontFamily: "'Clash Display', sans-serif", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#2D3748", margin: "4px 0 2px" }}>{s.label}</div>
            <div style={{ fontSize: 10, color: "#9AA5B4", fontFamily: "'DM Mono', monospace" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tools */}
      <div style={{ fontSize: 13, color: "#6B7C8E", fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 12 }}>TOOLS USED</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {tools.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, background: "#FFFFFF", borderRadius: 12, padding: "14px 16px", border: "1px solid #E8EDF2" }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: t.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 12, fontFamily: "'DM Mono', monospace" }}>{t.name.slice(0,2).toUpperCase()}</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13.5, color: "#0D1B2A" }}>{t.name} <span style={{ fontWeight: 500, color: "#9AA5B4", fontSize: 12 }}>— {t.role}</span></div>
              <div style={{ fontSize: 12.5, color: "#4A5568", marginTop: 2, lineHeight: 1.6 }}>{t.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── LEADS TAB ───────────────────────────────────────────────────────────────
function LeadsTab() {
  const [selected, setSelected] = useState(null);
  return (
    <div>
      <div style={{ background: "#F0FDF4", borderRadius: 12, padding: "12px 14px", marginBottom: 18, border: "1px solid #BBF7D0" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#16A34A", marginBottom: 2 }}>🔍 Apollo.io Search Filters Used</div>
        <div style={{ fontSize: 12, color: "#166534", fontFamily: "'DM Mono', monospace" }}>
          Industry: E-commerce / Retail &nbsp;·&nbsp; Location: US, UK &nbsp;·&nbsp; Size: 10–50 employees &nbsp;·&nbsp; Role: Founder, Marketing Manager, CEO
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {LEADS.map((lead) => (
          <div key={lead.id} onClick={() => setSelected(selected?.id === lead.id ? null : lead)}
            style={{ background: "#FFFFFF", border: `1.5px solid ${selected?.id === lead.id ? "#00C896" : "#E8EDF2"}`, borderRadius: 14, padding: "14px 16px", cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14.5, color: "#0D1B2A" }}>{lead.name}</div>
                <div style={{ fontSize: 12, color: "#6B7C8E" }}>{lead.role} · {lead.company}</div>
              </div>
              <Badge status={lead.status} />
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[lead.location, lead.size, lead.industry].map((tag, i) => (
                <span key={i} style={{ fontSize: 11, background: "#F1F5F9", color: "#475569", borderRadius: 5, padding: "2px 8px", fontFamily: "'DM Mono', monospace" }}>{tag}</span>
              ))}
            </div>

            {selected?.id === lead.id && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #F1F5F9" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                  {[["📧 Email", lead.email], ["🌐 Website", lead.website], ["📨 Emails Sent", lead.emailsSent], ["💬 Replied", lead.replied ? "Yes ✓" : "No"]].map(([k, v]) => (
                    <div key={k} style={{ background: "#F8FAFC", borderRadius: 8, padding: "8px 10px" }}>
                      <div style={{ fontSize: 10, color: "#9AA5B4", fontFamily: "'DM Mono', monospace", marginBottom: 2 }}>{k}</div>
                      <div style={{ fontSize: 12.5, color: "#2D3748", fontWeight: 600 }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#FFFBEB", borderRadius: 8, padding: "10px 12px", border: "1px solid #FDE68A" }}>
                  <div style={{ fontSize: 10, color: "#92400E", fontFamily: "'DM Mono', monospace", marginBottom: 3 }}>⚠️ IDENTIFIED PAIN POINT</div>
                  <div style={{ fontSize: 12.5, color: "#78350F", fontWeight: 600 }}>{lead.issue}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── EMAIL TAB ───────────────────────────────────────────────────────────────
function EmailTab() {
  const [activeTemplate, setActiveTemplate] = useState("cold");
  const [activeLead, setActiveLead] = useState(LEADS[0]);
  const template = EMAIL_TEMPLATES[activeTemplate];

  return (
    <div>
      <div style={{ fontSize: 13, color: "#6B7C8E", fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 10 }}>SELECT TEMPLATE</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {Object.entries(EMAIL_TEMPLATES).map(([key, t]) => (
          <button key={key} onClick={() => setActiveTemplate(key)} style={{
            padding: "8px 14px", borderRadius: 9, border: `1.5px solid ${activeTemplate === key ? "#00C896" : "#E8EDF2"}`,
            background: activeTemplate === key ? "#F0FFF8" : "#FFFFFF", color: activeTemplate === key ? "#065F46" : "#4A5568",
            fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: "'DM Mono', monospace"
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ fontSize: 13, color: "#6B7C8E", fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 10 }}>PREVIEW FOR LEAD</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, overflowX: "auto", paddingBottom: 4 }}>
        {LEADS.slice(0, 4).map(l => (
          <button key={l.id} onClick={() => setActiveLead(l)} style={{
            padding: "6px 12px", borderRadius: 8, border: `1.5px solid ${activeLead.id === l.id ? "#7C3AED" : "#E8EDF2"}`,
            background: activeLead.id === l.id ? "#FAF5FF" : "#FFFFFF", color: activeLead.id === l.id ? "#6D28D9" : "#4A5568",
            fontWeight: 600, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap"
          }}>{l.name.split(" ")[0]} · {l.company}</button>
        ))}
      </div>

      {/* AI Score Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, background: "#F0FDF4", borderRadius: 10, padding: "10px 14px", border: "1px solid #BBF7D0" }}>
        <span style={{ fontSize: 18 }}>🤖</span>
        <div>
          <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#166534", letterSpacing: 1 }}>LAVENDER AI SCORE</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#15803D" }}>87/100 — Strong personalization detected. Subject line clarity: Excellent.</div>
        </div>
      </div>

      {/* Email Preview */}
      <div style={{ background: "#FFFFFF", borderRadius: 14, border: "1px solid #E8EDF2", overflow: "hidden" }}>
        <div style={{ background: "#F8FAFC", padding: "12px 16px", borderBottom: "1px solid #E8EDF2" }}>
          <div style={{ fontSize: 11, color: "#9AA5B4", fontFamily: "'DM Mono', monospace", marginBottom: 3 }}>SUBJECT</div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0D1B2A" }}>{fillTemplate(template.subject, activeLead)}</div>
        </div>
        <div style={{ padding: "16px", fontFamily: "'Lora', serif", fontSize: 13.5, color: "#2D3748", lineHeight: 1.85, whiteSpace: "pre-wrap" }}>
          {fillTemplate(template.body, activeLead)}
        </div>
      </div>
    </div>
  );
}

// ─── CRM TAB ─────────────────────────────────────────────────────────────────
function CRMTab() {
  const grouped = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage] = LEADS.filter(l => l.status === stage);
    return acc;
  }, {});

  const stageCount = { "Lead Generated": 18, "Contacted": 42, "Follow-up Sent": 21, "Interested": 10, "Meeting Scheduled": 6, "Closed Won": 3 };

  return (
    <div>
      <div style={{ background: "#EFF6FF", borderRadius: 12, padding: "12px 14px", marginBottom: 18, border: "1px solid #BFDBFE" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", marginBottom: 2 }}>🔄 HubSpot CRM — 6-Stage Pipeline</div>
        <div style={{ fontSize: 12, color: "#1E40AF", fontFamily: "'DM Mono', monospace" }}>100 total leads tracked across all stages</div>
      </div>

      {/* Pipeline Visual */}
      <div style={{ marginBottom: 20 }}>
        {PIPELINE_STAGES.map((stage, i) => {
          const count = stageCount[stage];
          const pct = Math.round((count / 100) * 100);
          const c = STATUS_COLORS[stage];
          return (
            <div key={stage} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "#2D3748" }}>{i + 1}. {stage}</span>
                <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: c.text, fontWeight: 700 }}>{count} leads</span>
              </div>
              <div style={{ height: 8, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: c.border, borderRadius: 99, transition: "width 1s ease" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Sample Lead Cards per Stage */}
      <div style={{ fontSize: 13, color: "#6B7C8E", fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 12 }}>SAMPLE LEADS IN PIPELINE</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {LEADS.map(lead => (
          <div key={lead.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FFFFFF", borderRadius: 10, padding: "10px 14px", border: "1px solid #E8EDF2" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#0D1B2A" }}>{lead.name}</div>
              <div style={{ fontSize: 11.5, color: "#6B7C8E" }}>{lead.company} · {lead.emailsSent} email{lead.emailsSent !== 1 ? "s" : ""} sent</div>
            </div>
            <Badge status={lead.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CALL ANALYSIS TAB ───────────────────────────────────────────────────────
function CallTab() {
  return (
    <div>
      <div style={{ background: "#EFF6FF", borderRadius: 12, padding: "12px 14px", marginBottom: 18, border: "1px solid #BFDBFE" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", marginBottom: 2 }}>🤝 Fireflies.ai — AI Call Analysis Report</div>
        <div style={{ fontSize: 12, color: "#1E40AF", fontFamily: "'DM Mono', monospace" }}>Mock Discovery Call · James Thornton · PeakGear Store · 30 min</div>
      </div>

      {/* Summary */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#9AA5B4", letterSpacing: 1, marginBottom: 8 }}>CALL SUMMARY</div>
        <div style={{ background: "#FFFFFF", borderRadius: 12, padding: "14px 16px", border: "1px solid #E8EDF2", fontSize: 13.5, color: "#2D3748", lineHeight: 1.75 }}>
          {CALL_ANALYSIS.summary}
        </div>
      </div>

      {/* Key Insights */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#9AA5B4", letterSpacing: 1, marginBottom: 8 }}>KEY INSIGHTS</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {CALL_ANALYSIS.insights.map((ins, i) => (
            <div key={i} style={{ display: "flex", gap: 10, background: "#F8FAFC", borderRadius: 10, padding: "10px 12px", border: "1px solid #E8EDF2" }}>
              <span style={{ color: "#00C896", fontWeight: 900, fontSize: 14, marginTop: 1 }}>✦</span>
              <span style={{ fontSize: 13, color: "#2D3748", lineHeight: 1.6 }}>{ins}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Objections */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#9AA5B4", letterSpacing: 1, marginBottom: 8 }}>OBJECTIONS & RESPONSES</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CALL_ANALYSIS.objections.map((o, i) => (
            <div key={i} style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E8EDF2", overflow: "hidden" }}>
              <div style={{ background: "#FFF7ED", padding: "10px 14px", borderBottom: "1px solid #FED7AA" }}>
                <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#92400E", marginRight: 6 }}>⚠ OBJECTION</span>
                <span style={{ fontSize: 13, color: "#78350F", fontWeight: 600 }}>"{o.objection}"</span>
              </div>
              <div style={{ padding: "10px 14px" }}>
                <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#166534", marginRight: 6 }}>✓ RESPONSE</span>
                <span style={{ fontSize: 13, color: "#2D3748" }}>{o.response}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div>
        <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#9AA5B4", letterSpacing: 1, marginBottom: 8 }}>AGREED NEXT STEPS</div>
        {CALL_ANALYSIS.nextSteps.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8, background: "#F0FDF4", borderRadius: 9, padding: "9px 12px", border: "1px solid #BBF7D0" }}>
            <span style={{ background: "#00C896", color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, flexShrink: 0 }}>{i + 1}</span>
            <span style={{ fontSize: 13, color: "#065F46", fontWeight: 500 }}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RESULTS TAB ─────────────────────────────────────────────────────────────
function ResultsTab() {
  const metrics = [
    { label: "Leads Generated", value: "100", sub: "Apollo.io", icon: "🎯", color: "#2563EB" },
    { label: "Emails Sent", value: "72", sub: "Cold + Follow-ups", icon: "📧", color: "#7C3AED" },
    { label: "Reply Rate", value: "38.9%", sub: "28 replies", icon: "💬", color: "#0EA5E9" },
    { label: "Meeting Rate", value: "16.7%", sub: "12 meetings from replies", icon: "📅", color: "#F59E0B" },
    { label: "Deals Closed", value: "3", sub: "Simulation", icon: "✅", color: "#10B981" },
    { label: "Pipeline Value", value: "£8,500", sub: "Estimated", icon: "💰", color: "#EF4444" },
  ];

  const funnel = [
    { label: "Leads Found", n: 100, color: "#2563EB" },
    { label: "Emails Sent", n: 72, color: "#7C3AED" },
    { label: "Replies", n: 28, color: "#0EA5E9" },
    { label: "Meetings", n: 12, color: "#F59E0B" },
    { label: "Deals", n: 3, color: "#10B981" },
  ];

  return (
    <div>
      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: "#FFFFFF", borderRadius: 14, padding: "16px 14px", border: "1px solid #E8EDF2", textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{m.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: m.color, fontFamily: "'Clash Display', sans-serif" }}>{m.value}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#2D3748", margin: "4px 0 2px" }}>{m.label}</div>
            <div style={{ fontSize: 10, color: "#9AA5B4", fontFamily: "'DM Mono', monospace" }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Conversion Funnel */}
      <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#9AA5B4", letterSpacing: 1, marginBottom: 14 }}>CONVERSION FUNNEL</div>
      <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "18px 16px", border: "1px solid #E8EDF2", marginBottom: 20 }}>
        {funnel.map((f, i) => (
          <div key={i} style={{ marginBottom: i < funnel.length - 1 ? 12 : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#2D3748" }}>{f.label}</span>
              <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: f.color, fontWeight: 700 }}>{f.n}</span>
            </div>
            <div style={{ height: 10, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(f.n / 100) * 100}%`, background: f.color, borderRadius: 99 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Learnings */}
      <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#9AA5B4", letterSpacing: 1, marginBottom: 10 }}>KEY LEARNINGS</div>
      {[
        "Personalized cold emails (mentioning specific website issue) had 3x higher reply rate vs generic templates",
        "Follow-up 1 (Loom video offer) drove 40% of all replies — most effective touchpoint",
        "Founders responded faster than Marketing Managers — better targeting for future campaigns",
        "UK leads had higher open rates; US leads had higher reply-to-meeting conversion",
        "AI call analysis (Fireflies) saved ~2 hours of manual note-taking per discovery call",
      ].map((l, i) => (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, background: "#F8FAFC", borderRadius: 10, padding: "10px 12px", border: "1px solid #E8EDF2" }}>
          <span style={{ color: "#00C896", fontWeight: 900, flexShrink: 0 }}>✦</span>
          <span style={{ fontSize: 12.5, color: "#2D3748", lineHeight: 1.6 }}>{l}</span>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("overview");

  const tabContent = { overview: <OverviewTab />, leads: <LeadsTab />, email: <EmailTab />, crm: <CRMTab />, call: <CallTab />, results: <ResultsTab /> };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital@0;1&family=DM+Mono:wght@400;500&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@700,800,900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 0; }
        body { background: #F1F5F9; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#F1F5F9", fontFamily: "'Lora', serif" }}>

        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #0D1B2A 0%, #1A3A5C 50%, #0A4A3A 100%)",
          padding: "28px 20px 24px", position: "relative", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(0,200,150,0.08)" }} />
          <div style={{ position: "absolute", bottom: -20, left: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />

          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,200,150,0.15)", border: "1px solid rgba(0,200,150,0.3)", borderRadius: 20, padding: "4px 12px", marginBottom: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00C896" }} />
            <span style={{ color: "#00C896", fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1.5 }}>PORTFOLIO PROJECT · B2B SALES</span>
          </div>

          <h1 style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 900, marginBottom: 6, fontFamily: "'Clash Display', sans-serif", lineHeight: 1.2 }}>
            AI-Powered B2B Lead Gen<br />& Sales Pipeline
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 12.5, marginBottom: 16, lineHeight: 1.6 }}>
            Targeting US & UK E-commerce brands · Shopify Conversion Services
          </p>

          <div style={{ display: "flex", gap: 16 }}>
            {[["100", "Leads"], ["£8.5K", "Pipeline"], ["3", "Deals"]].map(([v, l]) => (
              <div key={l}>
                <div style={{ color: "#00C896", fontWeight: 900, fontSize: 20, fontFamily: "'Clash Display', sans-serif" }}>{v}</div>
                <div style={{ color: "#64748B", fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E8EDF2", overflowX: "auto" }}>
          <div style={{ display: "flex", minWidth: "max-content" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: "13px 16px", background: "none", border: "none",
                borderBottom: `2.5px solid ${tab === t.id ? "#00C896" : "transparent"}`,
                color: tab === t.id ? "#065F46" : "#64748B",
                fontFamily: "'DM Mono', monospace", fontSize: 11.5, fontWeight: tab === t.id ? 700 : 500,
                cursor: "pointer", letterSpacing: 0.3, whiteSpace: "nowrap", transition: "all 0.15s"
              }}>{t.short}</button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "20px 16px 48px", maxWidth: 680, margin: "0 auto", animation: "fadeUp 0.3s ease" }}>
          {tabContent[tab]}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "0 16px 28px" }}>
          <div style={{ display: "inline-block", background: "#FFFFFF", borderRadius: 10, padding: "8px 18px", border: "1px solid #E8EDF2" }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10.5, color: "#9AA5B4", letterSpacing: 1 }}>
              BUILT BY MOHAMED FAIZ M · BUSINESS DEVELOPMENT PORTFOLIO 2025
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
