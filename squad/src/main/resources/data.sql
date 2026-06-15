-- Usuários adicionais
INSERT INTO usuarios (nome, sobrenome, tipo, cpf, senha) VALUES ('Ana', 'Reis', 'MORADOR', '444.444.444-44', 'morador123');
INSERT INTO usuarios (nome, sobrenome, tipo, cpf, senha) VALUES ('João', 'Lima', 'MORADOR', '555.555.555-55', 'morador123');

-- Áreas comuns adicionais
INSERT INTO areas_comuns (nome, estado, url_imagem) VALUES ('Churrasqueira', 'DISPONIVEL', NULL);
INSERT INTO areas_comuns (nome, estado, url_imagem) VALUES ('Quadra Esportiva', 'DISPONIVEL', NULL);

-- Fórum — postagens do síndico (id 1), variando as tags
INSERT INTO postagens (url_imagem, titulo, descricao, qtde_upvotes, tag, tipo_post, id_usuario)
VALUES (NULL, 'Manutenção da caixa d''água', 'O fornecimento de água será interrompido das 8h às 14h na quarta-feira 18/06. Armazenem água com antecedência.', 0, 'ALERTA', 'FORUM', 1);

INSERT INTO postagens (url_imagem, titulo, descricao, qtde_upvotes, tag, tipo_post, id_usuario)
VALUES (NULL, 'Assembleia ordinária — julho', 'Assembleia marcada para 20/07 às 19h no salão de festas. Pauta: aprovação do orçamento 2025/2026.', 0, 'FIXADO', 'FORUM', 1);

INSERT INTO postagens (url_imagem, titulo, descricao, qtde_upvotes, tag, tipo_post, id_usuario)
VALUES (NULL, 'Aviso sobre uso da piscina', 'Crianças menores de 12 anos devem estar acompanhadas de um adulto responsável ao usar a piscina.', 0, 'NULA', 'FORUM', 1);

-- Ocorrências — moradores diferentes, tags variadas
INSERT INTO postagens (url_imagem, titulo, descricao, qtde_upvotes, tag, tipo_post, id_usuario)
VALUES (NULL, 'Barulho excessivo no bloco B', 'Som alto após as 22h no apartamento 304 nos últimos três fins de semana. Peço providências.', 12, 'RECLAMACAO', 'OCORRENCIA', 2);

INSERT INTO postagens (url_imagem, titulo, descricao, qtde_upvotes, tag, tipo_post, id_usuario)
VALUES (NULL, 'Jardim reformado ficou incrível', 'Parabéns ao síndico pela iniciativa de reformar a área verde. As crianças adoraram.', 27, 'ELOGIO', 'OCORRENCIA', 3);

INSERT INTO postagens (url_imagem, titulo, descricao, qtde_upvotes, tag, tipo_post, id_usuario)
VALUES (NULL, 'Lâmpada queimada no corredor', 'A lâmpada do corredor do 2º andar do bloco A está apagada há uma semana.', 5, 'RECLAMACAO', 'OCORRENCIA', 4);

INSERT INTO postagens (url_imagem, titulo, descricao, qtde_upvotes, tag, tipo_post, id_usuario)
VALUES (NULL, 'Portão da garagem travando', 'O portão automático da garagem está travando ao fechar. Já aconteceu três vezes essa semana.', 8, 'RECLAMACAO', 'OCORRENCIA', 5);

INSERT INTO postagens (url_imagem, titulo, descricao, qtde_upvotes, tag, tipo_post, id_usuario)
VALUES (NULL, 'Parabéns pela limpeza das escadas', 'As escadas do bloco C estão sempre limpas e bem conservadas. Ótimo serviço.', 15, 'ELOGIO', 'OCORRENCIA', 2);

-- Reservas — cobrindo áreas e períodos diferentes dentro da semana
-- área 1 = Salão de Festas, área 2 = Piscina, área 4 = Churrasqueira
INSERT INTO reservas (id_usuario, id_areacomum, data_inicio, data_fim)
VALUES (3, 2, '2026-06-16 08:00:00', '2026-06-16 12:00:00');

INSERT INTO reservas (id_usuario, id_areacomum, data_inicio, data_fim)
VALUES (2, 1, '2026-06-17 13:00:00', '2026-06-17 18:00:00');

INSERT INTO reservas (id_usuario, id_areacomum, data_inicio, data_fim)
VALUES (4, 2, '2026-06-18 13:00:00', '2026-06-18 18:00:00');

INSERT INTO reservas (id_usuario, id_areacomum, data_inicio, data_fim)
VALUES (5, 1, '2026-06-19 19:00:00', '2026-06-19 23:00:00');

INSERT INTO reservas (id_usuario, id_areacomum, data_inicio, data_fim)
VALUES (3, 4, '2026-06-20 08:00:00', '2026-06-20 12:00:00');

INSERT INTO reservas (id_usuario, id_areacomum, data_inicio, data_fim)
VALUES (2, 4, '2026-06-21 13:00:00', '2026-06-21 18:00:00');