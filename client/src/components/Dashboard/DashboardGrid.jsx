import { useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useDispatch } from "react-redux";
import { reorderWidgets } from "../../store/dashboardSlice";
import WidgetCard from "./WidgetCard";
import AddWidgetPlaceholder from "./AddWidgetPlaceholder";
import BitcoinWidget from "../Widgets/BitcoinWidget";
import TableWidget from "../Widgets/TableWidget";
import ChartWidget from "../Widgets/ChartWidget";
import WatchlistWidget from "../Widgets/WatchlistWidget";

const WidgetRenderer = ({ widget }) => {
  switch (widget.type) {
    case "card":
      return <BitcoinWidget widget={widget} />;
    case "table":
      return <TableWidget widget={widget} />;
    case "chart":
      return <ChartWidget widget={widget} />;
    case "watchlist":
      return <WatchlistWidget widget={widget} />;
    default:
      return <WidgetCard widget={widget} />;
  }
};

export default function DashboardGrid() {
  const dispatch = useDispatch();
  const { widgets } = useSelector((state) => state.dashboard);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    dispatch(
      reorderWidgets({
        startIndex: result.source.index,
        endIndex: result.destination.index,
      })
    );
  };

  if (widgets.length === 0) {
    return (
      <div className="text-center py-16" data-testid="empty-state">
        <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-chart-bar text-primary text-2xl"></i>
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Build Your Finance Dashboard
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Create custom widgets by connecting to any finance API. Track stocks,
          crypto, and market indicators - all in one place.
        </p>
        <AddWidgetPlaceholder isButton={true} />
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="dashboard-grid">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            data-testid="dashboard-grid"
          >
            {widgets.map((widget, index) => (
              <Draggable key={widget.id} draggableId={widget.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${getGridSpanClass(widget.size)} ${
                      snapshot.isDragging ? "drag-preview" : ""
                    }`}
                    data-testid={`widget-${widget.id}`}
                  >
                    <WidgetRenderer widget={widget} />
                  </div>
                )}
              </Draggable>
            ))}

            {/* Add Widget Placeholder */}
            <AddWidgetPlaceholder />

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

function getGridSpanClass(size) {
  switch (size) {
    case "small":
      return "";
    case "medium":
      return "md:col-span-2";
    case "large":
      return "md:col-span-2 lg:col-span-3";
    case "full":
      return "md:col-span-2 lg:col-span-3 xl:col-span-4";
    default:
      return "";
  }
}
