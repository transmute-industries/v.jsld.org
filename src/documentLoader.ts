import axios from "axios";

const getWithCache = async (url: string) => {
  const cacheHit = window.localStorage.getItem(url);
  if (!!cacheHit) {
    return JSON.parse(cacheHit);
  }
  const { data } = await axios.get(url, {
    headers: { accept: "application/json" },
  });
  window.localStorage.setItem(url, JSON.stringify(data));
  return data;
};

const documentLoader = async (iri: string) => {
  if (iri.startsWith("http")) {
    return {
      document: await getWithCache(iri),
    };
  }
  const message = `Unsupported iri: ${iri}`;
  throw new Error(message);
};

export default documentLoader;
