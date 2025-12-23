document.addEventListener("DOMContentLoaded", () => {
    const ITEMS_PER_PAGE = 2;

    const API_VIDEO = "http://localhost:3000/api/video";
    const API_ARTIKEL = "http://localhost:3000/api/artikel";

    const loading = document.getElementById("loading-overlay");

    const videoBody = document.getElementById("video-body");
    const artikelBody = document.getElementById("artikel-body");

    const videoPagination = document.getElementById("video-pagination");
    const artikelPagination = document.getElementById("artikel-pagination");

    const btnTambahVideo = document.getElementById("btnTambahVideo");
    const btnTambahArtikel = document.getElementById("btnTambahArtikel");

    const modalTambahVideo = document.getElementById("modal-tambah-video");
    const modalTambahArtikel = document.getElementById("modal-tambah-artikel");

    const formTambahVideo = document.getElementById("form-tambah-video");
    const formTambahArtikel = document.getElementById("form-tambah-artikel");

    const tombolTutup = document.querySelectorAll(".btn-tutup, .btn-batal");

    let dataVideo = [];
    let dataArtikel = [];

    let videoPage = 1;
    let artikelPage = 1;

    const showLoading = () => loading?.classList.add("active");
    const hideLoading = () => loading?.classList.remove("active");

    /* load data */
    async function loadVideo() {
        try {
            showLoading();
            const res = await fetch(API_VIDEO);
            const result = await res.json();
            dataVideo = result.data || result;
            videoPage = 1;
            renderVideo();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        } finally {
            hideLoading();
        }
    }

    async function loadArtikel() {
        try {
            showLoading();
            const res = await fetch(API_ARTIKEL);
            const result = await res.json();
            dataArtikel = result.data || result;
            artikelPage = 1;
            renderArtikel();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        } finally {
            hideLoading();
        }
    }

    /* video */
    function renderVideo() {
        videoBody.innerHTML = "";

        if (dataVideo.length === 0) {
            videoBody.innerHTML = `
                <tr><td colspan="5" style="text-align:center;">Belum ada video</td></tr>
            `;
            videoPagination.innerHTML = "";
            return;
        }

        const start = (videoPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageData = dataVideo.slice(start, end);

        pageData.forEach((item, index) => {
            videoBody.innerHTML += `
                <tr>
                    <td>${start + index + 1}</td>
                    <td>${item.nama_video}</td>
                    <td><a href="${item.link_youtube}" target="_blank">Lihat Video</a></td>
                    <td>${item.deskripsi}</td>
                    <td>
                        <button class="btn-aksi btn-hapus" data-id="${item.id}" data-type="video">Hapus</button>
                    </td>
                </tr>
            `;
        });

        renderVideoPagination();
    }

    function renderVideoPagination() {
        const totalPage = Math.ceil(dataVideo.length / ITEMS_PER_PAGE);
        videoPagination.innerHTML = "";

        for (let i = 1; i <= totalPage; i++) {
            videoPagination.innerHTML += `
                <button class="${i === videoPage ? "active" : ""}" onclick="changeVideoPage(${i})">${i}</button>
            `;
        }
    }

    window.changeVideoPage = (page) => {
        videoPage = page;
        renderVideo();
    };

    /* artikel */
    function renderArtikel() {
        artikelBody.innerHTML = "";

        if (dataArtikel.length === 0) {
            artikelBody.innerHTML = `
                <tr><td colspan="4" style="text-align:center;">Belum ada artikel</td></tr>
            `;
            artikelPagination.innerHTML = "";
            return;
        }

        const start = (artikelPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageData = dataArtikel.slice(start, end);

        pageData.forEach((item, index) => {
            artikelBody.innerHTML += `
                <tr>
                    <td>${start + index + 1}</td>
                    <td>${item.nama_artikel}</td>
                    <td><a href="/uploads/${item.file_pdf}" target="_blank">Lihat PDF</a></td>
                    <td>
                        <button class="btn-aksi btn-hapus" data-id="${item.id}" data-type="artikel">Hapus</button>
                    </td>
                </tr>
            `;
        });

        renderArtikelPagination();
    }

    function renderArtikelPagination() {
        const totalPage = Math.ceil(dataArtikel.length / ITEMS_PER_PAGE);
        artikelPagination.innerHTML = "";

        for (let i = 1; i <= totalPage; i++) {
            artikelPagination.innerHTML += `
                <button class="${i === artikelPage ? "active" : ""}" onclick="changeArtikelPage(${i})">${i}</button>
            `;
        }
    }

    window.changeArtikelPage = (page) => {
        artikelPage = page;
        renderArtikel();
    };

    /* modal */
    const openModal = (modal) => modal.classList.add("active");
    const closeAllModals = () => {
        modalTambahVideo.classList.remove("active");
        modalTambahArtikel.classList.remove("active");
        formTambahVideo.reset();
        formTambahArtikel.reset();
    };

    btnTambahVideo.addEventListener("click", () => openModal(modalTambahVideo));
    btnTambahArtikel.addEventListener("click", () => openModal(modalTambahArtikel));
    tombolTutup.forEach((btn) => btn.addEventListener("click", closeAllModals));

    /* init */
    loadVideo();
    loadArtikel();
});
