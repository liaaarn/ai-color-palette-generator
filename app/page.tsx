"use client";

import { useRef, useState } from "react";

import Navbar from "@/components/Navbar";
import UploadBox from "@/components/UploadBox";
import PaletteCard from "@/components/Palettecard";
import KMeansChart from "@/components/KMeansChart";
import Loader from "@/components/Loader";
import Footer from "@/components/Footer";

import { kmeans, selectImportantColors } from "@/lib/kmeans";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);

  const [colors, setColors] = useState<number[][]>([]);

  const [datasetState, setDatasetState] = useState<number[][]>([]);

  const [clusters, setClusters] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // =========================
  // HANDLE IMAGE
  // =========================
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const imageSrc = event.target?.result as string;

      if (!imageSrc) return;

      setImage(imageSrc);

      processImage(imageSrc);
    };

    reader.readAsDataURL(file);
  };

  // =========================
  // PROCESS IMAGE
  // =========================
  const processImage = (src: string) => {
    setLoading(true);

    const img = new Image();

    img.src = src;

    img.onload = () => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      const SIZE = 300;

      canvas.width = SIZE;
      canvas.height = SIZE;

      ctx.drawImage(img, 0, 0, SIZE, SIZE);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const pixels = imageData.data;

      let dataset: number[][] = [];

      // sampling pixel supaya ringan
      for (let i = 0; i < pixels.length; i += 16) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        dataset.push([r, g, b]);
      }

      setDatasetState(dataset);

      // jalankan kmeans
      const result = kmeans(dataset, 18);

      // centroid
      setClusters(result.centroids);

      // palette final
      const finalColors = selectImportantColors(result.centroids, 5);

      setColors(finalColors);

      setLoading(false);
    };
  };

  // =========================
  // RGB TO HEX
  // =========================
  function rgbToHex(r: number, g: number, b: number) {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);

          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  }

  // =========================
  // ANALISIS DINAMIS
  // =========================
  function generateVisualizationExplanation() {
    if (datasetState.length === 0) return "";

    // rata-rata RGB
    const avgR =
      datasetState.reduce((sum, c) => sum + c[0], 0) / datasetState.length;

    const avgG =
      datasetState.reduce((sum, c) => sum + c[1], 0) / datasetState.length;

    const avgB =
      datasetState.reduce((sum, c) => sum + c[2], 0) / datasetState.length;

    // dominant color
    let dominant = "";

    if (avgR > avgG && avgR > avgB) {
      dominant = "merah";
    } else if (avgG > avgR && avgG > avgB) {
      dominant = "hijau";
    } else {
      dominant = "biru";
    }

    // brightness
    const brightness = (avgR + avgG + avgB) / 3;

    let tone = "";

    if (brightness > 180) {
      tone = "terang";
    } else if (brightness > 110) {
      tone = "sedang";
    } else {
      tone = "gelap";
    }

    // warm / cool
    let mood = "";

    if (avgR > avgB) {
      mood = "warm tone";
    } else {
      mood = "cool tone";
    }

    // variasi warna
    let variation = "";

    if (clusters.length >= 15) {
      variation =
        "Visualisasi menunjukkan persebaran warna yang sangat beragam dan kompleks.";
    } else if (clusters.length >= 10) {
      variation = "Visualisasi menunjukkan variasi warna yang cukup seimbang.";
    } else {
      variation = "Visualisasi menunjukkan warna yang cenderung homogen.";
    }

    // distribusi titik
    let distribution = "";

    const uniqueColors = new Set(
      datasetState.map((c) => `${c[0]}-${c[1]}-${c[2]}`),
    ).size;

    if (uniqueColors > 2000) {
      distribution =
        "Titik-titik pada scatter plot tersebar luas, menandakan gambar memiliki banyak kombinasi warna.";
    } else if (uniqueColors > 1000) {
      distribution =
        "Scatter plot menunjukkan distribusi warna yang cukup bervariasi.";
    } else {
      distribution =
        "Scatter plot menunjukkan distribusi warna yang relatif terpusat.";
    }

    return `
Visualisasi menunjukkan bahwa gambar didominasi oleh warna ${dominant}
dengan karakter warna ${tone} dan kecenderungan ${mood}.

${variation}

${distribution}

Setiap titik pada scatter plot merepresentasikan pixel gambar
berdasarkan nilai RGB, sedangkan centroid menunjukkan pusat cluster
warna yang dihasilkan oleh algoritma K-Means Clustering.

Proses clustering digunakan untuk mengelompokkan warna-warna yang
memiliki kemiripan sehingga menghasilkan palette warna utama dari gambar.
`;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* HERO */}
        <div className="mb-10">
          <div className="inline-block px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm text-purple-300 mb-5">
            AI Powered Dashboard
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight">
            Color Palette
            <span className="block text-purple-400">Generator</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg mt-5 max-w-2xl leading-relaxed">
            Upload images and extract dominant colors instantly using K-Means
            Clustering AI algorithm.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT PANEL */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upload */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold mb-4">Upload Image</h2>

              <UploadBox handleImage={handleImage} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-gray-400 text-sm">Colors Found</p>

                <h3 className="text-2xl sm:text-3xl font-bold mt-2">
                  {colors.length}
                </h3>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-gray-400 text-sm">AI Status</p>

                <h3 className="text-2xl sm:text-3xl font-bold mt-2 text-green-400">
                  Ready
                </h3>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-2 space-y-6">
            {/* PREVIEW */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl min-h-[250px] sm:min-h-[350px] flex items-center justify-center overflow-hidden">
              {!image ? (
                <p className="text-gray-500 text-lg">
                  Image preview will appear here
                </p>
              ) : (
                <img
                  src={image}
                  alt="preview"
                  className="rounded-3xl w-full max-h-[220px] sm:max-h-[500px] object-cover shadow-2xl"
                />
              )}
            </div>

            {/* LOADER */}
            {loading && (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <Loader />
              </div>
            )}

            {/* PALETTE */}
            {colors.length > 0 && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold">
                    Generated Palette
                  </h2>

                  <div className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-300 text-sm">
                    {colors.length} Colors
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5">
                  {colors.map((color, index) => {
                    const hex = rgbToHex(color[0], color[1], color[2]);

                    return <PaletteCard key={index} hex={hex} />;
                  })}
                </div>
              </div>
            )}

            {/* KMEANS */}
            {datasetState.length > 0 && clusters.length > 0 && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold">
                    K-Means Visualization
                  </h2>

                  <div className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-300 text-sm">
                    Scatter Plot
                  </div>
                </div>

                <div className="w-full overflow-x-auto">
                  <KMeansChart dataset={datasetState} centroids={clusters} />
                </div>
              </div>
            )}

            {/* ANALISIS */}
            {colors.length > 0 && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                <h2 className="text-xl sm:text-2xl font-bold mb-5">
                  Analisis Visualisasi
                </h2>

                <p className="text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg whitespace-pre-line">
                  {generateVisualizationExplanation()}
                </p>

                {/* STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-5">
                    <p className="text-gray-400 text-sm">Total Pixel</p>

                    <h3 className="text-2xl sm:text-3xl font-bold mt-2">
                      {datasetState.length}
                    </h3>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-5">
                    <p className="text-gray-400 text-sm">Jumlah Cluster</p>

                    <h3 className="text-2xl sm:text-3xl font-bold mt-2">
                      {clusters.length}
                    </h3>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-5">
                    <p className="text-gray-400 text-sm">Palette Akhir</p>

                    <h3 className="text-2xl sm:text-3xl font-bold mt-2">
                      {colors.length}
                    </h3>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </section>

      <Footer />
    </main>
  );
}
