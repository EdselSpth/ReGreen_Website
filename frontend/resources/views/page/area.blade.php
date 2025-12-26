@extends('layout.pendaftaranAreaLayout')

@section('title', 'Pendaftaran Area')

@section('header')
Pendaftaran Area
@endsection

@section('content')
<div style="margin-bottom: 20px;">
    <button class="btn-tambah" onclick="openAddAreaModal()">+ Tambah Area Baru</button>
</div>

<div class="table-container">
    <h4 style="margin: 15px; color: #000000ff;">1. Menunggu Persetujuan (User Baru)</h4>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Jalan</th>
                <th>Kecamatan</th>
                <th>Kota</th>
                <th>Kelurahan</th>
                <th>Provinsi</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody id="pendingAreaTable">
            </tbody>
    </table>
</div>

<div class="table-container" style="margin-top: 25px;">
    <h4 style="margin: 15px; color: #000000ff;">2. Riwayat Seluruh Area Terdaftar</h4>
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
        <tbody id="registeredAreaTable">
            </tbody>
    </table>
</div>

<div class="table-container" style="margin-top: 25px; border: 1px solid #27ae60;">
    <h4 style="margin: 15px; color: #000000ff;">3. Catatan Area yang Anda Tambahkan</h4>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Kecamatan</th>
                <th>Kelurahan</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody id="adminSimpleTable">
            </tbody>
    </table>
</div>

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
                <div class="modal-footer">
                    <button type="button" class="btn-aksi btn-batal" onclick="closeAddAreaModal()">Batal</button>
                    <button type="submit" class="btn-aksi btn-simpan">Simpan Area</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script src="{{ asset('js/daftarArea.js') }}"></script>

@endsection