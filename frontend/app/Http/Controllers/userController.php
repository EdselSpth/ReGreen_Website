<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class userController extends Controller
{
    private $apiUrl = 'http://localhost:3000/api/users';

    public function index(Request $request)
    {
        /** @var \Illuminate\Http\Client\Response $response */
        $response = Http::get($this->apiUrl, $request->all());
        return $response->json();
    }

    public function store(Request $request)
    {
        /** @var \Illuminate\Http\Client\Response $response */
        $response = Http::post($this->apiUrl, $request->all());
        return response()->json($response->json(), $response->status());
    }

    public function update(Request $request, $id)
    {
        /** @var \Illuminate\Http\Client\Response $response */
        $response = Http::put("{$this->apiUrl}/{$id}", $request->all());
        return response()->json($response->json(), $response->status());
    }

    public function destroy($id)
    {
        /** @var \Illuminate\Http\Client\Response $response */
        $response = Http::delete("{$this->apiUrl}/{$id}");
        return response()->json($response->json(), $response->status());
    }

    public function changePassword(Request $request, $id)
    {
        /** @var \Illuminate\Http\Client\Response $response */
        $response = Http::patch("{$this->apiUrl}/{$id}/password", $request->all());
        return response()->json($response->json(), $response->status());
    }
}

