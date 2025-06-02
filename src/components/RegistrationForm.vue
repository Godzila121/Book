<template>
  <div class="registration-form">
    <h3>Реєстрація нового користувача</h3>
    <form @submit.prevent="handleRegister">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Пароль (мін. 6 символів):</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Зареєструватися</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </form>
  </div>
</template>
<script>
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default {
  name: "RegistrationForm",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    async handleRegister() {
      this.errorMessage = "";
      this.successMessage = "";

      if (this.password.length < 6) {
        this.errorMessage = "Пароль має бути щонайменше 6 символів.";
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = userCredential.user;
        console.log("Користувача успішно зареєстровано:", user);
        this.successMessage = `Користувача ${user.email} успішно зареєстровано! Тепер ви можете увійти.`;

        this.email = "";
        this.password = "";

      } catch (error) {
        console.error("Помилка реєстрації:", error);
        if (error.code === "auth/email-already-in-use") {
          this.errorMessage = "Цей email вже використовується.";
        } else if (error.code === "auth/weak-password") {
          this.errorMessage = "Пароль занадто слабкий.";
        } else {
          this.errorMessage = "Помилка реєстрації: " + error.message;
        }
      }
    },
  },
};
</script>

<style scoped>
.registration-form {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 30px auto;
}
.registration-form div {
  margin-bottom: 15px;
}
.registration-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.registration-form input {
  width: calc(100% - 22px);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.registration-form button {
  background-color: #28a745;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
.registration-form button:hover {
  background-color: #218838;
}
.error-message {
  color: red;
  margin-top: 10px;
}
.success-message {
  color: green;
  margin-top: 10px;
}
</style>
