@extends('layout.keuntunganLayout')

@section('title', 'Keuntungan ReGreen')

@section('header')
<h2>KEUNTUNGAN</h2>
@endsection

@section('content')
<div class="table-container">
    <h4>Menunggu Persetujuan</h4>
    <table id="tblPending">
        <thead>
            <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Nominal</th>
                <th>Rekening</th>
                <th>Metode</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
</div>
@endsection
