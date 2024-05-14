<script setup>
import qiz from "../data/quizes.json";
import { ref, watch } from "vue";
import Card from "../components/CardComponent.vue";

const quizes = ref(qiz);
const searchInput = ref("");

watch(
  searchInput,
  () =>
    (quizes.value = qiz.filter((quiz) =>
      quiz.name.toLowerCase().includes(searchInput.value.toLowerCase())
    ))
);
</script>

<template>
  <div>
    <header>
      <h1>Quizes</h1>
      <input v-model.trim="searchInput" type="text" placeholder="search..." />
    </header>
    <div class="cards-container">
      <Card v-for="quiz in quizes" :key="quiz.id" :quiz="quiz" />
    </div>
  </div>
</template>

<style scoped>
header {
  margin-top: 30px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

header h1 {
  font-weight: bold;
  margin-right: 30px;
}

header input {
  border: none;
  background-color: rgba(255, 255, 255, 0.737);
  border-radius: 5px;
  padding: 5px;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
}

/* CARD */
</style>
