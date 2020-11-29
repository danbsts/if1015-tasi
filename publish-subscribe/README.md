> Qual a principal diferença entre cada exemplo dos tutoriais seguidos?

Eles diferem por modalidade de publish/subs, uma vez que mostra o uso de forma diferente das filas, com varios consumidores, somente um,
por fila publicada... entre outros.

> Suponha que o seu servidor de filas (rabbitmq-server) está executando e possui filas que contém
mensagens ainda não consumidas, e acidentalmente a máquina em que ele roda reinicia, como se
pode garantir que as mensagens estarão salvas quando o servidor de filas voltar a funcionar?

E necessario enviar as mensagens como persistentes para que isso nao ocorra.


##### off: me empolguei deixando o front bonitinho kkkk
