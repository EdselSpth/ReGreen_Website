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

           <a href="{{ route('dashboard') }}" class="{{ request()->routeIs('dashboard') ? 'active' : '' }}">
                Beranda
            </a>
            
            <a href="#" class="{{ request()->routeIs('pengambilanSampah') ? 'active' : '' }}">
                Pengambilan Sampah
            </a>
            
            <a href="#" class="{{ request()->routeIs('pendaftaranArea') ? 'active' : '' }}">
                Pendaftaran Area
            </a>
            
            <a href="{{ route('keuntungan') }}" class="{{ request()->routeIs('keuntungan') ? 'active' : '' }}">
                Keuntungan
            </a>
            
            <a href="{{ route('bankSampah') }}" class="{{ request()->routeIs('bankSampah') ? 'active' : '' }}">
                Data Bank Sampah
            </a>
            
            <a href="{{ route('kelolaAkun') }}" class="{{ request()->routeIs('kelolaAkun') ? 'active' : '' }}">
                Kelola Akun
            </a>
            
            <a href="{{ route('kategoriSampah') }}" class="{{ request()->routeIs('kategoriSampah') ? 'active' : '' }}">
                Kategori Sampah
            </a>
            
            <a href="{{ route('videoArtikel') }}" class="{{ request()->routeIs('videoArtikel') ? 'active' : '' }}">
                Video & Artikel
            </a>
            
            {{-- LOGOUT FIX --}}
            <div class="logout">
                {{-- 1. Link ini cuma pancingan buat trigger form di bawah --}}
                <a href="#" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                    Logout
                </a>

                {{-- 2. Form Rahasia (Hidden) untuk kirim POST Logout --}}
                <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                    @csrf
                </form>
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