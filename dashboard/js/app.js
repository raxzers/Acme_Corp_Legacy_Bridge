import {
  normalizeAmount,
  normalizeDate,
  categorize,
  renderTable,
  renderTotales,
    calcularTotales
} from "./pipeline.js";

let DATA_ORIGINAL = [];

function parseTransactions(xmlDoc) {
  const nodes = xmlDoc.getElementsByTagName("transaction");
  const results = [];

  for (let t of nodes) {
    const txn = {
      description:
        t.getElementsByTagName("description")[0].textContent.trim(),
      amount: normalizeAmount(
        t.getElementsByTagName("amount")[0].textContent
      ),
      currency:
        t.getElementsByTagName("currency")[0].textContent.trim(),
      date: normalizeDate(
        t.getElementsByTagName("date")[0].textContent
      )
    };

    txn.category = categorize(txn.description);
    results.push(txn);
  }

  return results;
}
function llenarFiltroCategorias(data) {
  const select = document.getElementById("filtroCategoria");

  select.innerHTML = "";

  // opción todas
  const optAll = document.createElement("option");
  optAll.value = "ALL";
  optAll.textContent = "All";
  select.appendChild(optAll);

  const categorias = [...new Set(data.map(t => t.category))];

  for (const c of categorias) {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    select.appendChild(opt);
  }
}
function llenarFiltroMonedas(data) {
  const select = document.getElementById("monedaDestino");

  select.innerHTML = "";

  const optOriginal = document.createElement("option");
  optOriginal.value = "ORIGINAL";
  optOriginal.textContent = "Original";
  select.appendChild(optOriginal);

  const monedas = [...new Set(data.map(t => t.currency))];

  for (const m of monedas) {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m;
    select.appendChild(opt);
  }
}




function aplicarFiltro() {
    const filtro = document.getElementById("filtroCategoria").value;
    let filtrado = DATA_ORIGINAL;
    if (filtro !== "ALL") {
        filtrado = DATA_ORIGINAL.filter(t => t.category === filtro);
    }
    renderTable(filtrado);
    renderTotales(calcularTotales(filtrado));
}

async function cargarXML() {
  try {
    const response = await fetch("./transactions.xml");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const xmlText = await response.text();

    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "text/xml");

    DATA_ORIGINAL = parseTransactions(xml);

    llenarFiltroCategorias(DATA_ORIGINAL);
    llenarFiltroMonedas(DATA_ORIGINAL);

    renderTable(DATA_ORIGINAL);
    renderTotales(calcularTotales(DATA_ORIGINAL));

  } catch (err) {
    console.error("Error cargando XML:", err);
  }
  document.getElementById("filtroCategoria").addEventListener("change", aplicarFiltro);
    document.getElementById("monedaDestino").addEventListener("change", aplicarFiltro);
}


cargarXML();