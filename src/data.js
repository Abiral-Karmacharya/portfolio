// =====================================================================
//  data.js — THE ONLY FILE YOU EDIT.
//
//  Every section of the site is generated from the arrays below.
//    • ADD an item    → copy an existing object, change the values.
//    • REMOVE an item → delete its object (keep the array's brackets).
//    • REORDER        → move objects up/down; the page follows.
// =====================================================================

export const profile = {
  name: "Abiral Karmacharya",
  tagline: "Offensive Security & Digital Forensics",
  summary:
    "Cybersecurity practitioner focused on web application testing and " +
    "digital forensics. I take systems apart methodically, document what I " +
    "find, and build tools so the next investigation is faster than the last.",
  location: "Kathmandu, Nepal",
  handle: "abiral", // used in the prompt: abiral@cv:~$
  host: "cv",
  status: "ONLINE — OPEN TO OPPORTUNITIES",
};

// ---------------------------------------------------------------------
//  CONTACT / LINKS — set a value to "" to hide it everywhere.
// ---------------------------------------------------------------------
export const links = {
  github: "https://github.com/Abiral-Karmacharya",
  linkedin: "https://www.linkedin.com/in/abiral-karmacharya-3056a7360/",
  tryhackme: "https://tryhackme.com/p/abiralkarmachary",
  email: "abiralkarmacharya1@gmail.com", // e.g. "mailto:you@example.com"
};

// ---------------------------------------------------------------------
//  HEADLINE STATS — printed by `$ whoami`, top-left. 2–4 items.
// ---------------------------------------------------------------------
export const stats = [
  { value: "113", label: "TryHackMe rooms completed" },
  { value: "CCEP", label: "Certified Cybersecurity Educator Professional" },
  { value: "6+", label: "open-source security tools & platforms" },
];

// ---------------------------------------------------------------------
//  BOOT SEQUENCE — the intro lines. Edit / add / remove freely.
//  `d` = delay in ms before the line prints. Keep total under ~2.5s.
//  NOTE: the "auth token" line is the hidden base64 flag. Sneaky.
// ---------------------------------------------------------------------
export const bootLines = [
  { d: 150, text: "Connecting to cv.abiral.dev on port 443..." },
  { d: 350, text: "Connection established. TLS 1.3, cipher AES_256_GCM." },
  { d: 250, text: "auth token: ZmxhZ3tjdXIxMHNpdHlfcDR5c19yM250fQ==" },
  { d: 300, text: "Last login: from 10.13.37.1 (nice try)" },
  { d: 400, text: "" },
];

// ---------------------------------------------------------------------
//  CERTIFICATIONS
// ---------------------------------------------------------------------
export const certifications = [
  {
    id: "CERT-01",
    title: "Certified Cybersecurity Educator Professional (CCEP)",
    issuer: "Red Team Leaders",
    date: "Nov 2025",
    href: "https://courses.redteamleaders.com/exam-completion/6d138c0b31557c49",
    note: "Professional certification in cybersecurity education and training delivery.",
  },
  {
    id: "CERT-01",
    title: "Pre Security (Legacy)",
    issuer: "Try Hack Me",
    date: "May 2025",
    href: "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-LTIBX6UVDD.pdf",
    note: "Completed hands-on practical training covering network fundamentals, web applications, Linux/Windows OS security, and basic defensive security concepts.",
  },
];

// ---------------------------------------------------------------------
//  PROJECTS — listed by `$ ls ./projects`
// ---------------------------------------------------------------------
export const projects = [
  {
    id: "portswigger-automation",
    title: "PortSwigger Lab Automation",
    description:
      "Automation tooling for PortSwigger Web Security Academy labs, built " +
      "and published with PortSwigger's permission. Scripts the repetitive " +
      "parts so practice time goes to the actual vulnerability.",
    tags: ["Python", "Web Security", "Automation"],
    href: "https://github.com/Abiral-Karmacharya/portswigger_scripts",
  },
  {
    id: "ctf-platform",
    title: "Self-Hosted CTF Platform",
    description:
      "A capture-the-flag platform built from scratch — challenge hosting, " +
      "flag submission and scoring. Designing the puzzles taught me as much " +
      "about attack surface as solving them.",
    tags: ["Full-stack", "CTF", "Infrastructure"],
    href: "https://github.com/Abiral-Karmacharya/RedEyedGirl",
  },
  {
    id: "linux-tools",
    title: "Linux Tools",
    description:
      "Linux repo just for timepass. Benchmark your OS or create a short note, upto you.",
    tags: ["Linux", "Performance", "Python"],
    href: "https://github.com/Abiral-Karmacharya",
  },
];

