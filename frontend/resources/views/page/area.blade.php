@extends('layout.pendaftaranAreaLayout')

@section('title', 'Pendaftaran Area')

@section('header')
Pendaftaran Area
@endsection

@section('content')
<div style="margin-bottom: 20px;">
    <button class="btn-tambah" onclick="openAddAreaModal()">+ Tambah Area</button>
</div>

<div class="table-container">
    <h4 style="margin: 15px;">Menunggu Persetujuan</h4>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Jalan</th>
                <th>Kecamatan</th>
                <th>Kota</th>
                <th>Kelurahan</th>
                <th>Provinsi</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody id="pendingAreaTable"></tbody>
    </table>
</div>

<div class="table-container" style="margin-top: 25px;">
    <h4 style="margin: 15px;">Riwayat Area</h4>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Jalan</th>
                <th>Kecamatan</th>
                <th>Kota</th>
                <th>Kelurahan</th>
                <th>Provinsi</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody id="registeredAreaTable"></tbody>
    </table>
</div>

<!-- Modal Add Area -->
<!-- Modal Add Area -->
<div id="addAreaModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Tambah Area Baru</h2>
            <span class="btn-tutup" onclick="closeAddAreaModal()">&times;</span>
        </div>
        <div class="modal-body">
            <form id="addAreaForm">
                <div class="form-group">
                    <label>Kecamatan</label>
                    <input type="text" id="kecamatan" placeholder="Masukkan kecamatan" required>
                </div>
                <div class="form-group">
                    <label>Kelurahan</label>
                    <input type="text" id="kelurahan" placeholder="Masukkan kelurahan" required>
                </div>
                <div class="form-group">
                    <label>Kota</label>
                    <input type="text" id="kota" placeholder="Masukkan kota" required>
                </div>
                <div class="form-group">
                    <label>Provinsi</label>
                    <input type="text" id="provinsi" placeholder="Masukkan provinsi" required>
                </div>
                <div class="form-group">
                    <label>Jalan</label>
                    <input type="text" id="jalan" placeholder="Masukkan nama jalan" required>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-aksi btn-batal" onclick="closeAddAreaModal()">Batal</button>
                    <button type="submit" class="btn-aksi btn-simpan">Simpan</button>
                </div>
            </form>
        </div>
    </div>
</div>


@endsection

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="{{ asset('js/daftarArea.js') }}"></script>
