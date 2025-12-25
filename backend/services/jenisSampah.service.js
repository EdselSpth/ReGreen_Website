const JenisSampahRepository = require("../repositories/jenisSampah.repository");

class JenisSampahService {
  static async getAll(searchKeyword, page, limit) {
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 10;
    const offset = (currentPage - 1) * itemsPerPage;

    let jenisSampah;
    let totalItems;
    if (searchKeyword) {
      jenisSampah = await JenisSampahRepository.searchEngine(
        searchKeyword,
        itemsPerPage,
        offset
      );
      totalItems = await JenisSampahRepository.countSearch(searchKeyword);
    } else {
      jenisSampah = await JenisSampahRepository.findAll(
        itemsPerPage,
        offset
      );
      totalItems = await JenisSampahRepository.countAll();
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    return {
      data: jenisSampah,
      pagination: {
        currentPage,
        itemsPerPage,
        totalItems,
        totalPages: Math.ceil(totalItems / itemsPerPage),
      },
    };
  }

  static async getById(id) {
    if (!id) throw new Error("ID wajib diisi");

    const data = await JenisSampahRepository.findById(id);
    if (!data) throw new Error("Jenis sampah tidak ditemukan");

    return data;
  }
  

  static async create(data) {
    if (!data.nama_jenis || !data.harga_per_kg) {
      throw new Error("nama_jenis dan harga_per_kg wajib diisi");
    }

    return await JenisSampahRepository.create(data);
  }

  static async update(id, data) {
    if (!id) throw new Error("ID wajib diisi");

    const result = await JenisSampahRepository.update(id, data);
    if (result.affectedRows === 0) {
      throw new Error("Jenis sampah tidak ditemukan");
    }
  }

  static async delete(id) {
    if (!id) throw new Error("ID wajib diisi");

    const result = await JenisSampahRepository.delete(id);
    if (result.affectedRows === 0) {
      throw new Error("Jenis sampah tidak ditemukan");
    }
  }
}

module.exports = JenisSampahService;
