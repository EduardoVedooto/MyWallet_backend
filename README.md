# My Wallet

My Wallet is a simple to use app to manage all your incomes and expenses through a minimalist interface.

Try it out now [here](https://my-wallet-bootcamp.vercel.app/ "My Wallet App")

---

## About

- This repository is the API created to be used by the project My Wallet (link [here](https://github.com/EduardoVedooto/MyWallet_frontend)).

---

## Motivations to delevop this project

- One of the mainly motivations to do this project was to learn more about REST API and integration tests. It was really challenging in some parts, especially in its tests. Besides, I liked the objective of it, which I explains better in the frontend repository.

---

## Functionalities (Routes)

- Register a new account (POST/users)
- Sign in (POST/signin)
- Sign out (DELETE/logout/:id)
- Add a new income or expense (POST/finances/:id)
- Get all your incomes and expenses (GET/finances/:id)

---

## Next steps

Here as some improvements and new features which I want to implement in the future in this project:

- Change to a typescript project
- Change its architecture to a more dinamic one
- Added a ORM (TypeORM)

---

## Technologies

The following tools and frameworks were used in the construction of the project:<br>

<p>
  <img style='margin: 5px;' src="https://img.shields.io/badge/-NODEJS-&?style=for-the-badge&logo=nodedotjs&color=grey" alt="React logo" />
  <img style='margin: 5px;' src="https://img.shields.io/badge/-Javascript-&?style=for-the-badge&logo=javascript&color=grey&" alt="Javascript logo" />
  <img style='margin: 5px;' src='https://img.shields.io/badge/-Jest-&?style=for-the-badge&logo=jest&color=gray'>
  <img style='margin: 5px;' src='https://img.shields.io/badge/-express-&?style=for-the-badge&color=gray&logo=express&logoColor=%3a3a3a'>
  <img style='margin: 5px;' src='https://img.shields.io/badge/-eslint-&?style=for-the-badge&color=gray&logo=eslint&logoColor=%3a3a3a'>
</p>

---

## Getting started

You can install this project in you machine to run locally.
To do this, follow the next steps:

> You need to know how to create a database on postgresql

1. Clone this repository

```bash
git clone https://github.com/EduardoVedooto/MyWallet_frontend.git
```

2. Open the folder created

```bash
cd MyWallet_frontend
```

3. Install dependencies

```bash
npm i
```

4. Create a new postgres database called mywallet

5. Copy the tables from the archive dump.sql

6. Create a .env file with the same structure of .env.example

7. Run the project

```bash
npm run server
```

---

## Feedback

Feel free to collaborate opening issues, pull request or just giving me feedbacks of new features you'd love to see in the future on this project. If you want to contact me directly, [here's my email](mailto:vedootoeduardo@gmail.com). I'd love to hear you 😊
