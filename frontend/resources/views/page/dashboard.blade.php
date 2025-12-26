@extends('layout.dashboardLayout')

@section('title', 'Dashboard')

@section('header')
    DASHBOARD ADMIN
@endsection

@section('content')

    {{-- ================= LOADING OVERLAY ================= --}}
    <div id="loading-overlay" class="loading-overlay">
        <div class="loader"></div>
    </div>

    <div class="dashboard-grid">

        {{-- ================= JADWAL PENGAMBILAN ================= --}}
        <div class="section-box">
            <div class="section-header">
                <span class="section-title">Jadwal Pengambilan Sampah</span>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th style="width:5%">No</th>
                            <th style="width:15%">Kurir</th>
                            <th style="width:30%; text-align:left">Alamat</th>
                            <th style="width:15%">Tanggal</th>
                            <th style="width:10%">Waktu</th>
                            <th style="width:10%">Status</th>
                            <th style="width:15%">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="schedule-body">
                        <tr>
                            <td colspan="7" style="text-align:center;">
                                Memuat data jadwal...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        {{-- ================= KEUNTUNGAN ================= --}}
        <div class="section-box">
            <div class="section-header">
                <span class="section-title">Keuntungan</span>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th style="width:5%">No</th>
                            <th style="width:35%">Nama Pengguna</th>
                            <th style="width:20%">Nominal</th>
                            <th style="width:20%">Metode</th>
                            <th style="width:20%">Rekening</th>
                        </tr>
                    </thead>
                    <tbody id="pending-body">
                        <tr>
                            <td colspan="5" style="text-align:center;">
                                Memuat data keuntungan...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        {{-- ================= JADWAL MENUNGGU PERSETUJUAN ================= --}}
        <div class="section-box">
            <div class="section-header">
                <span class="section-title">Menunggu Persetujuan</span>
            </div>
            <div class="table-container">
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
                    <tbody id="pendingAreaTable">
                        <tr>
                            <td colspan="7" style="text-align:center;">
                                Memuat data area...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>

    {{-- ================= SCRIPT ================= --}}
    <script src="{{ asset('js/dashboard.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

@endsection
