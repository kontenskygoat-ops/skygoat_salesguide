"use client";

import { useEffect, useRef, useState } from "react";
import { videoSource } from "@/lib/googleDrive";

export default function HomePortraitVideo({
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const source = videoSource(videoUrl);

  // Video tidak autoplay. Jika pengguna sudah memutar lalu section
  // benar-benar keluar dari layar, video dijeda supaya tidak terus
  // bermain di background.
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

  if (!source) return null;

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
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

  return (
    <section ref={sectionRef} className="portraitVideoSection" aria-labelledby="portrait-video-title">
      <div className="shell portraitVideoGrid">
        <div className="portraitVideoCopy">
          <span className="sectionLabel">SKYGOAT IN MOTION</span>
          <h2 id="portrait-video-title">{title}</h2>
          {description && <p>{description}</p>}
          <div className="portraitVideoMeta">
            <span>9:16 PORTRAIT</span>
            <span>TAP TO PLAY</span>
            <span>SOUND AVAILABLE</span>
          </div>
        </div>

        <div className="portraitVideoFrame">
          {source.kind === "video" ? (
            <>
              <video
                ref={videoRef}
                src={source.url}
                poster={posterUrl || undefined}
                muted={muted}
                loop
                playsInline
                preload="metadata"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                aria-label={title}
              />

              {!playing && (
                <button
                  type="button"
                  className="portraitVideoPlayOverlay"
                  onClick={togglePlayback}
                  aria-label="Putar video"
                >
                  <span className="portraitVideoPlayIcon" aria-hidden="true">▶</span>
                  <span>Play Video</span>
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
          ) : (
            <iframe
              src={source.url}
              title={title}
              allow="autoplay; fullscreen"
              referrerPolicy="no-referrer"
              allowFullScreen
            />
          )}
          <div className="portraitVideoBadge">SKYGOAT</div>
        </div>
      </div>
    </section>
  );
}
