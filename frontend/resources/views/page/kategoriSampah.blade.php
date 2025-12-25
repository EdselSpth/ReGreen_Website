@extends('layout.kategoriSampahLayout')

@section('title', 'Kategori Sampah')

@section('header')
KATEGORI SAMPAH
@endsection

@section('content')

<!-- ================= SEARCH & ADD ================= -->
<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">

  <!-- tombol tambah sekarang di kiri -->
  <button class="btn-tambah" id="btnTambah">+ Tambah Kategori</button>

  <!-- search bar sekarang di kanan -->
  <form id="form-search" style="display:flex; gap:8px;">
    <input 
      type="text" 
      id="search-input" 
      placeholder="Cari kategori sampah..."
      style="padding:8px; border-radius:4px; border:1px solid #ccc;"
    >
    <button type="submit" class="btn-aksi btn-simpan">Cari</button>
  </form>

</div>


<!-- ================= TABLE ================= -->
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>No</th>
        <th>Nama Kategori</th>
        <th>Harga per Kg (Rp)</th>
        <th>Aksi</th>
      </tr>
    </thead>
    <tbody id="data-body">
      <!-- diisi JS -->
    </tbody>
  </table>
</div>

<!-- ================= PAGINATION ================= -->
<div style="display:flex; justify-content:space-between; align-items:center; margin-top:15px;">
  <div id="page-info" style="font-size:14px; color:#555;"></div>
  <div id="pagination-container" style="display:flex; gap:6px;"></div>
</div>

@endsection

@section('modal')
<!-- ================= MODAL TAMBAH ================= -->
<div class="modal" id="modal-tambah">
  <div class="modal-content">
    <div class="modal-header">
      <h2>Tambah Kategori Sampah</h2>
      <span class="btn-tutup">&times;</span>
    </div>

    <div class="modal-body">
      <form id="form-tambah">
        <div class="form-group">
          <label>Nama Kategori</label>
          <input type="text" id="tambah-nama" required>
        </div>

        <div class="form-group">
          <label>Harga per Kg (Rp)</label>
          <input type="number" id="tambah-harga" required>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-aksi btn-batal">Batal</button>
          <button type="submit" class="btn-aksi btn-simpan">Simpan</button>
        </div>
      </form>
    </div>
  </div>
</div>

<!-- ================= MODAL EDIT ================= -->
<div class="modal" id="modal-edit">
  <div class="modal-content">
    <div class="modal-header">
      <h2>Edit Kategori Sampah</h2>
      <span class="btn-tutup">&times;</span>
    </div>

    <div class="modal-body">
      <form id="form-edit">
        <input type="hidden" id="edit-id">

        <div class="form-group">
          <label>Nama Kategori</label>
          <input type="text" id="edit-nama" required>
        </div>

        <div class="form-group">
          <label>Harga per Kg (Rp)</label>
          <input type="number" id="edit-harga" required>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-aksi btn-batal">Batal</button>
          <button type="submit" class="btn-aksi btn-simpan">Simpan</button>
        </div>
      </form>
    </div>
  </div>
</div>  
@endsection

@section('script')
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="{{ asset('js/kategoriSampah.js') }}"></script>
@endsection
