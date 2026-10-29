export const cases = [
  {
    category: "apex",
    number: "01",
    label: "Apex & automation",
    title: "Simplifying calculation automation.",
    description:
      "Refactored existing calculation automation and extended the associated tests to support the revised behavior.",
    tags: ["Apex", "Trigger logic", "Test classes"],
    contribution:
      "Reviewed an existing calculation path, removed superseded components, and expanded tests around the remaining implementation.",
    impact: "TODO: Add a verified concrete outcome for this contribution.",
    approach: ["TODO: Add sanitized implementation steps for this case."],
  },
  {
    category: "apex",
    number: "02",
    label: "Forecasting & quoting",
    title: "Keeping forecasts aligned with the business.",
    description:
      "Worked on forecast calculations, migration support, and recalculation behavior when quote-line dates change.",
    tags: ["Forecasting", "Quote logic", "Regression fixes"],
    contribution:
      "Updated forecast behavior for closed-lost opportunities, contributed changes to forecasting helpers, and addressed quote-date recalculation requirements.",
    impact: "TODO: Add a verified concrete outcome for this contribution.",
    approach: ["TODO: Add sanitized implementation steps for this case."],
  },
  {
    category: "experience",
    number: "03",
    label: "Flow & user experience",
    title: "Guiding partner selection in Salesforce.",
    description:
      "Contributed a screen-flow experience for navigating opportunity partners, with the configuration needed to expose it to users.",
    tags: ["Screen Flow", "Lightning pages", "Quick actions"],
    contribution:
      "Added screen-flow metadata alongside an opportunity page update, a quick action, and supporting permission configuration. Later contributions addressed eligible-partner selection.",
    impact: "TODO: Add a verified concrete outcome for this contribution.",
    approach: ["TODO: Add sanitized implementation steps for this case."],
  },
  {
    category: "security",
    number: "04",
    label: "Access & integrations",
    title: "Making access fit the workflow.",
    description:
      "Updated integration-user permissions, API-only permission groups, and object access for business users.",
    tags: ["Permission sets", "API-only access", "Permission groups"],
    contribution:
      "Contributed configuration for API-only integration access and targeted permissions for integration and business-user scenarios.",
    impact: "TODO: Add a verified concrete outcome for this contribution.",
    approach: ["TODO: Add sanitized implementation steps for this case."],
  },
  {
    category: "experience",
    number: "05",
    label: "Configuration & release care",
    title: "Maintaining the platform around the code.",
    description:
      "Worked on approval groups, feature-flag retirement, interface configuration, and release documentation.",
    tags: ["Approval groups", "Metadata", "Runbooks"],
    contribution:
      "Updated approval-group configuration, removed retired feature flags, and documented automation changes in runbooks.",
    impact: "TODO: Add a verified concrete outcome for this contribution.",
    approach: ["TODO: Add sanitized implementation steps for this case."],
  },
  {
    category: "data",
    number: "06",
    label: "Salesforce data & reporting",
    title: "Connecting CRM fields to downstream data.",
    description:
      "Contributed field additions and mapping updates in Salesforce-aligned data models used for downstream reporting.",
    tags: ["dbt", "Field mappings", "Sales data"],
    contribution:
      "Added sales-data fields and corrected missing mappings in a downstream data project. Also contributed a CRM Analytics dashboard link in Salesforce.",
    impact: "TODO: Add a verified concrete outcome for this contribution.",
    approach: ["TODO: Add sanitized implementation steps for this case."],
  },
];
export const products = [
  {
    label: "Sales & CRM",
    title: "From first conversation to paid invoice.",
    description:
      "Lead capture, opportunity stages, quotes, sales orders, invoices, and recurring billing.",
    steps: ["Enquiry", "Lead", "Deal", "Invoice"],
    contribution:
      "My commits cover lead conversion, pipeline workflows, CSV import, linked sales documents, and end-to-end tests.",
  },
  {
    label: "Purchasing",
    title: "Keep the buy side connected.",
    description:
      "Vendors, purchase orders, bills, goods receipt, payment allocation, and purchase returns.",
    steps: ["Vendor", "Purchase order", "Bill", "Payment"],
    contribution:
      "Part of the wider product. Presented as product scope, not a claim of sole implementation.",
  },
  {
    label: "Inventory",
    title: "Know what moved, and where.",
    description:
      "Multiple warehouses, FIFO lots, barcode labels, transfers, adjustments, and delivery challans.",
    steps: ["Receive", "Track lots", "Transfer", "Dispatch"],
    contribution:
      "My manufacturing contributions include inventory consumption and output writers.",
  },
  {
    label: "Manufacturing",
    title: "Turn components into finished goods.",
    description:
      "Versioned bills of materials, assembly, repack and disassembly, costing, and production reports.",
    steps: ["BOM", "Components", "Assembly", "Output lot"],
    contribution:
      "My commits cover BOM screens and logic, assembly-order workflows, costing, and manufacturing reports. Production-stage/WIP orders are only partly built.",
  },
  {
    label: "GST & collections",
    title: "Connect billing with follow-through.",
    description:
      "GST reports, e-invoice and e-way-bill workflows, reconciliation, payment links, and reminders.",
    steps: ["Invoice", "Compliance", "Reminder", "Collection"],
    contribution:
      "Wider product functionality; availability depends on configuration and plan. Not a claim of independent compliance certification.",
  },
  {
    label: "Messaging & portal",
    title: "Bring customers into the workflow.",
    description:
      "Shared WhatsApp inbox, templates, customer statements, ordering, document access, and online payments.",
    steps: ["Conversation", "Customer", "Order", "Payment"],
    contribution:
      "My verified CRM commits include creating leads from WhatsApp conversations.",
  },
  {
    label: "Reports & platform",
    title: "One product, many working views.",
    description:
      "Configurable reports, a report builder, imports, backups, a REST API, and tenant administration.",
    steps: ["Business data", "Report model", "View", "Export"],
    contribution:
      "My commits cover joined report types, saved views, report configuration, and supporting tests. Webhooks and MCP are planned, not shipped.",
  },
];
export const profile = {
  email: "",
  linkedin: "",
  trailhead: "",
  resume: "",
  tracker: "",
  domain: "",
}; // TODO: Supply these values before publishing.
