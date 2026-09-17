import type { SiteData } from "../data/site";
import { EmptyState, PageHeading } from "../components/Shared";
import { localAsset } from "../utils";
import s from "../App.module.css";

export default function Miscellany({ data }: { data: SiteData }) {
  return (
    <>
      <PageHeading
        eyebrow="A LITTLE MORE CONTEXT"
        title="Miscellany"
        description="My cooking hobbies, photos taken during spare time"
      />

      {data.miscellany.length ? (
        data.miscellany.map((item, index) => (
          <article className={s.miscRow} key={item.title}>
            <span className={s.rowNumber}>0{index + 1}</span>

            <div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>

              {item.images?.length ? (
  <details className={s.details}>
    <summary>View photos ({item.images.length})</summary>

    <div className={s.miscGallery}>
      {item.images.map((image) => {
        const imagePath = localAsset(image.src);

        if (!imagePath) {
          return null;
        }

        return (
          <figure
            className={s.miscImage}
            key={`${image.src}-${image.alt}`}
          >
            <img
              src={imagePath}
              alt={image.alt}
              loading="lazy"
              decoding="async"
            />

            {image.caption ? (
              <figcaption>{image.caption}</figcaption>
            ) : null}
          </figure>
        );
      })}
    </div>
  </details>
) : null}
            </div>
          </article>
        ))
      ) : (
        <EmptyState title="More to come">
          <p>Reading interests and personal notes will appear here.</p>
        </EmptyState>
      )}

      <p className={s.miscFootnote}>
        For technical notes, visit the <a href="#/blog">blog</a>. For my academic
        background, see my <a href="#/cv">CV</a>.
      </p>
    </>
  );
}
