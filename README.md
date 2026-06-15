# Condominions — Sistema de Gerenciamento de Condomínio

Sistema web para gestão de condomínios residenciais, desenvolvido com Java Spring Boot no backend e HTML/CSS/JavaScript puro no frontend.

---

## Tecnologias

- Java 21
- Spring Boot 3
- Spring Data JPA + Hibernate
- H2 Database (banco em memória)
- Lombok
- Maven
- HTML5, CSS3, JavaScript (ES Modules)
- Tailwind CSS

---

## Pré-requisitos

- Java 21 instalado (`java -version` deve retornar 21)
- Maven instalado (`mvn -version`) ou uso do wrapper `./mvnw`
- Navegador moderno (Chrome, Firefox, Edge)

---

## Como executar

**1. Clone o repositório**

```bash
git clone https://github.com/seu-usuario/gerenciador-de-condominio.git
cd gerenciador-de-condominio/squad
```

**2. Execute o projeto**

```bash
./mvnw spring-boot:run
```

Ou, se tiver Maven instalado globalmente:

```bash
mvn spring-boot:run
```

**3. Acesse o sistema**

Abra o navegador e acesse:

```
http://localhost:8080/
```

---

## Credenciais de teste

| Perfil | CPF | Senha |
|---|---|---|
| Síndico | 111.111.111-11 | admin123 |
| Morador | 222.222.222-22 | morador123 |
| Morador | 333.333.333-33 | morador123 |

---

## Console do banco de dados (H2)

O banco de dados pode ser inspecionado pelo console H2 durante a execução:

```
http://localhost:8080/h2-console
```

Configurações de conexão:

```
JDBC URL:  jdbc:h2:mem:condominions
Username:  sa
Password:  password
```

> O banco é reiniciado a cada vez que o servidor é parado. Os dados iniciais são carregados automaticamente pelo arquivo `src/main/resources/data.sql`.

---

## Estrutura do projeto

```
squad/
├── src/
│   ├── main/
│   │   ├── java/com/squad/condominions/
│   │   │   ├── controller/     # Endpoints REST
│   │   │   ├── service/        # Regras de negócio
│   │   │   ├── repository/     # Acesso ao banco
│   │   │   ├── model/          # Entidades JPA
│   │   │   ├── enums/          # Enumerações
│   │   │   └── exception/      # Tratamento de erros
│   │   └── resources/
│   │       ├── static/         # Frontend (HTML, CSS, JS)
│   │       │   ├── api/        # Chamadas HTTP por domínio
│   │       │   ├── componentes/# Componentes de renderização
│   │       │   ├── utils/      # Utilitários
│   │       │   ├── app.js      # Controlador principal
│   │       │   ├── index.html  # Página principal
│   │       │   └── styles.css  # Estilos globais
│   │       ├── application.yml # Configurações da aplicação
│   │       └── data.sql        # Dados iniciais
└── pom.xml
```

---

## Endpoints principais

| Método | Endpoint | Descrição |
|---|---|---|
| POST | /condominions/usuarios/login | Autenticação |
| GET | /condominions/postagens/tipo/FORUM | Listar avisos do fórum |
| GET | /condominions/postagens/tipo/OCORRENCIA | Listar ocorrências |
| POST | /condominions/postagens | Criar postagem |
| PATCH | /condominions/postagens/{id}/upvote | Votar em ocorrência |
| GET | /condominions/areas-comuns | Listar áreas comuns |
| POST | /condominions/reservas | Criar reserva |
| GET | /condominions/wiki | Buscar wiki do condomínio |

---

## Integrantes

- Artur Vargas
- Gabriel Lacerda

Unisinos — Implementação de Software — 2026/1
