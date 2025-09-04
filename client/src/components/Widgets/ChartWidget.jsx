import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import WidgetCard from "../Dashboard/WidgetCard";

import { refreshWidgetData } from "../../store/dashboardSlice";

export default function ChartWidget({ widget }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(refreshWidgetData(widget.id));
    }, widget.refreshInterval * 1000);

    dispatch(refreshWidgetData(widget.id));

    return () => clearInterval(interval);
  }, [dispatch, widget.id, widget.refreshInterval]);

  const prepareChartData = () => {
    // console.log("[DEBUG] Widget data:", widget.name, widget.data);

    if (!widget.data || !Array.isArray(widget.data)) return [];
    return widget.data
      .slice(0, 20)
      .map((item, index) => ({
        name: item.name ?? item.time ?? `Point ${index + 1}`,
        value:
          Number(item.value ?? item.price ?? item.close ?? item.rate ?? 0) || 0,
        ...item,
      }))
      .filter((d) => Number.isFinite(d.value));
  };

  const chartData = prepareChartData();

  return (
    <WidgetCard widget={widget}>
      <div className="h-48 w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="name"
                stroke="var(--muted-foreground)"
                fontSize={12}
              />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--card-foreground)",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={{ fill: "var(--chart-1)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full bg-secondary/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
            <div className="text-center">
              <i className="fas fa-chart-line text-3xl text-muted-foreground mb-2"></i>
              <p className="text-sm text-muted-foreground">
                {widget.data
                  ? "No chart data available"
                  : "Loading chart data..."}
              </p>
            </div>
          </div>
        )}
      </div>

      {chartData.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-4 text-xs">
            <span className="text-chart-1">
              High:{" "}
              <span data-testid={`chart-high-${widget.id}`}>
                {Math.max(...chartData.map((d) => d.value)).toFixed(2)}
              </span>
            </span>
            <span className="text-chart-5">
              Low:{" "}
              <span data-testid={`chart-low-${widget.id}`}>
                {Math.min(...chartData.map((d) => d.value)).toFixed(2)}
              </span>
            </span>
          </div>
        </div>
      )}
    </WidgetCard>
  );
}
