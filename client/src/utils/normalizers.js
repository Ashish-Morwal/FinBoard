// // src/utils/normalizers.js

// // --- Helpers ---
// export function numberify(v) {
//   const n = typeof v === "string" ? parseFloat(v) : Number(v);
//   return Number.isFinite(n) ? n : NaN;
// }

// export function firstNumeric(obj) {
//   for (const k of Object.keys(obj)) {
//     const v = obj[k];
//     if (typeof v === "number" && Number.isFinite(v)) return v;
//     if (typeof v === "string" && Number.isFinite(+v)) return +v;
//   }
//   return null;
// }

// export function dig(obj, key) {
//   const v = obj?.[key];
//   if (typeof v === "number" || typeof v === "string") return v;
//   if (v && typeof v === "object") return firstNumeric(v);
//   return undefined;
// }

// export function mapItem(item) {
//   if (typeof item === "number") return { value: numberify(item) };

//   if (Array.isArray(item) && item.length >= 2 && Number.isFinite(+item[1])) {
//     return { time: item[0], value: numberify(item[1]) };
//   }

//   if (item && typeof item === "object") {
//     const keys = ["value", "price", "close", "rate", "last", "amount"];
//     for (const k of keys) {
//       const v = dig(item, k);
//       if (Number.isFinite(+v)) return { ...item, value: numberify(v) };
//     }
//     const v = firstNumeric(item);
//     if (v != null) return { ...item, value: numberify(v) };
//   }

//   return { ...item, value: NaN };
// }

// // --- Normalizers ---
// export function normalizeForWidgets(json) {
//   if (Array.isArray(json)) return json.map(mapItem);

//   if (json?.data && Array.isArray(json.data)) return json.data.map(mapItem);

//   // ✅ Coinbase exchange rates
//   if (json?.data?.rates && typeof json.data.rates === "object") {
//     return Object.entries(json.data.rates)
//       .slice(0, 20)
//       .map(([currency, rate]) => ({ name: currency, value: numberify(rate) }));
//   }

//   // ✅ Coinbase spot price (/v2/prices/<pair>/spot)
//   if (json?.data?.amount) {
//     const base = json.data.base || "ASSET";
//     return [{ name: base, value: numberify(json.data.amount) }];
//   }

//   // ✅ Generic "prices" array
//   if (Array.isArray(json?.prices)) {
//     return json.prices.map(([t, p]) => ({ time: t, value: numberify(p) }));
//   }

//   const single = mapItem(json);
//   if (Number.isFinite(single.value)) return [single];
//   return [];
// }

// export function normalizeForChart(json) {
//   if (Array.isArray(json)) return json.map(mapItem);
//   if (json?.data && Array.isArray(json.data)) return json.data.map(mapItem);

//   if (Array.isArray(json?.prices)) {
//     return json.prices.map(([t, p]) => ({ time: t, value: numberify(p) }));
//   }

//   const single = mapItem(json);
//   if (Number.isFinite(single.value)) return [single];
//   return [];
// }

// export function numberify(v) {
//   const n = typeof v === "string" ? parseFloat(v) : Number(v);
//   return Number.isFinite(n) ? n : NaN;
// }

// export function firstNumeric(obj) {
//   for (const k of Object.keys(obj)) {
//     const v = obj[k];
//     if (typeof v === "number" && Number.isFinite(v)) return v;
//     if (typeof v === "string" && Number.isFinite(+v)) return +v;
//   }
//   return null;
// }

// export function dig(obj, key) {
//   const v = obj?.[key];
//   if (typeof v === "number" || typeof v === "string") return v;
//   if (v && typeof v === "object") return firstNumeric(v);
//   return undefined;
// }

// export function mapItem(item) {
//   if (typeof item === "number") return { value: numberify(item) };
//   if (Array.isArray(item) && item.length >= 2 && Number.isFinite(+item[1])) {
//     return { time: item[0], value: numberify(item[1]) };
//   }
//   if (item && typeof item === "object") {
//     const keys = ["value", "price", "close", "rate", "last", "amount"];
//     for (const k of keys) {
//       const v = dig(item, k);
//       if (Number.isFinite(+v)) return { ...item, value: numberify(v) };
//     }
//     const v = firstNumeric(item);
//     if (v != null) return { ...item, value: numberify(v) };
//   }
//   return { ...item, value: NaN };
// }

