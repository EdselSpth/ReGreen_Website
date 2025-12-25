<?php 

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AreaAdminController;
// 1. Import Controller yang baru dibuat
use App\Http\Controllers\ScheduleController;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login']); 
});

Route::middleware('auth')->group(function () {
    
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    
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

    Route::get('/schedule', function () {
        return view('page.schedule');
    })->name('schedule');

    route::get('/pendaftaran-area', function () {
        return view('page.area');
    })->name('pendaftaranArea');

    Route::get('/api/areaRequests', function () {
        $areaRequests = AreaRequest::where('status', 'pending')->get();
        return response()->json(['data' => $areaRequests]);
    });
});

