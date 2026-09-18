"use client";

import { useState } from "react";
import HomeVideoAdmin from "./HomeVideoAdmin";
import HomePortraitVideoAdmin from "./HomePortraitVideoAdmin";
import SettingsAdmin from "./SettingsAdmin";
import { portraitSlots } from "@/lib/portraitVideos";

const categories = [
  ["video", "Video beranda"],
  ["products", "Produk"],
  ["contact", "Kontak & website"],
] as const;

export default function SettingsWorkspace() {
  const [active, setActive] = useState<string>("video");
  return (
    <div className="adminSettingsWorkspace">
      <div
        className="adminCategoryNav"
        role="group"
        aria-label="Kategori pengaturan"
      >
        {categories.map(([key, label]) => (
          <button
            key={key}
            type="button"
            aria-pressed={active === key}
            aria-controls={`settings-${key}`}
            onClick={() => setActive(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <div id="settings-video" hidden={active !== "video"}>
        <div className="adminSectionIntro">
          <h2>Video di halaman beranda</h2>
          <p>
            Kelola 1 video landscape dan 3 video portrait. Perubahan tampil
            setelah disimpan.
          </p>
        </div>
        <div className="adminVideoSections">
          <details className="adminDisclosure">
            <summary>
              <span>
                <strong>Video landscape</strong>
                <small>Video cerita SKYGOAT, format mendatar</small>
              </span>
              <span className="disclosureIndicator" aria-hidden="true" />
            </summary>
            <HomeVideoAdmin />
          </details>
          {portraitSlots.map((slot) => (
            <details className="adminDisclosure" key={slot}>
              <summary>
                <span>
                  <strong>Video portrait {slot}</strong>
                  <small>Slot {slot} · video tegak 9:16 dengan tombol Play</small>
                </span>
                <span className="disclosureIndicator" aria-hidden="true" />
              </summary>
              <HomePortraitVideoAdmin slot={slot} />
            </details>
          ))}
        </div>
      </div>
      <div id="settings-products" hidden={active !== "products"}>
        <SettingsAdmin group="products" />
      </div>
      <div id="settings-contact" hidden={active !== "contact"}>
        <SettingsAdmin group="contact" />
      </div>
    </div>
  );
}
