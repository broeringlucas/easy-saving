const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">{message}</div>
  );
};

export default ErrorMessage;
