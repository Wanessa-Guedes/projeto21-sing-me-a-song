<h1 align=center> API DOCUMENTATION </h1>

<p align="center">
  <a href="https://github.com/Wanessa-Guedes/projeto21-sing-me-a-song.git">
  <img src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f399-fe0f.svg" alt="readme-logo" width="80" height="80">
  </a>

  <h3 align="center">
    Project#21 SING ME A SONG
  </h3>
</p>

## Usage

```bash
$ git clone https://github.com/Wanessa-Guedes/projeto21-sing-me-a-song.git

$ cd $nome-repositorio

$ npm install

$ npx prisma migrate dev

$ npx prisma generate

$ npx prisma db seed

$ npm run dev
```

API:

```bash
- ROTAS 

- POST /recommendations
    - Rota para adicionar uma nova recomendação de música
    - headers: {}
    - body: {"name": "Musica Boa",
             "youtubeLink": "https://www.youtube.com/...."}
    
- POST /recommendations/:id/upvote
    - Rota para adicionar um ponto à pontuação da recomendação
    - headers: {}
    - body: {}            
    
- POST /recommendations/:id/downvote
    - Rota para remover um ponto da pontuação da recomendação
    - Regra de negócio: 
      - Se a pontuação fica abaixo de -5, a recomendação deve ser excluída
    - headers: {}
    - body: {}
    
- GET /recommendations
    - Rota para pegar todas as últimas 10 recomendações
    - headers: {}
    - body: [{ "id": 1,
		           "name": "Musica Boa",
		           "youtubeLink": "https://www.youtube.com/....",
		           "score": 100 }]
    
- GET /recommendations/:id
    - Rota para pegar uma recomendação pelo seu ID
    - headers: {}
    - body: {	"id": 2,
	            "name": "Musica muito boa",
	            "youtubeLink": "https://www.youtube.com/...",
	            "score": 63  }
    
- GET /recommendations/random
    - Rota para pegar uma recomendação aleatória 
    - Regras de Negócio:
      - 70% das vezes que baterem nessa rota: uma música com pontuação maior que 10 deve ser recomendada aleatoriamente;
      - 30% das vezes que baterem nessa rota: uma música com pontuação entre -5 e 10 (inclusive), deve ser recomendada aleatoriamente;
      - Caso só haja músicas com pontuação acima de 10 ou somente abaixo/igual a 10, 100% das vezes deve ser sorteada qualquer música;
      - Caso não haja nenhuma música cadastrada, deve ser retornado status 404.      
    - headers: {}
    - body: {	"id": 2,
	            "name": "Musica muito boa",
	            "youtubeLink": "https://www.youtube.com/...",
	            "score": 63  }    
  
  - GET /recommendations/top/:amount
    - Rota para listar as músicas com maior número de pontos e sua pontuação. 
    - Regras de Neógcio: 
      - São retornadas as top x músicas (parâmetro :amount da rota), ordenadas por pontuação (maiores primeiro)
    - headers: {}
    - body: [{ "id": 10,
		           "name": "Musica Bem Legal",
		           "youtubeLink": "https://www.youtube.com/...",
		           "score": 201
	          },
	          {
		          "id": 3,
		          "name": "Musica Legal",
		          "youtubeLink": "https://www.youtube.com/...",
		          "score": 143
	          },
	          ... ]

```    
