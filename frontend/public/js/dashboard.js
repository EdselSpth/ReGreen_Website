document.addEventListener("DOMContentLoaded", () => {
    const loading = document.getElementById("loading-overlay");

    const API_BANK = "http://localhost:3000/api/bankSampah";
    const API_KEUNTUNGAN = "http://localhost:3000/api/keuntungan";

    const bankBody = document.getElementById("bank-body");
    const pendingBody = document.getElementById("pending-body");

    function showLoading() {
        loading?.classList.add("active");
    }

    function hideLoading() {
        loading?.classList.remove("active");
    }

    // LOAD DATA
    loadBankSampah();
    loadPending();

    /* =====================
        BANK SAMPAH
    ====================== */
    async function loadBankSampah() {
        try {
            showLoading();
            const res = await fetch(API_BANK);
            const data = await res.json();
            renderBank(data);
        } catch (err) {
            console.error("Gagal load bank sampah", err);
        } finally {
            hideLoading();
        }
    }

    function renderBank(data) {
        bankBody.innerHTML = "";

        if (!data || data.length === 0) {
            bankBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center">
                        Tidak ada data bank sampah
                    </td>
                </tr>
            `;
            return;
        }

        data.forEach((item, i) => {
            bankBody.innerHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${item.nama}</td>
                    <td>${item.jenis}</td>
                    <td>
                        <span class="badge ${item.status === "Aktif" ? "aktif" : "nonaktif"}">
                            ${item.status}
                        </span>
                    </td>
                </tr>
            `;
        });
    }

    /* =====================
        KEUNTUNGAN (PENDING)
    ====================== */
    async function loadPending() {
        try {
            const res = await fetch(API_KEUNTUNGAN);
            const response = await res.json();
            const data = Array.isArray(response.data)
                ? response.data
                : response;

            renderPending(data);
        } catch (err) {
            console.error("Gagal load keuntungan", err);
        }
    }

    function renderPending(data) {
        pendingBody.innerHTML = "";

        if (!data || data.length === 0) {
            pendingBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center">
                        Tidak ada data keuntungan
                    </td>
                </tr>
            `;
            return;
        }

        data.slice(0, 5).forEach((item, i) => {
            pendingBody.innerHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${item.nama_pengguna}</td>
                    <td>Rp ${item.nominal.toLocaleString("id-ID")}</td>
                    <td>${item.metode}</td>
                    <td>${item.rekening}</td>
                </tr>
            `;
        });
    }
});
