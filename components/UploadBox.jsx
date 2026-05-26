"use client";

export default function UploadBox({ handleImage }) {
  return (
    <div className="border-2 border-dashed border-pink-500 p-10 rounded-3xl text-center hover:bg-slate-800 transition">
      <input type="file" accept="image/*" onChange={handleImage} />
    </div>
  );
}
