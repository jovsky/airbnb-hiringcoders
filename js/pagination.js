// Função que calcula número de páginas e exibe os botões de paginamento
function renderPages(totalCards) {

    pagesContainer.innerHTML = "";

    let totalPages = Math.ceil(totalCards/cardsPerPage);

    //previous btn
    if(totalPages>1){
        var li = document.createElement("li");
        li.className = "page-item disabled";
        li.setAttribute("id", "page_previous");
        li.addEventListener('click', clickPage);
        li.innerHTML = `
            <a class="page-link" href="#" tabindex="-1">
                <span aria-hidden="true">&laquo;</span>
                <span class="sr-only">Previous</span>
            </a> `
        pagesContainer.appendChild(li);
    }

    //btn
    for(var i=1; i<=totalPages; i++){
        li = document.createElement("li");
        (i==1) ? (li.className = "page-item active") : (li.className = "page-item");
        li.setAttribute("id", "page_"+i);
        li.addEventListener('click', clickPage);
        li.innerHTML = `<a class="page-link" href="#">`+i+`</a>`;
        pagesContainer.appendChild(li);
    }

    //next btn
    if(totalPages>1){
        var li = document.createElement("li");
        li.className = "page-item";
        li.setAttribute("id", "page_next");
        li.addEventListener('click', clickPage);
        li.innerHTML = `
            <a class="page-link" href="#">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
        </a>`
        pagesContainer.appendChild(li);
    }

    pagesContainer.style.visibility = 'visible';
}

// Função evento de clique para mudar de página
function clickPage(event){
    event.preventDefault();
    
    let index = this.id.substring(5);

    let buttons = pagesContainer.getElementsByTagName("li");
    TB = buttons.length;

    if(index=="previous"){
        if (currentPage != 1){
            currentPage --;
        }
    } else if ( index == "next" ) {
        if (currentPage != TB-2){
            currentPage ++;
        }
    } else {
        currentPage = index;
    }

    if (TB > 1){
        if(currentPage == 1){
            //console.log('a:' + currentPage);
            buttons[0].className = "page-item disabled";
            buttons[TB-1].className = "page-item";

        } else if (currentPage == TB-2){
            //console.log('b:'+currentPage);
            buttons[0].className = "page-item";
            buttons[TB-1].className = "page-item disabled";

        } else{
            //console.log('c:'+currentPage);
            buttons[TB-1].className = "page-item";
            buttons[0].className = "page-item";
        }
        for (var i=1; i<(TB-1); i++){
            //console.log('i>'+i+'  id: '+buttons[i].id);
            (currentPage == i) ? buttons[i].className = "page-item active" : buttons[i].className = "page-item";
        }
    }
    

    renderCards(data());

};


// função que vai renderizar cards e paginamento
function loadPage(){
        renderPages(data().length);
        renderCards(data());
}