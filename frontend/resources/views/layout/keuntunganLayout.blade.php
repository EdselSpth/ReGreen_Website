<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>@yield('title')</title>

  <link rel="stylesheet" href="{{ asset('css/keuntungan.css') }}">
</head>

<body>
  <div class="container">
    <!-- Sidebar -->
    <nav class="sidebar">
      <img src="{{ asset('assets/logo-regreen-with-text.png') }}" alt="ReGreen Logo" class="logo">

      <a href="#">Beranda</a>
      <a href="#">Pengambilan Sampah</a>
      <a href="#">Pendaftaran Area</a>
      <a href="{{ url('/keuntungan') }}" class="active">Keuntungan</a>
      <a href="{{ url('/bankSampah') }}">Data Bank Sampah</a>
      <a href="{{ url('/kelolaAkun') }}">Kelola Akun</a>
      <a href="{{ url('/kategoriSampah') }}">Kategori Sampah</a>
      <a href="{{ url('/videoArtikel') }}">Video & Artikel</a>

      <div class="logout">
        <a href="#" id="logoutBtn">Logout</a>
      </div>
    </nav>

    <!-- CONTENT -->
    <main class="content">
      <header class="header">
        @yield('header')
      </header>

      <div class="page-content">
        @yield('content')
      </div>
    </main>
  </div>

  <script src="{{ asset('js/keuntungan.js') }}"></script>
</body>
</html>
