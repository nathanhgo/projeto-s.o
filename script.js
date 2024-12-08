// 3 cozinheiros
//     velocidade
//     chance de erro
//     chance de milagre

// pratos
//     tempo
//     quantidade de cozinheiros


let recipes_div = document.querySelector('.pedidos')
let dinheiro_div = document.querySelector('#dinheiro')
let upgrade_buttons = document.querySelectorAll('.upgrade')

cook1_div = document.querySelector('#cozinheiro1')
cook2_div = document.querySelector('#cozinheiro2')
cook3_div = document.querySelector('#cozinheiro3')

class Cook {
    constructor(id, speed, error, miracle, cook_div){
        this.id = id
        this.status = false // False: Desocupado | True: Ocupado
        this.progress = 0
        this.speed = speed // int
        this.error = error // porcentagem
        this.miracle = miracle // porcentagem
        this.cook_div = cook_div // div p/ manipulação de status
        this.recipe = null
        this.price_upgrade = 5
    }

    updateVisualStatus() {
        let status_string = ''
        if (this.status == false) {
            status_string = 'Não ocupado'
        } else {

            status_string = 'Ocupado'
        }

        this.cook_div.innerHTML = `
        <div class="load_bar">
                <div class="progress">
        </div>
        </div>
        <div class="cozinheiro-token">
            <img src="./assets/Cozinheiro ${this.id}/cozinheiro${this.id}_anim.gif" alt="">
        </div>
        <div class="status">
            <p>${status_string}</p>
            <p>Velocidade: <span>${this.speed}</span></p>
            <p>Taxa de erro: <span>${this.error * 100}%</span></p>
            <p>Taxa de milagre: <span>${this.miracle * 100}%</span></p>
        </div>`
    }

    work(recipeObj) {
        this.recipe = recipeObj
        this.status = true
        this.updateVisualStatus()

        let miracle_res = this.calculateMiracle()
        let error_res = this.calculateError()

        if (miracle_res == true) {
            this.finishWork()
            game.money += 5
            window.alert('Um milagre ocorreu! Seu cozinheiro terminou o pedido instantaneamente')
            game.updateMoneyStatus()
        } else if(error_res == true) {
            this.finishWork()
            window.alert('Um desastre aconteceu! O pedido de um de seus cozinheiros foi descartado')
        }
        else {

            let progress_bar = this.cook_div.querySelector('.progress')
            let interval = setInterval(() => {
                    progress_bar.style.width = `${this.progress}%`
                    if (this.progress < 100) {
                        this.progress += (this.speed / this.recipe.difficult) * 0.75 // 0.75 é uma constante aleatória
                    } else {
                        this.finishWork()
                        game.money += 5
                        game.updateMoneyStatus()
                        clearInterval(interval)
                    }
                }, 100)
        }
    }

    finishWork() {

        this.recipe = null
        this.progress = 0
        this.status = false
        this.updateVisualStatus()
    }

    calculateError() {
        let random = Math.random()

        if (random < this.error) {
            return true
        } else {
            return false
        }
    }

    calculateMiracle() {
        let random = Math.random()
        
        if (random < this.miracle) {
            return true
        } else {
            return false
        }
    }
}

class Recipe {
    constructor(id, difficult, quantity){
        this.difficult = difficult
        this.quantity = quantity
        this.id = id
    }
}

class Game {
    constructor() {
        this.requestsArray = []
        this.last_id = 0
        this.money = 0
    }

    createRequest() {
        let difficult = parseInt(Math.random() * 3) + 1
        let quantity = parseInt(Math.random() * 2) + 1
        let new_recipe = new Recipe(this.last_id, difficult, quantity)
        this.requestsArray.push(new_recipe)
        this.showRequest(new_recipe)
        this.last_id += 1
    }
    
    showRequest(recipeObj) {
        let cooks = recipeObj.quantity;
        let difficult = recipeObj.difficult;
        let recipeIndex = recipeObj.id // Índice da receita

        let opc_a = "1"
        let opc_b = "2"
        let opc_c = "3"
        
        if (cooks == 2) {
            opc_a = "1 e 2"
            opc_b = "1 e 3"
            opc_c = "2 e 3"
        }

        // Criar um contêiner para o pedido
        let recipe_div = document.createElement('div');
        recipe_div.className = 'pedido';
        recipe_div.innerHTML = `
            <h3>Pedido ${recipeIndex + 1}</h3>
            <div class="pedido-status">
                <div>Cozinheiros: <span>${cooks}</span></div>
                <div>Dificuldade: <span>${difficult}</span></div>
            </div>
            <div class="pedido-interativo">
                <select>
                    <option value="a">${opc_a}</option>
                    <option value="b">${opc_b}</option>
                    <option value="c">${opc_c}</option>
                </select>
                <button>Atribuir</button>
            </div>
        `;

        const atribuir_btn = recipe_div.querySelector('button');
        const select_element = recipe_div.querySelector('select');

        atribuir_btn.addEventListener('click', () => {
            this.attachRecipe(select_element.value, recipeObj);
        });

        recipes_div.appendChild(recipe_div);
    }

