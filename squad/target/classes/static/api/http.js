const BASE_URL = 'http://localhost:8080/condominions';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const erro = await response.text();
    throw new Error(erro || `Erro ${response.status}`);
  }

  // 204 No Content não tem body
  if (response.status === 204) return null;

  return response.json();
}

export const http = {
  get:    (path)         => request(path, { method: 'GET' }),
  post:   (path, body)   => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (path, body)   => request(path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: (path)         => request(path, { method: 'DELETE' }),
};
