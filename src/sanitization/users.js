const userSanitization = (data) => {
  const { name, email } = data;
  return {
    ...data,
    name: name.trim(),
    email: email.trim(),
  };
};

export default userSanitization;
