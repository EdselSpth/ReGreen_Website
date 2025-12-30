@extends('layout.keuntunganLayout')

@section('title', 'Manajemen Keuntungan')

@section('header')
PENARIKAN KEUNTUNGAN
@endsection

@section('content')
<div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
    <div>
        <button class="btn-tambah" onclick="openModal()">+ Tambah Penarikan</button>
    </div>
    <button class="btn-aksi btn-simpan" onclick="exportData()" style="display: flex; align-items: center; gap: 8px; padding: 10px 20px;">
        <i class="fas fa-file-excel"></i> Export Excel (Backup)
    </button>
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
</div>

<div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
    <div id="pending-page-info" style="font-size:14px; color:#555;"></div>
    <div id="paginationPending" class="pagination" style="display:flex; gap:4px;"></div>
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
                <th>Alasan</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody id="tableHistoryBody"></tbody>
    </table>
</div>

<div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
    <div id="history-page-info" style="font-size:14px; color:#555;"></div>
    <div id="paginationHistory" class="pagination" style="display:flex; gap:4px;"></div>
</div>
@endsection

@section('modal')
<div id="modalTambah" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2 style="margin:0; font-size: 1.2rem;">Tambah Penarikan Baru</h2>
            <span class="btn-tutup" style="cursor:pointer; font-size: 24px; font-weight: bold;" onclick="closeModal()">&times;</span>
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
                    <label>Pemilihan Transfer</label>
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