@extends('layout.scheduleLayout')

@section('header')
    JADWAL PENJEMPUTAN
@endsection

@section('content')
<button class="btn-tambah" id="btnTambah">+ Tambah Jadwal</button>
<div class="d-flex justify-content-between align-items-center mb-3">
    <input
        type="text"
        id="searchInput"
        class="form-control"
        style="max-width:300px"
        placeholder="Cari kurir / alamat..."
    />
</div>

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
                        <th>Jenis Sampah</th>
                        <th>Tanggal</th>
                        <th>Waktu</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody id="tableBody"></tbody>
            </table>
        </div>
    </div>
</div>
<div class="d-flex justify-content-end mt-3">
    <nav>
        <ul class="pagination" id="pagination"></ul>
    </nav>
</div>

@endsection

@section('modal')
<div id="modalTambah" class="modal-overlay">
    <div class="modal-window">
        <div class="modal-header-ui">
            <h2 id="modalTitle" style="font-size: 1.1rem; margin:0;">Tambah Jadwal Baru</h2>
            <span class="btn-close-x" id="btnClose">&times;</span>
        </div>

        <form id="formSchedule">
            <div class="modal-body-ui">
                <input type="hidden" id="scheduleId">

                <div class="form-group">
                    <label>Pilih Kurir</label>
                    <select id="courier_name" required>
                        <option value="">-- Pilih Kurir --</option>
                        <option value="ajang beye">Ajang Beye</option>
                        <option value="Adang galon">Adang Galon</option>
                    </select>
                </div>

                <div class="form-group">
                    <label >Alamat</label>
                    <select id="alamat" required>
                        <option value="">-- Pilih Alamat --</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Jenis Sampah</label>
                    <select id="waste_type" required>
                        <option value="">-- Pilih Jenis Sampah --</option>
                    </select>
                </div>


                <div class="row">
                    <div class="col-md-6 form-group">
                        <label>Tanggal</label>
                        <input type="date" id="date" required>
                    </div>
                    <div class="col-md-6 form-group">
                        <label>Waktu Mulai</label>
                        <input type="time" id="time_start" required>
                    </div>

                    <div class="col-md-6 form-group">
                        <label>Waktu Selesai</label>
                        <input type="time" id="time_end" required>
                    </div>
                </div>

                <div id="statusContainer" class="form-group" style="display:none;">
                    <label>Status</label>
                    <select id="status">
                        <option value="tersedia">TERSEDIA</option>
                        <option value="diproses">DIPROSES</option>
                        <option value="selesai">SELESAI</option>
                        <option value="ditolak">DITOLAK</option>
                    </select>
                </div>
            </div>

            <div class="modal-footer-ui">
                <button type="button" class="btn-ui" id="btnBatal">Batal</button>
                <button type="submit" class="btn-ui btn-save">Simpan</button>
            </div>
        </form>
    </div>
</div>
@endsection
