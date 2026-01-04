<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class KeuntunganController extends Controller
{
    // URL API Node.js kamu (bisa dipindah ke .env nanti)
    private $baseUrl = 'http://localhost:3000/api/keuntungan';

    public function index()
    {
        $response = Http::get($this->baseUrl);
        return response()->json($response->json());
    }

    public function history()
    {
        $response = Http::get($this->baseUrl . '/history');
        return response()->json($response->json());
    }

    //     public function store(Request $request)
    // {
    //     $response = Http::post($this->baseUrl, $request->all());
    //     return response()->json($response->json(), $response->status());
    // }

    public function store(Request $request)
    {
        try {
            $response = Http::post($this->baseUrl, $request->all());
            
            if ($response->successful()) {
                return response()->json($response->json(), 201);
            }
            
            return response()->json($response->json(), $response->status());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Koneksi ke Backend Node.js terputus'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $response = Http::put($this->baseUrl . '/' . $id, $request->all());
        return response()->json($response->json(), $response->status());
    }

    public function destroy($id)
    {
        $response = Http::delete($this->baseUrl . '/' . $id);
        return response()->json($response->json(), $response->status());
    }

    public function export()
    {
        // Untuk export, kita redirect internal agar file terdownload
        return redirect($this->baseUrl . '/export');
    }
}