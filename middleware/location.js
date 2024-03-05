const axios = require('axios');

async function checkCountryExistence(countryName) {
  const baseUrl = `https://restcountries.com/v3.1/name/${countryName}`;
  try {
    const response = await axios.get(baseUrl);
    const data = response.data;
    return data.some(
      (el) => el.name.official === countryName || el.name.common === countryName
    );
  } catch (error) {
    return false;
  }
}

async function getAllCountries() {
  const baseUrl = 'https://restcountries.com/v3.1/all';
  try {
    const response = await axios.get(baseUrl);
    const data = response.data;
    const countryNames = data.map((el) => {
      return { name: el.name.official, flag: el.flag };
    });
    return countryNames;
  } catch (error) {
    console.log('error in getting all countries names');
  }
}

module.exports = {
  checkCountryExistence,
  getAllCountries,
};
