@extends('layout.bankSampahLayout')

@section('title', 'Data Bank Sampah')

@section('header')
DATA BANK SAMPAH
@endsection

@section('content')
<div class="table-header">
  <button class="btn-tambah">+ Tambah Data</button>

  <input 
    type="text" 
    id="search-bank" 
    placeholder="Cari bank sampah..."
  />
</div>


<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Nama Bank Sampah</th>
        <th>Alamat</th>
        <th>Melayani Sampah</th>
        <th>Status</th>
        <th>Aksi</th>
      </tr>
    </thead>
    <tbody id="data-bank-body">
      <!-- diisi JS -->
    </tbody>
  </table>
</div>

<div class="table-footer">
  <div id="info-data"></div>

  <div class="pagination" id="pagination"></div>
</div>

@endsection

@section('modal')
<!-- MODAL TAMBAH -->
<div class="modal" id="modal-tambah">
  <div class="modal-content">
    <div class="modal-header">
      <h2>Tambah Bank Sampah</h2>
      <span class="btn-tutup">&times;</span>
    </div>

    <div class="modal-body">
      <form id="form-tambah">
        <div class="form-group">
          <label>Nama Bank Sampah</label>
          <input type="text" id="tambah-nama" required>
        </div>

        <div class="form-group">
          <label>Alamat</label>
          <input type="text" id="tambah-alamat" required>
        </div>

        <div class="form-group">
          <label>Melayani Sampah</label>
          <input type="text" id="tambah-jenis" required>
        </div>

        <div class="form-group">
          <label>Status</label>
          <select id="tambah-status">
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-aksi btn-batal">Batal</button>
          <button type="submit" class="btn-aksi btn-simpan">Simpan</button>
        </div>
      </form>
    </div>
  </div>
</div>

<!-- MODAL EDIT -->
<div class="modal" id="modal-edit">
  <div class="modal-content">
    <div class="modal-header">
      <h2>Edit Bank Sampah</h2>
      <span class="btn-tutup">&times;</span>
    </div>

    <div class="modal-body">
      <form id="form-edit">
        <input type="hidden" id="edit-index">

        <div class="form-group">
          <label>Nama Bank Sampah</label>
          <input type="text" id="edit-nama" required>
        </div>

        <div class="form-group">
          <label>Alamat</label>
          <input type="text" id="edit-alamat" required>
        </div>

        <div class="form-group">
          <label>Melayani Sampah</label>
          <input type="text" id="edit-jenis" required>
        </div>

        <div class="form-group">
          <label>Status</label>
          <select id="edit-status">
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-aksi btn-batal">Batal</button>
          <button type="submit" class="btn-aksi btn-simpan">Simpan</button>
        </div>
      </form>
    </div>
  </div>
</div>
<div id="loading-overlay">
  <div class="spinner"></div>
</div>

@endsection
