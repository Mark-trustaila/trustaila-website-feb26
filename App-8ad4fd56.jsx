import { useState, useRef, useEffect } from "react";

/* ─────────────────────────────────────────────
   ICO Accountability Assessment — AiLA
   Notion-style: Source Serif 4 headings, system fonts body,
   #37352f primary, #e8e5e0 borders, 680px max-width
   ───────────────────────────────────────────── */

// ── Section metadata (ICO's 10 categories) ──
const SECTIONS = [
  { id: "leadership", label: "Leadership & Oversight", icon: "§1" },
  { id: "policies", label: "Policies & Procedures", icon: "§2" },
  { id: "training", label: "Training & Awareness", icon: "§3" },
  { id: "rights", label: "Individuals' Rights", icon: "§4" },
  { id: "transparency", label: "Transparency", icon: "§5" },
  { id: "records", label: "Records of Processing & Lawful Basis", icon: "§6" },
  { id: "contracts", label: "Contracts & Data Sharing", icon: "§7" },
  { id: "risks", label: "Risks & DPIAs", icon: "§8" },
  { id: "security", label: "Records Management & Security", icon: "§9" },
  { id: "breach", label: "Breach Response & Monitoring", icon: "§10" },
];

// ── Answer options ──
const OPTIONS = [
  { value: "yes", label: "Yes, fully in place", score: 3, color: "#22c55e" },
  { value: "partial", label: "Partially in place", score: 2, color: "#f59e0b" },
  { value: "no", label: "No / not started", score: 1, color: "#ef4444" },
  { value: "na", label: "Not applicable", score: null, color: "#9b9a97" },
];