    updateRequests() {
        recipes_div.innerHTML = ''
        for (let i = 0; i < this.requestsArray.length; i++) {
            this.showRequest(this.requestsArray[i])
        }
    }

    attachRecipe(select_value, recipeObj) {
        let sucess = false

        if (recipeObj.quantity == 1) {

            if (select_value == 'a' && cook1.status == false) {
                sucess = true
                cook1.work(recipeObj)

            } else if (select_value == 'b' && cook2.status == false) {
                sucess = true
                cook2.work(recipeObj)

            } else if (select_value == 'c' && cook3.status == false) {
                sucess = true
                cook3.work(recipeObj)
            }

        } else {
            if (select_value == 'a' && cook1.status == false && cook2.status == false) {
                sucess = true
                cook1.work(recipeObj)
                cook2.work(recipeObj)

            } else if (select_value == 'b' && cook1.status == false && cook3.status == false) {
                sucess = true
                cook1.work(recipeObj)
                cook3.work(recipeObj)

            } else if (select_value == 'c' && cook2.status == false && cook3.status == false) {
                sucess = true
                cook2.work(recipeObj)
                cook3.work(recipeObj)
            }
        }

        if (sucess == true) {
            let recipe_index = this.requestsArray.indexOf(recipeObj)
            this.requestsArray.splice(recipe_index, 1)
            this.updateRequests()
        } else {
            window.alert('Cozinheiro ocupado!')
        }
    }

    updateMoneyStatus() {
        dinheiro_div.innerHTML = this.money
    }

    upgradeSpeed(index) {
        console.log(index)
        let upgrade1 = document.querySelector('#upgrade1')
        let upgrade2 = document.querySelector('#upgrade2')
        let upgrade3 = document.querySelector('#upgrade3')

        let upgrade1_price = document.querySelector('#upgrade1_price')
        let upgrade2_price = document.querySelector('#upgrade2_price')
        let upgrade3_price = document.querySelector('#upgrade3_price')

        let speed_upgrade = 1
        let price_upgrade = 1

            if (index == 0 && this.money >= cook1.price_upgrade) {
                this.money -= cook1.price_upgrade

                cook1.speed += speed_upgrade
                cook1.price_upgrade += price_upgrade

                upgrade1.innerHTML = cook1.speed
                upgrade1_price.innerHTML = cook1.price_upgrade

                cook1.updateVisualStatus()

            } else if (index == 1 && this.money >= cook2.price_upgrade) {
                this.money -= cook2.price_upgrade

                cook2.speed += speed_upgrade
                cook2.price_upgrade += price_upgrade

                upgrade2.innerHTML = cook2.speed
                upgrade2_price.innerHTML = cook2.price_upgrade

                cook2.updateVisualStatus()

            } else if (index == 2 && this.money >= cook3.price_upgrade) {
                this.money -= cook3.price_upgrade

                cook3.speed += speed_upgrade
                cook3.price_upgrade += price_upgrade

                upgrade3.innerHTML = cook3.speed
                upgrade3_price.innerHTML = cook3.price_upgrade

                cook3.updateVisualStatus()
            } else {
                window.alert('Você não tem dinheiro suficiente para essa ação!')
            }

            this.updateMoneyStatus()
    }
}


var game = new Game()

var cook1 = new Cook(1, 5, 0.01, 0.01, cook1_div)
var cook2 = new Cook(2, 10, 0.05, 0.05, cook2_div)
var cook3 = new Cook(3, 20, 0.1, 0.1, cook3_div)

cook1.updateVisualStatus()
cook2.updateVisualStatus()
cook3.updateVisualStatus()


setInterval(() => {
    if (game.requestsArray.length < 8) {
        game.createRequest()
    }
}, 5000)

game.createRequest()
game.createRequest()
game.createRequest()
game.createRequest()
game.createRequest()
game.createRequest()
game.createRequest()
game.createRequest()


upgrade_buttons.forEach((button, index) => {
    button.onclick = () => {
        game.upgradeSpeed(index)
    }
})