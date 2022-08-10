import { useCallback, useEffect, useState } from "react";
import styles from "./style.module.css";

export const FormComponent = () => {
  const initialValues = {
    name: "",
    email: "",
    message: "",
    date: "",
    phone: "",
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFormSuccess, setIsFormSuccess] = useState(false);
  const [isFormError, setIsFormError] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormValues((state) => ({
      ...state,
      [name]: value,
    }));
    switch (name) {
      case "name":
        validateName(value);
        break;
      case "email":
        validateEmail(value);
        break;
      case "phone":
        validatePhone(value);
        break;
      case "date":
        validateDate(value);
        break;
      case "message":
        validateMessage(value);
        break;
    }
  }, []);

  useEffect(() => {});

  const validateEmail = (newEmail) => {
    const value = newEmail || formValues.email;
    const regEx = /[a-zA-Z0-9.%+-]+@[a-z0-9.-]+\.[a-z]/g;
    let message;

    if (value === "") {
      message = "Email is required";
    } else if (!regEx.test(value)) {
      message = "Email is not valid";
    }
    setFormErrors({ ...formErrors, email: message });
    return !message;
  };

  const validateName = (newName) => {
    const value = newName || formValues.name;
    const regEx = /[A-Za-z]{3,30}\ [A-Za-z]{3,30}/;
    let message;

    if (value === "") {
      message = "First and Last name are required";
    } else if (!regEx.test(value)) {
      message = "First and Last name are not valid";
    }
    setFormErrors({ ...formErrors, name: message });
    return !message;
  };

  const validatePhone = (newPhone) => {
    const value = newPhone || formValues.phone;
    const regEx =
      /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    let message;

    if (value === "") {
      message = "Phone is required";
    } else if (!regEx.test(value)) {
      message = "Phone is not valid";
    }
    setFormErrors({ ...formErrors, phone: message });
    return !message;
  };

  const validateDate = (newDate) => {
    const value = newDate || formValues.date;
    let message;

    if (value === "") {
      message = "Date is required";
    }
    setFormErrors({ ...formErrors, date: message });
    return !message;
  };

  const validateMessage = (newMessage) => {
    const value = newMessage || formValues.message;
    const regEx = /^.{10,300}$/;
    let message;

    if (value === "") {
      message = "Message is required";
    } else if (!regEx.test(value)) {
      message = "Message is not valid";
    }

    setFormErrors({ ...formErrors, message });
    return !message;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (isFormInvalid()) {
      return;
    }

    // here we have a request to the server and when it completes we get success / error
    setIsLoading(true);
    fetchRequest().then(
      (result) => {
        setIsLoading(false);
        setIsFormSuccess(result);
        setFormValues(initialValues);
      },
      (error) => {
        setIsLoading(false);
        setIsFormError(error);
      }
    );
  };

  async function fetchRequest() {
    const response = await fetch("", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  }

  const isFormInvalid = () => {
    return [
      validateName(),
      validateEmail(),
      validatePhone(),
      validateDate(),
      validateMessage(),
    ].some((isValid) => !isValid);
  };

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <input
        type="text"
        className={styles.input}
        name="name"
        placeholder="First and Last name..."
        value={formValues.name.toUpperCase()}
        onChange={handleChange}
        required
      />
      <p className={styles.message}>{formErrors.name}</p>

      <input
        type="email"
        name="email"
        className={styles.input}
        placeholder="Email..."
        value={formValues.email}
        onChange={handleChange}
        required
      />
      <p className={styles.message}>{formErrors.email}</p>

      <input
        type="tel"
        name="phone"
        className={styles.input}
        placeholder="Phone..."
        onChange={handleChange}
        value={formValues.phone}
        required
      />
      <p className={styles.message}>{formErrors.phone}</p>

      <input
        type="date"
        name="date"
        className={styles.input}
        required
        onChange={handleChange}
        value={formValues.date}
      />
      <p className={styles.message}>{formErrors.date}</p>

      <textarea
        className={styles.textarea}
        value={formValues.message}
        name="message"
        onChange={handleChange}
        placeholder="Message..."
        required
      />
      <p className={styles.message}>{formErrors.message}</p>

      <button type="submit" className={styles.button} disabled={isLoading}>
        Send
      </button>
    </form>
  );
};
