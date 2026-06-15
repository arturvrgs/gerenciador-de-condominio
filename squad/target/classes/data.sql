-- Usuários base
INSERT INTO usuarios (nome, sobrenome, tipo, cpf, senha) VALUES ('Artur', 'Vargas', 'ADMINISTRADOR', '111.111.111-11', 'admin123');
INSERT INTO usuarios (nome, sobrenome, tipo, cpf, senha) VALUES ('Gabriel', 'Lacerda', 'MORADOR', '222.222.222-22', 'morador123');
INSERT INTO usuarios (nome, sobrenome, tipo, cpf, senha) VALUES ('Maria', 'Souza', 'MORADOR', '333.333.333-33', 'morador123');

-- Usuários adicionais
INSERT INTO usuarios (nome, sobrenome, tipo, cpf, senha) VALUES ('Ana', 'Reis', 'MORADOR', '444.444.444-44', 'morador123');
INSERT INTO usuarios (nome, sobrenome, tipo, cpf, senha) VALUES ('Joao', 'Lima', 'MORADOR', '555.555.555-55', 'morador123');

-- Wiki
INSERT INTO wikis (nome_condominio, descricao) VALUES ('Residencial Palmeiras', 'Condominio localizado na Rua das Acacias, 450, Itajai - SC. Fundado em 2010. 4 blocos, 120 unidades. Portaria 24h: (47) 3344-5566.');

-- Areas comuns (id 1 a 5 nessa ordem)
INSERT INTO areas_comuns (nome, estado, url_imagem) VALUES ('Salao de Festas', 'DISPONIVEL', NULL);
INSERT INTO areas_comuns (nome, estado, url_imagem) VALUES ('Piscina', 'DISPONIVEL', NULL);
INSERT INTO areas_comuns (nome, estado, url_imagem) VALUES ('Academia', 'SUSPENSA', NULL);
INSERT INTO areas_comuns (nome, estado, url_imagem) VALUES ('Churrasqueira', 'DISPONIVEL', NULL);
INSERT INTO areas_comuns (nome, estado, url_imagem) VALUES ('Quadra Esportiva', 'DISPONIVEL', NULL);

-- Postagens forum
INSERT INTO postagens (url_imagem, titulo, descricao, qtde_upvotes, tag, tipo_post, id_usuario) VALUES (NULL, 'Manutencao da caixa dagua', 'Fornecimento interrompido das 8h as 14h na quarta-feira 18/06.', 0, 'ALERTA', 'FORUM', 1);
INSERT INTO postagens (url_imagem, titulo, descricao, qtde_upvotes, tag, tipo_post, id_usuario) VALUES (NULL, 'Assembleia ordinaria julho', 'Assembleia marcada para 20/07 as 19h no salao de festas.', 0, 'FIXADO', 'FORUM', 1);
INSERT INTO postagens (url_imagem, titulo, descricao, qtde_upvotes, tag, tipo_post, id_usuario) VALUES (NULL, 'Aviso sobre uso da piscina', 'Criancas menores de 12 anos devem estar acompanhadas de um adulto.', 0, 'NULA', 'FORUM', 1);

-- Postagens ocorrencias
INSERT INTO postagens (url_imagem, titulo, descricao, qtde_upvotes, tag, tipo_post, id_usuario) VALUES (NULL, 'Barulho excessivo no bloco B', 'Som alto apos as 22h no apartamento 304.', 12, 'RECLAMACAO', 'OCORRENCIA', 2);
INSERT INTO postagens (url_imagem, titulo, descricao, qtde_upvotes, tag, tipo_post, id_usuario) VALUES (NULL, 'Jardim reformado ficou incrivel', 'Parabens ao sindico pela iniciativa de reformar a area verde.', 27, 'ELOGIO', 'OCORRENCIA', 3);
INSERT INTO postagens (url_imagem, titulo, descricao, qtde_upvotes, tag, tipo_post, id_usuario) VALUES (NULL, 'Lampada queimada no corredor', 'A lampada do corredor do 2o andar do bloco A esta apagada ha uma semana.', 5, 'RECLAMACAO', 'OCORRENCIA', 4);
INSERT INTO postagens (url_imagem, titulo, descricao, qtde_upvotes, tag, tipo_post, id_usuario) VALUES (NULL, 'Portao da garagem travando', 'O portao automatico da garagem esta travando ao fechar.', 8, 'RECLAMACAO', 'OCORRENCIA', 5);
INSERT INTO postagens (url_imagem, titulo, descricao, qtde_upvotes, tag, tipo_post, id_usuario) VALUES (NULL, 'Parabens pela limpeza das escadas', 'As escadas do bloco C estao sempre limpas e bem conservadas.', 15, 'ELOGIO', 'OCORRENCIA', 2);

-- Reservas (agora todas as areas ja existem)
INSERT INTO reservas (id_usuario, id_areacomum, data_inicio, data_fim) VALUES (3, 2, '2026-06-16 08:00:00', '2026-06-16 12:00:00');
INSERT INTO reservas (id_usuario, id_areacomum, data_inicio, data_fim) VALUES (2, 1, '2026-06-17 13:00:00', '2026-06-17 18:00:00');
INSERT INTO reservas (id_usuario, id_areacomum, data_inicio, data_fim) VALUES (4, 2, '2026-06-18 13:00:00', '2026-06-18 18:00:00');
INSERT INTO reservas (id_usuario, id_areacomum, data_inicio, data_fim) VALUES (5, 1, '2026-06-19 19:00:00', '2026-06-19 23:00:00');
INSERT INTO reservas (id_usuario, id_areacomum, data_inicio, data_fim) VALUES (3, 4, '2026-06-20 08:00:00', '2026-06-20 12:00:00');
INSERT INTO reservas (id_usuario, id_areacomum, data_inicio, data_fim) VALUES (2, 4, '2026-06-21 13:00:00', '2026-06-21 18:00:00');