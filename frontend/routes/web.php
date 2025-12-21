<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('page.dashboard');
});

Route::get('/keuntungan', function () {
    return view('page.keuntungan');
});

Route::get('/bankSampah', function () {
    return view('page.bankSampah');
});

route::get('/kategoriSampah', function () {
    return view('page.kategoriSampah');
});
