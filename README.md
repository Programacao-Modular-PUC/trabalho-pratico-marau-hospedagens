

<div align="center">
 <img src="Documentos/imagens/ChatGPT Image 8 de jun. de 2026, 15_14_32.png" alt="Maraú Hospedagens" width="500">
</div>

<div align="center">

# **Plataforma completa para gestão de alojamentos, reservas, controle de disponibilidade e faturamento por temporada.**
Desenvolvido com arquitetura desacoplada, utilizando **Java (Spring Boot)** no backend e **React (TypeScript)** no frontend.

</div>

<div align="center">

![Java](https://img.shields.io/badge/Java-17%2B-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-brightgreen.svg)
![React](https://img.shields.io/badge/React-18.x-blue.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-blue.svg)
![Docker](https://img.shields.io/badge/Docker-24%2B-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

</div>

---

## ✪ Sumário

* [📘 Visão Geral](#-visão-geral)
* [🎯 Objetivos e Escopo](#-objetivos-e-escopo)
* [🧱 Arquitetura e Design](#-arquitetura-e-design)
* [🚀 Funcionalidades](#-funcionalidades)
* [🧪 Requisitos Mínimos](#-requisitos-mínimos)
* [🛠️ Execução do Projeto](#%EF%B8%8F-execu%C3%A7%C3%A3o-do-projeto)

---

## 📘 Visão Geral

O **Maraú Hospedagens** é uma solução robusta projetada para centralizar e automatizar os processos operacionais de imóveis, residências e quartos por temporada. O foco principal é mitigar falhas operacionais humanas, garantindo o controle preciso de calendários, automação de faturamento e relatórios financeiros transparentes.

* 🌐 **Arquitetura Desacoplada:** Frontend SPA integrado de forma limpa a uma API RESTful.
* 🔒 **Segurança Ativa:** Controle de acesso e autenticação segura para clientes e administradores.
* 📆 **Anti-Overbooking:** Sincronização inteligente de disponibilidade em tempo real.

---

## 🎯 Objetivos e Escopo

* **Gestão de Propriedades:** Cadastro, edição e exclusão de residências e quartos, detalhando capacidade, endereço e regras.
* **Onboarding de Clientes:** Fluxo seguro de cadastro, autenticação e gerenciamento de perfis de hóspedes.
* **Motor de Reservas:** Fluxo completo desde a checagem de datas disponíveis até a confirmação do aluguel.
* **Cálculo de Diárias:** Automação de precificação com base no período de estadia e taxas fixas do imóvel.
* **Controle de Disponibilidade:** Bloqueio automático de datas no calendário para evitar duplicidade de locação.

---

## 🧱 Arquitetura e Design

### ⚙️ Divisão de Camadas e Componentes

| Componente | Tecnologia | Responsabilidade Principal |
| :--- | :--- | :--- |
| **Backend** | Java 17 + Spring Boot | API RESTful, regras de negócio estruturadas, segurança e motor de cálculo. |
| **Frontend** | React + TypeScript + Tailwind | Interface SPA (Single Page Application) moderna, interativa e responsiva. |
| **Base de Dados** | PostgreSQL | Persistência relacional estável, integridade de dados e histórico de auditoria. |
| **Infraestrutura**| Docker & Compose | Conteinerização e padronização rápida dos ambientes de execução. |

### 🗄️ Modelagem de Dados (Entidades Principais)

* **Utilizador / Cliente (`User` / `Customer`):** Identificação única, credenciais seguras, dados de contato e data de adesão.
* **Propriedade / Quarto (`Property` / `Room`):** Especificação do alojamento, endereço físico, capacidade máxima e preço-base da diária.
* **Reserva (`Booking`):** Vinculação do cliente ao imóvel com período (`Check-in` / `Check-out`), valor consolidado e status da reserva.
* **Recibo (`Receipt`):** Registro fiscal contendo o método de pagamento utilizado e a data de liquidação da reserva.

---

## 🚀 Funcionalidades

* 👥 **Perfis de Acesso:** Telas e permissões específicas para Administradores do sistema e Hóspedes;
* 📊 **Histórico de Estadias:** Painel central de auditoria com o histórico de locações passadas, vigentes e futuras;
* 🧾 **Emissão Automatizada:** Geração automática do resumo financeiro e recibos assim que a reserva é confirmada;
* 📈 **Filtros Avançados:** Busca inteligente de acomodações filtrando por capacidade, tipo (quarto/casa) e faixas de preço.

---

## 🧪 Requisitos Mínimos

* **Java Development Kit (JDK) 17** ou superior
* **Node.js LTS** (v18+) & npm/yarn
* **Docker & Docker Compose** instalados e em execução

---

## 🛠️ Execução do Projeto

```bash
# 1. Clone o repositório do sistema
$git clone [https://github.com/seu-usuario/marau-hospedagens.git$](https://github.com/seu-usuario/marau-hospedagens.git$) cd marau-hospedagens

# 2. Suba o Banco de Dados via Docker
$ docker-compose up -d

# 3. Inicialize o servidor Backend (Spring Boot)
$ cd backend
$ ./mvnw spring-boot:run

# 4. Inicialize o painel Frontend (React)
$cd ../frontend$ npm install
$ npm run dev