// ── Questions ──
const QUESTIONS = {
  leadership: [
    {
      id: "lead-1",
      question: "Does your board or highest management level have overall responsibility for data protection and information governance?",
      help: "The ICO expects ultimate accountability for data protection to sit with the highest level of management. This means the board or senior leadership team has formally acknowledged its responsibility and actively oversees compliance, rather than delegating entirely to operational staff.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Leadership and oversight",
      severity: "critical",
      effort: "quick",
      remediation: "Formally assign data protection accountability to a named board member or senior leader. Record this in board minutes. Ensure data protection appears as a standing agenda item at board or senior management meetings at least quarterly.",
    },
    {
      id: "lead-2",
      question: "Have you assessed whether you are legally required to appoint a Data Protection Officer (DPO), and documented the decision?",
      help: "Under UK GDPR Articles 37–39, a DPO is mandatory if you are a public authority, carry out large-scale systematic monitoring, or process special category data on a large scale. Even if not required, many organisations benefit from appointing one. The ICO expects the assessment to be documented regardless of the outcome.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Leadership — DPO assessment",
      severity: "critical",
      effort: "quick",
      remediation: "Conduct and document a DPO assessment against the three mandatory criteria in Article 37. If a DPO is required, appoint one with the independence and resources required by Articles 38–39. If not required, consider appointing a data protection lead and document why a formal DPO is not necessary.",
    },
    {
      id: "lead-3",
      question: "Are sufficient resources (budget, staff, tools) allocated to data protection activities?",
      help: "The ICO has noted in multiple enforcement actions that under-resourcing data protection is an aggravating factor. Accountability requires not just policies but the practical means to implement them. The ICO expects organisations to demonstrate that resourcing is proportionate to the risks.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Leadership — Resources",
      severity: "high",
      effort: "moderate",
      remediation: "Review current data protection resourcing against your processing activities and risk profile. Document the resource allocation, including staff time, budget for tools and training, and any external support. Present a business case to leadership if resources are insufficient.",
    },
    {
      id: "lead-4",
      question: "Is data protection performance reported to senior management on a regular basis, using meaningful metrics?",
      help: "The ICO expects organisations to use management information to monitor data protection performance. This includes metrics such as: DSAR response times, breach statistics, training completion rates, DPIA completion, and complaint volumes. Without regular reporting, leadership cannot fulfil its oversight role.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Leadership — Management information",
      severity: "high",
      effort: "moderate",
      remediation: "Create a quarterly data protection dashboard covering: DSARs (volume, response times, overdue), breaches (number, severity, notification decisions), training completion, DPIAs completed, and complaints. Present to the board or senior management team with trend analysis.",
    },
    {
      id: "lead-5",
      question: "Do you have an established oversight group or governance committee that meets regularly to discuss data protection matters?",
      help: "The ICO framework recommends an oversight group that includes senior representatives from across the business, meeting regularly to review data protection risks, incidents, and compliance progress. This group reports to the board and provides strategic direction.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Leadership — Oversight group",
      severity: "medium",
      effort: "moderate",
      remediation: "Establish a data protection oversight group with representatives from IT, HR, legal, operations, and senior management. Set a meeting cadence (monthly or quarterly), define terms of reference, and ensure minutes and actions are recorded.",
    },
  ],
  policies: [
    {
      id: "pol-1",
      question: "Do you have a comprehensive, documented data protection policy that is reviewed and updated regularly?",
      help: "The ICO expects a formal data protection policy that sets out your organisation's approach to compliance. It should cover: scope, responsibilities, key principles, lawful bases, data subject rights, breach procedures, and retention. The policy must be reviewed at planned intervals and after significant changes.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Policies and procedures",
      severity: "critical",
      effort: "moderate",
      remediation: "Draft or update your data protection policy to cover: scope and applicability, roles and responsibilities, data protection principles, lawful basis identification, data subject rights procedures, breach notification, retention and deletion, and international transfers. Set an annual review date.",
    },
    {
      id: "pol-2",
      question: "Do you have a 'data protection by design and by default' approach embedded in new projects, systems, and processes?",
      help: "Article 25 UK GDPR requires data protection by design and by default. The ICO expects this to be a systematic approach — not just a principle — with documented procedures for assessing privacy implications at the start of any new project, procurement, or system change.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Policies — Privacy by design",
      severity: "high",
      effort: "moderate",
      remediation: "Create a privacy-by-design checklist or template that must be completed for all new projects, system procurements, and process changes. Integrate it into existing project management or change management workflows. Require sign-off from the DPO or data protection lead before proceeding.",
    },
    {
      id: "pol-3",
      question: "Do you have documented procedures for handling data subject requests (access, erasure, rectification, portability, objection)?",
      help: "The ICO expects written procedures for each type of data subject right, not just DSARs. These should cover: how requests are received, verified, escalated, processed, and responded to, with documented timelines and responsibilities.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Policies — Data subject rights procedures",
      severity: "critical",
      effort: "moderate",
      remediation: "Document procedures for each data subject right: access (DSAR), erasure, rectification, restriction, portability, objection, and automated decision-making. For each, specify: how requests are identified, who handles them, verification steps, response timelines, and template correspondence.",
    },
    {
      id: "pol-4",
      question: "Are your data protection policies distributed to all staff and easily accessible?",
      help: "A policy that staff cannot find or have not read is not meeting the accountability standard. The ICO expects policies to be actively distributed, not just stored on an intranet. Staff should be able to demonstrate awareness of their content.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Policies — Distribution",
      severity: "medium",
      effort: "quick",
      remediation: "Ensure data protection policies are available on the intranet, included in new starter onboarding packs, and referenced in annual training. Consider requiring staff acknowledgement of key policies. Make policies findable with clear naming and a central policy register.",
    },
  ],
  training: [
    {
      id: "train-1",
      question: "Do all staff receive data protection training on induction, before they access personal data?",
      help: "The ICO expects induction training to be completed before new staff access personal data, and ideally within one month of their start date. This applies to all staff, including temporary workers, contractors, and volunteers who handle personal data.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Training and awareness — Induction",
      severity: "high",
      effort: "moderate",
      remediation: "Implement mandatory data protection training as part of the onboarding process, to be completed before access to personal data is granted. Use an online module for consistency and tracking. Cover: data protection principles, your organisation's policies, how to recognise and report breaches, and data subject rights.",
    },
    {
      id: "train-2",
      question: "Is refresher training provided at regular intervals (at least annually)?",
      help: "The ICO expects refresher training to keep staff awareness current. Annual refresher training is the minimum standard. It should cover any changes to legislation, ICO guidance, your organisation's policies, and lessons learned from incidents.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Training — Refresher",
      severity: "high",
      effort: "moderate",
      remediation: "Schedule annual refresher training for all staff. Track completion rates and follow up on non-completion. Update content annually to reflect legislative changes, new ICO guidance, and lessons from any incidents or near-misses within your organisation.",
    },
    {
      id: "train-3",
      question: "Do staff in specialist roles (DPO, IT security, HR, marketing) receive additional data protection training relevant to their function?",
      help: "The ICO recognises that general awareness training is insufficient for staff whose roles involve significant data protection responsibilities. HR staff handling DSARs, marketing staff managing consent, and IT staff managing security all need function-specific training.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Training — Specialist roles",
      severity: "medium",
      effort: "moderate",
      remediation: "Identify roles with significant data protection responsibilities (HR, marketing, IT, customer service, DPO). Develop or procure role-specific training modules covering the data protection issues most relevant to each function. Track completion separately from general training.",
    },
    {
      id: "train-4",
      question: "Can you demonstrate that staff understand their data protection responsibilities (e.g. through assessments, surveys, or observed behaviour)?",
      help: "Training delivery alone is not sufficient — the ICO expects organisations to be able to demonstrate that training is effective. This means more than a tick-box completion record; it requires evidence that staff can apply what they have learned.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Training — Demonstrating understanding",
      severity: "medium",
      effort: "moderate",
      remediation: "Add assessment questions to training modules (pass mark required). Conduct periodic awareness surveys or spot checks. Review incident data for patterns suggesting training gaps. Use phishing simulations to test security awareness. Document results and feed findings back into training content.",
    },
  ],
  rights: [
    {
      id: "rights-1",
      question: "Can you handle all types of data subject request — not just DSARs — within the statutory timeframes?",
      help: "The ICO framework covers all individual rights under UK GDPR: access (Article 15), rectification (Article 16), erasure (Article 17), restriction (Article 18), portability (Article 20), and objection (Article 21). Many organisations have DSAR processes but no documented approach to the other rights.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Individuals' rights",
      severity: "critical",
      effort: "moderate",
      remediation: "Map each data subject right to a documented process: who handles it, how requests are identified, verification steps, the statutory timeframe, and response templates. Test your ability to action each right — can you actually erase data from all systems if asked? Can you export data in a portable format?",
    },
    {
      id: "rights-2",
      question: "Do you have processes for handling the right to erasure, including across backup systems and third-party processors?",
      help: "The right to erasure is particularly challenging operationally. The ICO expects you to be able to delete personal data from production systems, backups (within a reasonable timeframe), and to notify processors and third parties to whom data has been disclosed. Simply marking data as 'deleted' in a UI while it persists in backups may not be sufficient.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Rights — Erasure",
      severity: "high",
      effort: "significant",
      remediation: "Document your erasure process: which systems hold personal data, how deletion works in each (including backups), the timeframe for backup purging, and how you notify processors. Identify any systems where true deletion is technically difficult and document your approach to managing residual data.",
    },
    {
      id: "rights-3",
      question: "Do you have a process for handling objections to processing, including direct marketing?",
      help: "The right to object to direct marketing is absolute — there are no grounds for refusing. For other processing based on legitimate interests or public task, you must conduct a balancing test. The ICO expects a documented process for receiving and actioning objections, not just an unsubscribe link.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Rights — Right to object",
      severity: "high",
      effort: "moderate",
      remediation: "Document your objection-handling process for both direct marketing (absolute right, must comply immediately) and other processing (requires balancing test). Ensure marketing systems can action opt-outs in real time. For legitimate interest objections, create a template balancing assessment.",
    },
    {
      id: "rights-4",
      question: "If you use automated decision-making that produces legal or similarly significant effects, do individuals know about it and can they request human review?",
      help: "Article 22 UK GDPR gives individuals the right not to be subject to solely automated decisions with legal or similarly significant effects, unless certain conditions are met. The ICO expects transparency about automated processing and a meaningful mechanism for human review.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Rights — Automated decision-making",
      severity: "high",
      effort: "moderate",
      remediation: "Audit your processing activities for automated decision-making with legal or significant effects (e.g. credit scoring, recruitment screening, insurance pricing). For each, ensure: the privacy notice discloses it, individuals can request human review, and the review process is genuinely meaningful.",
    },
  ],
  transparency: [
    {
      id: "trans-1",
      question: "Do you have comprehensive, up-to-date privacy notices that cover all your processing activities?",
      help: "The ICO expects privacy notices to contain all information required by Articles 13 and 14 UK GDPR: identity and contact details, purposes and lawful bases, recipients, retention periods, rights, complaints, and source of data (for data not collected directly). Notices must be reviewed when processing changes.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Transparency — Privacy notices",
      severity: "critical",
      effort: "moderate",
      remediation: "Review all privacy notices (website, employee, customer, recruitment) against the Article 13/14 checklist. Ensure each notice covers: who you are, what you collect, why, lawful basis, who you share with, retention periods, individual rights, and how to complain. Use layered notices where appropriate.",
    },
    {
      id: "trans-2",
      question: "Are your privacy notices written in clear, plain language that your audience can understand?",
      help: "The ICO has consistently emphasised that privacy information must be concise, transparent, intelligible and easily accessible. Legal jargon and excessively long notices fail the transparency requirement. The ICO recommends layered approaches — a short summary with links to fuller detail.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Transparency — Clear language",
      severity: "medium",
      effort: "moderate",
      remediation: "Rewrite privacy notices in plain English, aiming for a reading age of 11–13. Use layered notices: a one-page summary covering the essentials, with links to the full notice. Test readability with a sample of your audience. Avoid legal jargon — use 'we use your data to...' not 'processing of personal data is undertaken for the purposes of...'.",
    },
    {
      id: "trans-3",
      question: "Do you provide privacy information at the point of data collection, before processing begins?",
      help: "Article 13 requires privacy information to be provided at the time personal data is collected. For data obtained indirectly (Article 14), it must be provided within a reasonable period and no later than one month. The ICO expects proactive provision, not passive availability.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Transparency — Timing",
      severity: "high",
      effort: "moderate",
      remediation: "Map every point at which you collect personal data (forms, phone calls, CCTV, third-party sources). Ensure a privacy notice or link is provided at each collection point. For indirect collection, document when and how you provide notice within the required timeframe.",
    },
    {
      id: "trans-4",
      question: "If you rely on consent as a lawful basis, do you obtain it in a way that meets the UK GDPR standard (freely given, specific, informed, unambiguous, and as easy to withdraw as to give)?",
      help: "The ICO has a high bar for valid consent. Pre-ticked boxes, bundled consent, and consent buried in terms and conditions do not meet the standard. The ICO expects consent mechanisms to be genuinely optional, specific to each purpose, clearly explained, and revocable through an equally simple mechanism.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Transparency — Consent",
      severity: "critical",
      effort: "moderate",
      remediation: "Audit all consent mechanisms: forms, cookies, marketing preferences, data sharing agreements. For each, verify: consent is opt-in (not pre-ticked), specific to each purpose, clearly explained, and withdrawal is as easy as giving consent. Document the consent record (who, when, what, how).",
    },
  ],
  records: [
    {
      id: "rec-1",
      question: "Do you maintain a comprehensive, accurate Record of Processing Activities (ROPA) as required by Article 30 UK GDPR?",
      help: "Article 30 requires controllers to maintain a record of processing activities. The ICO may request this at any time. It must include: purposes, categories of data subjects and data, recipients, international transfers, retention periods, and security measures. Many organisations have a ROPA but it is incomplete or out of date.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Records of processing",
      severity: "critical",
      effort: "significant",
      remediation: "Create or update your ROPA to include all required Article 30 fields. Assign ownership of each processing activity to a business area. Establish a review cycle (at least annually, and when processing changes). If you are also a processor, maintain a separate processor ROPA.",
    },
    {
      id: "rec-2",
      question: "Have you identified and documented the lawful basis for each processing activity?",
      help: "The ICO expects you to identify the most appropriate lawful basis before processing begins and to document it. You cannot retrospectively change your lawful basis. For special category data, you must also identify a condition under Article 9. Getting the lawful basis wrong undermines your entire compliance position.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Lawful basis",
      severity: "critical",
      effort: "moderate",
      remediation: "For each processing activity in your ROPA, document the lawful basis (consent, contract, legal obligation, vital interests, public task, or legitimate interests). For legitimate interests, complete a Legitimate Interests Assessment (LIA). For special category data, identify the Article 9 condition. Record these in your ROPA.",
    },
    {
      id: "rec-3",
      question: "Do you carry out regular data mapping exercises to understand what personal data you hold, where it is stored, and how it flows?",
      help: "The ICO expects data mapping to be an ongoing exercise, not a one-off GDPR compliance project. Understanding what data you hold, where, and how it flows is foundational to almost every other accountability requirement — you cannot write an accurate privacy notice, respond to a DSAR, or conduct a DPIA without it.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Records — Data mapping",
      severity: "high",
      effort: "significant",
      remediation: "Schedule regular data mapping exercises (annually at minimum). Document: what personal data is held, where it is stored (systems, locations), how it flows between systems and to third parties, who has access, and retention periods. Use the output to verify and update your ROPA and privacy notices.",
    },
    {
      id: "rec-4",
      question: "Where you rely on legitimate interests, have you completed a Legitimate Interests Assessment (LIA) for each relevant processing activity?",
      help: "The ICO expects a documented LIA for every processing activity that relies on legitimate interests as the lawful basis. The LIA must demonstrate: the legitimate interest identified, that the processing is necessary, and a balancing test weighing the interest against the individual's rights and freedoms.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Records — LIA",
      severity: "high",
      effort: "moderate",
      remediation: "Identify all processing activities relying on legitimate interests. For each, complete a three-part LIA: (1) purpose test — what is the legitimate interest? (2) necessity test — is the processing necessary? (3) balancing test — do the individual's rights override? Document and review when circumstances change.",
    },
  ],
  contracts: [
    {
      id: "con-1",
      question: "Do all your data processor contracts include the mandatory Article 28 UK GDPR terms?",
      help: "Article 28 requires written contracts with processors that include: subject matter and duration, nature and purpose, types of data, obligations and rights of the controller, and specific provisions on sub-processing, security, breach notification, deletion, and audit rights. Using a processor without an adequate contract is itself a breach.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Contracts and data sharing",
      severity: "critical",
      effort: "moderate",
      remediation: "Audit all processor relationships. For each, verify a written contract exists containing all Article 28 mandatory terms. Where contracts pre-date GDPR or lack required terms, negotiate amendments or addenda. Create a standard processor agreement template for new engagements.",
    },
    {
      id: "con-2",
      question: "Do you conduct due diligence on processors before engaging them, to verify they can provide sufficient guarantees of compliance?",
      help: "Article 28(1) requires you to use only processors providing sufficient guarantees. The ICO expects documented due diligence — not just reliance on the processor's assurances. This should include reviewing their security measures, compliance certifications, breach history, and sub-processor arrangements.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Contracts — Due diligence",
      severity: "high",
      effort: "moderate",
      remediation: "Create a processor due diligence questionnaire covering: security measures (technical and organisational), compliance certifications (ISO 27001, Cyber Essentials), sub-processor policy, breach notification capability, data location, and staff training. Require completion before engagement and review periodically.",
    },
    {
      id: "con-3",
      question: "Do you have appropriate safeguards in place for any international transfers of personal data outside the UK?",
      help: "Following the UK's departure from the EU, transfers require either an adequacy decision, appropriate safeguards (UK IDTA or EU SCCs with UK Addendum), or a derogation. The ICO expects organisations to map their international transfers, identify the transfer mechanism for each, and conduct Transfer Risk Assessments where required.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Contracts — International transfers",
      severity: "critical",
      effort: "significant",
      remediation: "Map all international transfers (including cloud services storing data outside the UK). For each, identify the transfer mechanism: UK adequacy decision, UK International Data Transfer Agreement (IDTA), EU SCCs with UK Addendum, or a valid derogation. Conduct Transfer Risk Assessments where the destination country lacks an adequacy decision.",
    },
    {
      id: "con-4",
      question: "Do you have documented data sharing agreements with other controllers where you share personal data?",
      help: "The ICO expects controller-to-controller data sharing to be governed by documented agreements setting out: the purpose of sharing, lawful basis, data types, security requirements, retention, and individual rights responsibilities. Informal sharing without governance is a common compliance gap.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Contracts — Data sharing",
      severity: "high",
      effort: "moderate",
      remediation: "Identify all controller-to-controller data sharing arrangements. For each, execute a data sharing agreement covering: purpose and lawful basis, data categories, security measures, retention and deletion, breach notification, and which party handles data subject requests. Use the ICO's data sharing code of practice as a guide.",
    },
  ],
  risks: [
    {
      id: "risk-1",
      question: "Do you have a process for identifying when a Data Protection Impact Assessment (DPIA) is required?",
      help: "DPIAs are mandatory for processing likely to result in a high risk to individuals. The ICO provides screening criteria: large-scale profiling, systematic monitoring, special category data at scale, innovative technology, and others. The ICO expects a documented screening process, not ad hoc decisions about whether a DPIA is needed.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Risks and DPIAs — Screening",
      severity: "critical",
      effort: "moderate",
      remediation: "Create a DPIA screening checklist based on the ICO's criteria and the Article 29 Working Party guidelines. Integrate it into project initiation and procurement workflows. Document screening decisions (including decisions that a DPIA is not required). Require DPO or data protection lead sign-off on screening outcomes.",
    },
    {
      id: "risk-2",
      question: "When a DPIA is required, do you follow a structured methodology that meets the Article 35 requirements?",
      help: "Article 35 requires a DPIA to contain: a systematic description of the processing, assessment of necessity and proportionality, assessment of risks to individuals, and measures to address those risks. The ICO expects DPIAs to be substantive assessments, not tick-box exercises.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Risks — DPIA methodology",
      severity: "high",
      effort: "moderate",
      remediation: "Adopt or develop a DPIA template that covers all Article 35 requirements. Use the ICO's sample DPIA template as a starting point. Ensure DPIAs include: processing description, necessity and proportionality assessment, risk identification and scoring, and documented mitigation measures. Require DPO review of all completed DPIAs.",
    },
    {
      id: "risk-3",
      question: "Do you maintain a risk register or similar tool for tracking data protection risks and their mitigations?",
      help: "The ICO expects data protection risks to be identified, assessed, and actively managed — not just documented in DPIAs and forgotten. A risk register provides ongoing visibility and ensures mitigations are implemented and monitored.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Risks — Risk management",
      severity: "medium",
      effort: "moderate",
      remediation: "Create a data protection risk register (or add data protection risks to your existing risk register). For each risk, document: description, likelihood, impact, current controls, residual risk level, planned mitigations, owner, and review date. Review quarterly and after any significant incident or processing change.",
    },
    {
      id: "risk-4",
      question: "Do you have a process for consulting the ICO when a DPIA identifies a high risk that cannot be mitigated?",
      help: "Article 36 requires prior consultation with the ICO where a DPIA shows that processing would result in a high risk that cannot be mitigated. The ICO expects organisations to have a documented process for this, even if it has never been triggered.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Risks — Prior consultation",
      severity: "medium",
      effort: "quick",
      remediation: "Document a process for ICO prior consultation: who decides when consultation is needed, what information to submit, and the internal approval process. Even if you have never needed to consult, having the process documented demonstrates preparedness. Reference the ICO's guidance on prior consultation.",
    },
  ],
  security: [
    {
      id: "sec-1",
      question: "Do you have appropriate technical and organisational security measures in place, proportionate to the risks of your processing?",
      help: "Article 32 UK GDPR requires security measures appropriate to the risk. The ICO expects a risk-based approach covering: encryption, pseudonymisation, access controls, resilience, recovery capability, and regular testing. 'Appropriate' is proportionate to the sensitivity and volume of data processed.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Records management and security",
      severity: "critical",
      effort: "significant",
      remediation: "Conduct a security risk assessment covering all systems processing personal data. Implement controls proportionate to the risk: encryption at rest and in transit, access controls (least privilege), multi-factor authentication, regular patching, backup and recovery procedures, and network security. Document your security measures.",
    },
    {
      id: "sec-2",
      question: "Do you have documented retention and deletion policies, and are they consistently applied across all systems?",
      help: "The storage limitation principle requires that personal data is not kept longer than necessary. The ICO expects documented retention periods for each category of personal data, automated deletion where possible, and evidence that retention policies are actually enforced — not just written.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Security — Retention",
      severity: "high",
      effort: "significant",
      remediation: "Create a retention schedule mapping each data category to a retention period with justification. Implement automated deletion where technically feasible. For systems where automated deletion is not possible, schedule regular manual reviews. Audit compliance with retention policies at least annually.",
    },
    {
      id: "sec-3",
      question: "Do you have access controls ensuring that personal data is only accessible to those who need it for their role?",
      help: "The principle of least privilege is a core security expectation. The ICO expects documented access control policies, regular access reviews, prompt removal of access when staff leave or change role, and separation of duties for sensitive processing.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Security — Access controls",
      severity: "high",
      effort: "moderate",
      remediation: "Implement role-based access controls across all systems containing personal data. Conduct access reviews at least quarterly. Ensure joiners/movers/leavers processes update access promptly. Log and monitor access to sensitive personal data. Remove dormant accounts after a defined period.",
    },
    {
      id: "sec-4",
      question: "Do you regularly test and evaluate the effectiveness of your security measures?",
      help: "Article 32(1)(d) specifically requires regular testing, assessing, and evaluating. The ICO expects evidence of ongoing security testing — vulnerability scanning, penetration testing, and security audits — not just initial implementation. Cyber Essentials or ISO 27001 certification can help demonstrate this.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Security — Testing",
      severity: "medium",
      effort: "moderate",
      remediation: "Schedule regular security testing: vulnerability scanning (quarterly), penetration testing (annually), and security policy review (annually). Consider Cyber Essentials certification as a baseline. Document test results, remediation actions, and timelines. Report findings to the oversight group.",
    },
  ],
  breach: [
    {
      id: "breach-1",
      question: "Do you have a documented personal data breach procedure covering detection, containment, assessment, notification, and recording?",
      help: "The ICO expects a comprehensive breach procedure — not just a notification process. It should cover: how breaches are detected and reported internally, initial containment steps, risk assessment methodology, decision-making on ICO notification (72-hour deadline) and individual notification, and a breach register.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Breach response and monitoring",
      severity: "critical",
      effort: "moderate",
      remediation: "Document a breach response procedure covering: (1) detection and internal reporting channels, (2) initial containment and assessment, (3) risk assessment using the ICO's methodology, (4) ICO notification decision (within 72 hours) with template, (5) individual notification decision with template, (6) root cause analysis, and (7) breach register. Test the procedure with a tabletop exercise.",
    },
    {
      id: "breach-2",
      question: "Can you assess the risk to individuals from a breach and make notification decisions within the 72-hour deadline?",
      help: "The 72-hour notification deadline runs from when you become aware of the breach, not from when you complete your investigation. The ICO expects organisations to be able to conduct an initial risk assessment quickly. Many organisations struggle with this because they lack a defined risk assessment methodology for breaches.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Breach — Notification",
      severity: "critical",
      effort: "moderate",
      remediation: "Create a breach risk assessment template that can be completed quickly: nature of the data, number of individuals affected, likely consequences, severity of consequences, special characteristics of individuals (children, vulnerable), and mitigating measures. Define clear thresholds for when ICO and individual notification is required.",
    },
    {
      id: "breach-3",
      question: "Do you maintain a comprehensive breach register recording all breaches, including those not reported to the ICO?",
      help: "Article 33(5) requires you to document all personal data breaches, including those that do not meet the notification threshold. The ICO may inspect this register. It should record: facts of the breach, effects, remedial action, and your reasoning for the notification decision.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Breach — Recording",
      severity: "high",
      effort: "quick",
      remediation: "Create a breach register documenting every breach: date detected, date reported, nature, data types, number of individuals, containment actions, risk assessment outcome, notification decisions (ICO and individuals) with reasoning, root cause, and preventive actions taken. Review trends quarterly.",
    },
    {
      id: "breach-4",
      question: "Do you conduct post-incident reviews after significant breaches and implement lessons learned?",
      help: "The ICO expects organisations to learn from breaches. A post-incident review should identify the root cause, assess whether existing controls failed, and implement changes to prevent recurrence. The ICO views repeated similar breaches as an aggravating factor in enforcement.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Breach — Lessons learned",
      severity: "high",
      effort: "moderate",
      remediation: "Establish a post-incident review process triggered by all significant breaches and near-misses. The review should cover: what happened, why existing controls failed, what changes are needed (technical, procedural, training), who is responsible for implementation, and a deadline. Report findings to the oversight group.",
    },
    {
      id: "breach-5",
      question: "Do you proactively monitor for security incidents and personal data breaches, rather than relying on ad hoc detection?",
      help: "The ICO expects active monitoring — not just reactive incident handling. This includes: intrusion detection systems, log monitoring, anomaly detection, and regular reviews of access logs. Organisations that only discover breaches when individuals complain demonstrate inadequate monitoring.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Breach — Monitoring",
      severity: "medium",
      effort: "significant",
      remediation: "Implement monitoring appropriate to your risk profile: log monitoring and alerting for access to sensitive data, intrusion detection/prevention, email security monitoring, and regular review of access logs. For smaller organisations, start with alerting on failed login attempts, unusual data exports, and after-hours access to sensitive systems.",
    },
  ],
};

