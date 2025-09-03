import { useEffect } from "react";
import { useDispatch } from "react-redux";
import WidgetCard from "../Dashboard/WidgetCard";
import { refreshWidgetData } from "../../store/dashboardSlice";

export default function BitcoinWidget({ widget }) {
  console.log("[BitcoinWidget] widget.data:", widget.data);

  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(refreshWidgetData(widget.id));
    }, widget.refreshInterval * 1000);

    dispatch(refreshWidgetData(widget.id));
    return () => clearInterval(interval);
  }, [dispatch, widget.id, widget.refreshInterval]);

  const formatNumber = (n) =>
    Number.isFinite(n)
      ? n.toLocaleString(undefined, { maximumFractionDigits: 2 })
      : "N/A";

  const dataArr = Array.isArray(widget.data) ? widget.data : [];

  const findByName = (key) => {
    if (!key) return undefined;
    const upper = String(key).toUpperCase();
    const match = dataArr.find((d) => String(d.name).toUpperCase() === upper);
    return match?.value;
  };

  const getValueForPath = (path) => {
    const direct = dataArr.find((d) => d.name === path)?.value;
    if (Number.isFinite(direct)) return direct;
    const fromKey = findByName(path);
    if (Number.isFinite(fromKey)) return fromKey;
    return undefined;
  };

  const autoFields = () =>
    dataArr.slice(0, 5).map((item) => ({
      label: item.name,
      path: item.name,
    }));

  const fieldsFromState =
    widget?.selectedFields && widget.selectedFields.length > 0
      ? widget.selectedFields
      : autoFields();

  const fields = fieldsFromState.some((f) => {
    const v = getValueForPath(f.path);
    return Number.isFinite(typeof v === "string" ? +v : v);
  })
    ? fieldsFromState
    : autoFields();

  console.log("[BitcoinWidget] items:", dataArr.length, dataArr.slice(0, 5));
  console.log("[BitcoinWidget] fields:", fields);

  return (
    <WidgetCard widget={widget}>
      <div className="space-y-3">
        {/* Table Header */}
        <div className="flex justify-between font-semibold border-b pb-1 text-sm">
          <span>Company</span>
          <span>Stocks</span>
        </div>

        {/* Table Rows */}
        {fields.length > 0 ? (
          fields.map((field, i) => {
            const raw = getValueForPath(field.path);
            const val =
              typeof raw === "number"
                ? raw
                : typeof raw === "string" && !isNaN(+raw)
                ? +raw
                : findByName(field.path);
            return (
              <div
                key={i}
                className="flex justify-between items-center text-sm py-1"
              >
                <span className="font-medium">{field.label}</span>
                <span
                  className="font-mono text-card-foreground"
                  data-testid={`field-value-${field.path}`}
                >
                  {formatNumber(val)}
                </span>
              </div>
            );
          })
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">No data available</p>
          </div>
        )}
      </div>
    </WidgetCard>
  );
}
