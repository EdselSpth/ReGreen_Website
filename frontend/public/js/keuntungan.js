document.addEventListener("DOMContentLoaded", () => {

  const tblPending = document.querySelector("#tblPending tbody");
  const tblHistory = document.querySelector("#tblHistory tbody");

  loadPending();
  loadHistory();

  function loadPending() {
    fetch("http://localhost:3000/api/keuntungan")
      .then(res => res.json())
      .then(data => {
        tblPending.innerHTML = "";
        data.forEach(item => addPendingRow(item));
        updateNumber(tblPending);
      });
  }

  function loadHistory() {
    fetch("http://localhost:3000/api/keuntungan/history")
      .then(res => res.json())
      .then(data => {
        tblHistory.innerHTML = "";
        data.forEach(item => addHistoryRow(item));
        updateNumber(tblHistory);
      });
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
    [...tbody.rows].forEach((row, i) => row.cells[0].innerText = i + 1);
  }

  document.addEventListener("click", e => {
    if (e.target.classList.contains("btn-terima")) {
      handleAction(e.target, "diterima");
    }

    if (e.target.classList.contains("btn-tolak")) {
      handleAction(e.target, "ditolak");
    }
  });

  function handleAction(button, status) {
    const row = button.closest("tr");
    const id = row.dataset.id;

    fetch(`http://localhost:3000/api/keuntungan/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    })
    .then(res => res.json())
    .then(() => {
      loadPending();
      loadHistory();
    });
  }

});
