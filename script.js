// 3 cozinheiros
//     velocidade
//     chance de erro
//     chance de milagre

// pratos
//     tempo
//     quantidade de cozinheiros


class Cook {
    constructor(){
        this.speed = 1 // int
        this.error = 0.1 // porcentagem
        this.miracle = 0.1 // porcentagem
    }
}

class Recipe {
    constructor(difficult, quantity){
        this.difficult = difficult * 5
        this.quantity = quantity
    }
}

const Game = {

    createRequest: () => {
        let difficult = parseInt(Math.random() * 3) + 1
        let quantity = parseInt(Math.random() * 3) + 1
        return new Recipe(difficult, quantity)
    },

    start: () => {
        console.log("começou")
    }
}


Game.start()