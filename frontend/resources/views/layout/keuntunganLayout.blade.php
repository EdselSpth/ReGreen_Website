<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>@yield('title')</title>
    <link rel="stylesheet" href="{{ asset('css/keuntungan.css') }}">
</head>
<body>

<div class="container">
    <nav class="sidebar">
        <img src="{{ asset('assets/logo-regreen-with-text.png') }}" class="logo">
        <a href="/keuntungan" class="active">Keuntungan</a>
    </nav>

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
