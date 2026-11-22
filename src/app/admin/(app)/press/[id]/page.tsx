"use client";

import { useEffect, useRef, useState, use, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/admin/AdminAuth";
import { useToast } from "@/components/admin/Toast";
import { ImageDropzone } from "@/components/admin/ImageDropzone";
import { ui } from "@/components/admin/ui";
import { Icon } from "@/components/icons/Icon";
import { MarkdownBody } from "@/components/content/MarkdownBody";
import { revalidatePublic } from "@/lib/supabase/browser";
import { uploadImage } from "@/lib/storage";
import { processPressPhoto } from "@/lib/image";
import { excerpt } from "@/lib/markdown";
import { formatLongDate, slugify, todayIST } from "@/lib/format";
import type { PressReleaseRow } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

type Form = {
  title_en: string;
  title_ml: string;
  body_en: string;
  body_ml: string;
  slug: string;
  photo_url: string | null;
  photo_social_url: string | null;
  photo_thumb_url: string | null;
  photo_width: number | null;
  photo_height: number | null;
  photo_alt: string;
  release_date: string;
  place: string;
  meta_description: string;
  is_published: boolean;
};

const EMPTY: Form = {
  title_en: "",
  title_ml: "",
  body_en: "",
  body_ml: "",
  slug: "",
  photo_url: null,
  photo_social_url: null,
  photo_thumb_url: null,
  photo_width: null,
  photo_height: null,
  photo_alt: "",
  release_date: todayIST(),
  place: "Kasaragod, Kerala",
  meta_description: "",
  is_published: false,
};

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ltsfoundation.in").replace(/\/$/, "");
const SITE_HOST = SITE.replace(/^https?:\/\//, "");

export default function PressEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === "new";
  const { sb } = useAdminAuth();
  const toast = useToast();
  const router = useRouter();

  const [form, setForm] = useState<Form>(EMPTY);
  const [loaded, setLoaded] = useState(isNew);
  const [notFound, setNotFound] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [metaTouched, setMetaTouched] = useState(false);
  const [slugState, setSlugState] = useState<"idle" | "checking" | "ok" | "taken">("idle");
  const [lang, setLang] = useState<"en" | "ml">("en");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const dirty = useRef(false);

  const set = (patch: Partial<Form>) => {
    dirty.current = true;
    setForm((f) => ({ ...f, ...patch }));
  };

  /* Load an existing release. */
  useEffect(() => {
    if (isNew || !sb) return;
    void sb
      .from("press_releases")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) return setNotFound(true);
        const r = data as PressReleaseRow;
        setForm({
          title_en: r.title_en,
          title_ml: r.title_ml ?? "",
          body_en: r.body_en,
          body_ml: r.body_ml ?? "",
          slug: r.slug,
          photo_url: r.photo_url,
          photo_social_url: r.photo_social_url,
          photo_thumb_url: r.photo_thumb_url,
          photo_width: r.photo_width,
          photo_height: r.photo_height,
          photo_alt: r.photo_alt ?? "",
          release_date: r.release_date,
          place: r.place ?? "",
          meta_description: r.meta_description ?? "",
          is_published: r.is_published,
        });
        setMetaTouched(Boolean(r.meta_description));
        setLoaded(true);
      });
  }, [id, isNew, sb]);

  /* Warn before leaving with unsaved changes. */
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  /* Auto slug from the English title (until edited by hand). */
  const autoSlug = slugify(form.title_en, form.release_date);
  const slug = slugTouched ? form.slug : autoSlug;

  /* Uniqueness check (debounced). */
  useEffect(() => {
    if (!sb || !slug) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- show "checking" immediately
    setSlugState("checking");
    const t = setTimeout(async () => {
      let q = sb.from("press_releases").select("id", { count: "exact", head: true }).eq("slug", slug);
      if (!isNew) q = q.neq("id", id);
      const { count } = await q;
      setSlugState(count ? "taken" : "ok");
    }, 400);
    return () => clearTimeout(t);
  }, [slug, sb, id, isNew]);

  const autoMeta = excerpt(form.body_en, 155);
  const metaDescription = metaTouched ? form.meta_description : autoMeta;

  async function onPhoto(file: File) {
    setUploading(true);
    const local = URL.createObjectURL(file);
    setPreview(local);
    try {
      const p = await processPressPhoto(file);
      const [main, social, thumb] = await Promise.all([
        uploadImage(p.main, { name: "main" }),
        uploadImage(p.social, { name: "social" }),
        uploadImage(p.thumb, { name: "thumb" }),
      ]);
      set({ photo_url: main, photo_social_url: social, photo_thumb_url: thumb, photo_width: p.width, photo_height: p.height });
      toast({ message: `Photo ready (${Math.round(p.main.size / 1024)} KB)` });
    } catch (e) {
      toast({ message: `Photo upload failed: ${e instanceof Error ? e.message : "unknown error"}`, type: "error" });
      setPreview(null);
    } finally {
      URL.revokeObjectURL(local);
      setUploading(false);
    }
  }

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!sb) return;
    const publish = (e.nativeEvent as SubmitEvent).submitter?.dataset.publish;
    const is_published = publish === "yes" ? true : publish === "no" ? false : form.is_published;

    if (!form.title_en.trim()) return toast({ message: "English title is required.", type: "error" });
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return toast({ message: "URL slug can only contain a–z, 0–9 and hyphens.", type: "error" });
    if (slugState === "taken") return toast({ message: "That URL slug is already used. Please change it.", type: "error" });
    if (is_published && !form.body_en.trim()) return toast({ message: "Add the English body text before publishing.", type: "error" });
    if (form.photo_url && !form.photo_alt.trim()) return toast({ message: "Please describe the photo (alt text) for accessibility and SEO.", type: "error" });

    setSaving(true);
    const row = {
      slug,
      title_en: form.title_en.trim(),
      title_ml: form.title_ml.trim() || null,
      body_en: form.body_en.trim(),
      body_ml: form.body_ml.trim() || null,
      photo_url: form.photo_url,
      photo_social_url: form.photo_social_url,
      photo_thumb_url: form.photo_thumb_url,
      photo_width: form.photo_width,
      photo_height: form.photo_height,
      photo_alt: form.photo_alt.trim() || null,
      release_date: form.release_date,
      place: form.place.trim() || null,
      meta_description: metaTouched && form.meta_description.trim() ? form.meta_description.trim() : null,
      is_published,
    };
    const res = isNew
      ? await sb.from("press_releases").insert(row).select("id").single()
      : await sb.from("press_releases").update(row).eq("id", id).select("id").single();
    setSaving(false);
    if (res.error) {
      const msg = res.error.code === "23505" ? "That URL slug is already used." : res.error.message;
      return toast({ message: `Couldn't save: ${msg}`, type: "error" });
    }
    dirty.current = false;
    setForm((f) => ({ ...f, is_published, slug }));
    setSlugTouched(true);
    void revalidatePublic(["press"]);
    toast({ message: is_published ? "Published. It's live now." : "Draft saved" });
    if (isNew) router.replace(`/admin/press/${res.data.id}`);
  }

  if (notFound) return <p>Press release not found. <Link href="/admin/press" className="font-semibold text-maroon underline">Back to list</Link></p>;
  if (!loaded) return <div className="h-96 animate-pulse rounded-[var(--radius-card)] bg-ink/5" role="status" aria-label="Loading" />;

  const bodyKey = lang === "en" ? "body_en" : "body_ml";
  const titlePreview = form.title_en || "Press release title";
  const urlPreview = `${SITE_HOST} › en › press › ${slug}`;

  return (
    <form onSubmit={save} className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/press" className="inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-maroon">
            <Icon name="arrowLeft" size={16} /> All press releases
          </Link>
          <h1 className="mt-1 text-3xl font-semibold">{isNew ? "New press release" : "Edit press release"}</h1>
        </div>
        <span className={cn("rounded-full px-3 py-1 text-sm font-semibold", form.is_published ? "bg-leaf/15 text-leaf" : "bg-ink/10 text-ink-soft")}>
          {form.is_published ? "Published" : "Draft"}
        </span>
      </header>

      {/* ── Titles ── */}
      <section className={cn(ui.card, "grid gap-4")}>
        <label className={ui.label}>
          Title (English) *
          <input className={cn(ui.input, "text-lg")} required maxLength={200} value={form.title_en} onChange={(e) => set({ title_en: e.target.value })} />
        </label>
        <label className={ui.label}>
          <span>Title (Malayalam) <span className={ui.hint}>(optional; Malayalam visitors see English if empty)</span></span>
          <input className={cn(ui.input, "text-lg")} lang="ml" maxLength={200} value={form.title_ml} onChange={(e) => set({ title_ml: e.target.value })} />
        </label>
        <div className={ui.label}>
          <label htmlFor="slug">URL</label>
          <div className="flex items-center overflow-hidden rounded-xl border border-ink/15 bg-white focus-within:border-maroon focus-within:ring-2 focus-within:ring-maroon/20">
            <span className="hidden shrink-0 bg-ink/5 px-3 py-3 text-sm font-normal text-ink-soft sm:block">/press/</span>
            <input
              id="slug"
              className="min-h-12 w-full px-3 text-base font-normal outline-none"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                set({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-{2,}/g, "-") });
              }}
              aria-describedby="slug-status"
            />
          </div>
          <p id="slug-status" className={cn("text-xs font-normal", slugState === "taken" ? "text-[#b42318]" : "text-ink-soft")} aria-live="polite">
            {slugState === "checking" ? "Checking…" : slugState === "taken" ? "Already used by another release. Please change it." : slugState === "ok" ? "✓ Available" : ""}
            {slugTouched && slug !== autoSlug && (
              <button type="button" className="ml-2 font-semibold text-maroon underline" onClick={() => setSlugTouched(false)}>Reset from title</button>
            )}
          </p>
        </div>
      </section>

      {/* ── Body ── */}
      <section className={ui.card}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div role="tablist" aria-label="Language" className="inline-flex rounded-full bg-ink/5 p-1">
            {(["en", "ml"] as const).map((l) => (
              <button key={l} type="button" role="tab" aria-selected={lang === l} onClick={() => setLang(l)} className={cn("min-h-10 rounded-full px-4 text-sm font-semibold", lang === l ? "bg-white shadow" : "text-ink-soft")}>
                {l === "en" ? "English *" : "Malayalam"}
              </button>
            ))}
          </div>
          <div role="tablist" aria-label="Mode" className="inline-flex rounded-full bg-ink/5 p-1">
            {(["write", "preview"] as const).map((m) => (
              <button key={m} type="button" role="tab" aria-selected={tab === m} onClick={() => setTab(m)} className={cn("min-h-10 rounded-full px-4 text-sm font-semibold capitalize", tab === m ? "bg-white shadow" : "text-ink-soft")}>
                {m}
              </button>
            ))}
          </div>
        </div>
        {tab === "write" ? (
          <>
            <textarea
              aria-label={`Body text (${lang === "en" ? "English" : "Malayalam"})`}
              lang={lang}
              className={cn(ui.textarea, "min-h-[22rem]")}
              value={form[bodyKey]}
              onChange={(e) => set({ [bodyKey]: e.target.value } as Partial<Form>)}
              placeholder={"Paste the press release here. Blank lines separate paragraphs.\n\n## A heading\n**bold**, *italic*, [link](https://…)\n- a bullet point"}
            />
            <p className="mt-2 text-xs text-ink-soft">
              Simple formatting: blank line = new paragraph · <code>## Heading</code> · <code>**bold**</code> · <code>*italic*</code> · <code>[text](https://link)</code> · <code>- bullet</code> · <code>&gt; quote</code>
            </p>
          </>
        ) : (
          <div className="min-h-[22rem] rounded-xl bg-cream/60 p-5 sm:p-8" lang={lang}>
            <h2 className="mb-2 text-3xl font-semibold">{(lang === "ml" && form.title_ml) || form.title_en || "Untitled"}</h2>
            <p className="mb-6 text-sm text-ink-soft">{formatLongDate(form.release_date, lang)}{form.place && ` · ${form.place}`}</p>
            {form[bodyKey].trim() ? <MarkdownBody source={form[bodyKey]} /> : <p className="text-ink-soft">Nothing to preview yet.</p>}
          </div>
        )}
      </section>

      {/* ── Photo + details ── */}
      <section className={cn(ui.card, "grid gap-6 md:grid-cols-2")}>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Photo</h2>
          <ImageDropzone
            onFile={(f) => void onPhoto(f)}
            onRemove={() => {
              setPreview(null);
              set({ photo_url: null, photo_social_url: null, photo_thumb_url: null, photo_width: null, photo_height: null });
            }}
            previewUrl={preview ?? form.photo_url}
            busy={uploading}
          />
          <label className={ui.label}>
            <span>Photo description (alt text) {form.photo_url && "*"} <span className={ui.hint}>(what the photo shows, for blind visitors and Google)</span></span>
            <input className={ui.input} maxLength={250} value={form.photo_alt} onChange={(e) => set({ photo_alt: e.target.value })} placeholder="Volunteers handing grocery kits to families in Cherkala" />
          </label>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Details</h2>
          <label className={ui.label}>
            Release date
            <input className={ui.input} type="date" required value={form.release_date} onChange={(e) => set({ release_date: e.target.value })} />
          </label>
          <label className={ui.label}>
            Place (dateline)
            <input className={ui.input} maxLength={120} value={form.place} onChange={(e) => set({ place: e.target.value })} placeholder="Kasaragod, Kerala" />
          </label>
        </div>
      </section>

      {/* ── SEO ── */}
      <section className={ui.card} aria-labelledby="seo-title">
        <h2 id="seo-title" className="text-lg font-semibold">Search &amp; sharing</h2>
        <label className={cn(ui.label, "mt-4")}>
          <span className="flex items-center justify-between gap-2">
            <span>Meta description <span className={ui.hint}>{metaTouched ? "(custom)" : "(auto: first 155 characters of the body)"}</span></span>
            <span className={cn("text-xs font-normal tabular", metaDescription.length > 160 ? "text-[#b42318]" : "text-ink-soft")}>{metaDescription.length}/160</span>
          </span>
          <textarea
            className={cn(ui.textarea, "min-h-24")}
            maxLength={320}
            value={metaDescription}
            onChange={(e) => {
              setMetaTouched(true);
              set({ meta_description: e.target.value });
            }}
          />
        </label>
        {metaTouched && (
          <button type="button" className="mt-1 text-sm font-semibold text-maroon underline" onClick={() => { setMetaTouched(false); set({ meta_description: "" }); }}>
            Use automatic description
          </button>
        )}

        <p className="mt-5 mb-2 text-xs font-semibold tracking-wide text-ink-soft uppercase">Google preview</p>
        <div className="max-w-[600px] rounded-xl bg-white p-4 font-[arial,sans-serif] ring-1 ring-ink/10">
          <p className="truncate text-[14px] text-[#202124]">{urlPreview}</p>
          <p className="mt-1 line-clamp-1 text-[20px] leading-snug text-[#1a0dab]">{titlePreview} | Hunger Free Kasaragod</p>
          <p className="mt-1 line-clamp-2 text-[14px] leading-[1.58] text-[#4d5156]">
            <span className="text-[#70757a]">{formatLongDate(form.release_date, "en")} — </span>
            {metaDescription || "Add body text to generate a description."}
          </p>
        </div>

        {form.photo_social_url && (
          <>
            <p className="mt-5 mb-2 text-xs font-semibold tracking-wide text-ink-soft uppercase">WhatsApp / Facebook preview image (1200×630)</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.photo_social_url} alt="" className="w-full max-w-sm rounded-xl ring-1 ring-ink/10" />
          </>
        )}
      </section>

      {/* ── Actions (sticky on phones) ── */}
      <div className="sticky bottom-0 -mx-4 flex flex-col gap-2 border-t border-ink/10 bg-cream/95 p-4 backdrop-blur sm:static sm:mx-0 sm:flex-row sm:justify-end sm:border-0 sm:bg-transparent sm:p-0">
        {form.is_published && !isNew && (
          <a href={`/en/press/${slug}`} target="_blank" rel="noopener" className={cn(ui.btn, ui.ghost)}>
            View live <Icon name="arrowRight" size={16} />
          </a>
        )}
        <button type="submit" data-publish="no" disabled={saving || uploading} className={cn(ui.btn, ui.outline)}>
          {form.is_published ? "Unpublish (save as draft)" : "Save draft"}
        </button>
        <button type="submit" data-publish="yes" disabled={saving || uploading} className={cn(ui.btn, ui.gold)}>
          <Icon name="check" size={18} /> {saving ? "Saving…" : form.is_published ? "Update" : "Publish"}
        </button>
      </div>
    </form>
  );
}
