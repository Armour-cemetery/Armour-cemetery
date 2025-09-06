let records = [
  { id: 1, lot: "1", name: "John A. Smith", birth: "1920-03-12", death: "1988-08-05", family: "Smith", notes: "Veteran, WW2", photo: "" },
  { id: 2, lot: "2", name: "Mary E. Johnson", birth: "1932-07-22", death: "2010-06-11", family: "Johnson", notes: "Beloved mother", photo: "" },
  { id: 3, lot: "3", name: "Peter Armour", birth: "1910-01-01", death: "1975-11-30", family: "Armour", notes: "Founder of Armour family plot", photo: "" },
  { id: 4, lot: "4", name: "Anna Lee", birth: "1945-10-10", death: "2005-04-02", family: "Lee", notes: "", photo: "" },
  { id: 5, lot: "5", name: "Samuel Green", birth: "1899-05-05", death: "1960-02-02", family: "Green", notes: "Obelisk marker", photo: "" }
];

const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('searchBtn');
const resultsList = document.getElementById('resultsList');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');
const fileInput = document.getElementById('fileInput');

document.querySelectorAll('.lot').forEach(r => {
  r.addEventListener('click', () => {
    const lot = r.dataset.lot;
    showLotModal(lot);
  });
});

searchBtn.addEventListener('click', doSearch);
searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });

function doSearch(){
  const q = searchInput.value.trim().toLowerCase();
  if(!q){ resultsList.innerHTML = 'Please enter a search term.'; return; }

  const results = records.filter(rec =>
    (rec.name && rec.name.toLowerCase().includes(q)) ||
    (rec.family && rec.family.toLowerCase().includes(q)) ||
    (rec.lot && (`lot ${rec.lot}`.toLowerCase() === q || rec.lot.toLowerCase() === q))
  );

  if(results.length === 0){
    resultsList.innerHTML = `<div>No results for "<b>${escapeHtml(q)}</b>".</div>`;
    return;
  }

  resultsList.innerHTML = '';
  results.forEach(r => {
    const el = document.createElement('div');
    el.className = 'record';
    el.innerHTML = `<strong>${escapeHtml(r.name)}</strong> — Lot ${escapeHtml(r.lot)}<br/>
                    ${r.birth ? `b. ${r.birth}` : ''} ${r.death ? `— d. ${r.death}` : ''}<br/>
                    <em>${escapeHtml(r.notes || '')}</em>
                    <div><button data-lot="${r.lot}" class="viewBtn">View Lot</button></div>`;
    resultsList.appendChild(el);
  });

  document.querySelectorAll('.viewBtn').forEach(b => {
    b.addEventListener('click', () => showLotModal(b.dataset.lot));
  });
}

function showLotModal(lot){
  const recs = records.filter(r => String(r.lot) === String(lot));
  modalBody.innerHTML = `<h3>Lot ${lot}</h3>`;
  if(recs.length === 0){
    modalBody.innerHTML += `<p>No burial records found for Lot ${lot}.</p>`;
  } else {
    recs.forEach(r => {
      modalBody.innerHTML += `<div class='record'><strong>${escapeHtml(r.name)}</strong><div>${r.birth ? 'Born ' + escapeHtml(r.birth) : ''} ${r.death ? '— Died ' + escapeHtml(r.death) : ''}</div><div>${escapeHtml(r.notes || '')}</div></div>`;
    });
  }
  modal.classList.remove('hidden');
}

closeModal.addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', (ev) => { if(ev.target === modal) modal.classList.add('hidden'); });

function escapeHtml(s){
  if(!s) return '';
  return s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}
