import { IS_DEMO } from "@/lib/api-client";

export default function DemoBanner() {
  if (!IS_DEMO) return null;
  return (
    <div className="sticky top-0 z-[100] w-full bg-yellow-300 text-black border-b-2 border-black">
      <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-[11px] sm:text-xs font-display font-bold tracking-[0.18em] uppercase text-center">
        <span aria-hidden>⚡</span>
        <span>Demo only — no live Salesforce login</span>
        <a
          href="https://github.com/sdong101010/org-roast"
          target="_blank"
          rel="noopener"
          className="underline decoration-2 underline-offset-[3px] hover:text-red-700"
        >
          Run it yourself →
        </a>
      </div>
    </div>
  );
}
