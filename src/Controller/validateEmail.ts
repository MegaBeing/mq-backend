const validateEmail = (email: string) => {
  try {
    const re = /^[\w.-]+@[a-zA-Z\d.-]+\.(com|in)$/;
    const isEmail = re.test(email);
    if (!isEmail) {
      throw new Error('Invalid Email');
    }
    return isEmail;
  } catch (error) {
    throw error;
  }
};

export default validateEmail;
