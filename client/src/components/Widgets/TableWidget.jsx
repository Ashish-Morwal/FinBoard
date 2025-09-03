import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import WidgetCard from "../Dashboard/WidgetCard";
import { refreshWidgetData } from "../../store/dashboardSlice";
import { formatCurrency } from "../../utils/formatters";

function normalizeForTable(data) {
  if (!data) return [];

  // Coinbase API format
  if (data?.rates && typeof data.rates === "object") {
    return Object.entries(data.rates).map(([symbol, rate]) => ({
      symbol,
      rate: parseFloat(rate),
    }));
  }

  // Wrapped array: { data: [...] }
  if (Array.isArray(data?.data)) {
    return data.data.map((item) => ({
      symbol: item.symbol ?? item.name,
      rate: item.rate ?? item.value,
    }));
  }

  // Direct array
  if (Array.isArray(data)) {
    return data.map((item) => ({
      symbol: item.symbol ?? item.name,
      rate: item.rate ?? item.value,
    }));
  }

  return [];
}

export default function TableWidget({ widget }) {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(refreshWidgetData(widget.id));
    }, widget.refreshInterval * 1000);

    dispatch(refreshWidgetData(widget.id));
    return () => clearInterval(interval);
  }, [dispatch, widget.id, widget.refreshInterval]);

  useEffect(() => {
    const normalized = normalizeForTable(widget.data);

    const filtered = normalized.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    setFilteredData(filtered);
    setPage(1);
  }, [widget.data, searchQuery]);

  const pageData = filteredData.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredData.length / pageSize);

  return (
    <WidgetCard widget={widget}>
      <div className="mb-4 flex items-center justify-between">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="bg-input border border-border rounded-lg px-3 py-1 text-sm w-48 pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <i className="fas fa-search absolute left-2.5 top-2 text-muted-foreground text-xs"></i>
        </div>
        <span className="text-xs text-muted-foreground">
          {filteredData.length} items
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground py-3 px-2">
                Symbol
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground py-3 px-2">
                Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                >
                  <td className="py-3 px-2 text-sm">{row.symbol}</td>
                  <td className="py-3 px-2 text-sm">
                    {row.rate !== undefined ? formatCurrency(row.rate) : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={2}
                  className="py-8 text-center text-muted-foreground"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </WidgetCard>
  );
}
