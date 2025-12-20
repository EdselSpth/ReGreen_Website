const ArtikelRepository = require("../repositories/artikel.repository");

class ArtikelService {
  static async getAll() {
    return await ArtikelRepository.findAll();
  }

  static async getById(id) {
    if (!id) throw new Error("ID wajib diisi");

    const artikel = await ArtikelRepository.findById(id);
    if (!artikel) throw new Error("Artikel tidak ditemukan");

    return artikel;
  }

  static async create(data) {
    if (!data.nama_artikel || !data.file_pdf) {
      throw new Error("nama_artikel dan file_pdf wajib diisi");
    }

    return await ArtikelRepository.create(data);
  }

  static async update(id, data) {
    if (!id) throw new Error("ID wajib diisi");

    const result = await ArtikelRepository.update(id, data);
    if (result.affectedRows === 0) {
      throw new Error("Artikel tidak ditemukan");
    }
  }

  static async delete(id) {
    if (!id) throw new Error("ID wajib diisi");

    const result = await ArtikelRepository.delete(id);
    if (result.affectedRows === 0) {
      throw new Error("Artikel tidak ditemukan");
    }
  }
}

module.exports = ArtikelService;
