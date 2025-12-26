@extends('layout.videoArtikelLayout')

@section('title', 'Video & Artikel')

@section('header')
    VIDEO & ARTIKEL EDUKASI
@endsection

@section('content')
    <div class="main-content">
        <div class="page-content">

            <!-- ================= VIDEO ================= -->
            <div class="header-tools" style="display:flex; justify-content:space-between; margin-bottom:16px;">
                <button class="btn-tambah" id="btnTambahVideo">+ Tambah Video</button>
                <form id="form-search-video" class="search-box">
                    <input type="text" id="search-video-input" placeholder="Cari Video..." autocomplete="off">
                    <button type="submit">Cari</button>
                </form>
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Judul Video</th>
                            <th>Link</th>
                            <th>Deskripsi</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="video-body">
                        <tr>
                            <td colspan="5" style="text-align:center;">Loading...</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination & Info di luar table -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                <div id="video-page-info" style="font-size:14px; color:#555;"></div>
                <div id="video-pagination" class="pagination" style="display:flex; gap:4px;"></div>
            </div>

            <!-- ================= ARTIKEL ================= -->
            <div class="header-tools"
                style="display:flex; justify-content:space-between; margin-top:24px; margin-bottom:16px;">
                <button class="btn-tambah" id="btnTambahArtikel">+ Tambah Artikel</button>
                <form id="form-search-artikel" class="search-box">
                    <input type="text" id="search-artikel-input" placeholder="Cari Artikel..." autocomplete="off">
                    <button type="submit">Cari</button>
                </form>
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Judul Artikel</th>
                            <th>File PDF</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="artikel-body">
                        <tr>
                            <td colspan="4" style="text-align:center;">Loading...</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination & Info Artikel di luar table -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                <div id="artikel-page-info" style="font-size:14px; color:#555;"></div>
                <div id="artikel-pagination" class="pagination" style="display:flex; gap:4px;"></div>
            </div>

        @endsection

        @section('modal')
            <!-- ================= MODAL TAMBAH VIDEO ================= -->
            <div class="modal" id="modal-tambah-video">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Tambah Video Edukasi</h2>
                        <span class="btn-tutup">&times;</span>
                    </div>
                    <div class="modal-body">
                        <form id="form-tambah-video">
                            <div class="form-group">
                                <label>Judul Video</label>
                                <input type="text" id="tambah-nama-video" name="nama_video" required>
                            </div>
                            <div class="form-group">
                                <label>Link Video (YouTube)</label>
                                <input type="text" id="tambah-link-video" name="link_youtube" required>
                            </div>
                            <div class="form-group">
                                <label>Deskripsi Video</label>
                                <input type="text" id="tambah-deskripsi" name="deskripsi" required>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn-aksi btn-batal">Batal</button>
                                <button type="submit" class="btn-aksi btn-simpan">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- ================= MODAL TAMBAH ARTIKEL ================= -->
            <div class="modal" id="modal-tambah-artikel">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Tambah Artikel Edukasi</h2>
                        <span class="btn-tutup">&times;</span>
                    </div>
                    <div class="modal-body">
                        <form id="form-tambah-artikel">
                            <div class="form-group">
                                <label>Judul Artikel</label>
                                <input type="text" name="nama_artikel" id="tambah-nama-artikel" required
                                    placeholder="Contoh: Pentingnya Vaksinasi">
                            </div>
                            <div class="form-group">
                                <label>Link Artikel (URL)</label>
                                <input type="url" id="tambah-link-artikel" name="link_artikel" required
                                    placeholder="https://drive.google.com/file/...">
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
            <script src="{{ asset('js/videoArtikel.js') }}"></script>
        @endsection
