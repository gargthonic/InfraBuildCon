import { HiPlus, HiTrash } from "react-icons/hi";
import { ICON_OPTIONS, getIcon } from "../../constants/icons";

const inputClass =
  "w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand transition-colors text-sm";

export default function RepeatableList({ items, fields, onChange, emptyItem, addLabel = "Add item" }) {
  const updateItem = (index, name, value) => {
    const next = items.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );
    onChange(next);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const addItem = () => {
    onChange([...items, { ...emptyItem }]);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-border rounded-xl p-4 bg-background space-y-3 relative"
        >
          <button
            type="button"
            onClick={() => removeItem(index)}
            aria-label="Remove item"
            className="absolute top-3 right-3 p-1.5 rounded-md text-muted hover:text-red-500 hover:bg-red-500/10 transition"
          >
            <HiTrash size={16} />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
            {fields.map((field) => {
              if (field.type === "icon") {
                const Icon = getIcon(item[field.name]);
                return (
                  <div key={field.name} className={field.full ? "sm:col-span-2" : ""}>
                    <label className="block text-xs font-medium text-muted mb-1">
                      {field.label}
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center h-9 w-9 rounded-md bg-brand-soft text-brand shrink-0">
                        <Icon size={18} />
                      </span>
                      <select
                        value={item[field.name] || ""}
                        onChange={(e) =>
                          updateItem(index, field.name, e.target.value)
                        }
                        className={inputClass}
                      >
                        {ICON_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              }

              if (field.type === "textarea") {
                return (
                  <div key={field.name} className={field.full ? "sm:col-span-2" : ""}>
                    <label className="block text-xs font-medium text-muted mb-1">
                      {field.label}
                    </label>
                    <textarea
                      value={item[field.name] || ""}
                      onChange={(e) =>
                        updateItem(index, field.name, e.target.value)
                      }
                      rows={2}
                      placeholder={field.placeholder}
                      className={inputClass}
                    />
                  </div>
                );
              }

              return (
                <div key={field.name} className={field.full ? "sm:col-span-2" : ""}>
                  <label className="block text-xs font-medium text-muted mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type === "number" ? "number" : "text"}
                    value={item[field.name] ?? ""}
                    onChange={(e) =>
                      updateItem(index, field.name, e.target.value)
                    }
                    placeholder={field.placeholder}
                    className={inputClass}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:gap-2.5 transition-all"
      >
        <HiPlus /> {addLabel}
      </button>
    </div>
  );
}
