import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.timeEntry.deleteMany();
  await prisma.task.deleteMany();

  const tasks = [
    // ─── Phase 1 ────────────────────────────────────────────────
    {
      title: "Deploy landing page to Shopify",
      description:
        "Push the fully-designed Gran Life landing page to the live Shopify store and verify all sections render correctly on desktop and mobile.",
      phase: "Phase 1 — This Week",
      tag: "Shopify",
      status: "Not Started",
      steps: JSON.stringify([
        "Export theme files from staging environment",
        "Push theme to live Shopify store via CLI",
        "Verify domain routing and SSL certificate",
        "QA all sections on desktop, tablet, and mobile",
        "Confirm page load speed is under 3s",
      ]),
      notes: null,
    },
    {
      title: "Deploy quiz page to Shopify",
      description:
        "Deploy the brand-quiz page to Shopify, ensuring the quiz logic, styling, and submit flow all work correctly before wiring up webhooks.",
      phase: "Phase 1 — This Week",
      tag: "Shopify",
      status: "Not Started",
      steps: JSON.stringify([
        "Upload quiz page template to Shopify",
        "Configure quiz settings and answer logic",
        "Test all quiz paths end-to-end",
        "Verify mobile responsiveness of quiz UI",
        "Confirm thank-you / completion state renders",
      ]),
      notes: null,
    },
    {
      title: "Test full landing → quiz flow",
      description:
        "Run a full end-to-end QA pass: visit the landing page, click through to the quiz, complete it, and verify the user lands on the correct completion state.",
      phase: "Phase 1 — This Week",
      tag: "QA",
      status: "Not Started",
      steps: JSON.stringify([
        "Test CTA button link from landing page to quiz",
        "Complete quiz on desktop and verify results page",
        "Complete quiz on mobile and verify results page",
        "Check UTM parameter preservation across pages",
        "Document any bugs or UX issues found",
      ]),
      notes: null,
    },
    {
      title: "Create GHL webhook for lead capture",
      description:
        "Set up a Go High Level inbound webhook endpoint that will receive lead data submitted from the Shopify quiz page.",
      phase: "Phase 1 — This Week",
      tag: "Go High Level",
      status: "Not Started",
      steps: JSON.stringify([
        "Create new webhook in GHL account",
        "Configure expected payload fields (name, email, quiz answers)",
        "Copy webhook URL for use in Shopify quiz form",
        "Test webhook with a sample POST payload",
        "Confirm contact is created in GHL on test trigger",
      ]),
      notes: null,
    },
    {
      title: "Wire quiz completion webhook to GHL",
      description:
        "Connect the Shopify quiz form submission to fire the GHL webhook so every quiz completion automatically creates a contact in Go High Level.",
      phase: "Phase 1 — This Week",
      tag: "Go High Level",
      status: "Not Started",
      steps: JSON.stringify([
        "Add GHL webhook URL to Shopify quiz form action",
        "Map quiz answer fields to GHL contact fields",
        "Test live submission from Shopify quiz",
        "Verify contact appears in GHL with correct data",
        "Add error handling / fallback for failed webhook",
      ]),
      notes: null,
    },
    {
      title: "Set up GHL contact pipeline + tags",
      description:
        "Create the Gran Life contact pipeline in GHL with stages, and configure auto-tagging rules so quiz leads are organized correctly from the moment they enter.",
      phase: "Phase 1 — This Week",
      tag: "Go High Level",
      status: "Not Started",
      steps: JSON.stringify([
        "Create 'Gran Life Leads' pipeline in GHL",
        "Define pipeline stages: New Lead, Nurturing, Sales Ready, Client",
        "Set up tag rules based on quiz answers",
        "Test that quiz leads enter the correct stage",
        "Document pipeline structure for client handoff",
      ]),
      notes: null,
    },

    // ─── Phase 2 ────────────────────────────────────────────────
    {
      title: "Build GHL welcome email automation",
      description:
        "Create an automated welcome email sequence in Go High Level that triggers when a new quiz lead is created, introducing the Gran Life brand.",
      phase: "Phase 2 — Next 1–2 Weeks",
      tag: "Go High Level",
      status: "Not Started",
      steps: JSON.stringify([
        "Design welcome email copy and subject line",
        "Build email template in GHL with brand styling",
        "Set up automation trigger on new contact tag",
        "Configure send timing (immediate + day 3 follow-up)",
        "Test automation with a real email address",
      ]),
      notes: null,
    },
    {
      title: "Build GHL welcome SMS automation",
      description:
        "Set up an automated SMS welcome message in GHL that fires within minutes of a quiz submission, complementing the email sequence.",
      phase: "Phase 2 — Next 1–2 Weeks",
      tag: "Go High Level",
      status: "Not Started",
      steps: JSON.stringify([
        "Verify SMS sending is enabled in GHL account",
        "Write concise welcome SMS copy (under 160 chars)",
        "Add SMS step to welcome automation workflow",
        "Configure send delay (e.g. 5 minutes after opt-in)",
        "Test with a real phone number end-to-end",
      ]),
      notes: null,
    },
    {
      title: "Build quiz re-engagement automation",
      description:
        "Create a re-engagement automation for leads who completed the quiz but haven't booked a call — triggers 72 hours after quiz completion.",
      phase: "Phase 2 — Next 1–2 Weeks",
      tag: "Go High Level",
      status: "Not Started",
      steps: JSON.stringify([
        "Define re-engagement trigger condition in GHL",
        "Write re-engagement email copy with soft CTA",
        "Write re-engagement SMS copy",
        "Set 72-hour delay branch in automation",
        "Test full re-engagement flow from trigger to send",
      ]),
      notes: null,
    },
    {
      title: "Generate logo options in Claude Design",
      description:
        "Use Claude Design to generate 3–5 distinct logo concepts for The Gran Life brand that Alison can review and select from.",
      phase: "Phase 2 — Next 1–2 Weeks",
      tag: "Claude Design",
      status: "Not Started",
      steps: JSON.stringify([
        "Define logo brief: tone, style, color direction",
        "Generate 3–5 logo concepts using Claude Design",
        "Export each concept as PNG and SVG",
        "Prepare a simple one-page mood board per concept",
        "Present options to Alison for selection",
      ]),
      notes: null,
    },
    {
      title: "Prepare sales landing page template",
      description:
        "Build and publish the Gran Life sales/offer landing page on Shopify, ready to be populated with finalized copy and the approved logo.",
      phase: "Phase 2 — Next 1–2 Weeks",
      tag: "Shopify",
      status: "Not Started",
      steps: JSON.stringify([
        "Design sales page wireframe and section structure",
        "Build page template in Shopify theme editor",
        "Add placeholder sections for hero, offer, testimonials, CTA",
        "Ensure mobile layout is polished",
        "Set page to draft until copy is finalized",
      ]),
      notes: null,
    },

    // ─── Phase 3 ────────────────────────────────────────────────
    {
      title: "Generate social media asset templates",
      description:
        "Create a full suite of on-brand social media asset templates (Instagram posts, stories, LinkedIn banners) using the approved logo and brand palette.",
      phase: "Phase 3 — Once Logo is Approved",
      tag: "Claude Design",
      status: "Not Started",
      steps: JSON.stringify([
        "Confirm approved logo and final color palette",
        "Generate Instagram post templates (1:1 and 4:5)",
        "Generate Instagram/Facebook story templates (9:16)",
        "Generate LinkedIn banner template",
        "Export all as editable files + final PNGs",
      ]),
      notes: null,
    },
    {
      title: "Generate print and digital brand assets",
      description:
        "Produce the complete brand asset kit — business cards, email signature, letterhead, and digital PDF — using the approved Gran Life identity.",
      phase: "Phase 3 — Once Logo is Approved",
      tag: "Claude Design",
      status: "Not Started",
      steps: JSON.stringify([
        "Design business card front and back",
        "Create email signature HTML template",
        "Design letterhead / proposal cover template",
        "Compile all assets into a brand kit PDF",
        "Deliver brand kit folder to client",
      ]),
      notes: null,
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({ data: task });
  }

  console.log(`✅ Seeded ${tasks.length} tasks successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