// ── Scoring and gap analysis logic ──
const SEVERITY_WEIGHT = { critical: 4, high: 3, medium: 2, low: 1 };
const EFFORT_SCORE = { quick: 3, moderate: 2, significant: 1 };
const SEVERITY_LABELS = { critical: "Critical", high: "High", medium: "Medium", low: "Low" };
const SEVERITY_COLORS = { critical: "#dc2626", high: "#ea580c", medium: "#d97706", low: "#65a30d" };
const EFFORT_LABELS = { quick: "Quick win (< 1 day)", moderate: "Moderate (1–5 days)", significant: "Significant (> 5 days)" };

function computeSectionScore(sectionId, answers) {
  const qs = QUESTIONS[sectionId] || [];
  let totalWeightedScore = 0;
  let totalWeight = 0;
  let answered = 0;
  let compliant = 0;
  let partial = 0;
  let gap = 0;
  let na = 0;

  qs.forEach((q) => {
    const a = answers[q.id];
    if (!a) return;
    answered++;
    if (a === "na") { na++; return; }
    const opt = OPTIONS.find((o) => o.value === a);
    totalWeightedScore += opt.score * q.weight;
    totalWeight += 3 * q.weight;
    if (a === "yes") compliant++;
    else if (a === "partial") partial++;
    else if (a === "no") gap++;
  });

  const pct = totalWeight > 0 ? Math.round((totalWeightedScore / totalWeight) * 100) : 0;
  return { pct, answered, compliant, partial, gap, na, total: qs.length, unanswered: qs.length - answered };
}

