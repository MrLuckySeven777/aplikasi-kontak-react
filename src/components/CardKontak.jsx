export default function CardKontak({ orang, onHapus, onEdit, onToggleFavorit }) {
  return (
    <div className="bg-gray-800 text-white p-5 rounded-lg shadow-md flex justify-between items-center border border-gray-700 hover:border-gray-600 transition">
      <div>
        <div className="flex items-center gap-2 mb-1">
          {/* Tombol Bintang Favorit */}
          <button
            onClick={() => onToggleFavorit(orang.id)}
            className="text-xl hover:scale-125 transition: transform"
            title={orang.isFavorite ? "Hapus dari Favorit" : "Tambah ke Favorit"}
          >
            {orang.isFavorite ? "⭐" : "📅"}
          </button>
          <h3 className="text-xl font-bold text-green-400">{orang.name}</h3>
        </div>
        <p className="text-gray-300 text-sm my-1">📧 {orang.email}</p>
        <p className="text-gray-300 text-sm my-1">🏢 {orang.company?.name || orang.company}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => onEdit(orang)}
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-3 py-1.5 rounded transition text-sm"
          >
          ✏️ Edit
          </button>
          <button
          onClick={() => onHapus(orang.id)}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1.5 rounded transition text-sm"
          >
          🗑️ Hapus
          </button>
      </div>
    </div>
  );
}