@extends('layout.videoArtikelLayout')

@section('title', 'Video & Artikel')

@section('header')
    VIDEO & ARTIKEL EDUKASI
@endsection

@section('content')
    <div class="main-content">
        <div class="page-content">
            <!-- VIDEO -->
            <div class="header-tools">
                <div class="left-section">
                    <button class="btn-tambah" id="btnTambahVideo">
                        + Tambah Video
                    </button>
                </div>

                <div class="right-section">
                    <form id="form-search-video" class="search-box">
                        <input type="text" id="search-video-input" placeholder="Cari Video..." autocomplete="off">
                    </form>
                </div>
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

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                <div id="video-page-info" style="font-size:14px; color:#555;"></div>
                <div id="video-pagination" class="pagination" style="display:flex; gap:4px;"></div>
            </div>

            <!-- ARTIKEL -->
            <div class="header-tools" style="margin-top: 30px;">
                <div class="left-section">
                    <button class="btn-tambah" id="btnTambahArtikel">
                        + Tambah Artikel
                    </button>
                </div>

                <div class="right-section">
                    <form id="form-search-artikel" class="search-box">
                        <input type="text" id="search-artikel-input" placeholder="Cari Artikel..." autocomplete="off">
                    </form>
                </div>
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

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                <div id="artikel-page-info" style="font-size:14px; color:#555;"></div>
                <div id="artikel-pagination" class="pagination" style="display:flex; gap:4px;"></div>
            </div>

        @endsection

        @section('modal')
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

            <div class="modal" id="modal-edit-video">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Edit Video Edukasi</h2>
                        <span class="btn-tutup">&times;</span>
                    </div>
                    <div class="modal-body">
                        <form id="form-edit-video">
                            <input type="hidden" id="edit-video-id">

                            <div class="form-group">
                                <label>Judul Video</label>
                                <input type="text" id="edit-nama-video" required>
                            </div>

                            <div class="form-group">
                                <label>Link Video</label>
                                <input type="text" id="edit-link-video" required>
                            </div>

                            <div class="form-group">
                                <label>Deskripsi</label>
                                <input type="text" id="edit-deskripsi" required>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn-aksi btn-batal">Batal</button>
                                <button type="submit" class="btn-aksi btn-simpan">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div class="modal" id="modal-edit-artikel">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Edit Artikel Edukasi</h2>
                        <span class="btn-tutup">&times;</span>
                    </div>
                    <div class="modal-body">
                        <form id="form-edit-artikel">
                            <input type="hidden" id="edit-artikel-id">

                            <div class="form-group">
                                <label>Judul Artikel</label>
                                <input type="text" id="edit-nama-artikel" required>
                            </div>

                            <div class="form-group">
                                <label>Link Artikel</label>
                                <input type="url" id="edit-link-artikel" required>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn-aksi btn-batal">Batal</button>
                                <button type="submit" class="btn-aksi btn-simpan">Update</button>
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
