document.getElementById('addAreaForm').onsubmit = async function (e) {
    e.preventDefault();

    // Ambil data dari form
    const data = {
        kecamatan: document.getElementById("kecamatan").value,
        kelurahan: document.getElementById("kelurahan").value,  // Menambahkan kelurahan
        kota: document.getElementById("kota").value,            // Menambahkan kota
        provinsi: document.getElementById("provinsi").value,    // Menambahkan provinsi
        jalan: document.getElementById("jalan").value
    };

    try {
        // Kirim data ke backend untuk disimpan
        const res = await fetch('http://localhost:3000/api/areaMaster', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            Swal.fire("Sukses", "Area berhasil ditambahkan", "success")
                .then(() => {
                    closeAddAreaModal();
                    loadRegisteredAreas(); // Reload daftar area yang sudah terdaftar
                });
        } else {
            const err = await res.json();
            Swal.fire("Error", err.message, "error");
        }
    } catch (err) {
        Swal.fire("Error", "Gagal menghubungi server", "error");
    }
};
