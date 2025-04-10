# Jardim Seguro - Gerenciador de Senhas Criativo

![Jardim Seguro Logo](/public/icons/icon-192x192.png)

## 📋 Sobre o Projeto

Jardim Seguro é um gerenciador de senhas inovador que transforma suas senhas em plantas virtuais que crescem com o tempo. O projeto permite armazenar, organizar e gerenciar suas senhas de forma segura, enquanto oferece uma experiência visual única onde senhas mais fortes geram plantas mais robustas que evoluem conforme você as utiliza.

**🔗 [Link da Aplicação](https://jardim-seguro.vercel.app)**

## ✨ Funcionalidades

### Gerenciamento de Senhas
- Visualizar lista de senhas em formato de "jardim"
- Ver detalhes de uma senha específica
- Criar novas senhas com gerador automático
- Editar e excluir senhas existentes
- Copiar usuário e senha para a área de transferência

### Sistema de Plantas Virtuais
- Senhas fortes geram plantas mais robustas (árvores, flores, arbustos)
- Senhas fracas geram plantas mais simples (grama, sementes)
- Plantas evoluem em estágios de crescimento conforme o uso
- Sistema visual de força da senha com feedback imediato

### Recursos de Segurança
- Criptografia AES-256 para armazenamento seguro
- Autenticação de usuários
- Avaliação de força de senhas em tempo real
- Gerador de senhas fortes e aleatórias

### Recursos Gerais
- Sistema de busca por senhas
- Organização por categorias
- Interface responsiva e intuitiva
- Instalável como aplicativo (PWA)
- Modo claro/escuro

## 🚀 Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **React** - Biblioteca para construção de interfaces
- **TypeScript** - Superset tipado de JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/UI** - Componentes de UI reutilizáveis
- **PostgreSQL (Neon)** - Banco de dados relacional serverless
- **Vercel** - Plataforma de deploy e hospedagem
- **PWA** - Progressive Web App para instalação em dispositivos

## 🔧 Instalação e Execução

### Pré-requisitos
- Node.js 18.x ou superior
- Conta no Vercel (para deploy)
- Banco de dados PostgreSQL (recomendamos Neon)

### Passos para Instalação

1. Clone o repositório:
```bash
git clone https://github.com/GuilhermePeritto/JardinSeguro.git
cd jardim-seguro
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env.local` na raiz do projeto
   - Adicione as seguintes variáveis:
```
DATABASE_URL=sua_url_de_conexao_postgresql
```

4. Execute as migrações do banco de dados:
```bash
npm run db:migrate
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

6. Acesse a aplicação em `http://localhost:3000`

## 📁 Estrutura do Projeto

```bash
jardim-seguro/
├── app/                    # Rotas e páginas da aplicação (App Router)
│   ├── api/                # Rotas de API
│   ├── auth/               # Autenticação de usuários
│   ├── passwords/          # Páginas relacionadas a senhas
│   ├── garden/             # Visualização do jardim virtual
│   └── layout.tsx          # Layout principal da aplicação
├── components/             # Componentes React reutilizáveis
│   ├── ui/                 # Componentes de UI (shadcn)
│   ├── plants/             # Componentes de plantas virtuais
│   └── ...                 # Outros componentes específicos
├── lib/                    # Utilitários e funções auxiliares
│   ├── auth.ts             # Configuração de autenticação
│   ├── encryption.ts       # Funções de criptografia
│   ├── password-strength.ts# Avaliador de força de senhas
│   └── ...                 # Outros utilitários
├── public/                 # Arquivos estáticos e imagens
└── ...                     # Arquivos de configuração
```

## 📊 Modelo de Dados

### Tabelas Principais

- **users**: Armazena os usuários do sistema
- **passwords**: Armazena as senhas criptografadas
- **categories**: Categorias para organização das senhas
- **password_history**: Histórico de alterações das senhas
- **plant_types**: Tipos de plantas associadas a níveis de força
- **user_plants**: Relacionamento entre usuários e plantas virtuais

## 🚀 Deploy

Para fazer o deploy da aplicação na Vercel:

1. Crie uma conta na [Vercel](https://vercel.com)
2. Instale a CLI da Vercel:
```bash
npm i -g vercel
```

3. Faça login na sua conta:
```bash
vercel login
```

4. Execute o comando de deploy na raiz do projeto:
```bash
vercel
```

5. Siga as instruções para configurar o projeto
6. Adicione as variáveis de ambiente necessárias no dashboard da Vercel

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

- **Nome**: Guilherme Peritto
- **Email**: perittoguilherme@gmail.com
- **GitHub**: [GuilhermePeritto](https://github.com/GuilhermePeritto)

---

Desenvolvido com ❤️ por [Guilherme Peritto](https://github.com/GuilhermePeritto)
