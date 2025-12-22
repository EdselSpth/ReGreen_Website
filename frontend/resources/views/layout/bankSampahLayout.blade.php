<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>@yield('title', 'ReGreen Dashboard')</title>

  <link rel="stylesheet" href="{{ asset('css/bankSampah.css') }}">
</head>
<body>

<div class="container">
  <!-- Sidebar -->
  <nav class="sidebar">
    <img src="{{ asset('assets/logo-regreen-with-text.png') }}" class="logo" alt="ReGreen">

    <a href="#">Beranda</a>
    <a href="#">Pengambilan Sampah</a>
    <a href="#">Pendaftaran Area</a>
    <a href="{{ url('/keuntungan') }}">Keuntungan</a>
    <a href="{{ url('/bankSampah') }}" class="active">Data Bank Sampah</a>
    <a href="{{ url('/kelolaAkun') }}">Kelola Akun</a>
    <a href="{{ url('/kategoriSampah') }}">Kategori Sampah</a>
    <a href="{{ url('/videoArtikel') }}">Video & Artikel</a>

   <form action="{{ route('logout') }}" method="POST">
        @csrf
        <button type="submit">Logout</button>
      </form>
  </nav>

  <!-- Main -->
  <div class="main-content">
    <div class="header">
      @yield('header')
    </div>

    <div class="page-content">
      <div class="content">
        @yield('content')
      </div>
    </div>
  </div>
</div>

@yield('modal')

<script src="{{ asset('js/bankSampah.js') }}"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</body>
</html>
