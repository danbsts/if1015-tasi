### REST API and Client

Para executar o cliente:
- node client.js `PATH` `METHOD` `BODY` `Accept`

##### Questões para discussão:
> Que decisões envolveram a escolha da nomenclatura dos recursos?

Escolhi um recurso especifico e suas "derivacoes", apos isso algumas decisoes para nao gerar conflitos nas rotas precisaram ser tomadas como por exemplo entre
/tasks/:id e /tasks/:day que levariam a mesma funcao, o que me fez adicionar um parametro de query para filtrar por dia e endereco.

> Que cabeçalhos HTTP estiveram envolvidos para garantir as quatro diretrizes acima?

Foram utilizados o `content-type` e `accept` para explicitar o tipo de dado enviado no conteudo e que tipo de dado era aceito pelo cliente/server, respectivamente.