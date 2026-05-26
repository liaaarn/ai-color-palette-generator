// menghitung jarak euclidean antara 2 warna rgb
// a dan b berbentu array: [R, G, B]
export function distance(a, b) {
  return Math.sqrt(
    (a[0] - b[0]) ** 2 + // selisih red dipangkatkan 2
      (a[1] - b[1]) ** 2 + // selisih green dipangkatkan 2
      (a[2] - b[2]) ** 2, // selisih blue dipangkatkan 2
  );
}

// menghitung rata-rata total warna dari sekumpulan titik warna
// points = kumpulan array rgb
export function average(points) {
  let sum = [0, 0, 0]; // menyimpan total nilai rgb
  // menjumlahkan semua nilai rgb
  points.forEach((p) => {
    sum[0] += p[0]; // total red
    sum[1] += p[1]; // total green
    sum[2] += p[2]; // total blue
  });
  // membagi total dengan jumlah data untuk mendapatkan rata-rata
  return sum.map((v) => Math.round(v / points.length));
}

// menghitung tingkat saturasi warna
// semakin besar nilainya, warna semakin mencolok
export function saturation(color) {
  // normalisasi rgb ke rentang 0-1
  const r = color[0] / 255;
  const g = color[1] / 255;
  const b = color[2] / 255;
  // mencari nilai terbesar dan terkecil
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  // selisih max dan min = tingkat saturasi sederhana
  return max - min;
}

// menghitung tingkat kecerahan warna
// menggunakan rata-rata rgb
export function brightness(color) {
  return (color[0] + color[1] + color[2]) / 3;
}

// algoritma kmeans untuk clustering warna
export function kmeans(data, k, maxIterations = 25) {
  // menyimpan centroid (pusat cluster)
  let centroids = [];

  // menyimpan kelompok warna
  let groups = [];

  // memilih centroid awal secara random
  for (let i = 0; i < k; i++) {
    centroids.push(data[Math.floor(Math.random() * data.length)]);
  }

  // proses iterasi kmeans
  for (let iter = 0; iter < maxIterations; iter++) {
    // membuat array kelompom sebanyak k cluster
    groups = Array.from({ length: k }, () => []);

    // mengelompokkan setiap warna ke centroid terdekat
    data.forEach((point) => {
      let minDist = Infinity; // jarang minimum sementara
      let index = 0; // indeks centroid terdekat

      // mengecek jarak ke semua centroid
      centroids.forEach((c, i) => {
        const d = distance(point, c);
        // jika kebih dekat, simpan
        if (d < minDist) {
          minDist = d;
          index = i;
        }
      });

      // meauskkan warna ke cluster terdekat
      groups[index].push(point);
    });

    // menghitung centroid baru dari setiap cluster
    centroids = groups.map((group) => {
      // jika cluster kosong, ambil warna random
      if (group.length === 0) {
        return data[Math.floor(Math.random() * data.length)];
      }
      // jika ada isi, hitung rata-rata warna
      return average(group);
    });
  }

  // membuat hasil akhir cluster
  let result = centroids.map((c, i) => ({
    color: c, // warna centroid
    count: groups[i].length, // jumlah anggota cluster
    sat: saturation(c), // tingkat saturasi
    bright: brightness(c), // tingkat kecerahan
  }));

  // mengurutkan warna berdasarkan 70% jmlh kemunculan dan 30% saturasi warna
  result.sort(
    (a, b) =>
      b.count * 0.7 + b.sat * 100 * 0.3 - (a.count * 0.7 + a.sat * 100 * 0.3),
  );

  // mengembalikan hasil cluster
  return {
    centroids: result,
    groups,
  };
}

// memilih warna paling penting dari hasil clustering
export function selectImportantColors(colors, total) {
  // menyimpan warna terpilih
  const selected = [];

  // mengurutkan warna berdarakan kombinasi saturasi + jumlah kemunculan
  const sorted = [...colors].sort(
    (a, b) =>
      b.sat * 0.5 +
      (b.count / colors[0].count) * 0.5 -
      (a.sat * 0.5 + (a.count / colors[0].count) * 0.5),
  );

  // memilih warna yang cukup berbeda satu sama lain
  for (const entry of sorted) {
    // mengecek apakah jaraknya cukup jauh
    const isFarEnough = selected.every((c) => distance(c, entry.color) > 60);
    // jika berbeda jauh, tambah
    if (isFarEnough) selected.push(entry.color);
    // berhenti jika jumlah sudah cukup
    if (selected.length >= total) break;
  }

  // jika warna belum cukup, tambahkan warna yang mirip tapi bukan duplikat
  if (selected.length < total) {
    for (const entry of sorted) {
      // hindari warna terlalu mirip
      const notDuplicate = selected.every((c) => distance(c, entry.color) > 20);
      // tambah warna
      if (notDuplicate) selected.push(entry.color);
      // stop jika cukup
      if (selected.length >= total) break;
    }
  }

  // mengembalikan jumlah warna sesuai permintaan
  return selected.slice(0, total);
}