// ---------------------------------------------------------------------
//  CTF RECORD — one object per event. Copy the commented template.
// ---------------------------------------------------------------------
export const ctfs = [
  {
    id: "CTF-01",
    event: "Hackfest 2.0 - Defend The Future",
    host: "Softwarica College",
    date: "2025",
    result: "", // e.g. "1st Place" — "" hides the badge
    highlights: [
      "Web Exploitation",
      "Reverse Engineering",
      "Digital Forensics",
      "OSINT",
    ],
  },
  {
    id: "CTF-02",
    event: "DataForGood Nepal",
    host: "Softwarica College",
    date: "2026",
    result: "",
    highlights: ["AI", "Web Developement (Full Stack)"],
  },
  {
    id: "CTF-03",
    event: "DFIR",
    host: "Softwarica college",
    date: "2026",
    result: "",
    highlights: ["OSINT", "Network Forensics"],
  },
];

// ---------------------------------------------------------------------
//  SKILLS — rendered as package-install progress bars.
//  `level` is 0–100. Be honest; recruiters distrust rows of 95s.
// ---------------------------------------------------------------------
export const skills = [
  {
    area: "Offensive",
    items: [
      { name: "web-app-testing", level: 70 },
      { name: "api-security-testing", level: 50 },
      { name: "automation-script", level: 80 },
    ],
  },
  {
    area: "Forensics",
    items: [
      { name: "disk-forensics", level: 80 },
      { name: "memory-forensics", level: 70 },
      { name: "network-forensics", level: 80 },
      { name: "steganography", level: 75 },
    ],
  },
  {
    area: "Engineering",
    items: [
      { name: "python", level: 80 },
      { name: "bash-linux", level: 85 },
      { name: "git", level: 75 },
      { name: "networking", level: 70 },
      { name: "web-development", level: 60 },
    ],
  },
];

// =====================================================================
//  TERMINAL & CTF CONFIG
// =====================================================================

export const terminalConfig = {
  // ---- Easter-egg flag #1 (the easy one) ----------------------------
  // The flag is hidden base64-encoded in the boot sequence ("auth token")
  // and in an HTML comment in index.html. Stored base64 here too, so
  // casual source-readers still have to decode *something*.
  easyFlagB64: "ZmxhZ3tjdXIxMHNpdHlfcDR5c19yM250fQ==",
  easyFlagResponse: [
    "ACCESS GRANTED to... absolutely nothing. There is no vault.",
    "But you decoded a random base64 string on a stranger's CV,",
    "which means you have exactly the instincts this industry needs.",
    "Virtual high five: o/",
    "",
    "Want a real challenge? Try: wget challenge.pdf",
  ],

  // ---- The PDF CTF --------------------------------------------------
  // 1. Drop your challenge PDF at  public/challenge.pdf
  //    (create the `public` folder next to src/ if it doesn't exist).
  // 2. Run  node tools/encrypt-reward.mjs  and follow the prompts —
  //    it prints the two values below. Paste them in.
  //    Until then, these placeholders keep the site working; `submit`
  //    will just say the challenge isn't armed yet.
  pdfCtf: {
    enabled: true,
    flagSha256:
      "3e00fefca9eddd53345e6c740dd94d253c44001ee7ce06d930a25396eb914eab",
    encryptedReward:
      "KOCOsgMxv1TrZ60uNQDsmNfWUBxiGozWRPqG/5QSI4pV7k0xWrgB89MK9teDw2m63D464GEW0lJNqLnYrEZYMMDad/uC9ls3YklZbIYgVA==",
  },

  // ---- Hall of fame -------------------------------------------------
  // When someone solves the PDF CTF, Netlify Forms notifies you.
  // Verify them, then add a line here. Shown by `hall of fame`.
  hallOfFame: [
    // { name: "First Solver", date: "2026-08-01", note: "blooded the challenge" },
    { name: "Abiral Karmacharya", date: "2026-01-01", note: "First Blood" },
  ],

  // ---- sudo hire ----------------------------------------------------
  sudoHireResponse: [
    "[sudo] password for recruiter: ********",
    "Authenticating... OK",
    "Scheduling interview with abiral... done.",
    "Just kidding. But the LinkedIn button works: type `contact`.",
  ],
};
