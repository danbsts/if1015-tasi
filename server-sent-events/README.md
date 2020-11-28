> Quais as principais diferenças entre esta implementação e a implementação com sockets TCP?

Nessa implementacao achei mais facil configurar por conta da biblioteca e conseguir manejar as conexoes do que na anterior.

> Quais as principais dificuldades com a implementação usando EventSource?

Teve um bug muito malicioso que ao mandar o `res.write('data: \n\n'')` se nao botar esse data e os dois "\n", nao funciona, mas fora isso foi tranquilo. :D 
