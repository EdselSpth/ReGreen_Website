<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>Pengguna | ReGreen</title>

    <link rel="stylesheet" href="{{ asset('css/kelolaAkun.css') }}">
</head>

<body>
    <div class="container">
        <nav class="sidebar">
            <img src="{{ asset('assets/logo-regreen-with-text.png') }}" alt="ReGreen Logo" class="logo">
            
            <a href="{{ url('/dashboard') }}">Beranda</a>
            <a href="#">Pengambilan Sampah</a>
            <a href="#">Pendaftaran Area</a>
            <a href="{{ url('/keuntungan') }}">Keuntungan</a>
            <a href="{{ url('/bankSampah') }}">Data Bank Sampah</a>
            <a href="#" class="active">Kelola Akun</a>
            <a href="{{ url('/kategoriSampah') }}">Kategori Sampah</a>
            <a href="{{ url('/videoArtikel') }}">Video & Artikel</a>
            
            <div class="logout">
                <a href="#" id="logoutBtn">Logout</a>
            </div>
        </nav>

        <div class="main-content">
            <div class="header">Kelola Akun Pengguna</div>

            <div class="page-content">
                 @yield('content')
            </div>
        </div>
    </div>

    <script src="{{ asset('js/script.js') }}"></script>
</body>
</html>