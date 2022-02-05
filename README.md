# kapusta-bl3-back

- регистрация нового пользователя
post: https://kapusta-smart-finances.herokuapp.com/api/auth/registration
обязательные поля body: email, password
не обязательные поля body: name, avatar
ответы: 201 / 409, 429

- верификация почты (ссылка в письме)
get: https://kapusta-smart-finances.herokuapp.com/api/users/verify/:token
ответы: 200 / 400

- запрос на повторную отправку письма верификации 
post: https://kapusta-smart-finances.herokuapp.com/api/users/verify
ответы: 200 / 404

- логинизация пользователя
post: https://kapusta-smart-finances.herokuapp.com/api/auth/login
email, password - обязательные поля body
ответы: 200+токен / 401, 

- разлогинизация пользователя
post: https://kapusta-smart-finances.herokuapp.com/api/auth/loguot
нужен токен
ответы: 200 / 401

- отправка аватарки пользователя
patch: https://kapusta-smart-finances.herokuapp.com/api/users/avatar
нужен токен
ответы: !!!хероку не хочет!!! / 404

- получение списка транзакций
get: https://kapusta-smart-finances.herokuapp.com/api/transactions
нужен токен
ответы: 200 проблемка!!!! / 401

- добавление транзакции
post: https://kapusta-smart-finances.herokuapp.com/api/transactions
нужен токен
обязательные поля body: type (true/false), sum, category
не обязательные поля body: date, description, currency
ответы: 200+обьект / 

- удаление транзакции
delete: https://kapusta-smart-finances.herokuapp.com/api/transactions/:id
нужен токен
ответы: 200+обьект / 404