<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::middleware('guest')->group(function () {
    // Menampilkan halaman login
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    
    // Menerima data post login
    Route::post('/login', [AuthController::class, 'login']); 
});
Route::middleware('auth')->group(function () {
    
    // Route Logout
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // --- Daftar Halaman Admin ---
    
    Route::get('/dashboard', function () {
        return view('page.dashboard');
    })->name('dashboard');

    Route::get('/videoArtikel', function () {
        return view('page.videoArtikel');
    })->name('videoArtikel'); 

    Route::get('/keuntungan', function () {
        return view('page.keuntungan');
    })->name('keuntungan');

    Route::get('/bankSampah', function () {
        return view('page.bankSampah');
    })->name('bankSampah');

    Route::get('/kategoriSampah', function () {
        return view('page.kategoriSampah');
    })->name('kategoriSampah');

    Route::get('/kelolaAkun', function () {
        return view('page.kelolaAkun');
    })->name('kelolaAkun');
});