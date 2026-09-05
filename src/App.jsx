import { useState, useEffect } from 'react';
import CardKontak from './components/CardKontak';
import toast, { Toaster } from 'react-hot-toast';

export default function App() {

  const [pengguna, setPengguna] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kataKunci, setKataKunci] = useState("");
  const [idHapus, setIdHapus] = useState(null);
  
  const [namaBaru, setNamaBaru] = useState("");
  const [emailBaru, setEmailBaru] = useState("");
  const [perusahaanBaru, setPerusahaanBaru] = useState("");
  const [idEdit, setIdEdit] = useState(null);

  const [tabAktif, setTabAktif] = useState("semua");
  const [urutan, setUrutan] = useState("a-z");

  const [halamanSekarang, setHalamanSekarang] = useState(1);
  const itemPerHalaman = 4;

  useEffect(() => {
    const dataTersimpan = localStorage.getItem("dataKontakPribadi");
    if (dataTersimpan) {
      setPengguna(JSON.parse(dataTersimpan));
      setLoading(false);
    } else {
      fetch('https://jsonplaceholder.typicode.com/users')
        .then((res) => res.json())
        .then((data) => {
          setPengguna(data);
          setLoading(false);
        });
    }
  }, []);

  const totalKontak = pengguna.length;
  const totalFavorit = pengguna.filter((p) => p.isFavorite).length;

  const totalPerusahaan = new Set(
    pengguna.map((p) => (typeof p.company === 'object' ? p.company?.name : p.company)).filter(Boolean)
  ).size;

  const tanganiExportData = () => {
    if (pengguna.length === 0) {
      toast.error("Tidak ada data kontak untuk di-export!");
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pengguna, null, 2));
    const elementDownload = document.createElement('a');
    elementDownload.setAttribute("href", dataStr);
    elementDownload.setAttribute("download", `backup_kontak_${Date.now()}.json`);
    document.body.appendChild(elementDownload);
    elementDownload.click();
    elementDownload.remove();
    toast.success("Data kontak berhasil di-export!");
  };

  const tanganiImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const pembacaFile = new FileReader();
    pembacaFile.onload = (event) => {
      try {
        const dataImpor = JSON.parse(event.target.result);
        if (Array.isArray(dataImpor)) {
          setPengguna(dataImpor);
          toast.success("Data kontak berhasil di-restore!");
        } else {
          toast.error("Format file JSON tidak valid!");
        }
      } catch {
        toast.error("Gagal membaca file JSON!");
      }
    };
    pembacaFile.readAsText(file);
  };

  useEffect(() => {
    if (pengguna.length > 0) {
      localStorage.setItem("dataKontakPribadi", JSON.stringify(pengguna));
    }
  }, [pengguna]);

  const tanganiSimpanKontak = (e) => {
    e.preventDefault();
    if (idEdit !== null) {
      const dataDiperbarui = pengguna.map((orang) => {
        if (orang.id === idEdit) {
          return { ...orang, name: namaBaru, email: emailBaru, company: { name: perusahaanBaru } };
        }
        return orang;
      });
      setPengguna(dataDiperbarui);
      setIdEdit(null);

      toast.success("Kontak berhasil diperbarui!");
    } else {
      const kontakBaru = {
        id: Date.now(),
        name: namaBaru,
        email: emailBaru,
        company: { name: perusahaanBaru },
      };
      setPengguna([kontakBaru, ...pengguna]);

      toast.success("Kontak berhasil ditambahkan!");
    }
    setNamaBaru("");
    setEmailBaru("");
    setPerusahaanBaru("");
    };

    const tanganiTombolEdit = (orang) => {
      setNamaBaru(orang.name);
      setEmailBaru(orang.email);
      setPerusahaanBaru(orang.company?.name || orang.company);
      setIdEdit(orang.id);
    };

    const tanganiBukaModalHapus = (id) => {
    setIdHapus(id);
  };

    const eksekusiHapus = () => {
      const penggunaSisa = pengguna.filter((orang) => orang.id !== idHapus);
      setPengguna(penggunaSisa);
      setIdHapus(null);

      toast.error("Kontak berhasil dihapus!");
    }

    const penggunaTersaring = pengguna
      .filter((orang) => orang.name.toLowerCase().includes(kataKunci.toLowerCase()))
      .filter((orang) => (tabAktif === "favorit" ? orang.isFavorite : true));

    const penggunaDiurutkan = [...penggunaTersaring].sort((a, b) => {
      if (urutan === "a-z") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

  const indeksTerakhir = halamanSekarang * itemPerHalaman;
  const indeksPertama = indeksTerakhir - itemPerHalaman;

  const kontakTampil = penggunaDiurutkan.slice(indeksPertama, indeksTerakhir);
  const totalHalaman = Math.ceil(penggunaDiurutkan.length / itemPerHalaman) || 1;

    const tanganiToggleFavorit = (id) => {
      const dataDiperbarui = pengguna.map((orang) => {
        if (orang.id == id) {
          const statusBaru = !orang.isFavorite;
          if (statusBaru) {
            toast.success(`${orang.name} ditambahkan ke Favorit! ⭐`);
          }
          return { ...orang, isFavorite: statusBaru };
        }
        return orang;
      });
      setPengguna(dataDiperbarui);
    };

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-xl">
          ⏳ Memuat data...
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
        <Toaster position="top-right" />

        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-extrabold text-blue-400 text-center mb-8">
            🌐 Daftar Kontak dari Internet
          </h1>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl text-center">
              <p className="text-gray-400 text-xs font-semibold uppercase">Total Kontak</p>
              <p className="text-2xl font-extrabold text-blue-400 mt-1">{totalKontak}</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl text-center">
              <p className="text-gray-400 text-xs font-semibold uppercase">Favorit</p>
              <p className="text-2xl font-extrabold text-yellow-400 mt-1">{totalFavorit}</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl text-center">
              <p className="text-gray-400 text-xs font-semibold uppercase">Perusahaan</p>
              <p className="text-2xl font-extrabold text-green-400 mt-1">{totalPerusahaan}</p>
            </div>
          </div>

          <form 
          onSubmit={tanganiSimpanKontak}
          className={`p-6 rounded-xl mb-6 shadow-lg border transition ${
            idEdit ? 'bg-gray-800 border-yellow-500' : 'bg-gray-800 border-gray-700'
          }`}
          >
            <h3 className="text-lg font-bold text-green-400 mb-4">
              {idEdit ? "✏️ Edit Data Kontak" : "➕ Tambah Kontak Baru"}
            </h3>

            <input
              required
              type="text"
              placeholder="Nama Lengkap"
              value={namaBaru}
              onChange={(e) => setNamaBaru(e.target.value)}
              className="w-full p-3 mb-3 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-400"
            />
            <input
              required
              type="email"
              placeholder="Alamat Email"
              value={emailBaru}
              onChange={(e) => setEmailBaru(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-400"
            />
            <input
              required
              type="text"
              placeholder="Nama Perusahaan"
              value={perusahaanBaru}
              onChange={(e) => setPerusahaanBaru(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-400"
            />

            <button
              type="submit"
              className={`w-full py-3 rounded font-bold transition ${
                idEdit
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {idEdit ? "Simpan Perubahan" : "Simpan Kontak"}
            </button>

            {idEdit && (
              <button
                type="button"
                onClick={() => {
                  setIdEdit(null);
                  setNamaBaru("");
                  setEmailBaru("");
                  setPerusahaanBaru("");
                }}
                className="w-full mt-2 py-2 text-gray-400 hover:text-white transition text-sm"
                >
                  Batal Edit
                </button>
            )}
          </form>

          <div className="flex justify-end gap-2 mb-6">
        <button
          onClick={tanganiExportData}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded transition"
        >
          📥 Export Data (JSON)
        </button>
        <label className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3 py-2 rounded transition cursor-pointer flex items-center">
          📤 Import Data (JSON)
          <input
            type="file"
            accept=".json"
            onChange={tanganiImportData}
            className="hidden"
          />
          </label> 
      </div>

          <input
            type="text"
            placeholder="🔍 Cari nama kontak..."
            value={kataKunci}
            onChange={(e) => setKataKunci(e.target.value)}
            className="w-full p-3 mb-6 bg-gray-700 text-white rounded-lg border-2 border-blue-400 focus:outline-none"
            />
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <div className="flex bg-gray-800 p-1 rounded-lg border border-gray-700 w-full sm:w-auto">
                  <button
                    onClick={() => setTabAktif("semua")}
                    className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition ${
                      tabAktif === "semua" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    ⭐ Favorit ({pengguna.filter((p) => p.isFavorite) .length})
                  </button>
                </div>

                <select
                  value={urutan}
                  onChange={(e) => setUrutan(e.target.value)}
                  className="bg-gray-800 text-white border border-gray-700 p-2 rounded-lg text-sm w-full sm:w-auto focus:outline-none"
                  >

                    <option value="a-z">🔤 Urutkan: A - Z</option>
                    <option value="z-a">🔤 Urutkan: Z - A</option>
                  </select>
              </div>
              
              <div className="flex flex-col gap-4">
                {kontakTampil.length > 0 ? (
                  kontakTampil.map((orang) => (
                    <CardKontak
                      key={orang.id}
                      orang={orang}
                      onHapus={tanganiBukaModalHapus}
                      onEdit={tanganiTombolEdit}
                      onToggleFavorit={tanganiToggleFavorit}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">❌ Tidak ada data kontak.</p>
                )}
              </div>

          <div className="flex flex-col gap-4">
            {penggunaTersaring.length > 0 ? (
              penggunaTersaring.map((orang) => (
                <CardKontak key={orang.id} orang={orang} onHapus={tanganiBukaModalHapus} onEdit={tanganiTombolEdit} />
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">❌ Tidak ada kontak dengan nama "{kataKunci}"</p>
            )}

            {idHapus !== null && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl max-w-sm w-full text-center shadow-2xl">
                  <div className="text-4xl mb-3">⚠️</div>
                  <h3 className="text-xl font-bold text-white mb-2">Konfirmasi Hapus</h3>
                  <p className="text-gray-300 text-sm mb-6">
                    Apakah Anda yakin ingin menghapus kontak ini? Tindakan ini tidak dapat dibatalkan.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setIdHapus(null)}
                      className="w-full py-2 bg-gray-600 hover:bg-gray-500 rounded text-white font-medium transition text-sm"
                    >
                      Batal
                    </button>
                    <button
                      onClick={eksekusiHapus}
                      className="w-full py-2 bg-red-600 hover:bg-red-700 rounded text-white font-medium transition text-sm"
                    >
                      Ya, Hapus
                    </button>
                  </div>
                </div>
              </div>
            )}

            {totalHalaman > 1 && (
                <div className="flex justify-between items-center mt-6 bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <button
                    disabled={halamanSekarang === 1}
                    onClick={() => setHalamanSekarang((prev) => prev - 1)}
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm rounded font-medium transition"
                  >
                    ⬅️ Sebelumnya
                  </button>

                  <span className="text-sm font-semibold text-gray-300">
                    Halaman {halamanSekarang} dari {totalHalaman}
                  </span>

                  <button
                    disabled={halamanSekarang === totalHalaman}
                    onClick={() => setHalamanSekarang((prev) => prev + 1)}
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm rounded font-medium transition"
                  >
                    Selanjutnya ➡️
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    );
  }