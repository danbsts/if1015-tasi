> Qual a vantagem de usar uma abordagem como gRPC ao invés de sockets?

A serializacao e coordenacao de mensagens (protocolos) fica bem mais facil de ser manipulada entre servidor-cliente.


> Ainda comparando-se com a abordagem utilizando sockets, qual o papel do Protocol Buffer nos
exercícios acima? Há algum aumento de complexidade?

Ele tem o papel de criar um protocolo de serializacao e desserializacao das mensagens. Uma vez definido o formato de mensagens a comunicacao fica mais simples na minha opiniao.


> De forma geral, quais as principais diferenças entre as implementações da calculadora e dos chats?

A calculadora e o primeiro chat sao aplicacoes em que temos um servidor e um cliente que pode fazer requisicoes para esse servidor. No primeiro chat servidor e cliente estao juntos. No multi-chat o servidor e um pouco diferente que ele pode aceitar conexoes simultaneas e persistentes e deve responder para todos quando uma mensagem e enviada. 
