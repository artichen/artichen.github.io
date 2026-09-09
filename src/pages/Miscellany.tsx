import type { SiteData } from "../data/site";
import { EmptyState, PageHeading } from "../components/Shared";
import s from "../App.module.css";

export default function Miscellany({ data }: { data: SiteData }) {
  return (
    <>
      <PageHeading
        eyebrow="A LITTLE MORE CONTEXT"
        title="Miscellany"
        description="Intellectual interests and the way I approach learning."
      />
      {data.miscellany.length ? (
        data.miscellany.map((item, index) => (
          <article className={s.miscRow} key={item.title}>
            <span className={s.rowNumber}>0{index + 1}</span>
            <div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
          </article>
        ))
      ) : (
        <EmptyState title="More to come">
          <p>Reading interests and personal notes will appear here.</p>
        </EmptyState>
      )}
      <p className={s.miscFootnote}>
        For technical notes, visit the <a href="#/blog">blog</a>. For my
        academic background, see my <a href="#/cv">CV</a>.
      </p>
    </>
  );
}
