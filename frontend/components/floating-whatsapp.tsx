export default function FloatingWhatsApp() {
  const phone = "7652002886";
  const message = `Hello Solar Compare Team,

I would like to know more about your solar solutions, pricing, installation process and available government subsidies.

Please assist me.

Thank you.`;
  const href = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Solar Compare on WhatsApp"
      title="Chat with Solar Compare on WhatsApp"
      className="fixed bottom-6 right-6 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full border border-emerald-300/30 bg-[#1f8f4d]/40 text-white backdrop-blur-xl shadow-[0_14px_34px_rgba(10,80,46,0.42)] ring-1 ring-white/20 transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#1f8f4d]/52 hover:shadow-[0_18px_42px_rgba(10,80,46,0.52)]"
    >
      <span className="sr-only">Open WhatsApp chat</span>
      <span aria-hidden className="absolute -inset-1 rounded-full bg-emerald-400/10 opacity-60 animate-pulse" />
      <svg viewBox="0 0 32 32" aria-hidden className="h-7 w-7 fill-current">
        <path d="M19.11 17.17c-.27-.13-1.58-.78-1.82-.87-.24-.09-.42-.13-.6.13-.18.27-.69.87-.85 1.04-.16.18-.31.2-.58.07-.27-.13-1.14-.42-2.17-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.41.12-.54.12-.12.27-.31.4-.47.13-.16.18-.27.27-.45.09-.18.04-.33-.02-.47-.07-.13-.6-1.45-.82-1.98-.22-.53-.44-.46-.6-.47h-.51c-.18 0-.47.07-.71.33-.24.27-.91.89-.91 2.17 0 1.27.93 2.5 1.05 2.67.13.18 1.81 2.76 4.39 3.88.61.27 1.09.43 1.46.55.61.2 1.16.17 1.59.1.49-.07 1.58-.65 1.8-1.27.22-.62.22-1.16.16-1.27-.07-.11-.24-.18-.51-.31z" />
        <path d="M16 3C8.83 3 3 8.83 3 16c0 2.27.59 4.49 1.7 6.45L3 29l6.75-1.67A12.95 12.95 0 0 0 16 29c7.17 0 13-5.83 13-13S23.17 3 16 3zm0 23.64c-2.04 0-4.04-.55-5.78-1.59l-.41-.24-4 .99 1.07-3.89-.27-.4a10.66 10.66 0 0 1-1.66-5.51C4.95 10.02 9.7 5.27 16 5.27S27.05 10.02 27.05 16 22.3 26.64 16 26.64z" />
      </svg>
    </a>
  );
}
