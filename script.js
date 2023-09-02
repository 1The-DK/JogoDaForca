const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d")

let palavras = [
  "Cachorro",
  "Gato",
  "Papagaio",
  "Sapo",
  "Leopardo",
  "Vaca",
  "Elefante",
  "Pinguim",
  "Golfinho",
  "Cobra",
  "Tartaruga",
  "Coruja",
  "Cavalo",
  "Touro",
  "Urso",
  "Girafa",
  "Macaco",
  "Aguia",
  "Camelo",
  "Rinoceronte",
  "Pardal",
  "Jacare",
  "Lagarto",
  "Peixe",
  "Leao",
  "Tigre",
  "Zebra",
  "Lobo",
  "Coelho",
  "Rato",
  "Passaro",
  "Gaivota",
  "Doninha",
  "Gaviao",
  "Pomba",
  "Foca",
  "Orca",
  "Hiena",
  "Esquilo",
  "Urutu",
  "Faisao",
  "Raposa",
  "Pantera",
  "Veado",
  "Abutre",
  "Alce",
  "Camaleao",
]


class JogoForca {
  constructor(palavras) {
    this.palavras = palavras
    this.word = ""
    this.hiddenWord = []
    this.tentativas = 0
    this.pontuacao = 0
    this.somatoria = 0;
    this.maxTentativas = 6
    this.tentativasRestantes = this.maxTentativas
    this.letrasDigitadasElement = document.getElementById("letras-digitadas")
    this.botões = document.querySelectorAll(".key") // Seleciona todos os botões
    this.vitoria = false
    this.mensagemElement = document.getElementById("mensagem")
    this.displayTentativasRestantes()
    // Adicione um ouvinte de clique a cada botão
    this.botões.forEach((button) => {
      button.addEventListener("click", () => {
        if (!button.disabled && !this.vitoria) {
          // Verifica se o botão não está desativado
          const letter = button.textContent
          this.handleLetterClick(letter)
          this.atualizarLetrasDigitadas(letter)
          button.disabled = true
        }
      })
    })
    this.selecionarPalavra()

    const botaoReiniciar = document.getElementById("reiniciar")

    // Adicione um ouvinte de clique ao botão de reiniciar
    botaoReiniciar.addEventListener("click", () => {
      // Limpe o canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Reinicie todas as variáveis do jogo
      this.word = ""
      this.hiddenWord = []
      this.tentativas = 0
      this.tentativasRestantes = this.maxTentativas
      this.vitoria = false
      this.mensagemElement.querySelector("h1").textContent = ""
      this.botões.forEach((button) => {
        button.disabled = false // Reative todos os botões
      })
      this.letrasDigitadasElement.textContent = "Letras:"
      this.mensagemElement.querySelector("h1").textContent = "Tema: Animais"
      this.selecionarPalavra()

      this.displayTentativasRestantes()
      this.desenharforca()
      this.atualizarPontuacao(0)
    })
  }

  atualizarPontuacaoNoCanvas() {
    ctx.font = "20px Arial"
    ctx.fillStyle = "white"
    ctx.textAlign = "left"

    // Desenha a pontuação no canto superior esquerdo do canvas
    ctx.fillText(`Pontuação: ${this.pontuacao}`, 310, 30)
  }

  atualizarPontuacao(pontos) {
    const pontosPorAdivinhacao = pontos
    this.pontuacao += pontosPorAdivinhacao
    this.atualizarPontuacaoNoCanvas()
  }

  desenharforca() {
    ctx.strokeStyle = "black"
    ctx.lineWidth = 4

    // Desenhe a base da forca
    ctx.beginPath()
    ctx.moveTo(350, 280)
    ctx.lineTo(150, 280)
    ctx.stroke()

    // Desenhe o poste vertical
    ctx.beginPath()
    ctx.moveTo(250, 280)
    ctx.lineTo(250, 50)
    ctx.stroke()

    // Desenhe a trave horizontal superior
    ctx.beginPath()
    ctx.moveTo(250, 50)
    ctx.lineTo(175, 50)
    ctx.stroke()

    // Desenhe a corda
    ctx.beginPath()
    ctx.moveTo(175, 50)
    ctx.lineTo(175, 80)
    ctx.stroke()

    if (this.tentativasRestantes < 6) {
      ctx.beginPath()
      ctx.arc(175, 100, 20, 0, Math.PI * 2)
      ctx.stroke()
    }

    if (this.tentativasRestantes < 5) {
      ctx.beginPath()
      ctx.moveTo(175, 120)
      ctx.lineTo(175, 200)
      ctx.stroke()
    }

    if (this.tentativasRestantes < 4) {
      ctx.beginPath()
      ctx.moveTo(175, 140)
      ctx.lineTo(150, 160)
      ctx.stroke()
    }

    if (this.tentativasRestantes < 3) {
      ctx.beginPath()
      ctx.moveTo(175, 140)
      ctx.lineTo(200, 160)
      ctx.stroke()
    }

    if (this.tentativasRestantes < 2) {
      ctx.beginPath()
      ctx.moveTo(175, 200)
      ctx.lineTo(150, 240)
      ctx.stroke()
    }

    if (this.tentativasRestantes < 1) {
      ctx.beginPath()
      ctx.moveTo(175, 200)
      ctx.lineTo(200, 240)
      ctx.stroke()
    }
  }

