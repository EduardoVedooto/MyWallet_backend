import supertest from "supertest";
import app from "../src/App.js";

export async function SignUp() {
  await supertest(app).post("/users").send(validBody);
}

export async function SignIn() {
  const newUser = await supertest(app).post("/signin").send({ email: validBody.email, password: validBody.password })
  return newUser.body;
}

export const validBody = {
  name: "Teste",
  email: "teste@email.com",
  password: "123456",
  confirmPassword: "123456"
};

export const validEntry = {
  value: 1,
  description: "TESTE",
}