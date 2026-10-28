import React, { useEffect, useState } from "react";
import { API_URL } from "../config";

export default function About() {
  const [aboutData, setAboutData] = useState({
    title: "",
    paragraph1: "",
    paragraph2: "",
    paragraph3: "",
    box1Title: "",
    box1Desc: "",
    box2Title: "",
    box2Desc: "",
    box3Title: "",
    box3Desc: "",
    box4Title: "",
    box4Desc: "",
  });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        // Bulk fetch all texts starting with "about_"
        const res = await fetch(`${API_URL}/api/texts/page/about_`);
        
        if (res.ok) {
          const data = await res.json();
          setAboutData({
            title: data.about_title || "",
            paragraph1: data.about_paragraph_1 || "",
            paragraph2: data.about_paragraph_2 || "",
            paragraph3: data.about_paragraph_3 || "",
            box1Title: data.about_feature_1_title || "",
            box1Desc: data.about_feature_1_desc || "",
            box2Title: data.about_feature_2_title || "",
            box2Desc: data.about_feature_2_desc || "",
            box3Title: data.about_feature_3_title || "",
            box3Desc: data.about_feature_3_desc || "",
            box4Title: data.about_feature_4_title || "",
            box4Desc: data.about_feature_4_desc || ""
          });
        }
      } catch (error) {
        console.error("Failed to load About page data:", error);
      }
    };

    fetchAboutData();
  }, []);

  return (
    <div
      className="w-full min-h-screen relative"
      style={{
        backgroundImage: "url('/about-us/about-us-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pb-20">
        <div className="pt-[120px] sm:pt-[100px] md:pt-[120px]">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 text-center">
            {aboutData.title}
          </h2>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-10 shadow-2xl border border-white/20 text-white space-y-6">

            {[aboutData.paragraph1, aboutData.paragraph2, aboutData.paragraph3]
              .filter((text) => text.trim() !== "")
              .map((text, i) => (
                <p key={i} className="text-base sm:text-lg leading-relaxed text-white/90 whitespace-pre-line">
                  {text}
                </p>
              ))}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              <div className="bg-black/30 rounded-xl p-5 border border-white/10">
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {aboutData.box1Title}
                </h3>
                <p className="text-white/80 text-sm sm:text-base">
                  {aboutData.box1Desc}
                </p>
              </div>

              <div className="bg-black/30 rounded-xl p-5 border border-white/10">
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {aboutData.box2Title}
                </h3>
                <p className="text-white/80 text-sm sm:text-base">
                  {aboutData.box2Desc}
                </p>
              </div>

              <div className="bg-black/30 rounded-xl p-5 border border-white/10">
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {aboutData.box3Title}
                </h3>
                <p className="text-white/80 text-sm sm:text-base">
                  {aboutData.box3Desc}
                </p>
              </div>

              <div className="bg-black/30 rounded-xl p-5 border border-white/10">
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {aboutData.box4Title}
                </h3>
                <p className="text-white/80 text-sm sm:text-base">
                  {aboutData.box4Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}