import React, { useState } from 'react';

const useForm = () => {
  const [values, setValues] = useState({});

  const handleInputChange = ({ target }) => {
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setValues({ ...values, [name]: value });
  };

  return { values, setValues, handleInputChange };
};

export { useForm };
