import { http } from './http.js';

const CAMINHO = '/wiki';

// API da Wiki — somente síndico pode criar e atualizar
export const wikiApi = {
  acharPorId: (id)       => http.get(`${CAMINHO}/${id}`),
  criar:      (wiki)     => http.post(CAMINHO, wiki),
  atualizar:  (id, wiki) => http.put(`${CAMINHO}/${id}`, wiki),
};
