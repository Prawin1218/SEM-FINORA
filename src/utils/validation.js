// Form validation utilities for FINORA

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validateSignIn = ({ email, password }) => {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!password || !password.trim()) {
    errors.password = 'Password is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateSignUp = ({ name, email, password, confirmPassword }) => {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = 'Full name is required.';
  } else if (name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters.';
  }

  if (!email || !email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Confirm password is required.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateProfile = ({ name, email }) => {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = 'Full name cannot be empty.';
  } else if (name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters.';
  }

  if (!email || !email.trim()) {
    errors.email = 'Email address cannot be empty.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateTransaction = ({ title, amount, type, category, date }) => {
  const errors = {};

  if (!title || !title.trim()) {
    errors.title = 'Transaction title is required.';
  } else if (title.trim().length < 2) {
    errors.title = 'Title must be at least 2 characters.';
  }

  const numAmount = Number(amount);
  if (amount === undefined || amount === null || amount === '') {
    errors.amount = 'Amount is required.';
  } else if (isNaN(numAmount) || numAmount <= 0) {
    errors.amount = 'Amount must be a valid positive number.';
  }

  if (!type || !['income', 'expense'].includes(type)) {
    errors.type = 'Please select Income or Expense.';
  }

  if (!category || !category.trim()) {
    errors.category = 'Please select a category.';
  }

  if (!date || !date.trim()) {
    errors.date = 'Date is required.';
  } else {
    const parts = date.split('-');
    if (parts.length !== 3 || isNaN(Date.parse(date))) {
      errors.date = 'Date must be formatted as YYYY-MM-DD.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
