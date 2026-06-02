export function obterHtmlPaginaInicial() { // Exporta uma função que retorna todo o HTML da página inicial da aplicação
  // Retorna a estrutura HTML completa da interface
  return `<!doctype html> 
<html lang="pt-BR"> 
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Gestao para Psicologos</title>
  <style>
    :root {
      --fundo: #2b1519;
      --papel: #fff6ef;
      --texto: #2c1718;
      --suave: #866c6c;
      --linha: #ead2c6;
      --roxo: #6d3b8f;
      --roxo-2: #eadcf5;
      --vermelho: #b73737;
      --vermelho-2: #ffe1dc;
      --marrom: #6f422b;
      --marrom-2: #f1dfd0;
      --escuro: #241013;
      --sombra: 0 28px 80px rgba(36, 16, 19, 0.24);
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      color: var(--texto);
      background:
        radial-gradient(circle at 10% 12%, rgba(183, 55, 55, 0.34), transparent 27rem),
        radial-gradient(circle at 88% 4%, rgba(109, 59, 143, 0.36), transparent 25rem),
        linear-gradient(135deg, #3a1b20 0%, #6f422b 52%, #281215 100%);
      font-family: Georgia, "Times New Roman", serif;
    }

    button, input, select { font: inherit; }

    .pagina {
      width: min(1200px, calc(100% - 32px));
      margin: 0 auto;
      padding: 26px 0 54px;
    }

    .topo {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      margin-bottom: 24px;
    }

    .marca {
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: "Trebuchet MS", Verdana, sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: rgba(255, 246, 239, 0.78);
      font-size: 0.78rem;
    }

    .marca span {
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      border-radius: 999px;
      color: #fff;
      background: linear-gradient(135deg, var(--roxo), var(--vermelho));
      font-weight: 700;
    }

    .links {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: flex-end;
      font-family: "Trebuchet MS", Verdana, sans-serif;
      font-size: 0.9rem;
    }

    .links a, .link-botao {
      color: #fff6ef;
      text-decoration: none;
      border: 1px solid rgba(255, 246, 239, 0.28);
      border-radius: 999px;
      padding: 10px 14px;
      background: rgba(255, 246, 239, 0.12);
    }

    .link-botao {
      cursor: pointer;
    }

    .login-layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(360px, 440px);
      gap: 24px;
      align-items: start;
    }

    .hero, .cartao, .painel-login {
      border: 1px solid rgba(88, 76, 57, 0.16);
      border-radius: 30px;
      background: rgba(255, 246, 239, 0.93);
      box-shadow: var(--sombra);
    }

    .hero {
      padding: clamp(26px, 4vw, 48px);
      min-height: auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      position: relative;
    }

    .hero:after {
      content: "";
      position: absolute;
      right: -90px;
      bottom: -110px;
      width: 320px;
      height: 320px;
      border-radius: 999px;
      background: rgba(109, 59, 143, 0.12);
    }

    .etiqueta {
      width: fit-content;
      display: inline-flex;
      padding: 8px 13px;
      border-radius: 999px;
      background: var(--roxo-2);
      color: var(--roxo);
      font-family: "Trebuchet MS", Verdana, sans-serif;
      font-size: 0.86rem;
      margin-bottom: 20px;
    }

    h1 {
      margin: 0;
      max-width: 760px;
      font-size: clamp(2.35rem, 4.8vw, 4.9rem);
      line-height: 0.96;
      letter-spacing: -0.07em;
    }

    .subtitulo {
      max-width: 650px;
      margin: 24px 0 0;
      color: var(--suave);
      font-size: clamp(1.05rem, 2vw, 1.28rem);
      line-height: 1.6;
    }

    .fluxo {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-top: 28px;
      position: relative;
      z-index: 1;
    }

    .passo {
      border-radius: 22px;
      background: rgba(255, 246, 239, 0.76);
      border: 1px solid rgba(88, 76, 57, 0.18);
      padding: 17px;
    }

    .passo span {
      display: block;
      color: var(--vermelho);
      font-family: "Trebuchet MS", Verdana, sans-serif;
      font-size: 0.78rem;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .painel-login {
      padding: 26px;
      align-self: start;
      position: sticky;
      top: 18px;
    }

    .painel-login h2 {
      margin: 0;
      font-size: 2rem;
      letter-spacing: -0.05em;
      line-height: 1;
    }

    .painel-login p {
      margin: 10px 0 18px;
      color: var(--suave);
      line-height: 1.5;
    }

    .abas {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 18px;
      padding: 6px;
      border-radius: 18px;
      background: var(--marrom-2);
    }

    .aba {
      border: 0;
      border-radius: 14px;
      background: transparent;
      color: var(--suave);
      padding: 11px 12px;
      cursor: pointer;
      font-family: "Trebuchet MS", Verdana, sans-serif;
    }

    .aba.ativa {
      background: var(--papel);
      color: var(--roxo);
      box-shadow: 0 8px 20px rgba(39, 29, 18, 0.08);
    }

    .formulario {
      display: grid;
      gap: 13px;
    }

    label {
      display: grid;
      gap: 7px;
      color: var(--suave);
      font-family: "Trebuchet MS", Verdana, sans-serif;
      font-size: 0.86rem;
    }

    input, select {
      width: 100%;
      border: 1px solid var(--linha);
      background: var(--papel);
      color: var(--texto);
      border-radius: 14px;
      padding: 12px 13px;
      outline: none;
    }

    input:focus, select:focus {
      border-color: var(--roxo);
      box-shadow: 0 0 0 3px rgba(109, 59, 143, 0.16);
    }

    .botao {
      border: 0;
      border-radius: 18px;
      padding: 13px 18px;
      cursor: pointer;
      color: #fff;
      background: linear-gradient(135deg, var(--roxo), var(--vermelho));
      box-shadow: 0 12px 30px rgba(109, 59, 143, 0.28);
      font-family: "Trebuchet MS", Verdana, sans-serif;
      transition: transform 0.2s ease, opacity 0.2s ease;
    }

    .botao:hover { transform: translateY(-2px); }
    .botao.secundario {
      color: var(--roxo);
      background: #fff1ea;
      border: 1px solid rgba(109, 59, 143, 0.24);
      box-shadow: none;
    }

    .dashboard { display: none; }

    .dashboard.ativo, .login-layout.ativo { display: grid; }
    .login-layout.oculto { display: none; }

    .dash-hero {
      display: grid;
      grid-template-columns: 1fr 0.78fr;
      gap: 24px;
      margin-bottom: 24px;
    }

    .boas-vindas {
      padding: clamp(26px, 5vw, 50px);
      border-radius: 30px;
      background: linear-gradient(135deg, #241013, #4a2020 58%, #5f2c7a);
      color: #fff6ef;
      box-shadow: var(--sombra);
    }

    .boas-vindas h2 {
      margin: 0;
      font-size: clamp(2.2rem, 5vw, 4.7rem);
      line-height: 0.95;
      letter-spacing: -0.06em;
    }

    .boas-vindas p {
      max-width: 680px;
      color: rgba(255, 246, 239, 0.78);
      line-height: 1.6;
    }

    .metricas {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .metrica {
      border-radius: 24px;
      background: rgba(255, 246, 239, 0.93);
      border: 1px solid rgba(88, 76, 57, 0.16);
      padding: 20px;
      min-height: 140px;
    }

    .metrica span {
      color: var(--suave);
      font-family: "Trebuchet MS", Verdana, sans-serif;
      font-size: 0.78rem;
      text-transform: uppercase;
    }

    .metrica strong {
      display: block;
      color: var(--roxo);
      font-size: 2.7rem;
      margin-top: 12px;
    }

    .grade {
      display: grid;
      grid-template-columns: minmax(320px, 0.8fr) minmax(0, 1.2fr);
      gap: 24px;
    }

    .cartao {
      padding: 24px;
      box-shadow: 0 18px 50px rgba(49, 36, 23, 0.08);
    }

    .cartao h3 {
      margin: 0 0 6px;
      font-size: 1.55rem;
      letter-spacing: -0.04em;
    }

    .cartao p {
      color: var(--suave);
      line-height: 1.55;
      margin: 0 0 18px;
    }

    .linha {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .lista {
      display: grid;
      gap: 12px;
    }

    .agenda-semanal {
      display: grid;
      grid-template-columns: repeat(5, minmax(130px, 1fr));
      gap: 12px;
      overflow-x: auto;
      padding-bottom: 4px;
    }

    .dia-agenda {
      min-width: 130px;
      border: 1px solid var(--linha);
      border-radius: 20px;
      background: rgba(255, 246, 239, 0.76);
      padding: 13px;
    }

    .dia-agenda h4 {
      margin: 0 0 10px;
      color: var(--marrom);
      font-family: "Trebuchet MS", Verdana, sans-serif;
      font-size: 0.86rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .slot-agenda {
      display: grid;
      gap: 4px;
      border-left: 4px solid var(--roxo);
      border-radius: 14px;
      background: var(--papel);
      padding: 10px;
      margin-bottom: 8px;
      box-shadow: 0 10px 26px rgba(36, 16, 19, 0.07);
    }

    .slot-agenda.remarcacao {
      border-left-color: var(--vermelho);
      background: #fff0ee;
    }

    .slot-agenda strong {
      font-family: "Trebuchet MS", Verdana, sans-serif;
      font-size: 0.92rem;
    }

    .slot-agenda small {
      color: var(--suave);
      font-family: "Trebuchet MS", Verdana, sans-serif;
      font-size: 0.76rem;
    }

    .item {
      display: grid;
      gap: 9px;
      border: 1px solid var(--linha);
      border-radius: 20px;
      background: var(--papel);
      padding: 16px;
    }

    .item.remarcacao {
      border-color: rgba(183, 55, 55, 0.42);
      background: #fff0ee;
    }

    .item-topo {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .item strong { font-size: 1.08rem; }
    .item small {
      color: var(--suave);
      font-family: "Trebuchet MS", Verdana, sans-serif;
    }

    .badge {
      display: inline-flex;
      width: fit-content;
      border-radius: 999px;
      padding: 6px 10px;
      background: var(--roxo-2);
      color: var(--roxo);
      font-family: "Trebuchet MS", Verdana, sans-serif;
      font-size: 0.78rem;
      white-space: nowrap;
    }

    .badge.alerta {
      background: var(--vermelho-2);
      color: var(--vermelho);
    }

    .mini-acoes {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 4px;
    }

    .mini-acoes button {
      border: 1px solid rgba(109, 59, 143, 0.24);
      background: #fff1ea;
      color: var(--roxo);
      border-radius: 999px;
      padding: 8px 10px;
      cursor: pointer;
      font-family: "Trebuchet MS", Verdana, sans-serif;
      font-size: 0.8rem;
    }

    .vazio {
      padding: 18px;
      border: 1px dashed var(--linha);
      border-radius: 18px;
      color: var(--suave);
      background: rgba(255, 246, 239, 0.54);
    }

    .aviso {
      position: fixed;
      right: 18px;
      bottom: 18px;
      max-width: 390px;
      background: var(--escuro);
      color: #fff6ef;
      border-radius: 20px;
      padding: 16px 18px;
      box-shadow: var(--sombra);
      transform: translateY(140%);
      transition: transform 0.28s ease;
      z-index: 30;
    }

    .aviso.visivel { transform: translateY(0); }

    @media (max-width: 900px) {
      .login-layout, .dash-hero, .grade, .fluxo {
        grid-template-columns: 1fr;
      }

      .hero {
        padding: 26px;
      }

      .painel-login {
        position: static;
      }

      .metricas, .linha {
        grid-template-columns: 1fr;
      }

      .topo {
        align-items: flex-start;
        flex-direction: column;
      }
    }
  </style>
</head>
<body>
  <main class="pagina">
    <header class="topo">
      <div class="marca"><span>GP</span> Gestao para Psicologos</div>
      <nav class="links">
        <a href="/docs" target="_blank" rel="noreferrer">Swagger</a>
        <a href="/saude" target="_blank" rel="noreferrer">Saude da API</a>
        <button class="link-botao" id="botao-sair" type="button">Sair</button>
      </nav>
    </header>

    <section class="login-layout ativo" id="area-login">
      <div class="hero">
        <div>
          <span class="etiqueta">MVP para agenda clinica</span>
          <h1>Um painel para acompanhar pacientes e remarcacoes sem bagunca.</h1>
          <p class="subtitulo">
            A proposta e dar ao psicologo uma visao simples dos proximos atendimentos,
            pedidos de remarcacao e disponibilidade semanal.
          </p>
        </div>
        <div class="fluxo">
          <div class="passo"><span>1. acesso</span><strong>Psicologo entra no painel</strong></div>
          <div class="passo"><span>2. agenda</span><strong>Visualiza os atendimentos</strong></div>
          <div class="passo"><span>3. paciente</span><strong>Responde confirmacao</strong></div>
          <div class="passo"><span>4. remarcacao</span><strong>Pedido aparece em destaque</strong></div>
        </div>
      </div>

      <aside class="painel-login">
        <span class="etiqueta">Acesso do profissional</span>
        <h2>Entre para ver a agenda</h2>
        <p>Crie um acesso de teste ou entre com o usuário já preenchido para abrir o painel.</p>

        <div class="abas">
          <button class="aba ativa" type="button" data-aba="entrar">Entrar</button>
          <button class="aba" type="button" data-aba="cadastrar">Criar acesso</button>
        </div>

        <form class="formulario" id="form-entrar">
          <label>E-mail
            <input name="email" value="ana@clinica.com" required />
          </label>
          <label>Senha
            <input name="senha" type="password" value="senha123" required />
          </label>
          <button class="botao" type="submit">Entrar no painel</button>
        </form>

        <form class="formulario" id="form-cadastrar" style="display:none">
          <label>Nome profissional
            <input name="nome" value="Dra. Ana Ribeiro" required />
          </label>
          <label>E-mail
            <input name="email" value="ana@clinica.com" required />
          </label>
          <label>Senha
            <input name="senha" type="password" value="senha123" required />
          </label>
          <button class="botao" type="submit">Criar acesso</button>
        </form>
      </aside>
    </section>

    <section class="dashboard" id="dashboard">
      <div class="dash-hero">
        <div class="boas-vindas">
          <span class="etiqueta">Painel do psicologo</span>
          <h2 id="titulo-dashboard">Agenda clinica</h2>
          <p>
            Aqui o profissional consegue ver rapidamente quem esta agendado,
            quem confirmou e quem pediu remarcacao.
          </p>
          <div class="mini-acoes">
            <button onclick="gerarAgendamentos()">Gerar agendamentos</button>
            <button onclick="enviarConfirmacoes()">Enviar confirmacoes simuladas</button>
          </div>
        </div>

        <div class="metricas">
          <div class="metrica"><span>Pacientes</span><strong id="total-pacientes">0</strong></div>
          <div class="metrica"><span>Agendamentos</span><strong id="total-agendamentos">0</strong></div>
          <div class="metrica"><span>Remarcacoes</span><strong id="total-remarcacoes">0</strong></div>
          <div class="metrica"><span>Disponibilidades</span><strong id="total-disponibilidades">0</strong></div>
        </div>
      </div>

      <div class="grade">
        <div class="cartao" style="grid-column: 1 / -1">
          <h3>Agenda da semana</h3>
          <p>Visao rapida dos proximos horarios para apresentar a rotina do consultorio.</p>
          <div class="agenda-semanal" id="agenda-semanal"></div>
        </div>

        <div class="cartao">
          <h3>Cadastro rapido</h3>
          <p>Crie dados de teste para demonstrar o fluxo no painel.</p>
          <form class="formulario" id="form-disponibilidade">
            <div class="linha">
              <label>Dia
                <select name="diaSemana">
                  <option value="1">Segunda</option>
                  <option value="2" selected>Terca</option>
                  <option value="3">Quarta</option>
                  <option value="4">Quinta</option>
                  <option value="5">Sexta</option>
                </select>
              </label>
              <label>Inicio
                <input name="horarioInicio" value="09:00" required />
              </label>
            </div>
            <label>Fim
              <input name="horarioFim" value="12:00" required />
            </label>
            <button class="botao secundario" type="submit">Cadastrar disponibilidade</button>
          </form>

          <hr style="border:0;border-top:1px solid var(--linha);margin:22px 0">

          <form class="formulario" id="form-paciente">
            <label>Paciente
              <input name="nomeCompleto" value="Maria Silva" required />
            </label>
            <label>Telefone
              <input name="telefone" value="+5511998888777" required />
            </label>
            <div class="linha">
              <label>Dia
                <select name="diaSemana">
                  <option value="1">Segunda</option>
                  <option value="2" selected>Terca</option>
                  <option value="3">Quarta</option>
                  <option value="4">Quinta</option>
                  <option value="5">Sexta</option>
                </select>
              </label>
              <label>Horario
                <input name="horarioInicio" value="10:00" required />
              </label>
            </div>
            <button class="botao" type="submit">Cadastrar paciente</button>
          </form>
        </div>

        <div class="cartao">
          <h3>Pedidos de remarcacao</h3>
          <p>Quando o paciente responde 3, o pedido aparece aqui para o psicologo acompanhar.</p>
          <div class="lista" id="lista-remarcacoes"></div>
        </div>

        <div class="cartao">
          <h3>Agenda</h3>
          <p>Visao dos proximos atendimentos e acoes rapidas de simulacao.</p>
          <div class="lista" id="lista-agendamentos"></div>
        </div>

        <div class="cartao">
          <h3>Pacientes</h3>
          <p>Pacientes cadastrados para demonstracao.</p>
          <div class="lista" id="lista-pacientes"></div>
        </div>
      </div>
    </section>
  </main>

  <div class="aviso" id="aviso"></div>

  <script>
    const aviso = document.querySelector('#aviso');
    const areaLogin = document.querySelector('#area-login');
    const dashboard = document.querySelector('#dashboard');
    const botaoSair = document.querySelector('#botao-sair');

    function mostrarAviso(texto) {
      aviso.textContent = texto;
      aviso.classList.add('visivel');
      window.setTimeout(() => aviso.classList.remove('visivel'), 4200);
    }

    async function requisitar(url, opcoes = {}) {
      const resposta = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...(opcoes.headers || {}) },
        ...opcoes,
      });
      const texto = await resposta.text();
      const dados = texto ? JSON.parse(texto) : null;
      if (!resposta.ok) {
        const mensagem = Array.isArray(dados?.message) ? dados.message.join(' | ') : dados?.message;
        throw new Error(mensagem || 'Nao foi possivel concluir a operacao.');
      }
      return dados;
    }

    function obterPsicologoLogado() {
      const raw = localStorage.getItem('psicologo');
      return raw ? JSON.parse(raw) : null;
    }

    function entrarNoPainel(psicologo) {
      localStorage.setItem('psicologo', JSON.stringify(psicologo));
      areaLogin.classList.add('oculto');
      dashboard.classList.add('ativo');
      botaoSair.style.display = 'inline-flex';
      document.querySelector('#titulo-dashboard').textContent = 'Agenda de ' + psicologo.nome;
      carregarTudo().catch((erro) => mostrarAviso(erro.message));
    }

    function sair() {
      localStorage.removeItem('psicologo');
      areaLogin.classList.remove('oculto');
      dashboard.classList.remove('ativo');
      botaoSair.style.display = 'none';
    }

    document.querySelectorAll('.aba').forEach((aba) => {
      aba.addEventListener('click', () => {
        document.querySelectorAll('.aba').forEach((item) => item.classList.remove('ativa'));
        aba.classList.add('ativa');
        const modo = aba.dataset.aba;
        document.querySelector('#form-entrar').style.display = modo === 'entrar' ? 'grid' : 'none';
        document.querySelector('#form-cadastrar').style.display = modo === 'cadastrar' ? 'grid' : 'none';
      });
    });

    document.querySelector('#form-cadastrar').addEventListener('submit', async (evento) => {
      evento.preventDefault();
      const form = new FormData(evento.currentTarget);
      try {
        const resposta = await requisitar('/psicologos/cadastrar', {
          method: 'POST',
          body: JSON.stringify({
            nome: form.get('nome'),
            email: form.get('email'),
            senha: form.get('senha'),
          }),
        });
        mostrarAviso(resposta.mensagem);
        entrarNoPainel(resposta.psicologo);
      } catch (erro) {
        mostrarAviso(erro.message);
      }
    });

    document.querySelector('#form-entrar').addEventListener('submit', async (evento) => {
      evento.preventDefault();
      const form = new FormData(evento.currentTarget);
      try {
        const resposta = await requisitar('/psicologos/entrar', {
          method: 'POST',
          body: JSON.stringify({
            email: form.get('email'),
            senha: form.get('senha'),
          }),
        });
        mostrarAviso(resposta.mensagem);
        entrarNoPainel(resposta.psicologo);
      } catch (erro) {
        mostrarAviso(erro.message);
      }
    });

    botaoSair.addEventListener('click', sair);

    async function carregarTudo() {
      await Promise.all([
        carregarPacientes(),
        carregarDisponibilidades(),
        carregarAgendamentos(),
      ]);
    }

    async function carregarPacientes() {
      const lista = document.querySelector('#lista-pacientes');
      const pacientes = await requisitar('/pacientes');
      document.querySelector('#total-pacientes').textContent = pacientes.length;
      lista.innerHTML = pacientes.length
        ? pacientes.map((paciente) => '<article class="item"><div class="item-topo"><strong>' + paciente.nomeCompleto + '</strong><span class="badge">paciente</span></div><small>' + paciente.telefone + '</small><small>Horario recorrente: dia ' + (paciente.horarioRecorrente?.diaSemana ?? '-') + ' as ' + (paciente.horarioRecorrente?.horarioInicio ?? '-') + '</small></article>').join('')
        : '<div class="vazio">Nenhum paciente cadastrado ainda.</div>';
    }

    async function carregarDisponibilidades() {
      const disponibilidades = await requisitar('/disponibilidade/semanal');
      document.querySelector('#total-disponibilidades').textContent = disponibilidades.length;
    }

    async function carregarAgendamentos() {
      const resposta = await requisitar('/agendamentos/resumo?limite=20');
      const agendamentos = resposta.itens || [];
      const remarcacoes = agendamentos.filter((item) => item.status === 'remarcacao_solicitada');
      document.querySelector('#total-agendamentos').textContent = resposta.total ?? agendamentos.length;
      document.querySelector('#total-remarcacoes').textContent = remarcacoes.length;
      renderizarAgendaSemanal(agendamentos);
      renderizarAgendamentos(agendamentos);
      renderizarRemarcacoes(remarcacoes);
    }

    function obterDiaSemana(textoDataHora) {
      const partes = textoDataHora.split(' as ');
      const data = partes[0]?.trim();
      const horario = partes[1]?.trim() || '';
      const [dia, mes, ano] = data.split('/').map(Number);
      const dataObj = new Date(ano, mes - 1, dia);
      const nomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
      return {
        chave: data,
        nome: nomes[dataObj.getDay()],
        horario,
      };
    }

    function renderizarAgendaSemanal(agendamentos) {
      const container = document.querySelector('#agenda-semanal');
      const dias = new Map();

      agendamentos.slice(0, 12).forEach((agendamento) => {
        const dia = obterDiaSemana(agendamento.dataHora);
        if (!dias.has(dia.chave)) {
          dias.set(dia.chave, {
            titulo: dia.nome + ' • ' + dia.chave,
            itens: [],
          });
        }

        dias.get(dia.chave).itens.push({
          horario: dia.horario,
          paciente: agendamento.paciente,
          status: agendamento.status,
          statusDescricao: agendamento.statusDescricao,
        });
      });

      const colunas = Array.from(dias.values()).slice(0, 5);
      container.innerHTML = colunas.length
        ? colunas.map((dia) => '<div class="dia-agenda"><h4>' + dia.titulo + '</h4>' + dia.itens.map((item) => '<div class="slot-agenda ' + (item.status === 'remarcacao_solicitada' ? 'remarcacao' : '') + '"><strong>' + item.horario + '</strong><small>' + item.paciente + '</small><small>' + item.statusDescricao + '</small></div>').join('') + '</div>').join('')
        : '<div class="vazio">Gere agendamentos para visualizar a agenda semanal.</div>';
    }

    function renderizarAgendamentos(agendamentos) {
      const lista = document.querySelector('#lista-agendamentos');
      lista.innerHTML = agendamentos.length
        ? agendamentos.map((agendamento) => '<article class="item ' + (agendamento.status === 'remarcacao_solicitada' ? 'remarcacao' : '') + '"><div class="item-topo"><strong>' + agendamento.paciente + '</strong><span class="badge ' + (agendamento.status === 'remarcacao_solicitada' ? 'alerta' : '') + '">' + agendamento.statusDescricao + '</span></div><small>' + agendamento.dataHora + ' | ' + agendamento.origemDescricao + '</small><div class="mini-acoes"><button onclick="responderAgendamento(\\'' + agendamento.id + '\\', \\'1\\')">Confirmar</button><button onclick="responderAgendamento(\\'' + agendamento.id + '\\', \\'2\\')">Cancelar</button><button onclick="responderAgendamento(\\'' + agendamento.id + '\\', \\'3\\')">Pedir remarcacao</button></div></article>').join('')
        : '<div class="vazio">Nenhum agendamento gerado ainda.</div>';
    }

    function renderizarRemarcacoes(remarcacoes) {
      const lista = document.querySelector('#lista-remarcacoes');
      lista.innerHTML = remarcacoes.length
        ? remarcacoes.map((item) => '<article class="item remarcacao"><div class="item-topo"><strong>' + item.paciente + '</strong><span class="badge alerta">remarcacao</span></div><small>' + item.dataHora + '</small><small>Paciente solicitou novo horario. Use a agenda para acompanhar o status.</small></article>').join('')
        : '<div class="vazio">Nenhum pedido de remarcacao no momento.</div>';
    }

    async function gerarAgendamentos() {
      try {
        const resposta = await requisitar('/agendamentos/gerar', { method: 'POST' });
        mostrarAviso('Agendamentos gerados: ' + resposta.quantidadeCriada);
        await carregarAgendamentos();
      } catch (erro) {
        mostrarAviso(erro.message);
      }
    }

    async function enviarConfirmacoes() {
      try {
        const resposta = await requisitar('/agendamentos/confirmacoes/enviar', { method: 'POST' });
        mostrarAviso('Confirmacoes simuladas enviadas: ' + resposta.quantidadeEnviada);
        await carregarAgendamentos();
      } catch (erro) {
        mostrarAviso(erro.message);
      }
    }

    async function responderAgendamento(id, resposta) {
      try {
        const retorno = await requisitar('/agendamentos/' + id + '/respostas', {
          method: 'POST',
          body: JSON.stringify({ resposta }),
        });
        mostrarAviso(retorno.mensagem || 'Resposta processada.');
        await carregarAgendamentos();
      } catch (erro) {
        mostrarAviso(erro.message);
      }
    }

    document.querySelector('#form-disponibilidade').addEventListener('submit', async (evento) => {
      evento.preventDefault();
      const form = new FormData(evento.currentTarget);
      try {
        await requisitar('/disponibilidade/semanal', {
          method: 'POST',
          body: JSON.stringify({
            diaSemana: Number(form.get('diaSemana')),
            horarioInicio: form.get('horarioInicio'),
            horarioFim: form.get('horarioFim'),
            ativo: true,
          }),
        });
        mostrarAviso('Disponibilidade cadastrada.');
        await carregarTudo();
      } catch (erro) {
        mostrarAviso(erro.message);
      }
    });

    document.querySelector('#form-paciente').addEventListener('submit', async (evento) => {
      evento.preventDefault();
      const form = new FormData(evento.currentTarget);
      const timestamp = Date.now().toString().slice(-4);
      const telefoneBase = String(form.get('telefone'));
      const telefone = telefoneBase.slice(0, -4) + timestamp;
      try {
        await requisitar('/pacientes', {
          method: 'POST',
          body: JSON.stringify({
            nomeCompleto: form.get('nomeCompleto'),
            telefone,
            observacoes: 'Paciente criado pela interface de demonstracao.',
            horarioRecorrente: {
              diaSemana: Number(form.get('diaSemana')),
              horarioInicio: form.get('horarioInicio'),
              duracaoMinutos: 50,
              ativo: true,
            },
          }),
        });
        mostrarAviso('Paciente cadastrado.');
        await carregarTudo();
      } catch (erro) {
        mostrarAviso(erro.message);
      }
    });

    botaoSair.style.display = 'none';
    const psicologo = obterPsicologoLogado();
    if (psicologo) {
      entrarNoPainel(psicologo);
    }
  </script>
</body>
</html>`;
}
