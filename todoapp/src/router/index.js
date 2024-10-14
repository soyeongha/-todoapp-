import { createRouter, createWebHistory } from "vue-router";

//연결할 각 컴포넌트 import
import TodoArea from "@/views/TodoArea.vue";
import TodoList from "@/views/TodoList.vue"; // TodoList.vue 임포트
import TodoState from "@/views/TodoState.vue";
import TodoCalendar from "@/views/TodoCalendar.vue";

//라우터 설계
const routes = [
    { path: '/', component: TodoList, name: 'TodoList' },
    { path: '/todo-area', component: TodoArea },
    { path: '/todos', component: TodoList }, // 이 라우트 확인
    { path: '/todo-state', component: TodoState },
    { path: '/todo-calendar', component: TodoCalendar },
]

//라우터 생성
const router = createRouter({
    history:createWebHistory(),
    routes
});


export {router}
