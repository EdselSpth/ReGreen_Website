fetch("http://localhost:3000/api/keuntungan")
  .then(res => res.json())
  .then(data => {
    const tbody = document.querySelector("#tblPending tbody");
    data.forEach((item, i) => {
      tbody.innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${item.nama}</td>
          <td>${item.nominal}</td>
          <td>${item.rekening}</td>
          <td>${item.metode}</td>
          <td>
            <button class="btn-terima">Terima</button>
            <button class="btn-tolak">Tolak</button>
          </td>
        </tr>
      `;
    });
  });
