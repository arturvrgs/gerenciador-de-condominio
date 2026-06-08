import { http } from './http.js';

const PATH = '/reservas';

export const reservaApi = {
  listar:     ()              => http.get(PATH),
  acharPorId: (id)            => http.get(`${PATH}/${id}`),
  criar:      (reserva)       => http.post(PATH, reserva),
  atualizar:  (id, reserva)   => http.put(`${PATH}/${id}`, reserva),
  deletar:    (id)            => http.delete(`${PATH}/${id}`),
};