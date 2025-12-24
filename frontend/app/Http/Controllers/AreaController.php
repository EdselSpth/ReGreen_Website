<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;

class AreaController extends Controller
{
    public function index()
    {
        
        $response = Http::get('http://localhost:3000/api/pendaftaran-area-admin/pending');

        $areas = $response->json()['data'] ?? [];

        return view('admin.pendaftaran-area', compact('areas'));
    }

    public function approve($id)
    {
        Http::post("http://localhost:3000/api/pendaftaran-area-admin/approve/{$id}");
        return redirect()->back()->with('success', 'Area berhasil di-approve');
    }

    public function reject($id)
    {
        Http::post("http://localhost:3000/api/pendaftaran-area-admin/reject/{$id}");
        return redirect()->back()->with('success', 'Area berhasil ditolak');
    }
}