function computeOverallScore(answers) {
  let totalWeighted = 0;
  let totalMax = 0;
  Object.keys(QUESTIONS).forEach((sectionId) => {
    QUESTIONS[sectionId].forEach((q) => {
      const a = answers[q.id];
      if (!a || a === "na") return;
      const opt = OPTIONS.find((o) => o.value === a);
      totalWeighted += opt.score * q.weight;
      totalMax += 3 * q.weight;
    });
  });
  return totalMax > 0 ? Math.round((totalWeighted / totalMax) * 100) : 0;
}

function getScoreLabel(pct) {
  if (pct >= 80) return { label: "Strong", color: "#22c55e", bg: "#f0fdf4" };
  if (pct >= 60) return { label: "Developing", color: "#f59e0b", bg: "#fffbeb" };
  if (pct >= 40) return { label: "Weak", color: "#f97316", bg: "#fff7ed" };
  return { label: "Critical gaps", color: "#ef4444", bg: "#fef2f2" };
}

function getGapRecommendations(answers) {
  const recs = [];
  Object.keys(QUESTIONS).forEach((sectionId) => {
    const section = SECTIONS.find((s) => s.id === sectionId);
    QUESTIONS[sectionId].forEach((q) => {
      const a = answers[q.id];
      if (a === "no" || a === "partial") {
        const severity = q.severity || (q.weight === 3 ? "high" : q.weight === 2 ? "medium" : "low");
        const effort = q.effort || "moderate";
        const sevWeight = SEVERITY_WEIGHT[severity] || 2;
        const effScore = EFFORT_SCORE[effort] || 2;
        const priorityScore = sevWeight * 2 + effScore + (a === "no" ? 1 : 0);
        recs.push({
          sectionLabel: section.label,
          sectionId,
          question: q.question,
          answer: a,
          weight: q.weight,
          icoRef: q.icoRef,
          help: q.help,
          severity,
          effort,
          remediation: q.remediation || q.help,
          priorityScore,
        });
      }
    });
  });
  recs.sort((a, b) => b.priorityScore - a.priorityScore);
  return recs;
}

