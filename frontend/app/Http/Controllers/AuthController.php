<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function showLoginForm()
    {
        return view('page.login');
    }

    public function login(Request $request)
    {
        // 1. Validasi Input
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $remember = $request->has('remember');
        
        // HAPUS baris $credentials['role'] = 'Admin' yang lama.
        // Kita cek role secara manual di bawah supaya bisa kasih pesan error yang jelas.

        // 2. Cek apakah Email & Password cocok di Database?
        if (Auth::attempt($credentials, $remember)) {
            $request->session()->regenerate();

            // 3. LOGIC PENENTUAN NASIB (Role Check)
            // Pastikan penulisan 'Admin' sesuai persis dengan di database (besar/kecilnya)
            if (Auth::user()->role === 'Admin') {
                return redirect()->intended('dashboard');
            }

            // 4. Kalau Login sukses TAPI bukan Admin (misal: Kurir iseng login)
            // Kita tendang keluar lagi.
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return back()->withErrors([
                'email' => 'Akun Anda bukan Admin. Silakan login via Aplikasi Mobile.',
            ])->onlyInput('email');
        }

        // 5. Kalau Email/Password salah
        return back()->withErrors([
            'email' => 'Email atau password salah.',
        ])->onlyInput('email');
    }

    public function logout(Request $request)
    {
        Auth::logout();
    
        $request->session()->invalidate();
    
        $request->session()->regenerateToken();
    
        return redirect('/login');
    }
}