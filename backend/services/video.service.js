const VideoRepository = require("../repositories/video.repository");

class VideoService {
  static async getAll(searchKeyword, page, limit) {
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 10;
    const offset = (currentPage - 1) * itemsPerPage;

    let videos;
    let totalItems;

    if (searchKeyword) {
      videos = await VideoRepository.searchEngine(searchKeyword, itemsPerPage, offset);
      totalItems = await VideoRepository.countSearch(searchKeyword);
    } else {
      videos = await VideoRepository.findAll(itemsPerPage, offset);
      totalItems = await VideoRepository.countAll();
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
      data: videos,
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

    const video = await VideoRepository.findById(id);
    if (!video) throw new Error("Video tidak ditemukan");

    return video;
  }

  static async create(data) {
    if (!data.nama_video || !data.link_youtube) {
      throw new Error("nama_video dan link_youtube wajib diisi");
    }

    return await VideoRepository.create(data);
  }

  static async update(id, data) {
    if (!id) throw new Error("ID wajib diisi");

    const result = await VideoRepository.update(id, data);
    if (result.affectedRows === 0) {
      throw new Error("Video tidak ditemukan");
    }
  }

  static async delete(id) {
    if (!id) throw new Error("ID wajib diisi");

    const result = await VideoRepository.delete(id);
    if (result.affectedRows === 0) {
      throw new Error("Video tidak ditemukan");
    }
  }
}

module.exports = VideoService;
