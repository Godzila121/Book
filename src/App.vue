<template>
  <div id="app">
    <header>
      <h1>Мій Каталог Улюблених Книг</h1>
      <div v-if="currentUser" class="user-info">
        <p>Вітаємо, {{ currentUser.email }}!</p>
        <button @click="handleLogout" class="logout-button">Вийти</button>
      </div>
    </header>
    <main>
      <div v-if="!currentUser" class="auth-section">
        <div class="form-toggle" v-if="authFormToShow === 'login'">
          <LoginForm @loggedIn="onUserLoggedIn" />
          <p>
            Немає акаунта?
            <button @click="showRegisterForm" class="toggle-button">
              Зареєструватися
            </button>
          </p>
        </div>

        <div class="form-toggle" v-else-if="authFormToShow === 'register'">
          <RegistrationForm @registered="onUserRegistered" />
          <p>
            Вже є акаунт?
            <button @click="showLoginForm" class="toggle-button">Увійти</button>
          </p>
        </div>
      </div>
      <hr v-if="!currentUser" class="section-divider" />

      <div v-if="currentUser">
        <h2>Ваші книги:</h2>
        <BookForm @add-book="addNewBook" />
        <BookList :books="books" />
      </div>
      <div v-if="!currentUser && !authFormToShow">
        <p>
          Будь ласка, увійдіть або зареєструйтеся, щоб переглядати та додавати
          книги.
        </p>
      </div>
    </main>
  </div>
</template>

<script>
import RegistrationForm from "./components/RegistrationForm.vue";
import LoginForm from "./components/LoginForm.vue";
import BookForm from "./components/BookForm.vue";
import { db, auth } from "./firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default {
  name: "App",
  components: {
    RegistrationForm,
    LoginForm,
    BookForm,
  },
  data() {
    return {
      db: db,
      auth: auth,
      books: [],
      currentUser: null,
      unsubscribeBooks: null,
      authFormToShow: "login",
    };
  },
  methods: {
    showLoginForm() {
      this.authFormToShow = "login";
    },
    showRegisterForm() {
      this.authFormToShow = "register";
    },
    onUserLoggedIn(user) {
      console.log("App.vue: User logged in event received", user);
    },
    onUserRegistered() {
      console.log("App.vue: User registered event received");
      this.authFormToShow = "login";
    },

    async addNewBook(bookData) {
      console.log("App.vue: addNewBook called with data:", bookData);

      if (!this.currentUser) {
        alert("Будь ласка, увійдіть в систему, щоб додати книгу.");
        console.error(
          "App.vue: Користувач не залогінений, спроба додати книгу."
        );
        return;
      }

      if (!this.db) {
        console.error("App.vue: Firestore (db) is not initialized!");
        alert("Помилка: База даних не ініціалізована.");
        return;
      }

      try {
        const userBooksCollectionRef = collection(
          this.db,
          "Users",
          this.currentUser.uid,
          "Books"
        );

        console.log(
          `App.vue: Attempting to add document to Firestore for user ${this.currentUser.uid} with data:`,
          { ...bookData, createdAt: "буде замінено serverTimestamp" }
        );

        await addDoc(userBooksCollectionRef, {
          ...bookData,
          rating: Number(bookData.rating) || null,
          createdAt: serverTimestamp(),
        });
        console.log(
          `App.vue: Книгу додано для користувача ${this.currentUser.uid}`
        );
      } catch (e) {
        console.error(
          `App.vue: Помилка додавання документа в Firestore для користувача ${this.currentUser.uid}: `,
          e
        );
        alert("Не вдалося додати книгу. Перевірте консоль для деталей.");
      }
    },
    fetchBooks(userId) {
      if (!userId) {
        this.books = [];
        console.log(
          "App.vue: fetchBooks - userId не надано, список книг очищено."
        );
        return;
      }

      console.log(`App.vue: Fetching books for user ${userId}`);
      const userBooksCollectionRef = collection(
        this.db,
        "Users",
        userId,
        "Books"
      );
      const q = query(userBooksCollectionRef, orderBy("createdAt", "desc"));

      if (this.unsubscribeBooks) {
        this.unsubscribeBooks();
        console.log("App.vue: Unsubscribed from previous books listener.");
      }

      this.unsubscribeBooks = onSnapshot(
        q,
        (querySnapshot) => {
          const fetchedBooks = [];
          querySnapshot.forEach((doc) => {
            fetchedBooks.push({ id: doc.id, ...doc.data() });
          });
          this.books = fetchedBooks;
          console.log(
            `App.vue: Books fetched/updated for user ${userId}:`,
            this.books
          );
        },
        (error) => {
          console.error(
            `App.vue: Помилка отримання книг для користувача ${userId} з Firestore: `,
            error
          );
          this.books = [];
        }
      );
    },
    handleLogout() {
      signOut(this.auth)
        .then(() => {
          console.log("Користувач вийшов");
          this.authFormToShow = "login";
        })
        .catch((error) => {
          console.error("Помилка виходу:", error);
          alert("Не вдалося вийти.");
        });
    },
    setupAuthListener() {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          this.currentUser = user;
          console.log(
            "App.vue: Користувач увійшов:",
            this.currentUser.email,
            "UID:",
            this.currentUser.uid
          );
          this.fetchBooks(this.currentUser.uid);
        } else {
          this.currentUser = null;
          console.log("App.vue: Користувач вийшов або не автентифікований.");
          if (this.unsubscribeBooks) {
            this.unsubscribeBooks();
            this.unsubscribeBooks = null;
            console.log("App.vue: Unsubscribed from books listener on logout.");
          }
          this.books = [];
        }
      });
    },
  },
  mounted() {
    this.setupAuthListener();
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
header {
  background-color: #42b983;
  padding: 15px 0;
  color: white;
  margin-bottom: 30px;
  position: relative;
}
header h1 {
  margin: 0;
}
main {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 15px;
}
.auth-section {
  margin-bottom: 30px;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  background-color: #fafafa;
  max-width: 450px;
  margin-left: auto;
  margin-right: auto;
}
.form-toggle p {
  margin-top: 15px;
  font-size: 0.9em;
}
.toggle-button {
  background: none;
  border: none;
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
}
.toggle-button:hover {
  color: #0056b3;
}
.section-divider {
  margin-top: 20px;
  margin-bottom: 20px;
  border: 0;
  border-top: 1px solid #eee;
}
.user-info {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 15px;
}
.user-info p {
  margin: 0;
  color: white;
}
.logout-button {
  background-color: #dc3545;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.logout-button:hover {
  background-color: #c82333;
}
</style>
