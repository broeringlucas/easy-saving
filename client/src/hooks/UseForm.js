import { useState } from "react";

const UseForm = (initialState, validators = {}, formatters = {}) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (formatters[name]) {
      formattedValue = formatters[name](value);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (formError) setFormError("");
  };

  const validateForm = async () => {
    setIsValidating(true);
    let isValid = true;
    const newErrors = {};

    for (const field in validators) {
      if (newErrors[field]) continue;

      const error = await validators[field](formData[field], formData);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    setIsValidating(false);
    return isValid;
  };

  return {
    validateForm,
    isValidating,
    formData,
    errors,
    formError,
    setFormData,
    setErrors,
    setFormError,
    handleChange,
  };
};

export default UseForm;
