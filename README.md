# Como rodar o APP
Caso deseja rodar esse app, nos usamos um banco de dados em docker, certifique que o docker esteja rodando em sua maquina e rode o comando
```bash
docker compose up -d
```

## caso nao queira usar o docker e tenha uma instancia MYSQL rodando localmente modifique o arquivo .env para algo como

```env
PORT="3333"
DATABASE_URL="mysql://[usuario]:[senha]@localhost:3306/foolish"

```


## Para finalizar use o comando npm install para instalar tudo e o comando npm run dev para rodar o servidor de desenvolvimento



