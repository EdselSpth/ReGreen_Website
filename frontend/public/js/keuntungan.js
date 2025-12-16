document.getElementById("logoutBtn").addEventListener("click", function (e) {
  e.preventDefault();
  if (confirm("Apakah Anda yakin ingin logout?")) {
    window.location.href = "#";
  }
});

const tblPending = document.querySelector("#tblPending tbody");
const tblHistory = document.querySelector("#tblHistory tbody");

// Load dari API Node.js
fetch("http://localhost:3000/api/keuntungan")
  .then(res => res.json())
  .then(data => {
    data.forEach(item => addRowToPending(item));
    updateNumbers(tblPending);
  });

function addRowToPending(item) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td></td>
    <td>${item.nama}</td>
    <td>${item.nominal}</td>
    <td>${item.rekening}</td>
    <td>${item.metode}</td>
    <td>
      <button class="btn btn-terima">Terima</button>
      <button class="btn btn-tolak">Tolak</button>
    </td>
  `;
  tblPending.appendChild(row);
}

function addRowToHistory(row, status) {
  const cells = row.querySelectorAll("td");
  const newRow = document.createElement("tr");

  newRow.innerHTML = `
    <td></td>
    <td>${cells[1].textContent}</td>
    <td>${cells[2].textContent}</td>
    <td>${cells[3].textContent}</td>
    <td>${cells[4].textContent}</td>
    <td>
      <span class="status-text ${status === "Diterima" ? "accepted" : "rejected"}">
        ${status}
      </span>
      <a class="edit-link" data-status="${status}">Ubah</a>
    </td>
  `;

  tblHistory.appendChild(newRow);
  updateNumbers(tblHistory);
}

function updateNumbers(tbody) {
  [...tbody.rows].forEach((row, i) => {
    row.cells[0].textContent = i + 1;
  });
}

document.addEventListener("click", function (e) {
  const acceptBtn = e.target.closest(".btn-terima");
  const rejectBtn = e.target.closest(".btn-tolak");
  const editBtn = e.target.closest(".edit-link");

  if (acceptBtn) {
    const row = acceptBtn.closest("tr");
    tblPending.removeChild(row);
    addRowToHistory(row, "Diterima");
    updateNumbers(tblPending);
  }

  if (rejectBtn) {
    const row = rejectBtn.closest("tr");
    tblPending.removeChild(row);
    addRowToHistory(row, "Ditolak");
    updateNumbers(tblPending);
  }

  if (editBtn) {
    const statusSpan = editBtn.previousElementSibling;
    const isAccepted = statusSpan.textContent.trim() === "Diterima";

    statusSpan.textContent = isAccepted ? "Ditolak" : "Diterima";
    statusSpan.classList.toggle("accepted");
    statusSpan.classList.toggle("rejected");
  }
});