// export function normalizeForWidgets(json) {
//   if (Array.isArray(json)) return json.map(mapItem);
//   if (json?.data && Array.isArray(json.data)) return json.data.map(mapItem);

//   if (json?.data?.rates && typeof json.data.rates === "object") {
//     return Object.entries(json.data.rates).map(([currency, rate]) => ({
//       name: currency,
//       value: numberify(rate),
//     }));
//   }

//   if (json?.data?.amount) {
//     const base = json.data.base || "ASSET";
//     return [{ name: base, value: numberify(json.data.amount) }];
//   }

//   if (Array.isArray(json?.prices)) {
//     return json.prices.map(([t, p]) => ({ time: t, value: numberify(p) }));
//   }

//   const single = mapItem(json);
//   if (Number.isFinite(single.value)) return [single];
//   return [];
// }

// export function normalizeForChart(json) {
//   if (Array.isArray(json)) return json.map(mapItem);
//   if (json?.data && Array.isArray(json.data)) return json.data.map(mapItem);

//   if (Array.isArray(json?.prices)) {
//     return json.prices.map(([t, p]) => ({ time: t, value: numberify(p) }));
//   }

//   const single = mapItem(json);
//   if (Number.isFinite(single.value)) return [single];
//   return [];
// }

export function numberify(v) {
  const n = typeof v === "string" ? parseFloat(v) : Number(v);
  return Number.isFinite(n) ? n : NaN;
}

export function firstNumeric(obj) {
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && Number.isFinite(+v)) return +v;
  }
  return null;
}

export function dig(obj, key) {
  const v = obj?.[key];
  if (typeof v === "number" || typeof v === "string") return v;
  if (v && typeof v === "object") return firstNumeric(v);
  return undefined;
}

export function mapItem(item) {
  if (typeof item === "number") return { value: numberify(item) };
  if (Array.isArray(item) && item.length >= 2 && Number.isFinite(+item[1])) {
    return { time: item[0], value: numberify(item[1]) };
  }
  if (item && typeof item === "object") {
    const keys = ["value", "price", "close", "rate", "last", "amount"];
    for (const k of keys) {
      const v = dig(item, k);
      if (Number.isFinite(+v)) return { ...item, value: numberify(v) };
    }
    const v = firstNumeric(item);
    if (v != null) return { ...item, value: numberify(v) };
  }
  return { ...item, value: NaN };
}

export function normalizeForWidgets(json) {
  if (Array.isArray(json)) return json.map(mapItem);
  if (json?.data && Array.isArray(json.data)) return json.data.map(mapItem);
  if (json?.data?.rates && typeof json.data.rates === "object") {
    return Object.entries(json.data.rates).map(([currency, rate]) => ({
      name: currency,
      value: numberify(rate),
    }));
  }
  if (json?.data?.amount) {
    const base = json.data.base || "ASSET";
    return [{ name: base, value: numberify(json.data.amount) }];
  }
  if (Array.isArray(json?.prices)) {
    return json.prices.map(([t, p]) => ({ time: t, value: numberify(p) }));
  }
  const single = mapItem(json);
  if (Number.isFinite(single.value)) return [single];
  return [];
}

// export function normalizeForTable(json) {
//   if (json?.data?.rates && typeof json.data.rates === "object") {
//     return Object.entries(json.data.rates).map(([currency, rate]) => ({
//       symbol: currency,
//       rate: numberify(rate),
//     }));
//   }
//   if (json?.data && Array.isArray(json.data)) return json.data;
//   if (Array.isArray(json)) return json;
//   return [];
// }
export function normalizeForTable(json) {
  if (Array.isArray(json)) {
    return json.map((item) => ({
      symbol: item.name ?? item.symbol,
      rate: item.value ?? item.rate,
    }));
  }

  if (json?.data?.rates && typeof json.data.rates === "object") {
    return Object.entries(json.data.rates).map(([currency, rate]) => ({
      symbol: currency,
      rate: parseFloat(rate),
    }));
  }

  return [];
}

export function normalizeForChart(json) {
  if (Array.isArray(json)) return json.map(mapItem);
  if (json?.data && Array.isArray(json.data)) return json.data.map(mapItem);
  if (Array.isArray(json?.prices)) {
    return json.prices.map(([t, p]) => ({ time: t, value: numberify(p) }));
  }
  const single = mapItem(json);
  if (Number.isFinite(single.value)) return [single];
  return [];
}
