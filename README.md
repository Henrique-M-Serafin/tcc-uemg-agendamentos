# Sistema de Agendamentos UEMG — Trabalho de Conclusão de Curso (TCC)

**tcc-uemg-agendamentos** é o projeto de Trabalho de Conclusão de Curso (TCC) desenvolvido para a Universidade do Estado de Minas Gerais (UEMG). O sistema tem como objetivo principal otimizar e digitalizar o processo de **agendamento e gestão de recursos**, focando na administração de veículos e marcação de horários, demonstrando a aplicação de tecnologias modernas em um contexto acadêmico e prático.

## 🌟 Destaques do Projeto

-   **Aplicação Full-Stack Moderna:** Utilização de React com TypeScript no frontend e Supabase como backend-as-a-service.
-   **Foco na Experiência do Usuário:** Interface construída com TailwindCSS e `shadcn/ui`, garantindo um design responsivo e acessível.
-   **Gerenciamento de Recursos:** Implementação de CRUD (Create, Read, Update, Delete) para a gestão de veículos e agendamentos.
-   **Contexto Acadêmico:** Solução prática para um problema real de gestão de recursos em ambientes universitários.

## 🚀 Tecnologias Utilizadas

O projeto foi desenvolvido com uma stack moderna e eficiente, priorizando a performance e a manutenibilidade do código.

| Categoria | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Frontend** | **React** | Biblioteca JavaScript para construção da interface de usuário. |
| **Tipagem** | **TypeScript** | Adiciona tipagem estática, aumentando a robustez e a detecção de erros. |
| **Estilização** | **TailwindCSS** | Framework CSS utilitário para desenvolvimento rápido e customizável. |
| **Componentes** | **shadcn/ui & Radix UI** | Coleção de componentes de UI acessíveis e reutilizáveis. |
| **Backend/DB** | **Supabase** | Backend-as-a-Service que fornece banco de dados PostgreSQL, autenticação e APIs em tempo real. |
| **Build Tool** | **Vite** | Ferramenta de build de nova geração, otimizando o desenvolvimento frontend. |

## ⚙️ Funcionalidades Principais

O sistema oferece um conjunto de funcionalidades essenciais para a gestão de agendamentos e recursos:

| Módulo | Funcionalidades |
| :--- | :--- |
| **Autenticação** | Login e Logout de usuários. |
| **Dashboard** | Visão geral e acesso rápido às principais funcionalidades. |
| **Gestão de Veículos** | Cadastro, listagem, edição e exclusão lógica de veículos. |
| **Gestão de Agendamentos** | Criação, visualização e cancelamento de agendamentos de veículos. |
| **Controle de Acesso** | Rotas protegidas, garantindo que apenas usuários autenticados possam realizar operações críticas. |

## 📂 Estrutura do Projeto

A arquitetura do projeto segue o padrão de aplicações React modernas, com separação clara de responsabilidades:

```
tcc-uemg-agendamentos/
├── public/
├── src/
│   ├── api/          # Funções de comunicação com a API (Supabase)
│   ├── components/   # Componentes de UI reutilizáveis
│   ├── context/      # Contextos globais (ex: Autenticação, Agendamentos)
│   ├── hooks/        # Hooks customizados para lógica de negócio
│   ├── lib/          # Funções utilitárias e de configuração
│   ├── pages/        # Páginas principais da aplicação (Login, Home, Agendamentos, Veículos)
│   └── types/        # Definições de tipos TypeScript
├── supabase/         # Configurações e scripts do Supabase
└── package.json
```

## 🌐 Demonstração

A aplicação está em produção e pode ser acessada através do link:

[**Acessar a Aplicação**](https://tcc-uemg-agendamentos.vercel.app)

## 🛠️ Como Rodar Localmente

Para configurar e executar o projeto em seu ambiente local, siga os passos abaixo:

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/Henrique-M-Serafin/tcc-uemg-agendamentos.git
    cd tcc-uemg-agendamentos
    ```

2.  **Instale as Dependências:**
    ```bash
    npm install
    ```

3.  **Configuração do Supabase:**
    Crie um arquivo `.env.local` na raiz do projeto e configure as variáveis de ambiente necessárias para a conexão com o Supabase. Utilize o arquivo `.env.example` como base.

    ```
    # Exemplo de .env.local
    VITE_SUPABASE_URL="SUA_URL_DO_SUPABASE"
    VITE_SUPABASE_ANON_KEY="SUA_CHAVE_ANON_DO_SUPABASE"
    ```

4.  **Execute a Aplicação:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:5173`.

## 👨‍🎓 Contexto Acadêmico e Autor

Este projeto foi desenvolvido como parte dos requisitos para a obtenção do título de [Insira o Título do Curso, ex: Bacharel em Sistemas de Informação] pela **Universidade do Estado de Minas Gerais (UEMG)**.

**Autor:**

-   **Henrique Serafin**
-   **GitHub:** [https://github.com/Henrique-M-Serafin](https://github.com/Henrique-M-Serafin)

---

*Este repositório serve como portfólio e documentação técnica do Trabalho de Conclusão de Curso.*
