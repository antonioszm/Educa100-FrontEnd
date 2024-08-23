# Educa100FrontEnd

Este projeto é uma aplicação web desenvolvida em Angular que simula um portal educacional, inspirado no projeto Educa100 em Java. O sistema suporta três tipos de usuários: alunos, professores e administradores, cada um com funcionalidades específicas.
## Tecnologias 
- Angular 18
- TypeScript
- SCSS
- HTML
- JSON
- Metodología GitFLow
- Kanban/Trello

## Funcionalidades

### Administradores
- Criar, deletar e atualizar informações de alunos e docentes.
- Criar turmas.
- Visualizar todos os docentes e alunos cadastrados.

### Docentes
- Criar notas para os alunos.
- Visualizar todos os alunos.

### Alunos
- Visualizar suas próprias notas.

## Rotas Disponíveis

O sistema possui várias rotas para atender às diferentes necessidades dos usuários:

- `/login`: Rota para autenticação de usuários.
- `/home`: Página inicial após o login.
- `/cadastro-turma`: Para administradores ou docentes criarem novas turmas.
- `/cadastro-nota`: Para administradores ou docentes registrarem notas dos alunos.
- `/cadastro-aluno`: Para administradores cadastrarem novos alunos.
- `/cadastro-docente`: Para administradores cadastrarem novos docentes.
- `/listagem-docente`: Para visualizar todos os docentes cadastrados.
- `/notas-aluno`: Para alunos visualizarem suas notas.

O sistema também implementa uma lógica de bloqueio de rotas baseada no tipo de usuário logado, garantindo que cada usuário só tenha acesso às funcionalidades permitidas para seu perfil.
## Usuarios e Senhas
- `ADM` 
    - usuario: adm
    - senha: 12345
- `Docente` 
    - usuario: jdrprofessor@outlook.com
    - senha: 12345678
- `Aluno` 
    - usuario: antonioszm@outlook.com
    - senha: 12345678
## Como Iniciar o Projeto

Para iniciar este projeto, você precisará de dois terminais abertos simultaneamente:

``` ng serve ```

``` npx json-server --watch db.json ```

Antes de iniciar o projeto, certifique-se de instalar todas as dependências necessárias executando o seguinte comando na raiz do projeto:

``` npm install ```

## Instalação das Dependências

Para baixar e instalar todas as dependências necessárias para o projeto, siga os passos abaixo:

1. Abra um terminal na pasta do projeto.
2. Execute o comando `npm install`.
3. Após a conclusão da instalação, você pode prosseguir com os passos descritos anteriormente para iniciar o projeto.

## Instalação do Angular CLI

Se você ainda não tem o Angular CLI instalado globalmente em sua máquina, siga os passos abaixo para instalá-lo:

1. Abra um terminal.
2. Execute o seguinte comando para instalar o Angular CLI globalmente:

``` npm install -g @angular/cli```

Este comando instalará a versão mais recente do Angular CLI, permitindo que você crie novos projetos Angular, gere componentes, serviços e muito mais.

## Uso da Biblioteca Externa NG Prime

Neste projeto, foi utilizada a biblioteca externa NG Prime para melhorar a interface do usuário com componentes prontos e estilizados.
