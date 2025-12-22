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
            <img src="{{ asset('assets/logo-regreen-with-text.png') }}" alt="ReGreen Logo" class="logo">
            
            {{-- MENU NAVIGASI (Pakai Route Laravel) --}}
            {{-- Menggunakan request()->routeIs() biar class 'active' pindah otomatis --}}
            
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
