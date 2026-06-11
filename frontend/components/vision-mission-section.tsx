"use client";

import { useLocale } from "@/components/locale-provider";

export default function VisionMissionSection() {
  const { locale } = useLocale();
  const isHindi = locale === "hi";

  return (
    <section className="mx-auto mt-16 w-full max-w-7xl px-4 md:px-8">
      <div className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-linear-to-br from-white via-emerald-50/45 to-sky-50/55 p-6 shadow-[0_24px_58px_rgba(15,23,42,0.12)] md:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-200/45 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-sky-200/45 blur-3xl" />

        <div className="vm-orb vm-orb-a" />
        <div className="vm-orb vm-orb-b" />
        <div className="vm-orb vm-orb-c" />
        <div className="vm-spark vm-spark-a" />
        <div className="vm-spark vm-spark-b" />
        <div className="vm-spark vm-spark-c" />

        <div className="relative z-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-4xl">{isHindi ? "✨ हमारी दृष्टि और मिशन" : "✨ Our Vision & Mission"}</h2>
        </div>

        <div className="relative z-10 mt-8 space-y-5 md:mt-10 md:space-y-0">
          <article className="vision-wrap bubble-wrap">
            <div className="bubble-shell bubble-shell-vision">
              <div className="bubble-core bubble-core-vision">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">🚀 {isHindi ? "दृष्टि" : "Vision"}</p>
                <p className="mt-4 text-sm leading-7 text-slate-700 md:text-base md:leading-8">
                  {isHindi
                    ? "प्रौद्योगिकी, पारदर्शिता और भरोसेमंद सोलर समाधानों के माध्यम से भारत के स्वच्छ ऊर्जा परिवर्तन को गति देना।"
                    : "To accelerate India's transition to clean energy through technology, transparency, and trusted solar solutions."}
                </p>
              </div>
            </div>
          </article>

          <article className="mission-wrap bubble-wrap">
            <div className="bubble-shell bubble-shell-mission">
              <div className="bubble-core bubble-core-mission">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">⚡ {isHindi ? "मिशन" : "Mission"}</p>
                <p className="mt-4 text-sm leading-7 text-slate-700 md:text-base md:leading-8">
                  {isHindi
                    ? "एक ही डिजिटल प्लेटफ़ॉर्म पर सत्यापित विक्रेताओं, पारदर्शी मूल्य, सब्सिडी सहायता, फाइनेंसिंग और ऊर्जा प्रबंधन समाधानों के साथ सोलर अपनाने को आसान बनाना।"
                    : "To simplify solar adoption by connecting consumers with verified vendors, transparent pricing, subsidy support, financing, and energy management solutions through a single digital platform."}
                </p>
              </div>
            </div>
          </article>
        </div>

        <style jsx>{`
          .bubble-wrap {
            position: relative;
            transition: transform 280ms ease;
          }

          .vision-wrap {
            width: min(94%, 760px);
            margin-right: auto;
          }

          .mission-wrap {
            width: min(95%, 790px);
            margin-left: auto;
          }

          .bubble-shell {
            position: relative;
            border-radius: 40% 36% 38% 34% / 34% 42% 36% 40%;
            padding: 1px;
            backdrop-filter: blur(10px);
            transition: transform 280ms ease, box-shadow 280ms ease, filter 280ms ease;
          }

          .bubble-shell-vision {
            background: linear-gradient(130deg, rgba(16, 185, 129, 0.45), rgba(125, 211, 252, 0.34), rgba(236, 253, 245, 0.45));
            box-shadow: 0 14px 38px rgba(16, 185, 129, 0.2);
          }

          .bubble-shell-mission {
            background: linear-gradient(130deg, rgba(125, 211, 252, 0.42), rgba(148, 163, 184, 0.24), rgba(16, 185, 129, 0.32));
            box-shadow: 0 14px 38px rgba(14, 165, 233, 0.18);
          }

          .bubble-core {
            position: relative;
            display: flex;
            min-height: 210px;
            flex-direction: column;
            justify-content: center;
            border-radius: 40% 36% 38% 34% / 34% 42% 36% 40%;
            border: 1px solid rgba(255, 255, 255, 0.6);
            background: rgba(255, 255, 255, 0.62);
            padding: 1.5rem 1.6rem;
            text-align: center;
            backdrop-filter: blur(16px);
            transition: background-color 280ms ease, border-color 280ms ease;
          }

          .bubble-core::after {
            content: "";
            position: absolute;
            width: 40px;
            height: 28px;
            border: 1px solid rgba(255, 255, 255, 0.6);
            background: rgba(255, 255, 255, 0.62);
            backdrop-filter: blur(16px);
            clip-path: polygon(0 8%, 100% 0, 82% 100%, 18% 100%);
          }

          .bubble-core-vision::after {
            left: 14%;
            bottom: -20px;
            transform: rotate(11deg);
          }

          .bubble-core-mission::after {
            right: 14%;
            bottom: -20px;
            transform: rotate(-12deg);
          }

          .bubble-wrap:hover .bubble-shell {
            transform: translateY(-6px);
            filter: saturate(1.06);
          }

          .bubble-wrap:hover .bubble-shell-vision {
            box-shadow: 0 24px 56px rgba(16, 185, 129, 0.24);
          }

          .bubble-wrap:hover .bubble-shell-mission {
            box-shadow: 0 24px 56px rgba(14, 165, 233, 0.24);
          }

          .bubble-wrap:hover .bubble-core {
            border-color: rgba(255, 255, 255, 0.88);
            background: rgba(255, 255, 255, 0.72);
          }

          .vm-orb,
          .vm-spark {
            pointer-events: none;
            position: absolute;
            border-radius: 9999px;
            animation: vmFloat 7s ease-in-out infinite;
          }

          .vm-orb-a {
            width: 14px;
            height: 14px;
            left: 8%;
            top: 26%;
            background: rgba(16, 185, 129, 0.45);
          }

          .vm-orb-b {
            width: 18px;
            height: 18px;
            right: 9%;
            top: 28%;
            background: rgba(14, 165, 233, 0.4);
            animation-delay: 0.55s;
          }

          .vm-orb-c {
            width: 10px;
            height: 10px;
            right: 28%;
            bottom: 12%;
            background: rgba(16, 185, 129, 0.38);
            animation-delay: 1.1s;
          }

          .vm-spark {
            box-shadow: 0 0 16px rgba(255, 255, 255, 0.65);
          }

          .vm-spark-a {
            width: 4px;
            height: 4px;
            left: 21%;
            top: 16%;
            background: rgba(255, 255, 255, 0.95);
            animation-duration: 5.5s;
          }

          .vm-spark-b {
            width: 5px;
            height: 5px;
            right: 18%;
            top: 54%;
            background: rgba(236, 253, 245, 0.95);
            animation-delay: 0.75s;
            animation-duration: 6.2s;
          }

          .vm-spark-c {
            width: 3px;
            height: 3px;
            left: 46%;
            bottom: 16%;
            background: rgba(240, 249, 255, 0.95);
            animation-delay: 1.2s;
            animation-duration: 5.8s;
          }

          @keyframes vmFloat {
            0%,
            100% {
              transform: translateY(0px) translateX(0px);
            }
            50% {
              transform: translateY(-10px) translateX(4px);
            }
          }

          @media (min-width: 768px) {
            .vision-wrap {
              transform: translateX(-1.2rem);
            }

            .mission-wrap {
              margin-top: -2.1rem;
              transform: translateX(1.5rem);
            }

            .bubble-core {
              min-height: 238px;
              padding: 1.85rem 2.2rem;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
