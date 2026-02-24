import type { Persona } from "@/lib/types";

type Props = {
  defaultQuery?: string;
  placeholder: string;
  locale: "en-IN" | "hi-IN";
  persona: Persona;
};

export function SearchCommand({ defaultQuery, placeholder, locale, persona }: Props) {
  return (
    <form
      action="/results"
      className="w-full rounded-3xl border border-white/20 bg-white/90 p-3 shadow-2xl shadow-amber-900/20 backdrop-blur"
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="persona" value={persona} />

      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <div className="flex-1">
          <label htmlFor="q" className="sr-only">
            Search AI tools and models
          </label>
          <input
            id="q"
            name="q"
            defaultValue={defaultQuery}
            required
            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900 outline-none ring-amber-400 transition focus:ring-2"
            placeholder={placeholder}
          />
        </div>
        <button
          type="submit"
          className="rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
        >
          Search
        </button>
      </div>
    </form>
  );
}
