import type { SiteData } from "../data/site";
import { Arrow, EmptyState, Portrait, SocialLinks } from "../components/Shared";
import { localAsset, safeExternalUrl } from "../utils";
import s from "../App.module.css";

export default function Home({ data }: { data: SiteData }) {
  const { profile } = data;
  return (
    <>
      <section className={s.hero} aria-labelledby="profile-title">
        <div className={s.heroText}>
          <p className={s.eyebrow}>ACADEMIC & PROFESSIONAL PROFILE</p>
          <h1 id="profile-title">{profile.name || "Your name"}</h1>
          {profile.role && <p className={s.role}>{profile.role}</p>}
          {profile.institution && (
            <p className={s.institution}>{profile.institution}</p>
          )}
          <div className={s.biography}>
            {profile.bio.length ? (
              profile.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            ) : (
              <p>A short biography will be added soon.</p>
            )}
          </div>
          <div className={s.heroLinks}>
            <a href="#/cv" className={s.cvLink}>
              Curriculum vitae <Arrow />
            </a>
            <SocialLinks profile={profile} />
          </div>
        </div>
        <Portrait key={profile.photo} profile={profile} />
      </section>
      <section className={s.section} aria-labelledby="interests-title">
        <div className={s.sectionHeading}>
          <h2 id="interests-title">Research interests</h2>
          <span>AREAS I’M EXPLORING</span>
        </div>
        {data.interests.length ? (
          <div>
            {data.interests.map((item, index) => (
              <article className={s.interestRow} key={item.title}>
                <span className={s.rowNumber}>0{index + 1}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className={s.keywords}>{item.keywords.join(" / ")}</div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="Research interests to follow" />
        )}
      </section>
      <section className={s.section} aria-labelledby="work-title">
        <div className={s.sectionHeading}>
          <h2 id="work-title">Selected work</h2>
          <span>PROJECT FRAMEWORK</span>
        </div>
        {data.isDraft && (
          <p className={s.sectionIntro}>
            
          </p>
        )}
        {data.projects.length ? (
          data.projects.map((project) => (
            <article className={s.projectRow} key={project.id}>
              <div className={s.projectMeta}>{project.kind || "Project"}</div>
              <div>
                <h3>{project.title || "Untitled project"}</h3>
                <p>
                  {project.summary || "A project summary will be added soon."}
                </p>
                {!!project.tags?.length && (
                  <div className={s.tags}>
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                )}
                <details className={s.details}>
                  <summary>Read project outline</summary>
                  <p>
                    {project.details ||
                      "Further details are not yet available."}
                  </p>
                  {project.report && (
  <p>
    <a
      href={localAsset(project.report)}
      target="_blank"
      rel="noopener noreferrer"
    >
      Read report <Arrow />
    </a>
  </p>
)}
                  {safeExternalUrl(project.url) && (
                    <a
                      href={safeExternalUrl(project.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View repository <Arrow />
                    </a>
                  )}
                </details>
              </div>
            </article>
          ))
        ) : (
          <EmptyState title="Projects to follow">
            <p>
              Selected projects will appear here once they are ready to share.
            </p>
          </EmptyState>
        )}
      </section>
      <section className={`${s.section} ${s.homeClosing}`}>
        <div>
          <h2>Beyond the profile</h2>
          <p>Notes on what I’m learning, and a few ideas along the way.</p>
        </div>
        <a href="#/blog">
          Read the blog <Arrow />
        </a>
      </section>
    </>
  );
}
