<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Login - ReGreen')</title>

    <link rel="stylesheet" href="{{ asset('css/login.css') }}">
</head>

<body>

    @yield('content')

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <script src="{{ asset('js/login.js') }}"></script>

    @yield('scripts')
</body>

</html>