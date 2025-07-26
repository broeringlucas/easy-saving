const PeriodSelector = ({
  value,
  onChange,
  options = [
    { value: "1", label: "Last month" },
    { value: "3", label: "Last 3 months" },
    { value: "6", label: "Last 6 months" },
    { value: "12", label: "Last year" },
    { value: "total", label: "All time" },
  ],
}) => {
  return (
    <div className="flex justify-end mb-3 ">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-p-orange focus:border-transparent bg-white"
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
