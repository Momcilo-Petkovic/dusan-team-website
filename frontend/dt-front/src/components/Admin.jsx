import React, { useState } from "react";
import { API_URL } from "../config";

const SLIDE_COUNT = 4;
const MAX_IMAGE_MB = 10;
const emptySlide = () => ({ id: null, text: "", imageFile: null, currentImageUrl: "" });

// About page field -> key in the database
const ABOUT_KEYS = {
  title: "about_title", paragraph1: "about_paragraph_1", paragraph2: "about_paragraph_2", paragraph3: "about_paragraph_3",
  box1Title: "about_feature_1_title", box1Desc: "about_feature_1_desc",
  box2Title: "about_feature_2_title", box2Desc: "about_feature_2_desc",
  box3Title: "about_feature_3_title", box3Desc: "about_feature_3_desc",
  box4Title: "about_feature_4_title", box4Desc: "about_feature_4_desc",
};

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [slides, setSlides] = useState(() => Array.from({ length: SLIDE_COUNT }, emptySlide));

  const [aboutTexts, setAboutTexts] = useState(() =>
    Object.fromEntries(Object.keys(ABOUT_KEYS).map((field) => [field, ""]))
  );

  const authHeader = () => ({
    Authorization: "Basic " + btoa(`${adminUsername}:${adminPassword}`),
  });

  // fetch() only fails on network errors, so check the status and surface the server's message
  const api = async (path, options = {}) => {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { ...authHeader(), ...(options.headers || {}) },
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(detail || `Greška ${res.status}`);
    }
    return res;
  };

  const handleLogin = async () => {
    setLoginError("");
    try {
      const res = await fetch(`${API_URL}/api/admin/check`, { headers: authHeader() });
      if (res.status === 401) {
        setLoginError("Neispravni podaci za prijavu");
        return;
      }
      if (!res.ok) throw new Error();
      setLoggedIn(true);
      loadAll();
    } catch {
      setLoginError("Server nije dostupan. Pokušajte ponovo kasnije.");
    }
  };

  const logout = () => {
    setLoggedIn(false);
    setAdminPassword("");
  };

  const loadAll = async () => {
    await Promise.all([fetchAbout(), fetchImages(), fetchSlides()]);
  };

  const fetchAbout = async () => {
    const res = await fetch(`${API_URL}/api/texts/page/about_`);
    if (!res.ok) return;
    const data = await res.json();
    setAboutTexts(
      Object.fromEntries(Object.entries(ABOUT_KEYS).map(([field, key]) => [field, data[key] || ""]))
    );
  };

  const saveAbout = async () => {
    try {
      await Promise.all(
        Object.entries(ABOUT_KEYS).map(([field, key]) =>
          api(`/api/texts/${key}`, {
            method: "PUT",
            headers: { "Content-Type": "text/plain;charset=UTF-8" },
            body: aboutTexts[field],
          })
        )
      );
      alert("Stranica 'O nama' je uspešno sačuvana!");
    } catch (err) {
      alert("Čuvanje nije uspelo: " + err.message);
    }
  };

  const fetchImages = async () => {
    const res = await fetch(`${API_URL}/api/gallery`);
    if (res.ok) setImages(await res.json());
  };

  const uploadImages = async () => {
    if (!selectedFiles.length) return;
    const tooBig = selectedFiles.filter((f) => f.size > MAX_IMAGE_MB * 1024 * 1024);
    if (tooBig.length) {
      alert(`Ove slike su veće od ${MAX_IMAGE_MB} MB: ${tooBig.map((f) => f.name).join(", ")}`);
      return;
    }
    const fd = new FormData();
    selectedFiles.forEach((f) => fd.append("files", f));
    setUploading(true);
    try {
      await api("/api/gallery/multiple", { method: "POST", body: fd });
      setSelectedFiles([]);
      fetchImages();
      alert("Slike su otpremljene!");
    } catch (err) {
      alert("Otpremanje nije uspelo: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id) => {
    if (!confirm("Da li ste sigurni da želite da obrišete sliku?")) return;
    try {
      await api(`/api/gallery/${id}`, { method: "DELETE" });
    } catch (err) {
      alert("Brisanje nije uspelo: " + err.message);
    }
    fetchImages();
  };

  const fetchSlides = async () => {
    const res = await fetch(`${API_URL}/api/slides`);
    if (!res.ok) return;
    const data = await res.json();
    // Always show 4 slots, so slides can be added on an empty database too
    setSlides(
      Array.from({ length: SLIDE_COUNT }, (_, i) =>
        data[i]
          ? { id: data[i].id, text: data[i].text || "", imageFile: null, currentImageUrl: data[i].imageUrl || "" }
          : emptySlide()
      )
    );
  };

  const updateSlide = (index, changes) => {
    setSlides((prev) => prev.map((slide, i) => (i === index ? { ...slide, ...changes } : slide)));
  };

  const updateSlideText = (index, newText) => updateSlide(index, { text: newText });

  const updateSlideImage = (index, file) => updateSlide(index, { imageFile: file || null });

  const saveSlide = async (index) => {
    const slide = slides[index];
    if (!slide.id && !slide.imageFile) {
      alert("Za novi slajd prvo odaberite sliku.");
      return;
    }
    if (slide.imageFile && slide.imageFile.size > MAX_IMAGE_MB * 1024 * 1024) {
      alert(`Slika je veća od ${MAX_IMAGE_MB} MB.`);
      return;
    }

    const fd = new FormData();
    fd.append("text", slide.text);
    if (slide.imageFile) {
      fd.append("file", slide.imageFile);
    }

    try {
      await api(slide.id ? `/api/slides/${slide.id}` : "/api/slides", {
        method: slide.id ? "PUT" : "POST",
        body: fd,
      });
      alert("Slajd je sačuvan!");
      fetchSlides();
    } catch (err) {
      console.error("Greška pri otpremanju:", err);
      alert("Čuvanje nije uspelo: " + err.message);
    }
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-xl space-y-4 w-full max-w-md shadow-2xl">
          <h2 className="text-2xl font-bold text-center">Admin Portal</h2>
          <input
            type="text" placeholder="Korisničko ime"
            value={adminUsername}
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
            onChange={(e) => setAdminUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <input
            type="password" placeholder="Lozinka"
            value={adminPassword}
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
            onChange={(e) => setAdminPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin} className="w-full bg-blue-600 p-3 rounded font-bold hover:bg-blue-700 transition">
            Pristupi Panelu
          </button>
          {loginError && <p className="text-red-400 text-center text-sm">{loginError}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 pt-32 space-y-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <button onClick={logout} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded font-semibold">
          Odjava
        </button>
      </div>

      <section className="bg-gray-800 p-6 rounded-lg space-y-6">
        <h2 className="text-2xl font-bold mb-4">Slajdovi na početnoj strani (4 slajda)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slides.map((slide, i) => (
            <div key={i} className="bg-gray-700 p-4 rounded-lg space-y-3">
              <h3 className="text-xl font-semibold">Slajd {i + 1}</h3>
              
              {slide.currentImageUrl && (
                <div className="mb-2">
                  <p className="text-sm text-gray-400 mb-1">Trenutna slika:</p>
                  <img
                    src={slide.currentImageUrl}
                    alt={`Slajd ${i + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              )}
              
              <div>
                <br />
                <label className="block text-sm mb-1">Tekst slajda:</label>
                <input
                  value={slide.text}
                  onChange={(e) => updateSlideText(i, e.target.value)}
                  className="w-full bg-gray-600 p-2 rounded text-white"
                  placeholder={`Tekst za slajd ${i + 1}`}
                />
              </div>

              <div>
                <br />
                <label className="block text-sm mb-3">Otpremite novu sliku:</label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded transition-colors shrink-0">
                    ODABERITE DATOTEKU
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => updateSlideImage(i, e.target.files[0])}
                    />
                  </label>
                  <span className="text-sm text-gray-400 truncate">
                    {slide.imageFile ? slide.imageFile.name : "Nijedna datoteka nije odabrana"}
                  </span>
                </div>
                <br />
              </div>

              <button
                onClick={() => saveSlide(i)}
                className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
              >
                Sačuvaj slajd {i + 1}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-800 p-6 rounded-lg space-y-4">
        <h2 className="text-2xl font-bold mb-4">Stranica 'O nama'</h2>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Naslov:</label>
            <input
              value={aboutTexts.title}
              onChange={(e) => setAboutTexts({ ...aboutTexts, title: e.target.value })}
              className="w-full bg-gray-700 p-2 rounded text-white"
              placeholder="Naslov sekcije O nama"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Paragraf 1:</label>
            <textarea
              value={aboutTexts.paragraph1}
              onChange={(e) => setAboutTexts({ ...aboutTexts, paragraph1: e.target.value })}
              className="w-full bg-gray-700 p-2 rounded text-white"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Paragraf 2:</label>
            <textarea
              value={aboutTexts.paragraph2}
              onChange={(e) => setAboutTexts({ ...aboutTexts, paragraph2: e.target.value })}
              className="w-full bg-gray-700 p-2 rounded text-white"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Paragraf 3:</label>
            <textarea
              value={aboutTexts.paragraph3}
              onChange={(e) => setAboutTexts({ ...aboutTexts, paragraph3: e.target.value })}
              className="w-full bg-gray-700 p-2 rounded text-white"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm mb-1">Naslov boksa 1:</label>
              <input
                value={aboutTexts.box1Title}
                onChange={(e) => setAboutTexts({ ...aboutTexts, box1Title: e.target.value })}
                className="w-full bg-gray-700 p-2 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Opis boksa 1:</label>
              <textarea
                value={aboutTexts.box1Desc}
                onChange={(e) => setAboutTexts({ ...aboutTexts, box1Desc: e.target.value })}
                className="w-full bg-gray-700 p-2 rounded text-white"
                rows="2"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Naslov boksa 2:</label>
              <input
                value={aboutTexts.box2Title}
                onChange={(e) => setAboutTexts({ ...aboutTexts, box2Title: e.target.value })}
                className="w-full bg-gray-700 p-2 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Opis boksa 2:</label>
              <textarea
                value={aboutTexts.box2Desc}
                onChange={(e) => setAboutTexts({ ...aboutTexts, box2Desc: e.target.value })}
                className="w-full bg-gray-700 p-2 rounded text-white"
                rows="2"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Naslov boksa 3:</label>
              <input
                value={aboutTexts.box3Title}
                onChange={(e) => setAboutTexts({ ...aboutTexts, box3Title: e.target.value })}
                className="w-full bg-gray-700 p-2 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Opis boksa 3:</label>
              <textarea
                value={aboutTexts.box3Desc}
                onChange={(e) => setAboutTexts({ ...aboutTexts, box3Desc: e.target.value })}
                className="w-full bg-gray-700 p-2 rounded text-white"
                rows="2"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Naslov boksa 4:</label>
              <input
                value={aboutTexts.box4Title}
                onChange={(e) => setAboutTexts({ ...aboutTexts, box4Title: e.target.value })}
                className="w-full bg-gray-700 p-2 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Opis boksa 4:</label>
              <textarea
                value={aboutTexts.box4Desc}
                onChange={(e) => setAboutTexts({ ...aboutTexts, box4Desc: e.target.value })}
                className="w-full bg-gray-700 p-2 rounded text-white"
                rows="2"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={saveAbout} 
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-semibold mt-4"
        >
          Sačuvaj O nama
        </button>
      </section>

      <section className="bg-gray-800 p-6 rounded-lg space-y-4">
        <h2 className="text-2xl font-bold mb-4">Upravljanje galerijom</h2>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-6 rounded transition-colors shrink-0 uppercase tracking-wider">
              ODABERITE DATOTEKE
              <input 
                type="file" 
                multiple 
                className="hidden"
                accept="image/*"
                onChange={(e) => setSelectedFiles([...e.target.files])} 
              />
            </label>
            <span className="text-sm text-gray-400 italic">
              {selectedFiles.length > 0 
                ? `Izabrano: ${selectedFiles.length} datoteka` 
                : "Nijedna datoteka nije odabrana"}
            </span>
          </div>
          <button
            onClick={uploadImages}
            disabled={uploading || !selectedFiles.length}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Otpremanje..." : "Otpremi slike"}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative group">
              <img 
                src={img.url} 
                alt="" 
                className="w-full h-40 object-cover rounded-lg" 
              />
              <button
                onClick={() => deleteImage(img.id)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}