function getExecutiveSummary(overall, recs, totalAnswered, totalQuestions) {
  const critical = recs.filter(r => r.severity === "critical").length;
  const high = recs.filter(r => r.severity === "high").length;
  const medium = recs.filter(r => r.severity === "medium").length;
  const low = recs.filter(r => r.severity === "low").length;
  const quickWins = recs.filter(r => r.effort === "quick").length;

  let narrative = "";
  if (overall >= 80) {
    narrative = "Your organisation demonstrates a strong accountability posture against the ICO's expectations. The gaps identified are relatively minor and can be addressed through targeted improvements. Focus on the action plan items below to strengthen an already solid foundation.";
  } else if (overall >= 60) {
    narrative = "Your organisation has developing accountability practices with some notable gaps. The foundations are in place but key areas need strengthening. The ICO would expect to see active progress on the critical and high-severity items identified below.";
  } else if (overall >= 40) {
    narrative = "Your accountability framework has material weaknesses. The ICO considers failure to comply with its guidance an aggravating factor in enforcement. Immediate action is needed on the critical items, followed by systematic work through the prioritised action plan.";
  } else {
    narrative = "Your organisation has significant gaps in its accountability framework. In an ICO audit or investigation, these gaps would represent serious aggravating factors. Urgent remediation is required, starting with the critical items identified below. Consider engaging specialist support.";
  }

  return { narrative, critical, high, medium, low, quickWins };
}

// ── Shared styles ──
const FONT_BODY = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif";
const FONT_HEADING = "'Source Serif 4', Georgia, serif";
const COLOR_TEXT = "#37352f";
const COLOR_MUTED = "#6b6b6b";
const COLOR_FAINT = "#9b9a97";
const COLOR_BORDER = "#e8e5e0";
const COLOR_BG = "#ffffff";
const COLOR_BG_HOVER = "#f7f6f3";
const COLOR_ACCENT = "#2563eb";

