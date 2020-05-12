const dataApiUrl = "https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72";
const locApiUrl = "https://v1.nocodeapi.com/jovsky/google_sheets/ugAvwESzogxnXVIV?tabId=Loc";

const cardsContainer = document.getElementById("cards");
const pagesContainer = document.getElementById("pages");
const bigContainer = document.getElementById("container-results");

const locName = document.getElementById("location-search");
const dateCkIn = document.getElementById("checkin");
const dateCkOut = document.getElementById("checkout");
const numHostages = document.getElementById("hostages");

const resultTitle = document.getElementById("result-title");
const resultData = document.getElementById("result-data");
const searchValue = document.getElementById("location-search");
const space = document.getElementById("space");


const cardsPerPage = 8;
var currentPage = 1;

var data_all = [];
var data_filter;
var FILTER = false;

var nights;

//
function data(){
    if (FILTER) {
        return data_filter;
    } else {
         return data_all;
    }
}


// Função assíncrona que acessa API e retorna objetos
async function fetchData() {

    pagesContainer.innerHTML = `<div class="spinner-border text-danger" role="status">
    <span class="sr-only">Loading...</span></div>`;

    let data1 = await (await fetch(dataApiUrl)).json();
    let data2 = (await (await fetch(locApiUrl)).json()).data;

    if (data1.length == data2.length){
        for (var i=0; i< data1.length; i++){
            data1[i] = {...data2[i], ...data1[i]};
            data1[i].code = i+1;
        }
    }
    return await data1;
}

// Função que renderiza o containerCards
function renderCards(cards) {

    cardsContainer.innerHTML = ""; // limpa o html da div #cards
    let x = cardsPerPage*(currentPage-1);
    cards.slice(x, x+cardsPerPage).map(renderCard); // funciona como um for, para cada elemento...

}

// Função que cria e renderiza um Card
function renderCard(card) {

    let d1 = new Date(dateCkIn.value); // Data de hoje
    let d2 = new Date(dateCkOut.value); // Outra data no passado
    let diff = Math.abs(d2.getTime() - d1.getTime()); // Subtrai uma data pela outra
    nights = Math.ceil(diff / (1000 * 60 * 60 * 24));

    let totalPrice = nights*card.price*numHostages.value;

    const div = document.createElement("div");

    div.id = "card_#"+card.code;
    div.className = "card";
    div.innerHTML = `
    <img src="${card.photo}" class="card-img-top" alt="${card.name}" />
    <div class="card-body" >
        <h6 class="card-title">${card.name}</h6>
        <p class="card-text">
            ${card.property_type}
        </p>
        <div class="preco">
            Total: <span>R$${totalPrice},00</span>
            <br>
            R$${card.price},00/noite

        </div>
        <a id="btnCard_#${card.code}" href="javascript:event.preventDefault();" class="btn btn-primary text-right"
        data-toggle="modal" data-target=".bd-example-modal-lg" onclick="buildModal(this.id.slice(9))">Visualizar</a>
    </div>`;
    cardsContainer.appendChild(div);

    if (FILTER) space.scrollIntoView({block: 'start', behavior: 'smooth' });

}


/* Pagination functions was here */


// função que vai renderizar cards e paginamento
function loadPage(){
        renderPages(data().length);
        renderCards(data());

}

// função que recebe o texto, então monta data_filtered e retorna 
// chamada em searchAccomod()
function setFilteredData() {

    data_filter = [];
    let terms = locName.value.split(", ");
    let nT = (terms.length > 1) ? 2 : 1;
    let count = 0;
    let local;

    console.log("NT = " + nT);

    for (var i=0; i<data_all.length; i++){

        count=0;

        local = data_all[i].local.toLowerCase();
        console.log("<>" + local);
        for (var j = 0; j < terms.length; j++) {
            
            if (local.includes(terms[j].toLowerCase())) {
                count++;
                console.log(" <<<"+count+">>>>" + terms[j].toLowerCase());
                if (count >= nT){
                    data_filter.push(data_all[i]);
                    break;
                }
            }
        }
    }
    console.log('> Procurar:  ' + terms);
    console.log('> Filtrados: ');
    console.log(data_filter);
    return data_filter.length;
}

//função que aplica a busca e retorna o conteúdo
function searchAccomod(){

    console.log('shit');

    bigContainer.style.display = 'block';
    FILTER = true;
    let n = setFilteredData();
    resultTitle.innerHTML = `Hospedagens encontradas em ${searchValue.value} (${n})`;
                        //<a href="javascript:clearFilter()"> &times;</a>`;

    let sD = (nights > 1) ? 's' : '';
    let sP = (numHostages.value > 1) ? 's' : '';
    resultData.innerHTML = `
    Check-In em <span>${formatDate(dateCkIn.value)}</span>, Check-Out em <span>${formatDate(dateCkOut.value)}</span> 
    &nbsp; &rarr; &nbsp; <span>${nights}</span> diária${sD} para <span>${numHostages.value}</span> pessoa${sP}`;

    loadPage();

}

//
function formatDate(old){
    return old.substring(8)+'/'+old.substring(5,7)+'/'+old.substring(0,4);
}

// função que constrói modal com informações da hospedagem selecionada
function buildModal(code){

    let card;

    // busca sequencial 
    for (var i=0; i<data_all.length; i++){
        if (data_all[i].code == code){
            card = data_all[i];
            break;
        }
    }

    loadMap(parseFloat(card.lat), parseFloat(card.lng));

    let dtcin = dateCkIn.value, dtcout = dateCkOut.value;
    let totalPrice = nights*card.price*numHostages.value;
    let sD = (nights > 1) ? 's' : '';
    let sP = (numHostages.value > 1) ? 's' : '';

    dtcin = formatDate(dtcin);
    dtcout = formatDate(dtcout);

    document.getElementsByClassName('modal-title')[0].textContent = card.name;
    document.getElementById('modal-info').innerHTML = 
        `<h6> Informações do local </h6><br>
        Tipo de propriedade: <span>${card.property_type}</span><br>
        Localização: <span>${card.local}</span><br><br>
        Valor da diária: <span>RS${card.price},00</span>`;
    document.getElementById('modal-price').innerHTML = 
        `<h6> Detalhes do pedido </h6><br>
        Data de Check-In: <span>${dtcin}</span><br>
        Data de Check-Out: <span>${dtcout}</span><br>
        <span>${nights}</span> diária${sD} para <span>${numHostages.value}</span> pessoa${sP}
        
        <div id="total-price"> Valor total: <span>R$${totalPrice},00</span></div>`;

}

// função que constroi elementos
function initialConstruct(){

    let today = new Date();
    let dd = ("0" + (today.getDate())).slice(-2);
    let mm = ("0" + (today.getMonth() +　1)).slice(-2);
    let yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd ;
    dateCkIn.setAttribute("value", today);

    let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
    dd = ("0" + (tomorrow.getDate())).slice(-2);
    mm = ("0" + (tomorrow.getMonth() +　1)).slice(-2);
    yyyy = tomorrow.getFullYear();
    tomorrow = yyyy + '-' + mm + '-' + dd ;
    dateCkOut.setAttribute("value", tomorrow);

}

// Função principal
async function main() {

    initialConstruct();

    data_all = await fetchData();
    data_filter = data_all;

    if(data_all) {
        console.log(data_all);
        document.getElementById("btn-checkin").disabled = false;
        loadPage();
    }
    
};

main();
