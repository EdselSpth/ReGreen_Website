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
    <a href="#">Keuntungan</a>
    <a href="#" class="active">Data Bank Sampah</a>
    <a href="#">Kelola Akun</a>
    <a href="#">Kategori Sampah</a>

    <div class="logout">
      <a href="#">Logout</a>
    </div>
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
</body>
</html>
