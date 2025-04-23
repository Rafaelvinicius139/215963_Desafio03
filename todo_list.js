// essa função para atualizar uma das caracteristicas dos botoes 
function funcionalidades(botao) {
    botao.style.display = 'none';

    const parent = botao.parentElement.parentElement; 
    const icone = parent.querySelector('.atualizar');
    const tarefa = parent.querySelector('h2');

    const id = parent.getAttribute('data-id'); 
    let tarefas = JSON.parse(localStorage.getItem(armazenamento)) || [];
    let tarefaIndex = tarefas.findIndex(t => t.id === id);

    if (tarefaIndex !== -1) {
        tarefas[tarefaIndex].concluida = false;

     
        console.log(`Tarefa concluída:`, tarefas[tarefaIndex]);
    }

    localStorage.setItem(armazenamento, JSON.stringify(tarefas)); 
    
    if (icone) {
        icone.style.display = 'flex'; 
        tarefa.style.textDecoration = 'line-through';
        tarefa.style.color = "#8f98a8";
    }

    contarTarefa();
}


// erra funcionalidade e para adicionar outras caracteristicas relacionado ao icone 
function funcionalidades2(botao) {
    const parent = botao.parentElement.parentElement; 
    const icone = parent.querySelector('.atualizar');
    const concluir = parent.querySelector('.concluido'); 
    const tarefa = parent.querySelector('h2');

    if (icone && concluir) {
        icone.style.display = "none";
        concluir.style.display = 'inline-block'; 

        tarefa.style.textDecoration = 'none';
        tarefa.style.color = "black";

        contarTarefa();
    }
}


// essa funcionalidade e para que a tarefa seja contada quando clicar no motão 
function contarTarefa() {
    const botoes = document.getElementsByClassName('concluido');
    const contadorElemento = document.getElementById('contar'); 
  
    let contador = 0; 

    
    for (let i = 0; i < botoes.length; i++) {
        if (botoes[i].style.display === 'none') {
            contador++; // AQUI estava faltando!
        }
    }

    contadorElemento.textContent = `${contador} tarefa concluída${contador > 1 ? 's' : ''}`;
    localStorage.setItem('contadorConcluidas', contador);
}
// essa função ira sempre carregar na tela as tarefas concluidas 
window.onload = function () {
    const salvo = parseInt(localStorage.getItem('contadorConcluidas')) || 0;
    document.getElementById('contar').textContent = `${salvo} tarefa concluída${salvo > 1 ? 's' : ''}`;
};




const armazenamento = 'Gerenciamento_da_lista';



// essa função e a função que sera pego no local storage para mostra as tarefas da tela 
function mostrarTarefas() {
    const valores = JSON.parse(localStorage.getItem(armazenamento) || "[]");

    const listas = document.getElementById('js_colunas');
    listas.innerHTML = '';

    for (let item of valores) {
        if (!item.id) {
            item.id = Date.now().toString() + Math.random().toString(16).substr(2);
        }

// para adicionar a data no momento da tarefa 
        if (!item.dataCriacao) {
            const hoje = new Date();
            item.dataCriacao = `${String(hoje.getDate()).padStart(2, '0')}/${String(hoje.getMonth() + 1).padStart(2, '0')}/${hoje.getFullYear()}`;
        }
// a interface no dom sobre cada variavel que vai aparecer dinamicamente na tela 
        listas.innerHTML += `
            <div class="conteudo" data-id="${item.id}">
                <div id="conteudo_texto">
                    <div id="conteudo-titulo">
                        <h2 onclick="atualizando(this)" class="tranformar" style="${item.concluida ? 'text-decoration: line-through; color: #8f98a8;' : ''}">${item.name}</h2>
                    </div>
                    <div id="etiquetas">
                        <span class="etiqueta2"><p id="etiqueta">${item.etiqueta}</p></span>
                        <span id="datas">criado em ${item.dataCriacao}</span>
                    </div>
                </div>

                <div id="conteudo_botao">
                    <!-- Botão Concluir: se a tarefa estiver concluída, mostra "Concluir" e esconde o ícone -->
                    <button class="concluido" onclick="funcionalidades(this)" style="${item.concluida ? 'display: none;' : ''}">Concluir</button>
                    <!-- Ícone de atualização: se a tarefa estiver concluída, mostra o ícone e esconde o botão "Concluir" -->
                    <button class="atualizar" onclick="funcionalidades2(this)" style="${item.concluida ? 'display: flex;' : 'display: none;'}">
                        <img src="imagens/icone.svg" alt="icone">
                    </button>
                </div>
            </div>
        `;
    }

    localStorage.setItem(armazenamento, JSON.stringify(valores));
}




 


// funão para atualizar tranformando h2 ema tag imput para que as tarefas seja atualizada 
  function atualizando(h2) {
    const parent = h2.closest(".conteudo");
    const id = parent.getAttribute("data-id");

    const input = document.createElement("input");
    input.type = "text";
    input.value = h2.textContent;
    input.className = "tranformar";
    input.style.fontSize = "1.2rem";
    input.style.width = "80%";
    input.style.marginLeft = "20px"

    h2.replaceWith(input);
    input.focus();

    input.addEventListener("blur", () => {
        const novoTexto = input.value.trim();
        if (novoTexto !== "") {
            let tarefas = JSON.parse(localStorage.getItem(armazenamento)) || [];
            let tarefaIndex = tarefas.findIndex(t => t.id === id);
            if (tarefaIndex !== -1) {
                tarefas[tarefaIndex].name = novoTexto;
                localStorage.setItem(armazenamento, JSON.stringify(tarefas));
            }
        }
        mostrarTarefas();
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            input.blur(); // forçando para salvar 
        }
    });
}
 // essa tarefa e a tarefa do armazenamento ou cadastramento 
function novaTarefa() {
    const tarefa = document.getElementById("tarefa").value; //peguei valor da tarefa 
    const etiqueta = document.getElementById("etiquetando").value; // valor a etiqueta 

    const valores = JSON.parse(localStorage.getItem(armazenamento) || "[]"); // armazena lo local storage 

    valores.push({
        id: Date.now().toString() + Math.random().toString(16).substr(2),
        name: tarefa,
        etiqueta: etiqueta,
        concluida: false
    });
   // convertendo para o arquivo do local storage 
    localStorage.setItem(armazenamento, JSON.stringify(valores));
    mostrarTarefas();
   // limpando os imputs para armazenamento
    document.getElementById("tarefa").value = "";
    document.getElementById("etiquetando").value = "";
}




// sempre caregar e mostra na pagina 
document.onload = mostrarTarefas();



