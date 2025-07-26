const DeleteConfirmationModal = ({
  itemName,
  onCancel,
  onConfirm,
  description = "All associated transactions will be removed.",
}) => {
  return (
    <div className="rounded-lg max-w-md mx-auto w-full">
      <div className="p-4 rounded-lg">
        <p className="text-base text-center mt-2">
          {description} Are you sure you want to delete
          <span className="text-red-600 font-bold"> {itemName}</span>?
        </p>
      </div>
      <div className="flex justify-center gap-3">
        <button
          onClick={onCancel}
          className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
