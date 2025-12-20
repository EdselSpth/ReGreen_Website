const VideoRepository = require("../repositories/video.repository");

class VideoService {
  static async getAll() {
    return await VideoRepository.findAll();
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
