<template>
  <form @submit.prevent="handleSubmit" class="book-form">
    <h3>Додати нову книгу</h3>
    <div>
      <label for="title">Назва:</label>
      <input type="text" id="title" v-model="book.title" required />
    </div>
    <div>
      <label for="author">Автор:</label>
      <input type="text" id="author" v-model="book.author" required />
    </div>
    <div>
      <label for="rating">Оцінка (1-5):</label>
      <input
        type="number"
        id="rating"
        v-model.number="book.rating"
        min="1"
        max="5"
        required
      />
    </div>
    <div>
      <label for="genre">Жанр (необов'язково):</label>
      <input type="text" id="genre" v-model="book.genre" />
    </div>
    <div>
      <label for="review">Короткий відгук (необов'язково):</label>
      <textarea id="review" v-model="book.review"></textarea>
    </div>
    <button type="submit">Додати книгу</button>
  </form>
</template>

<script>
export default {
  name: "BookForm",
  data() {
    return {
      book: {
        title: "",
        author: "",
        rating: null,
        genre: "",
        review: "",
      },
    };
  },
  methods: {
    handleSubmit() {
      // Тут ми будемо викликати подію, щоб передати дані книги батьківському компоненту
      this.$emit("add-book", { ...this.book });

      // Очистити форму після відправки
      this.book.title = "";
      this.book.author = "";
      this.book.rating = null;
      this.book.genre = "";
      this.book.review = "";
    },
  },
};
</script>

<style scoped>
.book-form {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 20px auto;
}
.book-form div {
  margin-bottom: 15px;
}
.book-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.book-form input[type="text"],
.book-form input[type="number"],
.book-form textarea {
  width: calc(100% - 22px); /* Враховуємо padding та border інпутів */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; /* Дозволяє padding не збільшувати загальну ширину */
}
.book-form button {
  background-color: #42b983; /* Зелений Vue */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
.book-form button:hover {
  background-color: #36a374;
}
</style>
