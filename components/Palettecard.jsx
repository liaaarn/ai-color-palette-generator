"use client";

export default function PaletteCard({ hex }) {
  const copyColor = () => {
    navigator.clipboard.writeText(hex);

    alert(`Copied ${hex}`);
  };

  return (
    <div
      onClick={copyColor}
      className="rounded-3xl h-36 cursor-pointer hover:scale-105 transition-all flex items-end justify-center pb-4 font-bold shadow-2xl"
      style={{
        background: hex,
      }}
    >
      {hex}
    </div>
  );
}
