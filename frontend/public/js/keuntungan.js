document.addEventListener("DOMContentLoaded", () => {
  console.log("keuntungan.js loaded");

  const tblPending = document.querySelector("#tblPending tbody");
  const tblHistory = document.querySelector("#tblHistory tbody");

  loadPending();
  loadHistory();

  function loadPending() {
    fetch("http://localhost:3000/api/keuntungan")
      .then(res => res.json())
      .then(data => {
        console.log("PENDING:", data);
        tblPending.innerHTML = "";

        data.forEach(item => addPendingRow(item));
        updateNumber(tblPending);
      })
      .catch(err => console.error("Pending error:", err));
  }

  function loadHistory() {
    fetch("http://localhost:3000/api/keuntungan/history")
      .then(res => res.json())
      .then(data => {
        console.log("HISTORY:", data);
        tblHistory.innerHTML("");

        data.forEach(item => addHistoryRow(item));
        updateNumber(tblHistory);
      })
      .catch(err => console.error("History error:", err));
  }

  function addPendingRow(item) {
    const tr = document.createElement("tr");
    tr.dataset.id = item.id;

    tr.innerHTML = `
      <td></td>
      <td>${item.nama_pengguna}</td>
      <td>Rp ${Number(item.nominal).toLocaleString("id-ID")}</td>
      <td>${item.rekening ?? "-"}</td>
      <td>${item.metode ?? "-"}</td>
      <td>
        <button class="btn btn-terima">Terima</button>
        <button class="btn btn-tolak">Tolak</button>
      </td>
    `;

    tblPending.appendChild(tr);
  }

  function addHistoryRow(item) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td></td>
      <td>${item.nama_pengguna}</td>
      <td>Rp ${Number(item.nominal).toLocaleString("id-ID")}</td>
      <td>${item.rekening ?? "-"}</td>
      <td>${item.metode ?? "-"}</td>
      <td>
        <span class="status-text ${item.status === "diterima" ? "accepted" : "rejected"}">
          ${item.status}
        </span>
      </td>
    `;

    tblHistory.appendChild(tr);
  }

  function updateNumber(tbody) {
    [...tbody.rows].forEach((row, i) => {
      row.cells[0].innerText = i + 1;
    });
  }
});
