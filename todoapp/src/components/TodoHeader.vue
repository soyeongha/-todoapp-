<template>
  <header class="header">
    <div class="logo" @click="goHome">My Todolist</div>
    <nav class="nav">
      <!-- "할일목록" 버튼 클릭 시 TodoArea로 이동 -->
      <MyButton buttonClass="nav-btn" @click="goToTodoArea">카테고리 테이블</MyButton>
      <MyButton buttonClass="nav-btn" @click="goToTodoState">상태 테이블</MyButton>
      <MyButton buttonClass="nav-btn" @click="goToTodoCalender">캘린더</MyButton>
    </nav>
  </header>
</template>

<script>
import MyButton from './MyButton.vue';

export default {
  name: "TodoHeader",  // 이름을 다중 단어로 변경
  components: {
    MyButton,
  },
  methods: {
    goHome() {
      this.$router.push('/'); // 홈으로 이동
    },
    goToTodoArea() {
      this.$router.push('/todo-area'); // TodoArea로 이동
    },
    goToTodoState() {
      this.$router.push('./todo-state') //TodoState로 이동
    },
    goToTodoCalender() {
      this.$router.push('./todo-calendar')
    },
  },
};
</script>

<style scoped>
.header {
  background-color: #ff85a1;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4); /* 미세한 그림자 효과를 추가하여 입체감을 줌 */
  
}
.logo {
  padding-left: 4%;
  color: white;
  font-size: 40px;
  font-weight: bold;
  cursor: pointer;
}
.nav {
  padding-right: 15%;
  display: flex;
  gap: 10px;
}
.nav-btn {
  background-color: white;
  color: #ff85a1;
  border-radius: 12px;
  padding: 10px 20px;
  font-weight: bold;
}
</style>
