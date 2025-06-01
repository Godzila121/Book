<template>
  <div id="app">
    <header>
      <h1>Мій Каталог Улюблених Книг</h1>
    </header>
    <main>
      <div class="auth-section">
        <RegistrationForm />
      </div>
      <hr class="section-divider" />

      <BookForm @add-book="addNewBook" />
      <BookList :books="books" />
    </main>
  </div>
</template>

<script>
import RegistrationForm from "./components/RegistrationForm.vue"; // <-- Імпорт форми реєстрації
import BookForm from "./components/BookForm.vue";
/*import BookList from "./components/BookList.vue";*/
import { db, auth } from "./firebaseConfig"; // <-- Переконайтеся, що auth імпортовано
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
// Важливо: createUserWithEmailAndPassword використовується в RegistrationForm.vue, тому тут він не потрібен.

export default {
  name: "App",
  components: {
    RegistrationForm, // <-- Реєстрація компонента
    BookForm,
    /*BookList,*/
  },
  data() {
    return {
      db: db,
      auth: auth, // Можна додати для доступу, якщо потрібно буде в App.vue
      books: [],
      currentUser: null, // Додамо пізніше для зберігання інформації про поточного користувача
    };
  },
  methods: {
    async addNewBook(bookData) {
      // Цей метод поки що не змінюємо, але пізніше він буде використовувати ID користувача
      console.log("App.vue: addNewBook called with data:", bookData);
      if (!this.db) {
        console.error("App.vue: Firestore (db) is not initialized!");
        return;
      }
      // TODO: Пізніше додати перевірку, чи користувач залогінений (this.currentUser)
      // і зберігати книгу для конкретного користувача
      try {
        const booksCollectionRef = collection(this.db, "books"); // Поки що зберігаємо в загальну колекцію
        await addDoc(booksCollectionRef, {
          ...bookData,
          rating: Number(bookData.rating) || null,
          createdAt: serverTimestamp(),
        });
        console.log("App.vue: Книгу додано");
      } catch (e) {
        console.error("App.vue: Помилка додавання документа в Firestore: ", e);
      }
    },
    fetchBooks() {
      // Цей метод поки що не змінюємо, але пізніше він буде завантажувати книги
      // або для всіх, або для конкретного користувача
      const booksCollectionRef = collection(this.db, "books");
      const q = query(booksCollectionRef, orderBy("createdAt", "desc"));

      onSnapshot(
        q,
        (querySnapshot) => {
          const fetchedBooks = [];
          querySnapshot.forEach((doc) => {
            fetchedBooks.push({ id: doc.id, ...doc.data() });
          });
          this.books = fetchedBooks;
          console.log("App.vue: Books fetched/updated:", this.books);
        },
        (error) => {
          console.error("App.vue: Помилка отримання книг з Firestore: ", error);
        }
      );
    },
    // Тут пізніше додамо методи для відстеження стану автентифікації
  },
  mounted() {
    this.fetchBooks(); // Поки що завантажуємо всі книги
    // Тут пізніше додамо слухача onAuthStateChanged
  },
};
</script>

<style>
/* Ваші глобальні стилі */
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
}
.section-divider {
  margin-top: 20px;
  margin-bottom: 20px;
  border: 0;
  border-top: 1px solid #eee;
}
</style>
