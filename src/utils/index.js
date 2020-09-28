let fetchAsync = async (url, option = {}) => {
  option.credentials = 'include';
  let response = await fetch(url, option);
  return response.json();
}

export { fetchAsync }
