import { RULES, FX_RULES } from "./config.js";

export function normalizeAmount(value) {
  let v = value.trim();

  if (v.includes(",") && v.includes(".")) {
    v = v.replace(/\./g, "").replace(",", ".");
  } else if (v.includes(",")) {
    v = v.replace(",", ".");
  }

  return v.replace(/[^\d.-]/g, "");
}

export function normalizeDate(dateStr) {
  let clean = dateStr.trim();
  clean = clean.replace(/[^a-zA-Z0-9,\/:\-\s]/g, "");

  const d = new Date(clean);
  if (isNaN(d)) return "Invalid Date";

  return d.toISOString();
}

export function categorize(description) {
  const descUpper = description.toUpperCase();

  for (const rule of RULES) {
    for (const key of rule.keywords) {
      if (descUpper.includes(key.toUpperCase())) {
        return rule.category;
      }
    }
  }
  return "Other";
}

export function convertCurrency(amount, from, to) {
  if (to === "ORIGINAL") return amount;
  if (from === to) return amount;

  if (!FX_RULES[to] || !FX_RULES[to][from]) {
    console.warn(`No FX rule for ${from} -> ${to}`);
    return amount;
  }

  return amount * FX_RULES[to][from];
}
export function renderTable(data) {
  const tabla = document.getElementById("tablaTransacciones");
  tabla.innerHTML = "";

  const monedaDestino =
    document.getElementById("monedaDestino").value;

  for (const t of data) {
    const montoConvertido = convertCurrency(
      parseFloat(t.amount),
      t.currency,
      monedaDestino
    );

    tabla.innerHTML += `
      <tr>
        <td>${t.description}</td>
        <td>${montoConvertido.toFixed(2)}</td>
        <td>${monedaDestino === "ORIGINAL" ? t.currency : monedaDestino}</td>
        <td>${t.date}</td>
        <td>${t.category}</td>
      </tr>
    `;
  }



}

export function renderTotales(totales) {
  const cont = document.getElementById("totalesCategoria");
  cont.innerHTML = "";

  if (Object.keys(totales).length === 0) {
    cont.innerHTML =
      "<em>Conversion required for totals</em>";
    return;
  }

  for (const cat in totales) {
    cont.innerHTML += `
      <div id="totalcategory">
        <strong>${cat}</strong>: ${totales[cat].toFixed(2)}
      </div>
    `;
  }
}

export function calcularTotales(data) {
  const totales = {};
  const monedaDestino =
    document.getElementById("monedaDestino").value;

  const monedas = monedasUnicas(data);


  if (monedaDestino === "ORIGINAL" && monedas.length > 1) {
    console.warn("No se calculan totales: múltiples monedas sin conversión");
    return {};
  }

  for (const t of data) {
    const montoOriginal = parseFloat(t.amount) || 0;

    const montoConvertido = convertCurrency(
      montoOriginal,
      t.currency,
      monedaDestino
    );

    if (!totales[t.category]) {
      totales[t.category] = 0;
    }

    totales[t.category] += montoConvertido;
  }

  return totales;
}


function monedasUnicas(data) {
  return [...new Set(data.map(t => t.currency))];
}