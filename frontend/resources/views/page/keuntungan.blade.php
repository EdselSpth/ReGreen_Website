@extends('layout.keuntunganLayout')

@section('title', 'Manajemen Keuntungan')

@section('header')
PENARIKAN KEUNTUNGAN
@endsection

@section('content')
<div style="margin-bottom: 20px;">
    <button class="btn-tambah" onclick="openModal()">+ Tambah Penarikan</button>
</div>

<div class="table-container">
    <h4 style="margin: 15px;">Menunggu Persetujuan</h4>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama Pengguna</th>
                <th>Saldo Saat Ini</th>
                <th>Nominal Tarik</th>
                <th>No Rekening</th>
                <th>Metode</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody id="tableBody"></tbody>
    </table>
    <div id="paginationPending" class="pagination-container"></div>
</div>

<div class="table-container" style="margin-top:25px;">
    <h4 style="margin: 15px;">Riwayat Penarikan</h4>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama Pengguna</th>
                <th>Nominal</th>
                <th>No Rekening</th>
                <th>Metode</th>
                <th>Status</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody id="tableHistoryBody"></tbody>
    </table>
    <div id="paginationHistory" class="pagination-container"></div>
</div>
@endsection

@section('modal')
<div id="modalTambah" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Tambah Penarikan Baru</h2>
            <span class="btn-tutup" onclick="closeModal()">&times;</span>
        </div>
        <div class="modal-body">
            <form id="formTambah">
                <div class="form-group">
                    <label>Nama Pengguna</label>
                    <input type="text" id="nama_pengguna" placeholder="Masukkan nama" required>
                </div>
                <div class="form-group">
                    <label>Nominal (Min 20.000)</label>
                    <input type="number" id="nominal" placeholder="Contoh: 25000" required>
                </div>
                <div class="form-group">
                    <label>No Rekening (10-15 Digit)</label>
                    <input type="text" id="rekening" 
                           placeholder="Contoh: 1234567890" 
                           oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 15);" 
                           required>
                </div>
                <div class="form-group">
                    <label>Metode Pembayaran</label>
                    <select id="metode" required>
                        <option value="">-- Pilih Bank --</option>
                        <option value="BCA">BCA (Bank Central Asia)</option>
                        <option value="BNI">BNI (Bank Negara Indonesia)</option>
                        <option value="BRI">BRI (Bank Rakyat Indonesia)</option>
                        <option value="MANDIRI">Mandiri</option>
                        <option value="BSI">BSI (Bank Syariah Indonesia)</option>
                        <option value="CIMB">CIMB Niaga</option>
                        <option value="BTN">BTN (Bank Tabungan Negara)</option>
                        <option value="DANAMON">Danamon</option>
                        <option value="PERMATA">Permata Bank</option>
                        <option value="MAYBANK">Maybank Indonesia</option>
                        <option value="PANIN">Panin Bank</option>
                        <option value="OCBC">OCBC NISP</option>
                    </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-aksi btn-batal" onclick="closeModal()">Batal</button>
                    <button type="submit" class="btn-aksi btn-simpan">Simpan</button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection