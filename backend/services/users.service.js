const UsersRepository = require('../repositories/users.repository');
const bcrypt = require('bcrypt');

class UsersService {
    static async getUsers(searchKeyword){
        if (searchKeyword){
            return await UsersRepository.searchEngine(searchKeyword);
        } else {
            return await UsersRepository.findAll();
        }
    }

    static async createUser(data){
        if (!data.username || !data.email || !data.password || !data.role){
            throw new Error("Username, email, password, dan role wajib diisi");
        }

        const existingUsers = await UsersRepository.findByUsernameOrEmail(data.username, data.email);
        if (existingUsers.length > 0){
            throw new Error("Username atau email sudah terdaftar");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const userData = {
            username: data.username,
            email: data.email,
            password: hashedPassword,
            role: data.role
        }

        return await UsersRepository.create(userData);
    }

    static async update(id, data){
        if (!id){
            throw new Error("ID user tidak valid");
        }

        if (!data.username || !data.email || !data.role){
            throw new Error("Username, email, dan role wajib diisi");
        }

        const updateResult = await UsersRepository.update(id, data);

        if (updateResult.affectedRows === 0){
            throw new Error("User tidak ditemukan dan gagal update data");
        }

        return updateResult;
    }

    static async delete(id){
        if (!id){
            throw new Error("ID user tidak valid");
        }

        const deleteResult = await UsersRepository.delete(id);

        if (deleteResult.affectedRows === 0){
            throw new Error("User tidak ditemukan dan gagal menghapus data");
        }

        return deleteResult;
    }

    static async updatePassword(id, newPassword){
        if (!id){
            throw new Error("ID user tidak valid");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatePasswordResult = await UsersRepository.updatePassword(id, hashedPassword);

        if (updatePasswordResult.affectedRows === 0){
            throw new Error("User tidak ditemukan dan gagal mengupdate password");
        }

        return updatePasswordResult;
    }
}

module.exports = UsersService;