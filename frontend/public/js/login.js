document.addEventListener('DOMContentLoaded', function() {
    
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!email || !password) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Peringatan',
                    text: 'Email dan Kata Sandi tidak boleh kosong!',
                    confirmButtonColor: '#558B3E'
                });
                return;
            }

            Swal.fire({
                title: 'Sedang Masuk...',
                text: 'Mohon tunggu sebentar',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            this.submit(); 
        });
    }
});