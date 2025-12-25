@extends('layout.scheduleLayout')

@section('header')
    JADWAL PENJEMPUTAN
@endsection

@section('content')
<button class="btn-tambah" id="btnTambah">+ Tambah Jadwal</button>

<div class="table-card">
    <h4 style="font-weight: bold; margin-bottom: 20px;">Daftar Antrean Penjemputan</h4>
    <div class="white-inner-box">
        <div class="table-responsive">
            <table class="table-custom">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Kurir</th>
                        <th style="text-align: left;">Alamat</th>
                        <th>Tanggal</th>
                        <th>Waktu</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                    </tbody>
            </table>
        </div>
    </div>
</div>
@endsection

@section('modal')
<div id="modalTambah" class="modal-overlay">
    <div class="modal-window">
        <div class="modal-header-ui">
            <h2 id="modalTitle" style="font-size: 1.1rem; margin:0;">Tambah Jadwal Baru</h2>
            <span class="btn-close-x" id="btnClose" style="cursor:pointer;">&times;</span>
        </div>
        <form id="formSchedule">
            <div class="modal-body-ui">
                <input type="hidden" id="scheduleId">
                
                <div class="form-group">
                    <label>Pilih Kurir</label>
                    <select id="courier_name" required>
                        <option value="ajang beye">ajang beye</option>
                        <option value="Adang galon">Adang galon</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Alamat / Area</label>
                    <select id="alamat" required>
                        <option value="" disabled selected>Memuat area...</option>
                    </select>
                </div>

                <div class="row">
                    <div class="col-md-6 form-group">
                        <label>Tanggal</label>
                        <input type="date" id="date" required>
                    </div>
                    <div class="col-md-6 form-group">
                        <label>Waktu</label>
                        <input type="text" id="time" placeholder="09:00 - 10:00" required>
                    </div>
                </div>

                <div id="statusContainer" class="form-group" style="display:none;">
                    <label>Status</label>
                    <select id="status">
                        <option value="tersedia">TERSEDIA</option>
                        <option value="diproses">DIPROSES</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer-ui">
                <button type="button" class="btn-ui" style="background:#eee;" id="btnBatal">Batal</button>
                <button type="submit" class="btn-ui btn-save">Simpan</button>
            </div>
        </form>
    </div>
</div>
@endsection