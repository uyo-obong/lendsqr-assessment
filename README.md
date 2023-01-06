# Lendsqr Assessment

This is a Demo Credit app that allows the user to 
- create an account.
- fund his/her account.
- transfer funds to another user’s account.
- withdraw funds from their account.

The tools used in the project are

- Nodejs
- Typescript
- Typeorm
- Mysql Database

The payment gateway been used is `Flutterwaves`

## DATABASE DESIGN
https://dbdesigner.page.link/Env65Pc26D9z4TVB8

## SETUP

- Clone the repo.
- Run ```npm install```
- Create .env (The content via email)
- Run ```npm run dev``` to start the app

## HOW TO FUND WALLET

In order to fund wallet, you have to send `amount` and `transaction_id` to the fund endpoint
demo transaction_id are;
== 4068888 (amount is 1000)
== 4066674 (amount is 500)

## HOW TO WITHDRAW FUND
To withdraw funds, you have to use the below details

```json
{
    "amount": 100,
    "account_number": "0690000040",
    "account_name": "Test",
    "bank_code": "044"
}
```

## HOW TO TRANSFER FUNDS

In order to transfer funds to another user, you have to get the user `account_id` and send a post request to the transfer endpoint
