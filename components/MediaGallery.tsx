"use client";

import { useMemo, useState } from "react";
import type { MediaAsset } from "@/lib/types";
import { googleDriveImageUrl, googleDrivePreviewUrl } from "@/lib/googleDrive";

const categories = ["all", "mesin", "produksi", "peternakan", "produk", "video"] as const;

export default function MediaGallery({ items }: { items: MediaAsset[] }) {
  const [filter, setFilter] = useState<(typeof categories)[number]>("all");
  const [activeVideo, setActiveVideo] = useState<MediaAsset | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((item) => item.category === filter)),
    [filter, items]
  );

  return (
    <>
      <div className="filterBar">
        {categories.map((category) => (
          <button
            key={category}
            className={filter === category ? "filterButton active" : "filterButton"}
            onClick={() => setFilter(category)}
          >
            {category === "all" ? "ALL" : category.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="mediaGrid">
        {filtered.map((item) => {
          const image = googleDriveImageUrl(item.image_url);

          return (
            <article className="mediaCard" key={item.id}>
              <div className="mediaCover">
                {image ? (
                  <img src={image} alt={item.title} />
                ) : (
                  <div className="mediaPlaceholder">
                    <span>{item.category.toUpperCase()}</span>
                    <strong>{item.title}</strong>
                  </div>
                )}

                {item.video_url && (
                  <button className="playButton" onClick={() => setActiveVideo(item)}>
                    ▶
                  </button>
                )}
              </div>

              <div className="mediaBody">
                <span>{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {item.video_url ? (
                  <button className="textButton" onClick={() => setActiveVideo(item)}>
                    Play Video →
                  </button>
                ) : (
                  <small>Video belum ditambahkan</small>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {activeVideo && (
        <div className="modalBackdrop" onClick={() => setActiveVideo(null)}>
          <div className="videoModal" onClick={(e) => e.stopPropagation()}>
            <button className="modalClose" onClick={() => setActiveVideo(null)}>
              ×
            </button>
            <div className="ratio169">
              <iframe
                src={googleDrivePreviewUrl(activeVideo.video_url)}
                title={activeVideo.title}
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </div>
            <h3>{activeVideo.title}</h3>
          </div>
        </div>
      )}
    </>
  );
}
