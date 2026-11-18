async function nacitat() {
  const odpoved = await fetch('/api/knihy');
  const knihy = await odpoved.json();

  const telo = document.getElementById('telo');
  telo.innerHTML = '';

  knihy.forEach(function (k) {
    telo.innerHTML += `
      <tr>
        <td>${k.id}</td>
        <td>${k.autor}</td>
        <td>${k.nazov}</td>
        <td>${k.cena}</td>
        <td>${k.rok}</td>
        <td>
          <button onclick="zmazat(${k.id})">Zmazať</button>
          <button onclick="zmenit(${k.id}, 'cena')">Zmeniť cenu</button>
          <button onclick="zmenit(${k.id}, 'autor')">Zmeniť autora</button>
          <button onclick="zmenit(${k.id}, 'nazov')">Zmeniť názov</button>
          <button onclick="zmenit(${k.id}, 'rok')">Zmeniť rok</button>
        </td>
      </tr>`;
  });
}

async function pridat() {
  const kniha = {
    autor: document.getElementById('autor').value,
    nazov: document.getElementById('nazov').value,
    cena: document.getElementById('cena').value,
    rok: document.getElementById('rok').value
  };

  await fetch('/api/knihy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(kniha)
  });

  nacitat();
}


async function zmazat(id) {
  await fetch('/api/knihy/' + id, { method: 'DELETE' });
  nacitat();
}

async function zmenit(id, pole) {
  const hodnota = prompt('Zadaj novú hodnotu pre: ' + pole);

  if (hodnota === null || hodnota === '') {
    return;
  }

  await fetch('/api/knihy/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pole: pole, hodnota: hodnota })
  });

  nacitat();
}

nacitat();