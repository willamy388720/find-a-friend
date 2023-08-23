import axios from "axios";

const api = axios.create({
  baseURL: "https://viacep.com.br/ws",
});

export async function findCityByCep(cep: string) {
  const cepFormatted = cep.replace(/[^0-9]/g, "");
  const city = await api
    .get(`/${cepFormatted}/json`)
    .then((response) => {
      return response.data.localidade;
    })
    .catch((err) => {
      return null;
    });

  return city;
}
