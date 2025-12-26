const ArtikelRepository = require("../repositories/artikel.repository");

class ArtikelService {
  static async getAll(searchKeyword, page, limit) {
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 10;
    const offset = (currentPage - 1) * itemsPerPage;

    let artikels;
    let totalItems;

    if (searchKeyword) {
      artikels = await ArtikelRepository.searchEngine(searchKeyword, itemsPerPage, offset);
      totalItems = await ArtikelRepository.countSearch(searchKeyword);
    } else {
      artikels = await ArtikelRepository.findAll(itemsPerPage, offset);
      totalItems = await ArtikelRepository.countAll();
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
      data: artikels,
      pagination: {
        currentPage,
        itemsPerPage,
        totalItems,
        totalPages,
      },
    };
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