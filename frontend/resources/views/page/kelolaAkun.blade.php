@extends('layout.kelolaAkunLayout')

@section('content')
    <div class="content">
        <button class="btn-tambah" onclick="openModal('modal-tambah')">+ Tambah Data</button>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody id="data-pengguna-body"></tbody>
            </table>
        </div>

        <div class="table-footer">
            <span class="page-info" id="page-info"></span>
            <div class="pagination" id="pagination"></div>
        </div>
    </div>

    <div class="modal" id="modal-tambah">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Tambah Pengguna Baru</h2>
                <span class="btn-tutup" onclick="closeModal('modal-tambah')">&times;</span>
            </div>
            <form class="modal-body" id="form-tambah">
                <div class="form-group">
                    <label for="tambah-username">Username</label>
                    <input type="text" id="tambah-username" required placeholder="Masukkan username">
                </div>
                <div class="form-group">
                    <label for="tambah-email">Email</label>
                    <input type="email" id="tambah-email" required placeholder="Masukkan email">
                </div>
                <div class="form-group">
                    <label for="tambah-role">Role</label>
                    <select id="tambah-role">
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                        <option value="Kurir">Kurir</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="tambah-password">Password</label>
                    <input type="password" id="tambah-password" required placeholder="Masukkan kata sandi">
                </div>
            </form>
            <div class="modal-footer">
                <button type="submit" form="form-tambah" class="btn-aksi btn-simpan">Simpan</button>
                <button type="button" class="btn-aksi btn-batal" onclick="closeModal('modal-tambah')">Batal</button>
            </div>
        </div>
    </div>

    <div class="modal" id="modal-edit">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Edit Pengguna</h2>
                <span class="btn-tutup" onclick="closeModal('modal-edit')">&times;</span>
            </div>
            <form class="modal-body" id="form-edit">
                <input type="hidden" id="edit-user-id">
                <div class="form-group">
                    <label for="edit-username">Username</label>
                    <input type="text" id="edit-username" required>
                </div>
                <div class="form-group">
                    <label for="edit-email">Email</label>
                    <input type="email" id="edit-email" required>
                </div>
                <div class="form-group">
                    <label for="edit-role">Role</label>
                    <select id="edit-role">
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                        <option value="Kurir">Kurir</option>
                    </select>
                </div>
            </form>
            <div class="modal-footer">
                <button type="submit" form="form-edit" class="btn-aksi btn-simpan">Update</button>
                <button type="button" class="btn-aksi btn-batal" onclick="closeModal('modal-edit')">Batal</button>
            </div>
        </div>
    </div>

    <div class="modal" id="modal-password">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Ubah Password</h2>
                <span class="btn-tutup" onclick="closeModal('modal-password')">&times;</span>
            </div>
            <form class="modal-body" id="form-password">
                <input type="hidden" id="password-user-id">
                <p>Mengubah password untuk: <strong id="password-user-email"></strong></p>
                <div class="form-group">
                    <label for="password-baru">Password Baru</label>
                    <input type="password" id="password-baru" required placeholder="Masukkan password baru anda">
                </div>
                <div class="form-group">
                    <label for="password-konfirmasi">Konfirmasi Password</label>
                    <input type="password" id="password-konfirmasi" required placeholder="Konfirmasi password baru anda">
                </div>
            </form>
            <div class="modal-footer">
                <button type="submit" form="form-password" class="btn-aksi btn-simpan">Ubah</button>
                <button type="button" class="btn-aksi btn-batal">Batal</button>
            </div>
        </div>
    </div>

@endsection