"use client";

import { useEffect, useRef, useState } from "react";
import { videoSource } from "@/lib/googleDrive";

export default function HomeStoryVideo({
  videoUrl,
  title,
  description,
  posterUrl,
}: {
  videoUrl: string;
  title: string;
  description?: string;
  posterUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const source = videoSource(videoUrl);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [open]);

  if (!source) return null;

  function openPlayer() {
    setFailed(false);
    setOpen(true);
  }

  return (
    <section className="storyVideoSection" aria-labelledby="story-video-title">
      <div className="shell">
        <button
          className="storyVideoBanner"
          type="button"
          onClick={openPlayer}
          aria-label={`Putar video: ${title}`}
        >
          {posterUrl ? (
            <img className="storyVideoPoster" src={posterUrl} alt="" loading="lazy" />
          ) : (
            <div className="storyVideoFallback" aria-hidden="true" />
          )}
          <div className="storyVideoShade" />
          <div className="storyVideoCopy">
            <span>DISCOVER SKYGOAT</span>
            <h2 id="story-video-title">{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <span className="storyPlayButton" aria-hidden="true"><span>▶</span></span>
          <span className="storyPlayLabel" aria-hidden="true">PLAY VIDEO</span>
        </button>
      </div>

      {open && (
        <dialog
          ref={dialogRef}
          className="storyVideoDialog"
          aria-labelledby="story-video-dialog-title"
          onCancel={() => setOpen(false)}
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="storyVideoDialogHead">
            <div>
              <span>SKYGOAT VIDEO</span>
              <h3 id="story-video-dialog-title">{title}</h3>
            </div>
            <button
              type="button"
              className="storyVideoClose"
              aria-label="Tutup video"
              autoFocus
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="storyVideoPlayer">
            {source.kind === "video" ? (
              failed ? (
                <div className="storyVideoError" role="alert">
                  <strong>Video belum dapat diputar.</strong>
                  <p>Coba buka ulang player atau buka file video secara langsung.</p>
                  <div className="actionRow">
                    <button type="button" onClick={() => setFailed(false)}>Coba lagi</button>
                    <a href={source.url} target="_blank" rel="noopener noreferrer">Buka video</a>
                  </div>
                </div>
              ) : (
                <video
                  src={source.url}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  onError={() => setFailed(true)}
                />
              )
            ) : (
              <iframe
                src={source.url}
                title={title}
                allow="autoplay; fullscreen"
                referrerPolicy="no-referrer"
                allowFullScreen
              />
            )}
          </div>
        </dialog>
      )}
    </section>
  );
}
