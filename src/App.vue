<template>
  <div id="app">
    <header>
      <h1>Мій Каталог Улюблених Книг</h1>
    </header>
    <main>
      <BookForm @add-book="addNewBook" />
    </main>
  </div>
</template>

<script>
import BookForm from "./components/BookForm.vue";
import { db } from "./firebaseConfig"; // Імпортуємо наш конфіг Firebase та db
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default {
  name: "App",
  components: {
    BookForm,
  },
  methods: {
    async addNewBook(bookData) {
      try {
        const booksCollectionRef = collection(db, "books"); // Посилання на колекцію 'books'
        const docRef = await addDoc(booksCollectionRef, {
          ...bookData, // Дані з форми
          createdAt: serverTimestamp(), // Додаємо мітку часу створення на сервері
        });
        console.log("Книгу додано з ID: ", docRef.id);
        alert("Книгу успішно додано!"); // Простий відгук користувачу
      } catch (e) {
        console.error("Помилка додавання документа: ", e);
        alert("Не вдалося додати книгу. Перевірте консоль для деталей.");
      }
    },
  },
};
</script>

<style>
/* Глобальні стилі або стилі для App.vue */
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
</style>