// ── Main component ──
export default function ICOAccountability() {
  const [screen, setScreen] = useState("intake");
  const [orgName, setOrgName] = useState("");
  const [orgSector, setOrgSector] = useState("");
  const [orgSize, setOrgSize] = useState("");
  const [orgRole, setOrgRole] = useState("");
  const [activeSection, setActiveSection] = useState("leadership");
  const [answers, setAnswers] = useState({});
  const [expandedHelp, setExpandedHelp] = useState({});
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const mainRef = useRef(null);

  // LinkedIn Insight Tag
  useEffect(() => {
    window._linkedin_partner_id = "8728946";
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push("8728946");
    const s = document.getElementsByTagName("script")[0];
    const b = document.createElement("script");
    b.type = "text/javascript"; b.async = true;
    b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
    s.parentNode.insertBefore(b, s);
  }, []);

  const allSectors = [
    "Financial services",
    "Healthcare / NHS",
    "Education",
    "Local government",
    "Central government",
    "Retail / e-commerce",
    "Technology",
    "Legal services",
    "Professional services",
    "Telecoms / media",
    "Energy / utilities",
    "Manufacturing",
    "Charity / non-profit",
    "Other",
  ];

  const canStart = orgName.trim().length > 0;

  const handleAnswer = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const totalAnswered = Object.keys(answers).length;
  const totalQuestions = Object.values(QUESTIONS).reduce((sum, qs) => sum + qs.length, 0);

  // ── Styles ──
  const pageStyle = {
    minHeight: "100vh",
    background: COLOR_BG,
    fontFamily: FONT_BODY,
    color: COLOR_TEXT,
    display: "flex",
    flexDirection: "column",
  };

  const headerStyle = {
    padding: "12px 24px",
    borderBottom: `1px solid ${COLOR_BORDER}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    background: COLOR_BG,
    zIndex: 100,
  };

  const contentStyle = {
    flex: 1,
    maxWidth: "680px",
    width: "100%",
    margin: "0 auto",
    padding: "60px 24px 80px",
  };

  // ── Render functions ──

  const renderHeader = () => (
    <header style={headerStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "14px", fontWeight: 600, color: COLOR_TEXT }}>AiLA</span>
        <span style={{ color: "#d3d1cb" }}>·</span>
        <span style={{ fontSize: "13px", color: COLOR_FAINT }}>ICO Accountability Assessment</span>
      </div>
      {screen === "questionnaire" && (
        <span style={{ fontSize: "12px", color: COLOR_FAINT }}>
          {totalAnswered} / {totalQuestions} answered
        </span>
      )}
      {screen !== "questionnaire" && (
        <a href="https://trustaila.com" target="_blank" rel="noopener noreferrer" style={{
          fontSize: "12px", color: COLOR_FAINT, textDecoration: "none"
        }}>trustaila.com</a>
      )}
    </header>
  );

  const renderIntake = () => (
    <div style={contentStyle}>
      <div style={{ marginBottom: "48px" }}>
        <h1 style={{
          fontFamily: FONT_HEADING,
          fontSize: "40px",
          fontWeight: 700,
          color: COLOR_TEXT,
          margin: "0 0 12px",
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
        }}>ICO Accountability Assessment</h1>
        <p style={{ fontSize: "16px", color: COLOR_MUTED, margin: "0 0 8px", lineHeight: 1.6 }}>
          Assess your organisation against the ICO's Accountability Framework — the benchmark the ICO uses in audits and investigations to evaluate your data protection compliance position.
        </p>
        <p style={{ fontSize: "14px", color: COLOR_FAINT, margin: 0, lineHeight: 1.6 }}>
          {totalQuestions} questions across 10 categories · Takes 15–20 minutes · Generates a prioritised action plan with ICO references
        </p>
      </div>

      {/* Org name */}
      <div style={{ marginBottom: "32px" }}>
        <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: COLOR_TEXT, marginBottom: "8px" }}>
          Organisation name <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <input
          type="text"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="Enter your organisation name"
          style={{
            width: "100%",
            padding: "10px 12px",
            border: `1px solid ${COLOR_BORDER}`,
            borderRadius: "4px",
            fontSize: "15px",
            fontFamily: FONT_BODY,
            color: COLOR_TEXT,
            background: COLOR_BG,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Sector */}
      <div style={{ marginBottom: "32px" }}>
        <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: COLOR_TEXT, marginBottom: "4px" }}>
          Sector
        </label>
        <p style={{ fontSize: "13px", color: COLOR_FAINT, margin: "0 0 8px" }}>
          The ICO's expectations are risk-based — sector affects what 'proportionate' means for your organisation
        </p>
        <select
          value={orgSector}
          onChange={(e) => setOrgSector(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            border: `1px solid ${COLOR_BORDER}`,
            borderRadius: "4px",
            fontSize: "15px",
            fontFamily: FONT_BODY,
            color: orgSector ? COLOR_TEXT : COLOR_FAINT,
            background: COLOR_BG,
            outline: "none",
            boxSizing: "border-box",
          }}
        >
          <option value="">Select sector</option>
          {allSectors.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Org size */}
      <div style={{ marginBottom: "32px" }}>
        <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: COLOR_TEXT, marginBottom: "4px" }}>
          Approximate number of employees
        </label>
        <p style={{ fontSize: "13px", color: COLOR_FAINT, margin: "0 0 8px" }}>
          The ICO's framework is designed for larger organisations — smaller organisations may benefit from the ICO's SME toolkit instead
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {["1–49", "50–249", "250–999", "1,000–4,999", "5,000+"].map((size) => (
            <button
              key={size}
              onClick={() => setOrgSize(size)}
              style={{
                padding: "8px 16px",
                border: `1px solid ${orgSize === size ? COLOR_ACCENT : COLOR_BORDER}`,
                borderRadius: "4px",
                background: orgSize === size ? `${COLOR_ACCENT}0a` : COLOR_BG,
                color: orgSize === size ? COLOR_ACCENT : COLOR_TEXT,
                fontSize: "14px",
                fontFamily: FONT_BODY,
                cursor: "pointer",
                fontWeight: orgSize === size ? 600 : 400,
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Role */}
      <div style={{ marginBottom: "48px" }}>
        <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: COLOR_TEXT, marginBottom: "4px" }}>
          Your role
        </label>
        <p style={{ fontSize: "13px", color: COLOR_FAINT, margin: "0 0 8px" }}>
          Helps us understand who is completing the assessment
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {["DPO", "Senior management", "Legal / compliance", "IT / security", "Other"].map((role) => (
            <button
              key={role}
              onClick={() => setOrgRole(role)}
              style={{
                padding: "8px 16px",
                border: `1px solid ${orgRole === role ? COLOR_ACCENT : COLOR_BORDER}`,
                borderRadius: "4px",
                background: orgRole === role ? `${COLOR_ACCENT}0a` : COLOR_BG,
                color: orgRole === role ? COLOR_ACCENT : COLOR_TEXT,
                fontSize: "14px",
                fontFamily: FONT_BODY,
                cursor: "pointer",
                fontWeight: orgRole === role ? 600 : 400,
              }}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={() => { setScreen("questionnaire"); }}
        disabled={!canStart}
        style={{
          padding: "12px 32px",
          background: canStart ? COLOR_TEXT : "#d3d1cb",
          color: "#ffffff",
          border: "none",
          borderRadius: "4px",
          fontSize: "15px",
          fontWeight: 600,
          fontFamily: FONT_BODY,
          cursor: canStart ? "pointer" : "not-allowed",
          transition: "background 0.15s",
        }}
      >
        Begin assessment
      </button>
    </div>
  );

  const renderSidebar = () => (
    <div style={{
      width: "240px",
      flexShrink: 0,
      borderRight: `1px solid ${COLOR_BORDER}`,
      padding: "16px 0",
      position: "sticky",
      top: "49px",
      height: "calc(100vh - 49px)",
      overflowY: "auto",
      background: COLOR_BG,
    }}>
      {SECTIONS.map((sec) => {
        const stats = computeSectionScore(sec.id, answers);
        const isActive = activeSection === sec.id;
        const allAnswered = stats.unanswered === 0;
        return (
          <button
            key={sec.id}
            onClick={() => { setActiveSection(sec.id); mainRef.current?.scrollTo(0, 0); }}
            style={{
              display: "block",
              width: "100%",
              padding: "10px 16px",
              border: "none",
              background: isActive ? COLOR_BG_HOVER : "transparent",
              cursor: "pointer",
              textAlign: "left",
              borderLeft: isActive ? `2px solid ${COLOR_TEXT}` : "2px solid transparent",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
              <span style={{
                fontSize: "13px",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? COLOR_TEXT : COLOR_MUTED,
              }}>{sec.label}</span>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {allAnswered && stats.total > 0 ? (
                <span style={{ fontSize: "12px", color: getScoreLabel(stats.pct).color, fontWeight: 600 }}>
                  {stats.pct}%
                </span>
              ) : stats.answered > 0 ? (
                <span style={{ fontSize: "12px", color: COLOR_FAINT }}>
                  {stats.answered}/{stats.total}
                </span>
              ) : (
                <span style={{ fontSize: "12px", color: COLOR_FAINT }}>—</span>
              )}
              {stats.gap > 0 && <span style={{ fontSize: "11px", color: "#ef4444" }}>● {stats.gap} gap{stats.gap > 1 ? "s" : ""}</span>}
            </div>
          </button>
        );
      })}

      {/* View results button */}
      <div style={{ padding: "16px", borderTop: `1px solid ${COLOR_BORDER}`, marginTop: "8px" }}>
        <button
          onClick={() => setScreen("results")}
          disabled={totalAnswered === 0}
          style={{
            width: "100%",
            padding: "10px 0",
            background: totalAnswered > 0 ? COLOR_TEXT : "#d3d1cb",
            color: "#ffffff",
            border: "none",
            borderRadius: "4px",
            fontSize: "13px",
            fontWeight: 600,
            fontFamily: FONT_BODY,
            cursor: totalAnswered > 0 ? "pointer" : "not-allowed",
          }}
        >
          View results
        </button>
        <p style={{ fontSize: "11px", color: COLOR_FAINT, margin: "6px 0 0", textAlign: "center" }}>
          {totalAnswered}/{totalQuestions} answered
        </p>
      </div>
    </div>
  );

  const renderQuestion = (q) => {
    const current = answers[q.id];
    const isHelpOpen = expandedHelp[q.id];
    return (
      <div
        key={q.id}
        style={{
          padding: "24px 0",
          borderBottom: `1px solid ${COLOR_BORDER}`,
        }}
      >
        <p style={{ fontSize: "15px", color: COLOR_TEXT, margin: "0 0 4px", lineHeight: 1.5, fontWeight: 500 }}>
          {q.question}
        </p>
        {q.weight === 3 && (
          <span style={{
            display: "inline-block",
            fontSize: "11px",
            color: COLOR_ACCENT,
            background: `${COLOR_ACCENT}0a`,
            border: `1px solid ${COLOR_ACCENT}22`,
            borderRadius: "3px",
            padding: "1px 6px",
            marginBottom: "8px",
            fontWeight: 600,
          }}>High priority</span>
        )}

        {/* Answer buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "12px 0" }}>
          {OPTIONS.map((opt) => {
            const selected = current === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleAnswer(q.id, opt.value)}
                style={{
                  padding: "7px 14px",
                  border: `1px solid ${selected ? opt.color : COLOR_BORDER}`,
                  borderRadius: "4px",
                  background: selected ? `${opt.color}0a` : COLOR_BG,
                  color: selected ? opt.color : COLOR_TEXT,
                  fontSize: "13px",
                  fontFamily: FONT_BODY,
                  cursor: "pointer",
                  fontWeight: selected ? 600 : 400,
                  transition: "all 0.12s",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Help toggle */}
        <button
          onClick={() => setExpandedHelp((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            fontSize: "13px",
            color: COLOR_FAINT,
            cursor: "pointer",
            fontFamily: FONT_BODY,
          }}
        >
          {isHelpOpen ? "Hide guidance ▴" : "Show guidance ▾"}
        </button>
        {isHelpOpen && (
          <div style={{
            marginTop: "8px",
            padding: "12px 16px",
            background: COLOR_BG_HOVER,
            borderRadius: "4px",
            borderLeft: `3px solid ${COLOR_BORDER}`,
          }}>
            <p style={{ fontSize: "13px", color: COLOR_MUTED, margin: "0 0 8px", lineHeight: 1.6 }}>
              {q.help}
            </p>
            <p style={{ fontSize: "12px", color: COLOR_FAINT, margin: 0, fontStyle: "italic" }}>
              Source: {q.icoRef}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderQuestionnaire = () => {
    const sectionMeta = SECTIONS.find((s) => s.id === activeSection);
    const sectionQuestions = QUESTIONS[activeSection] || [];
    const sectionIdx = SECTIONS.findIndex((s) => s.id === activeSection);

    return (
      <div style={{ display: "flex", minHeight: "calc(100vh - 49px)" }}>
        {renderSidebar()}
        <div
          ref={mainRef}
          style={{
            flex: 1,
            overflowY: "auto",
            height: "calc(100vh - 49px)",
          }}
        >
          <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 32px 80px" }}>
            <div style={{ marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", color: COLOR_FAINT }}>{sectionMeta.icon}</span>
            </div>
            <h2 style={{
              fontFamily: FONT_HEADING,
              fontSize: "28px",
              fontWeight: 700,
              color: COLOR_TEXT,
              margin: "0 0 8px",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
            }}>{sectionMeta.label}</h2>
            <p style={{ fontSize: "14px", color: COLOR_FAINT, margin: "0 0 24px" }}>
              {sectionQuestions.length} questions
            </p>

            {sectionQuestions.map(renderQuestion)}

            {/* Section navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px" }}>
              {sectionIdx > 0 ? (
                <button
                  onClick={() => { setActiveSection(SECTIONS[sectionIdx - 1].id); mainRef.current?.scrollTo(0, 0); }}
                  style={{
                    padding: "8px 16px",
                    border: `1px solid ${COLOR_BORDER}`,
                    borderRadius: "4px",
                    background: COLOR_BG,
                    color: COLOR_TEXT,
                    fontSize: "13px",
                    fontFamily: FONT_BODY,
                    cursor: "pointer",
                  }}
                >
                  ← {SECTIONS[sectionIdx - 1].label}
                </button>
              ) : <div />}
              {sectionIdx < SECTIONS.length - 1 ? (
                <button
                  onClick={() => { setActiveSection(SECTIONS[sectionIdx + 1].id); mainRef.current?.scrollTo(0, 0); }}
                  style={{
                    padding: "8px 16px",
                    border: `1px solid ${COLOR_BORDER}`,
                    borderRadius: "4px",
                    background: COLOR_BG,
                    color: COLOR_TEXT,
                    fontSize: "13px",
                    fontFamily: FONT_BODY,
                    cursor: "pointer",
                  }}
                >
                  {SECTIONS[sectionIdx + 1].label} →
                </button>
              ) : (
                <button
                  onClick={() => setScreen("results")}
                  style={{
                    padding: "8px 20px",
                    border: "none",
                    borderRadius: "4px",
                    background: COLOR_TEXT,
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 600,
                    fontFamily: FONT_BODY,
                    cursor: "pointer",
                  }}
                >
                  View results →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const overall = computeOverallScore(answers);
    const scoreInfo = getScoreLabel(overall);
    const recs = getGapRecommendations(answers);
    const summary = getExecutiveSummary(overall, recs, totalAnswered, totalQuestions);

    return (
      <div style={contentStyle}>
        <button
          onClick={() => setScreen("questionnaire")}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            fontSize: "13px",
            color: COLOR_FAINT,
            cursor: "pointer",
            fontFamily: FONT_BODY,
            marginBottom: "24px",
          }}
        >
          ← Back to questions
        </button>

        <h1 style={{
          fontFamily: FONT_HEADING,
          fontSize: "36px",
          fontWeight: 700,
          color: COLOR_TEXT,
          margin: "0 0 8px",
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
        }}>ICO Accountability Report</h1>
        <p style={{ fontSize: "14px", color: COLOR_FAINT, margin: "0 0 40px" }}>
          {orgName}{orgSector ? ` · ${orgSector}` : ""}{orgSize ? ` · ${orgSize} employees` : ""}
        </p>

        {/* ── Executive summary ── */}
        <div style={{
          padding: "32px",
          background: scoreInfo.bg,
          borderRadius: "8px",
          border: `1px solid ${scoreInfo.color}22`,
          marginBottom: "32px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "32px", marginBottom: "20px", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "64px", fontWeight: 700, color: scoreInfo.color, fontFamily: FONT_HEADING }}>
                {overall}%
              </div>
              <div style={{ fontSize: "18px", fontWeight: 600, color: scoreInfo.color }}>
                {scoreInfo.label}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: "240px" }}>
              <p style={{ fontSize: "14px", color: COLOR_TEXT, margin: "0 0 16px", lineHeight: 1.6 }}>
                {summary.narrative}
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {summary.critical > 0 && <span style={{ fontSize: "13px", color: SEVERITY_COLORS.critical, fontWeight: 600 }}>● {summary.critical} critical</span>}
                {summary.high > 0 && <span style={{ fontSize: "13px", color: SEVERITY_COLORS.high, fontWeight: 600 }}>● {summary.high} high</span>}
                {summary.medium > 0 && <span style={{ fontSize: "13px", color: SEVERITY_COLORS.medium, fontWeight: 600 }}>● {summary.medium} medium</span>}
                {summary.low > 0 && <span style={{ fontSize: "13px", color: "#65a30d", fontWeight: 600 }}>● {summary.low} low</span>}
              </div>
              {summary.quickWins > 0 && (
                <p style={{ fontSize: "13px", color: COLOR_MUTED, margin: "8px 0 0" }}>
                  {summary.quickWins} quick win{summary.quickWins > 1 ? "s" : ""} identified — actions achievable in under a day.
                </p>
              )}
            </div>
          </div>
          <p style={{ fontSize: "12px", color: COLOR_FAINT, margin: 0, borderTop: `1px solid ${scoreInfo.color}15`, paddingTop: "12px" }}>
            Based on {totalAnswered} of {totalQuestions} questions answered
          </p>
        </div>

        {/* ── Section scores ── */}
        <h2 style={{
          fontFamily: FONT_HEADING,
          fontSize: "24px",
          fontWeight: 700,
          color: COLOR_TEXT,
          margin: "0 0 16px",
        }}>Category scores</h2>
        <div style={{ marginBottom: "40px" }}>
          {SECTIONS.map((sec) => {
            const stats = computeSectionScore(sec.id, answers);
            if (stats.answered === 0) return null;
            const si = getScoreLabel(stats.pct);
            return (
              <div key={sec.id} style={{ padding: "12px 0", borderBottom: `1px solid ${COLOR_BORDER}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 500, color: COLOR_TEXT }}>{sec.label}</span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: si.color }}>{stats.pct}%</span>
                </div>
                <div style={{ height: "6px", background: "#f0f0ec", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${stats.pct}%`,
                    background: si.color,
                    borderRadius: "3px",
                    transition: "width 0.4s ease",
                  }} />
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
                  {stats.compliant > 0 && <span style={{ fontSize: "12px", color: "#22c55e" }}>✓ {stats.compliant} compliant</span>}
                  {stats.partial > 0 && <span style={{ fontSize: "12px", color: "#f59e0b" }}>◐ {stats.partial} partial</span>}
                  {stats.gap > 0 && <span style={{ fontSize: "12px", color: "#ef4444" }}>✕ {stats.gap} gap{stats.gap > 1 ? "s" : ""}</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Prioritised action plan ── */}
        {recs.length > 0 && (
          <>
            <h2 style={{
              fontFamily: FONT_HEADING,
              fontSize: "24px",
              fontWeight: 700,
              color: COLOR_TEXT,
              margin: "0 0 8px",
            }}>Prioritised action plan</h2>
            <p style={{ fontSize: "14px", color: COLOR_MUTED, margin: "0 0 16px", lineHeight: 1.5 }}>
              Actions ranked by priority. Critical gaps with quick fixes appear first. Each action includes specific remediation steps referencing ICO expectations.
            </p>
            <div style={{ marginBottom: "40px" }}>
              {recs.map((r, i) => {
                const sevColor = SEVERITY_COLORS[r.severity] || "#64748b";
                return (
                  <div key={i} style={{
                    padding: "20px",
                    background: r.severity === "critical" && r.answer === "no" ? "#fef2f2" : "#ffffff",
                    border: `1px solid ${r.severity === "critical" && r.answer === "no" ? "#fecaca" : COLOR_BORDER}`,
                    borderRadius: "6px",
                    marginBottom: "8px",
                  }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#fff", background: sevColor, borderRadius: "3px", padding: "2px 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {SEVERITY_LABELS[r.severity]}
                      </span>
                      <span style={{ fontSize: "11px", color: r.answer === "no" ? "#dc2626" : "#d97706", fontWeight: 600 }}>
                        {r.answer === "no" ? "Not in place" : "Partially in place"}
                      </span>
                      <span style={{ fontSize: "11px", color: COLOR_FAINT }}>·</span>
                      <span style={{ fontSize: "11px", color: COLOR_FAINT }}>{r.sectionLabel}</span>
                      <span style={{ fontSize: "11px", color: COLOR_FAINT, marginLeft: "auto" }}>{EFFORT_LABELS[r.effort]}</span>
                    </div>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: COLOR_TEXT, margin: "0 0 8px", lineHeight: 1.4 }}>{r.question}</p>
                    <div style={{
                      padding: "12px 14px",
                      background: "#f8f9fa",
                      borderRadius: "4px",
                      borderLeft: `3px solid ${sevColor}`,
                      marginBottom: "8px",
                    }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: COLOR_TEXT, margin: "0 0 4px" }}>What to do</p>
                      <p style={{ fontSize: "13px", color: COLOR_MUTED, margin: 0, lineHeight: 1.5 }}>{r.remediation}</p>
                    </div>
                    <p style={{ fontSize: "12px", color: COLOR_FAINT, margin: 0, fontStyle: "italic" }}>{r.icoRef}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── Summary table ── */}
        {recs.length > 0 && (
          <>
            <h2 style={{
              fontFamily: FONT_HEADING,
              fontSize: "24px",
              fontWeight: 700,
              color: COLOR_TEXT,
              margin: "0 0 16px",
            }}>Action plan summary</h2>
            <div style={{ overflowX: "auto", marginBottom: "40px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${COLOR_TEXT}` }}>
                    <th style={{ textAlign: "left", padding: "8px 12px", color: COLOR_TEXT, fontWeight: 600 }}>#</th>
                    <th style={{ textAlign: "left", padding: "8px 12px", color: COLOR_TEXT, fontWeight: 600 }}>Finding</th>
                    <th style={{ textAlign: "left", padding: "8px 12px", color: COLOR_TEXT, fontWeight: 600 }}>Severity</th>
                    <th style={{ textAlign: "left", padding: "8px 12px", color: COLOR_TEXT, fontWeight: 600 }}>Status</th>
                    <th style={{ textAlign: "left", padding: "8px 12px", color: COLOR_TEXT, fontWeight: 600 }}>Effort</th>
                    <th style={{ textAlign: "left", padding: "8px 12px", color: COLOR_TEXT, fontWeight: 600 }}>Owner</th>
                    <th style={{ textAlign: "left", padding: "8px 12px", color: COLOR_TEXT, fontWeight: 600 }}>Target</th>
                  </tr>
                </thead>
                <tbody>
                  {recs.map((r, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${COLOR_BORDER}` }}>
                      <td style={{ padding: "8px 12px", color: COLOR_FAINT }}>{i + 1}</td>
                      <td style={{ padding: "8px 12px", color: COLOR_TEXT, maxWidth: "260px" }}>{r.question.length > 80 ? r.question.substring(0, 77) + "…" : r.question}</td>
                      <td style={{ padding: "8px 12px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 600, color: SEVERITY_COLORS[r.severity] }}>{SEVERITY_LABELS[r.severity]}</span>
                      </td>
                      <td style={{ padding: "8px 12px", fontSize: "12px", color: r.answer === "no" ? "#dc2626" : "#d97706" }}>
                        {r.answer === "no" ? "Gap" : "Partial"}
                      </td>
                      <td style={{ padding: "8px 12px", fontSize: "12px", color: COLOR_MUTED }}>
                        {r.effort === "quick" ? "< 1 day" : r.effort === "moderate" ? "1–5 days" : "> 5 days"}
                      </td>
                      <td style={{ padding: "8px 12px", color: COLOR_FAINT, fontStyle: "italic" }}>—</td>
                      <td style={{ padding: "8px 12px", color: COLOR_FAINT, fontStyle: "italic" }}>—</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* AiLA CTA */}
        <div style={{
          padding: "32px",
          background: "#f8f9fa",
          borderRadius: "8px",
          border: `1px solid ${COLOR_BORDER}`,
          marginBottom: "40px",
        }}>
          <h3 style={{
            fontFamily: FONT_HEADING,
            fontSize: "20px",
            fontWeight: 700,
            color: COLOR_TEXT,
            margin: "0 0 12px",
          }}>How AiLA supports your accountability programme</h3>
          <p style={{ fontSize: "14px", color: COLOR_MUTED, margin: "0 0 16px", lineHeight: 1.6 }}>
            AiLA automates the operational side of data protection compliance: handling DSARs end-to-end, triaging legal and compliance requests, managing data discovery across enterprise systems, and maintaining audit trails — so your team can focus on governance and strategy.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
            {[
              ["Individuals' Rights", "Automates DSAR processing from request to response, including data discovery, PII identification, redaction, and exemption assessment"],
              ["Records Management", "Connects to enterprise systems to map where personal data lives, supporting your ROPA and data mapping exercises"],
              ["Breach Preparedness", "Real-time monitoring and audit trails provide the evidence base you need for breach investigation and ICO reporting"],
              ["Transparency", "Built-in UK legal knowledge ensures responses reference the correct lawful basis, ICO guidance, and DPA 2018 provisions"],
              ["Audit Trail", "Every action is logged, providing the accountability evidence the ICO expects to see"],
            ].map(([title, desc]) => (
              <div key={title} style={{ padding: "8px 0" }}>
                <span style={{ fontSize: "14px", fontWeight: 600, color: COLOR_TEXT }}>{title}</span>
                <span style={{ fontSize: "14px", color: COLOR_MUTED }}> — {desc}</span>
              </div>
            ))}
          </div>

          {/* Email capture */}
          {!emailSubmitted ? (
            <div>
              <p style={{ fontSize: "14px", fontWeight: 600, color: COLOR_TEXT, margin: "0 0 8px" }}>
                Get your full report and learn how AiLA can help
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Work email address"
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    border: `1px solid ${COLOR_BORDER}`,
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontFamily: FONT_BODY,
                    color: COLOR_TEXT,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  onClick={async () => {
                    if (email.includes("@") && email.includes(".")) {
                      const overall = computeOverallScore(answers);
                      const recs = getGapRecommendations(answers);
                      try {
                        await fetch("https://formspree.io/f/mjgerjao", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            email,
                            _subject: `ICO Accountability Assessment — ${orgName || email}`,
                            organisation: orgName || "",
                            sector: orgSector || "",
                            size: orgSize || "",
                            overallScore: `${Math.round(overall)}%`,
                            totalAnswered: Object.keys(answers).length,
                            totalQuestions: Object.values(QUESTIONS).reduce((s, qs) => s + qs.length, 0),
                            gapCount: recs.length,
                            highPriorityGaps: recs.filter(r => r.weight === 3 && r.answer === "no").length,
                            source: "ico-assessment",
                          }),
                        });
                      } catch (_) { /* silently continue */ }
                      setEmailSubmitted(true);
                    }
                  }}
                  style={{
                    padding: "10px 24px",
                    background: COLOR_TEXT,
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontWeight: 600,
                    fontFamily: FONT_BODY,
                    cursor: "pointer",
                  }}
                >
                  Send report
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              padding: "12px 16px",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "4px",
            }}>
              <p style={{ fontSize: "14px", color: "#166534", margin: 0 }}>
                Thanks — we'll send your full report to {email}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${COLOR_BORDER}`, paddingTop: "24px" }}>
          <p style={{ fontSize: "13px", color: COLOR_FAINT, lineHeight: 1.5, margin: "0 0 8px" }}>
            This assessment is based on the ICO's Accountability Framework (2024), the UK GDPR, the Data Protection Act 2018, and ICO enforcement actions and guidance. It covers organisational accountability measures, not legal advice.
          </p>
          <p style={{ fontSize: "13px", color: COLOR_FAINT, margin: 0 }}>
            © {new Date().getFullYear()} AiLA AI Ltd · <a href="https://trustaila.com" target="_blank" rel="noopener noreferrer" style={{ color: COLOR_FAINT }}>trustaila.com</a>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div style={pageStyle}>
      <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet" />
      {renderHeader()}
      {screen === "intake" && renderIntake()}
      {screen === "questionnaire" && renderQuestionnaire()}
      {screen === "results" && renderResults()}
    </div>
  );
}
