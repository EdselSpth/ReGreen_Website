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

    <script src="{{ asset('js/login.js') }}"></script>
</body>
</html>