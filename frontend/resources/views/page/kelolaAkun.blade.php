@extends('layout.kelolaAkunLayout')

@section('content')
<div class="content">
    <div class="d-flex justify-content-between align-items-center mb-3" style="margin-bottom: 20px;">
        <div class="header-tools">
            <div class="left-section">
                <button class="btn-tambah" onclick="openModal('modal-tambah')">
                    + Tambah Data
                </button>
            </div>

            <div class="right-section">
                <form id="form-search" class="search-box">
                    <input type="text"
                        id="search-input"
                        placeholder="Cari Data..."
                        autocomplete="off">
                    <button type="submit">
                        <i class="fas fa-search"></i>
                    </button>
                </form>
            </div>
        </div>
    </div>

    <div class="table-container">
        <table width="100%" border="1" style="border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="padding: 10px;">Username</th>
                    <th style="padding: 10px;">Email</th>
                    <th style="padding: 10px;">Role</th>
                    <th style="padding: 10px;">Aksi</th>
                </tr>
            </thead>
            <tbody id="data-pengguna-body">

            </tbody>
        </table>
    </div>

    <div class="table-footer" style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
        <span class="page-info" id="page-info" style="font-size: 14px; color: #555;"></span>

        <div class="pagination-buttons" id="pagination-container" style="display: flex; gap: 5px;">
        </div>
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
                <label>Username</label>
                <input type="text" id="tambah-username" required placeholder="Masukkan username">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="tambah-email" required placeholder="Masukkan email">
            </div>
            <div class="form-group">
                <label>Role</label>
                <select id="tambah-role">
                    <option value="Admin">Admin</option>
                    <option value="Kurir">Kurir</option>
                </select>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="tambah-password" required placeholder="Masukkan kata sandi">
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn-aksi btn-simpan">Simpan</button>
                <button type="button" class="btn-aksi btn-batal" onclick="closeModal('modal-tambah')">Batal</button>
            </div>
        </form>
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
                <label>Username</label>
                <input type="text" id="edit-username" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="edit-email" required>
            </div>
            <div class="form-group">
                <label>Role</label>
                <select id="edit-role">
                    <option value="Admin">Admin</option>
                    <option value="Kurir">Kurir</option>
                </select>
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn-aksi btn-simpan">Update</button>
                <button type="button" class="btn-aksi btn-batal" onclick="closeModal('modal-edit')">Batal</button>
            </div>
        </form>
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
            <p>User: <strong id="password-user-email"></strong></p>
            <div class="form-group">
                <label>Password Baru</label>
                <input type="password" id="password-baru" required placeholder="Password baru">
            </div>
            <div class="form-group">
                <label>Konfirmasi Password</label>
                <input type="password" id="password-konfirmasi" required placeholder="Ulangi password">
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn-aksi btn-simpan">Ubah</button>
                <button type="button" class="btn-aksi btn-batal" onclick="closeModal('modal-password')">Batal</button>
            </div>
        </form>
    </div>
</div>
@endsection