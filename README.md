# <img src="Documentos/imagens/logohostel2.png" alt="Maraú Hospedagens" width="400">

Sistema completo de gestão de alojamentos, reservas e alugueres por temporada, desenvolvido para otimizar a administração de residências e quartos, oferecendo uma experiência fluida tanto para os administradores quanto para os clientes.

---

## 📌 Índice
- [Sobre o Projeto](#-sobre-o-projeto)
- [Escopo do Sistema](#-escopo-do-sistema)
- [Arquitetura e Tecnologias](#%EF%B8%F0-arquitetura-e-tecnologias)
- [Modelagem de Dados (Entidades Principais)](#%EF%B8%F0-modelagem-de-dados-entidades-principais)
- [Como Executar o Projeto](#-como-executar-o-projeto)

---

## 📖 Sobre o Projeto
O **Maraú Hospedagens** nasceu da necessidade de centralizar e automatizar os processos de reservas de imóveis e quartos. O foco principal é garantir o controlo rigoroso de disponibilidade, liquidação automatizada de valores e facilidade no onboarding de novos clientes e propriedades.

---

## 🎯 Escopo do Sistema

O sistema foi projetado para cobrir todas as etapas do fluxo de hospedagem com base nos seguintes requisitos:

* **Gerenciamento de residências e quartos:** Registo, edição e exclusão de propriedades disponíveis para aluguer, detalhando características, capacidade e regras do local.
* **Cadastro e autenticação de clientes:** Controlo de acesso seguro para utilizadores, permitindo a gestão de perfis e histórico.
* **Realização de reservas e aluguéis:** Fluxo completo desde a solicitação de reserva até a confirmação do aluguer.
* **Cálculo automático de diárias:** Motor de cálculo que considera o período de estadia e taxas base da propriedade.
* **Emissão de recibos:** Geração automatizada de comprovativos de pagamento e resumos financeiros da estadia.
* **Controle de disponibilidade:** Bloqueio automático de datas no calendário para evitar *overbooking*.
* **Histórico de hospedagens:** Registo centralizado de todas as estadias passadas e atuais para auditoria e CRM.

---

## 🛠️ Arquitetura e Tecnologias

O ecossistema do projeto foi estruturado seguindo o modelo de desacoplamento entre cliente e servidor:

* **Backend:** Java (Spring Boot) — Responsável pela API RESTful, regras de negócio estruturadas, segurança e emissão de recibos.
* **Frontend:** React (TypeScript) — Interface SPA moderna, interativa e responsiva utilizando Tailwind CSS.
* **Base de Dados:** PostgreSQL — Para persistência robusta e relacional dos dados.
* **Contentores:** Docker — Isolamento e padronização dos ambientes de desenvolvimento e produção.

---

## 🗄️ Modelagem de Dados (Entidades Principais)

1. **Utilizador / Cliente (`User` / `Customer`)**
   * `id`, `nome`, `email`, `password_hash`, `telefone`, `data_cadastro`
2. **Propriedade / Quarto (`Property` / `Room`)**
   * `id`, `nome`, `tipo` (Residência/Quarto), `endereco`, `preco_diaria`, `capacidade_max`
3. **Reserva (`Booking`)**
   * `id`, `cliente_id`, `propriedade_id`, `data_checkin`, `data_checkout`, `valor_total`, `status` (Pendente, Confirmada, Cancelada)
4. **Recibo (`Receipt`)**
   * `id`, `reserva_id`, `data_emissao`, `valor_pago`, `metodo_pagamento`

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
* JDK 17 ou superior
* Node.js & npm/yarn
* Docker & Docker Compose

### Passos para Configuração

1. **Clonar o repositório:**
   ```bash
   git clone [https://github.com/seu-usuario/marau-hospedagens.git](https://github.com/seu-usuario/marau-hospedagens.git)
   cd marau-hospedagens
