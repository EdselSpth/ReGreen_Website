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
        <nav class="sidebar">
            <img src="{{ asset('assets/logo-regreen-with-text.png') }}" alt="ReGreen Logo" class="logo">
            <a href="{{ route('dashboard') }}" class="{{ request()->routeIs('dashboard') ? 'active' : '' }}">Beranda</a>
            <a href="{{ route('schedule')}}" class="{{ request()->routeIs('pengambilanSampah') ? 'active' : '' }}">
                Pengambilan Sampah
            </a>
            <a href="{{ route('pendaftaranArea') }}" class="{{ request()->routeIs('pendaftaranArea') ? 'active' : '' }}">
                Pendaftaran Area
            </a>
            <a href="{{ route('keuntungan') }}" class="{{ request()->routeIs('keuntungan') ? 'active' : '' }}">Keuntungan</a>
            <a href="{{ route('bankSampah') }}" class="{{ request()->routeIs('bankSampah') ? 'active' : '' }}">Data Bank Sampah</a>
            <a href="{{ route('kelolaAkun') }}" class="{{ request()->routeIs('kelolaAkun') ? 'active' : '' }}">Kelola Akun</a>
            <a href="{{ route('kategoriSampah') }}" class="{{ request()->routeIs('kategoriSampah') ? 'active' : '' }}">Kategori Sampah</a>
            <a href="{{ route('videoArtikel') }}" class="{{ request()->routeIs('videoArtikel') ? 'active' : '' }}">Video & Artikel</a>

            <div class="logout">
                <a href="#" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">Logout</a>
                <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                    @csrf
                </form>
            </div>
        </nav>

        <div class="main-content">
            <div class="header">@yield('header')</div>
            <div class="page-content">
                <div class="content">@yield('content')</div>
            </div>
        </div>
    </div>
    @yield('modal')
    <script src="{{ asset('js/keuntungan.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</body>

</html>