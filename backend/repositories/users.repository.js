const db = require("../config/db");

class usersRepository{
    static findAll(limit, offset) {
        return new Promise((resolve, reject) =>{
            const sql = "SELECT id, username, email, role FROM users ORDER BY username ASC LIMIT ? OFFSET ?";
            db.query(sql, [limit, offset], (err, rows) => {
                if (err){
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static countAll() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT COUNT(*) as total FROM users";
            db.query(sql, (err, rows) => {
                if (err){
                    reject(err);
                } else {
                    resolve(rows[0].total);
                }
            });
        });
    }

    static searchEngine(keyword, limit, offset) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT id, username, email, role FROM users WHERE username LIKE ? OR email LIKE ? ORDER BY username ASC LIMIT ? OFFSET ?";
            const searchKeyword = `%${keyword}%`;
            
            db.query(sql, [searchKeyword, searchKeyword, limit, offset], (err, rows) => {
                if (err){
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static countSearch(keyword) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT COUNT(*) as total FROM users WHERE username LIKE ? OR email LIKE ?";
            const searchKeyword = `%${keyword}%`;

            db.query(sql, [searchKeyword, searchKeyword], (err, rows) => {
                if (err){
                    reject(err);
                } else {
                    resolve(rows[0].total);
                }
            });
        });
    }

    static findByUsernameOrEmail(username, email) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT id FROM users WHERE username = ? OR email = ?";
            
            db.query(sql, [username, email], (err, rows) => {
                if (err) {
                    reject(err);
                }else {
                    resolve(rows)
                };
            });
        });
    }

    static create(data){
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
            db.query(sql, [data.username, data.email, data.password, data.role], 
                (err, result) => {
                if (err){
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static update(id, data){
        return new Promise((resolve, reject) => {
            const sql = "UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?";
            db.query(sql, [data.username, data.email, data.role, id], 
                (err, result) =>{
                if (err){
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static delete(id){
        return new Promise((resolve, reject)=> {
            const sql = "DELETE FROM users WHERE id = ?";
            db.query(sql, [id], (err, result) => {
                if (err){
                    reject(err);
                } else {
                    resolve(result);
                }
            }); 
        })
    }

    static updatePassword(id, newPassword) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE users SET password = ? WHERE id = ?";
            db.query(sql, [newPassword, id], (err, result) => {
                if (err){
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

}

module.exports = usersRepository;