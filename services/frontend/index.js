//Função para criar e retornar um elemento HTML representando um produto
function newBook(book) {
    //cria uma div para o livro e adiciona a classe de coluna
    const div = document.createElement('div');
    div.className = 'column is-4';

    //Define o conteudo HTML interno da div com os dados do livro
    div.innerHTML = `
        <div class="card is-shady">
            <div class="card-image">
                <figure class="image is-4by3">
                    <img
                        src="${book.photo}" //imagem do produto
                        alt="${book.name}" //texto alternativo do produto
                        class="modal-button"
                    />
                </figure>
            </div>
            <div class="card-content">
                <div class="content book" data-id="${book.id}"> //armazena o ID do Livro
                    <div class="book-meta">
                        <p class="is-size-4">R$${book.price.toFixed(2)}</p> //Preço formatado
                        <p class="is-size-6">Disponível em estoque: 5</p> //quantidade ficticia
                        <h4 class="is-size-3 title">${book.name}</h4> //Nome do Produto
                        <p class="subtitle">${book.author}</p> //autor
                    </div>
                    <div class="field has-addons"> 
                        <div class="control">
                            <input class="input" type="text" placeholder="Digite o CEP"/>
                        </div>
                        <div class="control">
                            <a class="button button-shipping is-info" data-id="${book.id}"> Calcular Frete </a>
                        </div>
                    </div>
                    <button class="button button-buy is-success is-fullwidth">Comprar</button>
                </div>
            </div>
        </div>`;

    //retorna o elemento montado
    return div;
}

// função para calcular o frete com base no ID do livro e no CEP
function calculateShipping(id, cep) {
    fetch('http://localhost:3000/shipping' + cep) //faz requisição para a API de frete
        .then((data) => {
            if(data.ok) {
                return data.json(); //converte a resposta para JSON se estiver ok
            }
            throw data.statusText; //caso contrario, lança erro
        })
        .then((data) => {
            //mostra o valor do frete
            swal('Frete', `O frete é: R$${data.value.toFixed(2)}`, 'success');
        })
        .catch((err) => {
            //mostra erro se a requisição falhar
            swal('Erro', 'Erro ao consultar frete', 'error');
            console.error(err);
        });
}

//aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function () {
    const books = document.querySelector('.books'); // Seleciona o conteiner onde os livros serão exibidos

    //Busca os produtos (livros) do servidor
    fetch('http://localhost:300/products')
        .then((data) => {
            if (data.ok) {
                return data.json(); //converte a resposta para JSON se estiver ok
            }
            throw data.statusText;
        })
        .then((data) => {
            if(data) {
                //para cada livro, cria e adiciona o elemento ao container
                data.forEach ((book) => {
                    books.appendChild(newBook(book));
                });

                //adiocina evento de clique aos botões de calcular o frete
                document.querySelectorAll('.button-shipping').forEach((btn) => {
                    btn.addEventListener('click', (e) => {
                        const id = e.target.getAttribute('data-id'); //Pega o ID do livro
                        const cep = document.querySelector(`.book[data-id="${id}"] input`).value;
                        calculateShipping(id, cep); //chama a função de frete
                    });
                });

                //adiciona evento de clique aos botões de compra
                document.querySelectorAll('.button-buy').forEach((btn) => {
                    btn.addEventListener('click', (e) => {
                        swal('Compra de livro', 'Sua compra foi realizada com sucesso', 'success');
                    });
                });
            }
        })
        .catch((err) => {
            //Em caso de erro ao carregar os produtos
            swal('Erro', 'Erro o listar os produtos', 'error');
            console.error(err);
        });
});