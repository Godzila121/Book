<template>
  <div class="login-form">
    <h3>Вхід в акаунт</h3>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="login-email">Email:</label>
        <input type="email" id="login-email" v-model="email" required />
      </div>
      <div>
        <label for="login-password">Пароль:</label>
        <input
          type="password"
          id="login-password"
          v-model="password"
          required
        />
      </div>
      <button type="submit">Увійти</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export default {
  name: "LoginForm",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      this.errorMessage = "";
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = userCredential.user;
        console.log("Користувач успішно увійшов:", user.email);

      } catch (error) {
        console.error("Помилка входу:", error);
        if (
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password" ||
          error.code === "auth/invalid-credential"
        ) {
          this.errorMessage = "Неправильний email або пароль.";
        } else {
          this.errorMessage = "Помилка входу: " + error.message;
        }
      }
    },
  },
};
</script>

<style scoped>
.login-form {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 20px auto;
}
.login-form div {
  margin-bottom: 15px;
}
.login-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.login-form input {
  width: calc(100% - 22px);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.login-form button {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
.login-form button:hover {
  background-color: #0056b3;
}
.error-message {
  color: red;
  margin-top: 10px;
}
</style>
