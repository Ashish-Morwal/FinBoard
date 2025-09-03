import {
  normalizeForWidgets,
  normalizeForTable,
  normalizeForChart,
} from "./normalizers.js";

export const testApiConnection = async (url, apiKeys = {}) => {
  try {
    const urlObj = new URL(url);

    if (url.includes("alphavantage.co") && apiKeys.alphaVantage) {
      urlObj.searchParams.set("apikey", apiKeys.alphaVantage);
    }
    if (url.includes("finnhub.io") && apiKeys.finnhub) {
      urlObj.searchParams.set("token", apiKeys.finnhub);
    }

    const response = await fetch(urlObj.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to connect to API: ${error.message}`);
  }
};

export const fetchWidgetData = async (url, apiKeys = {}) => {
  try {
    const urlObj = new URL(url);

    if (url.includes("alphavantage.co") && apiKeys.alphaVantage) {
      urlObj.searchParams.set("apikey", apiKeys.alphaVantage);
    }
    if (url.includes("finnhub.io") && apiKeys.finnhub) {
      urlObj.searchParams.set("token", apiKeys.finnhub);
    }

    const response = await fetch(urlObj.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    return normalizeForWidgets(json);
  } catch (error) {
    console.error("Error fetching widget data:", error);
    throw error;
  }
};

export const extractFieldsFromResponse = (data, prefix = "", maxDepth = 3) => {
  const fields = [];
  const extractFields = (obj, currentPrefix, depth) => {
    if (depth > maxDepth || obj === null || obj === undefined) return;
    if (Array.isArray(obj)) {
      fields.push({
        path: currentPrefix,
        type: "array",
        value: `Array[${obj.length}]`,
        isArray: true,
      });
      if (obj.length > 0 && typeof obj[0] === "object") {
        extractFields(obj[0], currentPrefix + "[0]", depth + 1);
      }
    } else if (typeof obj === "object") {
      Object.keys(obj).forEach((key) => {
        const newPath = currentPrefix ? `${currentPrefix}.${key}` : key;
        const value = obj[key];
        if (value === null || value === undefined) {
          fields.push({
            path: newPath,
            type: "null",
            value: "null",
            isArray: false,
          });
        } else if (Array.isArray(value)) {
          fields.push({
            path: newPath,
            type: "array",
            value: `Array[${value.length}]`,
            isArray: true,
          });
          if (value.length > 0 && typeof value[0] === "object") {
            extractFields(value[0], newPath + "[0]", depth + 1);
          }
        } else if (typeof value === "object") {
          extractFields(value, newPath, depth + 1);
        } else {
          fields.push({
            path: newPath,
            type: typeof value,
            value: String(value),
            isArray: false,
          });
        }
      });
    } else {
      fields.push({
        path: currentPrefix,
        type: typeof obj,
        value: String(obj),
        isArray: false,
      });
    }
  };
  extractFields(data, prefix, 0);
  return fields;
};

export const DEFAULT_APIS = {
  alphavantage: {
    globalQuote: (symbol) =>
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}`,
    intradayData: (symbol) =>
      `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min`,
    exchangeRate: (from, to) =>
      `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}`,
  },
  finnhub: {
    quote: (symbol) => `https://finnhub.io/api/v1/quote?symbol=${symbol}`,
    companyProfile: (symbol) =>
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}`,
    news: (symbol) =>
      `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=2024-01-01&to=2024-12-31`,
  },
  coinbase: {
    exchangeRates: (currency) =>
      `https://api.coinbase.com/v2/exchange-rates?currency=${currency}`,
    currentPrice: (pair) => `https://api.coinbase.com/v2/prices/${pair}/spot`,
  },
};
