import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Suspense } from "react";
import { z } from "zod";
import { AppModeSwitch } from "@/components/AppModeSwitch";
import { CurrencySwitch } from "@/components/CurrencySwitch";
import { LocaleSwitch } from "@/components/LocaleSwitch";
import { resolveCurrency } from "@/lib/currency";
import {
  addSubmission,
  listSubmissions,
  setSubmissionStatus,
} from "@/lib/data/store";
import { resolveLocale } from "@/lib/i18n";
import type { Intent } from "@/lib/types";

const modalOptions: Intent[] = [
  "text",
  "image",
  "video",
  "audio",
  "code",
  "agent",
  "search",
];

const submissionSchema = z.object({
  name: z.string().min(2).max(120),
  websiteUrl: z.string().url(),
  description: z.string().min(20).max(2_000),
  submittedBy: z.string().min(2).max(120),
  modalities: z
    .array(z.enum(["text", "image", "video", "audio", "code", "agent", "search"]))
    .min(1),
});

const moderationSchema = z.object({
  submissionId: z.string().min(1),
  status: z.enum(["approved", "rejected"]),
  notes: z.string().max(1_000).optional(),
});

async function createSubmissionAction(formData: FormData) {
  "use server";

  const payload = {
    name: String(formData.get("name") ?? ""),
    websiteUrl: String(formData.get("websiteUrl") ?? ""),
    description: String(formData.get("description") ?? ""),
    submittedBy: String(formData.get("submittedBy") ?? ""),
    modalities: formData.getAll("modalities").map((entry) => String(entry)) as Intent[],
  };

  const parsed = submissionSchema.safeParse(payload);
  if (!parsed.success) {
    return;
  }

  addSubmission(parsed.data);
  revalidatePath("/moderation");
}

async function moderateAction(formData: FormData) {
  "use server";

  const parsed = moderationSchema.safeParse({
    submissionId: String(formData.get("submissionId") ?? ""),
    status: String(formData.get("status") ?? ""),
    notes: String(formData.get("notes") ?? "") || undefined,
  });

  if (!parsed.success) {
    return;
  }

  setSubmissionStatus(parsed.data.submissionId, parsed.data.status, parsed.data.notes);
  revalidatePath("/moderation");
}

export default async function ModerationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const locale = resolveLocale(
    Array.isArray(params.locale) ? params.locale[0] : params.locale,
  );
  const currency = resolveCurrency(
    Array.isArray(params.currency) ? params.currency[0] : params.currency,
  );

  const submissions = listSubmissions().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const pending = submissions.filter((item) => item.status === "pending");

  return (
    <div className="min-h-screen bg-[#f6f6f2]">
      <div className="mx-auto max-w-5xl px-5 py-8 md:px-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              href={`/?${new URLSearchParams({ locale, currency }).toString()}`}
              className="text-xs font-medium text-neutral-500 hover:underline"
            >
              ← AI Bazaar
            </Link>
            <h1 className="mt-1 text-2xl font-bold text-neutral-900">Submissions & Moderation</h1>
            <p className="text-sm text-neutral-600">
              Open submissions are queued as unverified. Only approved entries can be published.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Suspense fallback={<div className="hidden md:block" />}>
              <AppModeSwitch mode="marketplace" variant="light" />
            </Suspense>
            <CurrencySwitch currency={currency} variant="light" />
            <LocaleSwitch locale={locale} variant="light" />
          </div>
        </header>

        <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-neutral-900">Submit a listing</h2>
          <form action={createSubmissionAction} className="grid gap-3 md:grid-cols-2">
            <label className="text-sm text-neutral-700">
              Name
              <input
                name="name"
                required
                className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none ring-amber-400 focus:ring-2"
              />
            </label>
            <label className="text-sm text-neutral-700">
              Website URL
              <input
                name="websiteUrl"
                type="url"
                required
                className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none ring-amber-400 focus:ring-2"
              />
            </label>
            <label className="md:col-span-2 text-sm text-neutral-700">
              Description
              <textarea
                name="description"
                required
                rows={3}
                className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none ring-amber-400 focus:ring-2"
              />
            </label>
            <label className="text-sm text-neutral-700">
              Submitted by
              <input
                name="submittedBy"
                required
                className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none ring-amber-400 focus:ring-2"
              />
            </label>

            <fieldset className="text-sm text-neutral-700">
              <legend className="mb-1">Modalities</legend>
              <div className="flex flex-wrap gap-2">
                {modalOptions.map((item) => (
                  <label key={item} className="inline-flex items-center gap-1 rounded-full border border-neutral-300 px-2 py-1 text-xs">
                    <input name="modalities" type="checkbox" value={item} />
                    {item}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700"
              >
                Submit for review
              </button>
            </div>
          </form>
        </section>

        <section className="mt-5 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-neutral-900">
            Editorial queue ({pending.length} pending)
          </h2>

          {submissions.length === 0 ? (
            <p className="text-sm text-neutral-600">No submissions yet.</p>
          ) : (
            <div className="space-y-3">
              {submissions.map((item) => (
                <article key={item.id} className="rounded-2xl border border-neutral-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900">{item.name}</h3>
                      <a
                        href={item.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-neutral-600 underline"
                      >
                        {item.websiteUrl}
                      </a>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        item.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : item.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-neutral-700">{item.description}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    by {item.submittedBy} • {new Date(item.createdAt).toLocaleString("en-IN")}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.modalities.map((mod) => (
                      <span key={mod} className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-700">
                        {mod}
                      </span>
                    ))}
                  </div>

                  {item.status === "pending" ? (
                    <form action={moderateAction} className="mt-3 flex flex-wrap items-center gap-2">
                      <input type="hidden" name="submissionId" value={item.id} />
                      <input
                        name="notes"
                        placeholder="Optional moderation note"
                        className="min-w-[220px] flex-1 rounded-lg border border-neutral-300 px-2 py-1 text-xs"
                      />
                      <button
                        type="submit"
                        name="status"
                        value="approved"
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        Approve
                      </button>
                      <button
                        type="submit"
                        name="status"
                        value="rejected"
                        className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        Reject
                      </button>
                    </form>
                  ) : item.notes ? (
                    <p className="mt-2 text-xs text-neutral-600">Note: {item.notes}</p>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
