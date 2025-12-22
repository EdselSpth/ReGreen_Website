@extends('layout.keuntunganLayout')

@section('content')
  <div style="margin-bottom: 20px;">
    <button class="btn btn-terima" onclick="openModal()">+ Tambah Penarikan</button>
  </div>

  <div id="modalTambah" class="modal" style="display:none;">
    <div class="modal-content">
      <h3>Tambah Penarikan Baru</h3>
      <form id="formTambah">
        <input type="text" id="nama_pengguna" placeholder="Nama Pengguna" required>
        <input type="number" id="nominal" placeholder="Nominal (Min 10.000)" required>
        <input type="text" id="rekening" placeholder="No Rekening (10-15 digit)" required>
        <select id="metode" required>
          <option value="">-- Pilih Metode --</option>
          <option value="BCA">BCA</option>
          <option value="BNI">BNI</option>
          <option value="MANDIRI">MANDIRI</option>
          <option value="BSI">BSI</option>
        </select>
        <div style="margin-top:15px;">
          <button type="submit" class="btn btn-terima">Simpan</button>
          <button type="button" class="btn btn-tolak" onclick="closeModal()">Batal</button>
        </div>
      </form>
    </div>
  </div>

<div class="table-container">
    <h4>Menunggu Persetujuan</h4>
    <table id="tblPending">
      <thead>
        <tr>
          <th>No</th>
          <th>Nama Pengguna</th>
          <th>Saldo Saat Ini</th> <th>Nominal Tarik</th>
          <th>No Rekening</th>
          <th>Metode</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody id="tableBody"></tbody>
    </table>
</div>
  
  <div class="table-container" style="margin-top:25px;">
    <h4>Riwayat Penarikan</h4>
    <table id="tblHistory">
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
      <tbody></tbody>
    </table>
  </div>
@endsection