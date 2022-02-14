# kapusta-bl3-back

https://kapusta-smart-finances.herokuapp.com/api-docs/ 
документация бекэнда


- регистрация нового пользователя
post: https://kapusta-smart-finances.herokuapp.com/api/auth/registration
обязательные поля body: email, password
не обязательные поля body: name, avatar, currency
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
{
    "status": "success",
    "code": 200,
    "data": {
        "name": "Guest",
        "email": "notDelete@test.com",
        "avatar": "https://s.gravatar.com/avatar/9d824df4591788970910476f86defe43?s=250",
        "balance": null,
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMDJkOWM5YmI3MDJjNzBhYTE5N2ZmOCIsImVtYWlsIjoibm90RGVsZXRlQHRlc3QuY29tIiwiaWF0IjoxNjQ0ODMzOTg0LCJleHAiOjE2NDQ5MjAzODR9.1Vf3Nxkmmm0wBREg_1vb8udzaNevh8v9tfJ7CQ6pbmA"
    }
}

- рефреш данных пользователя по токену
post: https://kapusta-smart-finances.herokuapp.com/api/auth/current
нужен токен
ответы: 200+обьект / 401,

- разлогинизация пользователя
post: https://kapusta-smart-finances.herokuapp.com/api/auth/logout
нужен токен
ответы: 200 / 401

- отправка аватарки пользователя
patch: https://kapusta-smart-finances.herokuapp.com/api/users/avatar
нужен токен
ответы: 200+avatarUrl / 404

- получение списка транзакций
get: https://kapusta-smart-finances.herokuapp.com/api/transactions
нужен токен
ответы: 200+список обектов / 401
пример ответа с перечнем транзакций:
{
    "status": "success",
    "code": 200,
    "data": {
        "total": 5,
        "transactions": [
            {
                "type": true,
                "sum": 150,
                "date": "2022-02-05T11:45:40.197Z",
                "category": "доход",
                "description": null,
                "currency": "UAH",
                "owner": {
                    "id": "61fe628716eac7bf99681b1b"
                },
                "createdAt": "2022-02-05T12:35:56.126Z",
                "updatedAt": "2022-02-05T12:35:56.126Z",
                "id": "61fe6f2ca6f52ea4bc7eb959"
            },
            {
                "type": true,
                "sum": 330,
                "date": "2022-02-05T19:52:43.627Z",
                "category": "доход",
                "description": null,
                "currency": "UAH",
                "owner": {
                    "id": "61fe628716eac7bf99681b1b"
                },
                "createdAt": "2022-02-05T20:34:36.231Z",
                "updatedAt": "2022-02-05T20:34:36.231Z",
                "id": "61fedf5c9dc52c5d6db212b3"
            }
        ]
    }
}

- добавление транзакции
post: https://kapusta-smart-finances.herokuapp.com/api/transactions
нужен токен
обязательные поля body: type (true/false), sum, category
не обязательные поля body: date, description
ответы: 200+обьект / 400

- удаление транзакции
delete: https://kapusta-smart-finances.herokuapp.com/api/transactions/:id
нужен токен
ответы: 200+обьект / 404

- обновление баланса пользователя
patch: https://kapusta-smart-finances.herokuapp.com/api/reports/balance
нужен токен
обязательные поля body: balance
ответ:
{
    "status": "success",
    "code": 200,
    "data": {
        "balance": 20000
    }
}

- получение баланса пользователя
get: https://kapusta-smart-finances.herokuapp.com/api/reports/balance
нужен токен
ответ:
{
    "status": "success",
    "code": 200,
    "data": {
        "balance": {
            "total": [
                {
                    "_id": false,
                    "total": 6000
                },
                {
                    "_id": true,
                    "total": 80000
                }
            ]
        }
    }
}

- получение сводки с доходами по месяцам
get: https://kapusta-smart-finances.herokuapp.com/api/reports/summary_income
нужен токен
ответ: (уже отсортировано по убыванию)
{
    "status": "success",
    "code": 200,
    "data": {
        "0": {
            "_id": {
                "month": 2,
                "year": 2022,
                "type": "true"
            },
            "totalValue": 122000
        },
        "1": {
            "_id": {
                "month": 1,
                "year": 2022,
                "type": "true"
            },
            "totalValue": 16000
        }
    }
}

- получение сводки с расходами по месяцам
get: https://kapusta-smart-finances.herokuapp.com/api/reports/summary_cost
нужен токен
ответ: аналогичен сводке с доходами, только тип: false

- получение детальной информации по доходам и расходам за месяц
get: https://kapusta-smart-finances.herokuapp.com/api/reports/detail?year=2022&month=2
нужен токен, в параметрах запроса: год, месяц
ответ: 

