@extends('layout.bankSampahLayout')

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

        {{-- ================= BANK SAMPAH ================= --}}
        <div class="section-box">
            <div class="section-header">
                <span class="section-title">Data Bank Sampah</span>
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Bank Sampah</th>
                            <th>Jenis</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="bank-body">
                        <tr>
                            <td colspan="4" style="text-align:center;">
                                Loading...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        {{-- ================= KEUNTUNGAN (PENDING) ================= --}}
        <div class="section-box">
            <div class="section-header">
                <span class="section-title">Keuntungan (Pending)</span>
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Pengguna</th>
                            <th>Nominal</th>
                            <th>Metode</th>
                            <th>Rekening</th>
                        </tr>
                    </thead>
                    <tbody id="pending-body">
                        <tr>
                            <td colspan="5" style="text-align:center;">
                                Loading...
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
