const UsersRepository = require("../repositories/users.repository");
const bcrypt = require("bcrypt");

class UsersService {
  static async getUsers(searchKeyword, page, limit) {
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 10;
    const offset = (currentPage - 1) * itemsPerPage;

    let users;
    let totalItems;

    if (searchKeyword) {
      users = await UsersRepository.searchEngine(
        searchKeyword,
        itemsPerPage,
        offset
      );
      totalItems = await UsersRepository.countSearch(searchKeyword);
    } else {
      users = await UsersRepository.findAll(itemsPerPage, offset);
      totalItems = await UsersRepository.countAll();
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
      data: users,
      pagination: {
        total_data: totalItems,
        total_page: totalPages,
        current_page: currentPage,
        per_page: itemsPerPage,
      },
    };
  }

  static async createUser(data) {
    if (!data.username || !data.email || !data.password || !data.role) {
      throw new Error("Username, email, password, dan role wajib diisi");
    }

    const allowedRoles = ["Admin", "Kurir"];
    if (!allowedRoles.includes(data.role)) {
      throw new Error("Role tidak valid. Pilih: Admin atau Kurir");
    }

    const existingUsers = await UsersRepository.findByUsernameOrEmail(
      data.username,
      data.email
    );
    if (existingUsers.length > 0) {
      throw new Error("Username atau email sudah terdaftar");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userData = {
      username: data.username,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    };

    return await UsersRepository.create(userData);
  }

  static async update(id, data) {
    if (!id) {
      throw new Error("ID user tidak valid");
    }

    if (!data.username || !data.email || !data.role) {
      throw new Error("Username, email, dan role wajib diisi");
    }

    const updateResult = await UsersRepository.update(id, data);

    if (updateResult.affectedRows === 0) {
      throw new Error("User tidak ditemukan dan gagal update data");
    }

    return updateResult;
  }

  static async delete(id) {
    if (!id) {
      throw new Error("ID user tidak valid");
    }

    const deleteResult = await UsersRepository.delete(id);

    if (deleteResult.affectedRows === 0) {
      throw new Error("User tidak ditemukan dan gagal menghapus data");
    }

    return deleteResult;
  }

  static async updatePassword(id, newPassword) {
    if (!id) {
      throw new Error("ID user tidak valid");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatePasswordResult = await UsersRepository.updatePassword(
      id,
      hashedPassword
    );

    if (updatePasswordResult.affectedRows === 0) {
      throw new Error("User tidak ditemukan dan gagal mengupdate password");
    }

    return updatePasswordResult;
  }
  
}

module.exports = UsersService;
