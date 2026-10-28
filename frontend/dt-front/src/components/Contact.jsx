import React, { useState } from "react";
import { API_URL, SITE } from "../config";

export default function Contact() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null); // { ok: boolean, text: string }
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const params = new URLSearchParams();
      params.append("email", email);
      params.append("message", message);

      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setStatus({ ok: true, text: "Poruka je uspešno poslata! Javićemo Vam se uskoro." });
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error(error);
      setStatus({
        ok: false,
        text: "Slanje poruke nije uspelo. Pokušajte ponovo ili nas pozovite telefonom.",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 6000);
    }
  };

  return (
    
    <div
      className="w-full relative"
      style={{
        backgroundImage: "url('/contacts/contact-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        
      }}
    >
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative min-h-screen pb-22 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto px-6 pt-28 md:pt-20">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              Kontaktirajte nas
            </h2>
            <p className="text-lg text-white/90 drop-shadow-md">
              Imate pitanja? Pošaljite nam poruku! 😊
            </p>
          </div>

          {/* Contact Form Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 md:p-10 shadow-2xl border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-white font-semibold mb-2 text-lg">
                  Unesite Vaš email:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Vaš@email.com"
                  className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 border-2 border-transparent focus:border-blue-400 focus:outline-none transition-all"
                />
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-white font-semibold mb-2 text-lg">
                  Unesite Vašu poruku:
                </label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Vaša poruka..."
                  className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 border-2 border-transparent focus:border-blue-400 focus:outline-none transition-all resize-none"
                  rows="5"
                  maxLength={5000}
                />
              </div>


              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Slanje...
                  </span>
                ) : (
                  "Pošaljite poruku"
                )}
              </button>

              {/* Status Message */}
              {status && (
                <div
                  role="status"
                  className={`text-center p-4 rounded-lg font-semibold ${
                    status.ok
                      ? "bg-green-500/20 text-green-100 border border-green-400/50"
                      : "bg-red-500/20 text-red-100 border border-red-400/50"
                  }`}
                >
                  {status.text}
                </div>
              )}
            </form>
          </div>

            
              

          {/* Additional Contact Info - Now using Environment Variable */}
          <div className="mt-8 text-center text-white/80 text-sm [text-shadow:_2px_2px_12px_rgba(0,0,0,1)]">

            <p className="drop-shadow-md">
              Možete nam poslati poruku i na našu email adresu: {" "}
              <a 
                href={`mailto:${SITE.email}`}
                className="underline hover:text-white transition-colors"
              >
                {SITE.email}
              </a>
            </p>
              <br />
            <p className="drop-shadow-md">
              Takođe nas možete kontaktirati preko telefona: {" "}
              <a 
                href={SITE.phoneLink}
                className="underline hover:text-white transition-colors"
              >
                {SITE.phoneDisplay}
              </a>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}