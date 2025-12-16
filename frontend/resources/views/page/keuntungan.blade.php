@extends('layout.keuntunganLayout')

@section('title', 'Keuntungan ReGreen')

@section('header')
  <h2>KEUNTUNGAN</h2>
@endsection

@section('content')
  <!-- Pending -->
  <div class="table-container">
    <h4>Menunggu Persetujuan</h4>
    <table id="tblPending">
      <thead>
        <tr>
          <th>No</th>
          <th>Nama Pengguna</th>
          <th>Nominal</th>
          <th>No Rekening</th>
          <th>Metode</th>
          <th>Persetujuan</th>
        </tr>
      </thead>
      <tbody id="tableBody"></tbody>
    </table>
  </div>

  <!-- Accepted / Rejected -->
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
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
@endsection
