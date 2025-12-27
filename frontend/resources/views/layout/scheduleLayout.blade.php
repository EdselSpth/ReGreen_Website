<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>ReGreen - Jadwal Penjemputan</title>
    <link rel="stylesheet" href="{{ asset('css/schedule.css') }}">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
</head>

<body>
    <div class="app-wrapper">
        <nav class="sidebar">
            <div class="sidebar-logo">
                <img src="{{ asset('assets/logo-regreen-with-text.png') }}" alt="ReGreen Logo">
            </div>

            <div class="sidebar-menu">
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
            </div>

            <div class="sidebar-logout">
                <a href="#" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                    <i class="bi bi-box-arrow-left"></i> Logout
                </a>
                <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                    @csrf
                </form>
            </div>
        </nav>

        <main class="main-content">
            <header class="main-header">
                @yield('header')
            </header>
            <div class="page-body">
                @yield('content')
            </div>
        </main>
    </div>

    @yield('modal')

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('js/schedule.js') }}"></script>
</body>

</html>