var places = document.querySelectorAll("input[name=place]")

const ufSelect = document.querySelector("select[name=uf]")
const citySelect = document.querySelector("select[name=city]")

//vetor com o nome de cada Estado e seu respectivo id
let allStates = []

function getStates() {
    const stateApi = fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados") 

    //THEN = caminho de sucesso
    stateApi.then(function(response) {
        return(response.json())
    }).then(function(states) {
        for(let state of states) {
            //preenche o vetor allStates com os nomes dos Estados e seu respectivo id
            allStates.push([state.nome, state.id])
        }

        //preenche o "select uf" com os nomes dos Estados em ordem alfabética
        for(let state of allStates.sort()) {
            ufSelect.innerHTML += `<option value=${state[1]}> ${state[0]} </option>`
        }
    })

    //CATCH = caminho de erro
    stateApi.catch(function() {
        console.warn("ERROR 404")
    })
}
getStates()

//Função para carregar as cidades de cada estado
function getCities(event) {
    const stateInput = document.querySelector("input[name=state]")

    const indexOfSelectedState = event.target.selectedIndex;

    //atualiza o valor do input hidden com o nome do Estado
    stateInput.value = event.target.options[indexOfSelectedState].text

    //id do Estado
    let ufId = event.target.value
    
    const cityApi = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufId}/municipios`

    //reseta o valor do "select city" sempre que troca de Estado
    citySelect.innerHTML = `<option value>Selecione a cidade</option>`

    //desabilita o "select city" momentaneamente sempre que troca de Estado
    citySelect.disabled = true

    fetch(cityApi)
    .then(function(response) {
        return(response.json())
    }).then(function(cities) {
        for(let city of cities) {
            citySelect.innerHTML += `<option value="${city.nome}"> ${city.nome} </option>`
        }

        //habilita o "select city" após carregar os municípios
        citySelect.disabled = false;
    })
}

//chama a função getCities sempre que o usuário escolhe um novo Estado
ufSelect.addEventListener("change", getCities)

const problems = document.querySelectorAll(".problems .problems-grid li")
const collectedProblems = document.querySelector(".problems input[name=problems]")
var selectedProblems = []

for(const problem of problems) {
    problem.addEventListener("click", handleSelectedProblem)
}

for(const problem of problems) {
    problem.addEventListener("click", enableReport)
}

function handleSelectedProblem(event) {
    event.target.classList.toggle("selected")

    const problemId = event.target.dataset.id

    //verifica se existem itens selecionados e returna o seu index
    const isSelected = selectedProblems.findIndex(problem => problem == problemId) 

    //remove o item do array se já estiver selecionado
    if(isSelected >= 0) {
        const filteredProblems = selectedProblems.filter(problem => problem != problemId)

        selectedProblems = filteredProblems
    }
    //adiciona o item ao array se não estiver selecionado
    else {
        selectedProblems.push(problemId)
    }
    
    
    //atualiza o input hidden com os itens selecionados, em ordem numérica
    collectedProblems.value = selectedProblems.sort()

    // selectedProblems.forEach(element => {
    //     textarea[element-1].disabled = false
    // });
}

const textarea = document.querySelectorAll(".details textarea")

//habilita o textarea de cada problema, quando for clicado
function enableReport() {
    const problemId = event.target.dataset.id
    
    if(textarea[problemId-1].disabled == true)
        textarea[problemId-1].disabled = false
    else {
        textarea[problemId-1].disabled = true
    }
}

//Função de feedback enviado
function registerSucceed() {
    document.getElementById("modal").classList.toggle("hide")

    setTimeout(function() {
        window.location = "index.html"
        } ,2000)
    
}



