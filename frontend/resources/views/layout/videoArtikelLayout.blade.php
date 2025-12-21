<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Video & Artikel')</title>

    <link rel="stylesheet" href="{{ asset('css/videoArtikel.css') }}">
</head>

<body>
<div class="container">

    <!-- SIDEBAR -->
    <nav class="sidebar">
        <img src="{{ asset('assets/logo-regreen-with-text.png') }}" 
             alt="ReGreen Logo" 
             class="logo">

        <a href="#">Beranda</a>
        <a href="#">Pengambilan Sampah</a>
        <a href="#">Pendaftaran Area</a>
        <a href="{{ url('/keuntungan') }}">Keuntungan</a>
        <a href="{{ url('/bankSampah') }}">Data Bank Sampah</a>
        <a href="#">Kelola Akun</a>
        <a href="{{ url('/kategoriSampah') }}">Kategori Sampah</a>
        <a href="{{ url('/videoArtikel') }}" class="active">Video & Artikel</a>

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

{{-- MODAL --}}
@yield('modal')

{{-- SCRIPT --}}
<script src="{{ asset('js/videoArtikel.js') }}"></script>

</body>
</html>

        </a>