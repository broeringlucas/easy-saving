const PeriodSelector = ({
  value,
  onChange,
  options = [
    { value: "1", label: "Último mês" },
    { value: "3", label: "Últimos 3 meses" },
    { value: "6", label: "Últimos 6 meses" },
    { value: "12", label: "Último ano" },
    { value: "total", label: "Total" },
  ],
}) => {
  return (
    <div className="flex justify-end mb-3">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PeriodSelector;
