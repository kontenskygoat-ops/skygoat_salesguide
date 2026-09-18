"use client";

import { useEffect, useId, useRef, useState } from "react";
import { videoSource } from "@/lib/googleDrive";
import type { PortraitSlot } from "@/lib/portraitVideos";

export default function HomePortraitVideo({
  slot,
  videoUrl,
  title,
  description,
  posterUrl,
}: {
  slot: PortraitSlot;
  videoUrl: string;
  title: string;
  description?: string;
  posterUrl?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [failed, setFailed] = useState(false);
  const source = videoSource(videoUrl);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || source?.kind !== "video") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.1) {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: [0, 0.1, 0.5] },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [source?.kind, source?.url]);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      setFailed(false);
      if (video.error) video.load();
      void video.play()
        .then(() => setPlaying(true))
        .catch(() => {
          setPlaying(false);
          setFailed(true);
        });
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    const next = !video.muted;
    video.muted = next;
    setMuted(next);
  }

  const normalizedDescription =
    description ===
    "Lihat SKYGOAT lebih dekat dalam format portrait yang otomatis berjalan saat bagian ini terlihat."
      ? "Tekan Play untuk melihat video SKYGOAT."
      : description;

  return (
    <article
      ref={sectionRef}
      className="portraitVideoCard"
      aria-labelledby={titleId}
      data-portrait-slot={slot}
    >
      <div className="portraitVideoCardInner">
        <div className="portraitVideoCopy">
          <span className="portraitSlotLabel">VIDEO {slot}</span>
          <h3 id={titleId}>{title}</h3>
          {normalizedDescription && <p>{normalizedDescription}</p>}
        </div>

        <div className="portraitVideoFrame">
          {!videoUrl ? (
            <div className="portraitVideoEmpty" role="status">
              <span>VIDEO {slot}</span>
              <strong>Belum ada video aktif</strong>
              <small>Upload video portrait {slot} melalui CMS.</small>
            </div>
          ) : source?.kind === "video" ? (
            <>
              <video
                ref={videoRef}
                src={source.url}
                poster={posterUrl || undefined}
                muted={muted}
                loop
                playsInline
                preload="metadata"
                onPlay={() => {
                  document
                    .querySelectorAll<HTMLVideoElement>(".portraitVideoCard video")
                    .forEach((video) => {
                      if (video !== videoRef.current) video.pause();
                    });
                  setPlaying(true);
                }}
                onPause={() => setPlaying(false)}
                onError={() => {
                  setFailed(true);
                  setPlaying(false);
                }}
                aria-label={title}
              />

              {!playing && (
                <button
                  type="button"
                  className="portraitVideoPlayOverlay"
                  onClick={togglePlayback}
                  aria-label={`Putar video portrait ${slot}`}
                >
                  <span className="portraitVideoPlayIcon" aria-hidden="true">▶</span>
                  <span>{failed ? "Coba lagi" : "Play Video"}</span>
                </button>
              )}

              <div className={`portraitVideoControls ${playing ? "isPlaying" : ""}`}>
                <button
                  type="button"
                  onClick={togglePlayback}
                  aria-label={playing ? "Jeda video" : "Putar video"}
                >
                  {playing ? "❚❚" : "▶"}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={muted ? "Aktifkan suara" : "Matikan suara"}
                >
                  {muted ? "Suara mati" : "Suara aktif"}
                </button>
              </div>
            </>
          ) : source?.kind === "iframe" ? (
            <iframe
              src={source.url}
              title={title}
              allow="autoplay; fullscreen"
              referrerPolicy="no-referrer"
              allowFullScreen
            />
          ) : (
            <div className="portraitVideoEmpty portraitVideoInvalid" role="alert">
              <span>VIDEO {slot}</span>
              <strong>URL video tidak dapat dikenali</strong>
              <small>Upload ulang video melalui CMS agar slot ini tidak hilang diam-diam.</small>
              <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                Periksa file video ↗
              </a>
            </div>
          )}
          <div className="portraitVideoBadge">SKYGOAT</div>
        </div>

        {failed && source && (
          <p className="portraitVideoError" role="alert">
            Video belum dapat diputar. Coba lagi atau{" "}
            <a href={source.url} target="_blank" rel="noopener noreferrer">
              buka video langsung
            </a>.
          </p>
        )}
      </div>
    </article>
  );
}
