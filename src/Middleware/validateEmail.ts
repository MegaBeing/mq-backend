const validateEmail = (email: string): Boolean => {
  try {
    const re = /^[\w.-]+@[a-zA-Z\d.-]+\.(com|in)$/;
    const isEmail = re.test(email);
    if (!isEmail) {
      return false;
    }
    return true;
  } catch (error) {
    throw error;
  }
};

export default validateEmail;
