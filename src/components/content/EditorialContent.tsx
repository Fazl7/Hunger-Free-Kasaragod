import type { EditorialSection } from "@content/editorial";
import { tr } from "@/lib/utils";

export function EditorialContent({ sections, locale }: { sections: EditorialSection[]; locale: string }) {
  return (
    <article className="container-page max-w-4xl space-y-10 py-12 pb-20 text-lg leading-relaxed text-ink-soft">
      {sections.map((section, i) => (
        <section key={i} className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{tr(section.heading, locale)}</h2>
          {section.paragraphs.map((paragraph, j) => <p key={j}>{tr(paragraph, locale)}</p>)}
        </section>
      ))}
    </article>
  );
}