  selecionarPalavra() {
    this.word = this.palavras[Math.floor(Math.random() * this.palavras.length)]
    this.initializeHiddenWord()
  }

  verificarVitoria() {
    if (!this.hiddenWord.includes("_")) {
      this.vitoria = true
      if (this.tentativasRestantes === 6)
        this.atualizarPontuacao(this.somatoria + 60)
      else if (this.tentativasRestantes === 5) {
        this.atualizarPontuacao(this.somatoria + 50)
      } else if (this.tentativasRestantes === 4) {
        this.atualizarPontuacao(this.somatoria + 40)
      } else if (this.tentativasRestantes === 3) {
        this.atualizarPontuacao(this.somatoria + 30)
      } else if (this.tentativasRestantes === 2) {
        this.atualizarPontuacao(this.somatoria + 20)
      } else if (this.tentativasRestantes === 1) {
        this.atualizarPontuacao(this.somatoria + 10)
      }
      // Todas as letras foram encontradas, desative todos os botões
      this.botões.forEach((button) => {
        button.disabled = true
      })

      // Exiba a mensagem de vitória
      this.mensagemElement.querySelector("h1").textContent = "Você venceu!"
    }
  }

  atualizarLetrasDigitadas(letra) {
    // Obtenha o texto atual das letras digitadas
    const letrasDigitadas = this.letrasDigitadasElement.textContent
      .replace("Letras:", "")
      .trim()

    // Adicione a letra às letras digitadas
    this.letrasDigitadasElement.textContent = `Letras: ${letrasDigitadas} ${letra},`
  }

  handleLetterClick(letter) {
    const letraClicada = letter.toUpperCase()
    let letraEncontrada = false // Adicione uma variável para rastrear se a letra foi encontrada

    // Verifica se a letra clicada existe na palavra oculta
    for (let i = 0; i < this.word.length; i++) {
      if (this.word[i].toUpperCase() === letraClicada) {
        this.hiddenWord[i] = this.word[i]
        letraEncontrada = true // Marque a letra como encontrada
      }
    }

    if (letraEncontrada) {
      // Se a letra foi encontrada, atualize a palavra exibida e exiba novamente
      this.displayHiddenWord()
      this.verificarVitoria()
      this.desenharforca()
      this.displayTentativasRestantes()
      this.atualizarPontuacao(this.somatoria)
    } else {
      this.tentativasRestantes--
      this.displayTentativasRestantes()
      this.verificarDerrota()
      this.desenharforca()
    }
  }

  displayTentativasRestantes() {
    // Limpe a área onde as tentativas são exibidas
    ctx.clearRect(0, 0, 150, 50)

    // Configura o estilo do texto para exibir as tentativas restantes
    ctx.font = "20px Arial"
    ctx.fillStyle = "white"
    ctx.textAlign = "left"

    // Desenha o número de tentativas restantes no canto superior esquerdo
    ctx.fillText(`Tentativas: ${this.tentativasRestantes}`, 10, 30)
  }
  verificarDerrota() {
    if (this.tentativasRestantes <= 0) {
      this.atualizarPontuacao(this.somatoria - 60)
      this.vitoria = false // Marque a vitória como falso
      this.botões.forEach((button) => {
        button.disabled = true // Desative todos os botões
      })
      this.displayPalavraOculta()
      this.mensagemElement.querySelector("h1").textContent = "Você perdeu!"
      this.atualizarPontuacaoNoCanvas()
      this.displayTentativasRestantes()
    }
  }

  displayPalavraOculta() {
    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Configura o estilo do texto
    ctx.font = "40px Arial"
    ctx.fillStyle = "white" // Cor do texto
    ctx.textAlign = "center" // Alinhamento do texto

    // Desenha a palavra oculta no centro do canvas
    ctx.fillText(this.word, canvas.width / 2, canvas.height / 1.1)
  }

  initializeHiddenWord() {
    for (let i = 0; i < this.word.length; i++) {
      if (this.word[i] !== " ") {
        this.hiddenWord[i] = "_"
      } else {
        this.hiddenWord[i] = " "
      }
    }
    this.displayHiddenWord()
  }
  displayHiddenWord() {
    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Configura o estilo do texto
    ctx.font = "40px Arial"
    ctx.fillStyle = "white" // Cor do texto
    ctx.textAlign = "center" // Alinhamento do texto

    // Desenha a palavra oculta no centro do canvas
    const spacedHiddenWord = this.hiddenWord.join(" ")

    // Desenha a palavra oculta no centro do canvas
    ctx.fillText(spacedHiddenWord, canvas.width / 2, canvas.height / 1.1)
  }
}

const sorteio = new JogoForca(palavras)
sorteio.desenharforca()
sorteio.displayTentativasRestantes();
sorteio.atualizarPontuacao(0)