let fetchAsync = async (url, option = {}) => {
  option.credentials = 'include';
  const response = await fetch(url, option);
  return response.json();
}

let isJSON = (str) =>  {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str);
      return !!(typeof obj == 'object' && obj);
    } catch (e) {
      return false;
    }
  }
  return !!(typeof str == 'object' && str);
}

export { fetchAsync,isJSON }
