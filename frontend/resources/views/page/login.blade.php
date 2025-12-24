@extends('layout.LoginLayout')

@section('title', 'Login - ReGreen')

@section('content')
    <div class="login-container">

        <div class="left-panel">
            <div>
                <img src="{{ asset('assets/logo.png') }}" alt="ReGreen Logo" class="logo-img">
                
                <h1>Buang Sampah<br>Dapat Cuan.</h1>
                <p>ReGreen adalah sebuah aplikasi yang diciptakan untuk membuat para masyarakat
                    dapat membuang sampah
                    dan mendapatkan dana secara online</p>
            </div>
            
            <img src="{{ asset('assets/illustration.png') }}" alt="Ilustrasi" class="illustration-img">
        </div>

        <div class="right-panel">
            <div class="form-container">
                <h2>Masuk</h2>
                <p class="subtitle">Masuk untuk mengakses halaman utama admin ReGreen</p>

                {{-- Form Action: Nanti arahkan ke route login Laravel --}}
                <form id="loginForm" method="POST" action="{{ route('login') }}">
                    {{-- Wajib ada @csrf untuk keamanan form di Laravel --}}
                    @csrf 
                    
                    <div class="form-group">
                        <label for="email" class="form-label">Email</label>
                        {{-- Tambahkan name="email" agar terbaca oleh Controller --}}
                        <input type="email" class="form-input" id="email" name="email"
                            placeholder="Masukan Email Anda" required autofocus>
                    </div>

                    <div class="form-group">
                        <label for="password" class="form-label">Kata Sandi</label>
                        {{-- Tambahkan name="password" --}}
                        <input type="password" class="form-input" id="password" name="password"
                            placeholder="Masukan Kata Sandi" required>
                    </div>

                    {{-- Tambahan: Menampilkan error validasi jika login gagal --}}
                    @if ($errors->any())
                        <div style="color: red; margin-bottom: 15px; font-size: 0.9em;">
                            <ul>
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <div class="form-grid">
                        <button type="submit" class="form-button">Masuk</button>
                    </div>
                </form>
                
                {{-- Container pesan tambahan (opsional jika pakai JS) --}}
                <div id="loginMessage" class="message-container"></div>
            </div>
        </div>

    </div>
@endsection

@section('scripts')
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const loginForm = document.getElementById('loginForm');

            if (loginForm) {
                loginForm.addEventListener('submit', function(event) {
                    event.preventDefault(); // Tahan dulu

                    const email = document.getElementById('email').value;
                    const password = document.getElementById('password').value;

                    if (!email || !password) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Peringatan',
                            text: 'Email dan Kata Sandi wajib diisi.',
                            confirmButtonColor: '#558B3E'
                        });
                        return;
                    }


                    let timerInterval;
                    Swal.fire({
                        title: 'Proses Login...',
                        html: 'Mencocokkan data ke database.',
                        timer: 1000, 
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                        willClose: () => {
                            this.submit(); 
                        }
                    });
                });
            }
        });
    </script>
    

    @if($errors->any())
    <script>
        Swal.fire({
            icon: 'error',
            title: 'Gagal Masuk',
            text: '{{ $errors->first() }}', 
            confirmButtonColor: '#d33'
        });
    </script>
    @endif
@endsection