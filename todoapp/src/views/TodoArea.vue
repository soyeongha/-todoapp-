<template>
  <div>
    <TodoHeader />
    <div class="todo-app">
      <h1 style="margin-bottom: 40px; margin-top: -20px;">Todo Area</h1>
      <!-- Tabulator 테이블을 렌더링 -->
      <div ref="tabulator"></div>
      <div class="new-todo">
        <!-- 새로운 할 일 추가 입력란과 버튼 -->
        <input
          style="width: 50%;"
          v-model="newTodo"
          placeholder="새로운 항목 추가"
        />
        <MyButton buttonClass="add" @click="addTodo">Add Category</MyButton>
      </div>
      <!-- EditModal 컴포넌트: 카테고리 수정 모달 -->
      <EditModal
        v-if="showModal"
        :modalTitle="'카테고리 수정'"
        :editTodoTitle="editCategoryTitle"
        @save="updateCategory"
        @close="closeModal"
      />
    </div>
  </div>
</template>

<script>
// Tabulator import 방식 (CommonJS 또는 ES 모듈 방식 사용 가능)
const Tabulator = require("tabulator-tables"); // CommonJS 방식 사용
import "tabulator-tables/dist/css/tabulator.min.css"; // Tabulator CSS 가져오기

// 컴포넌트 임포트
import TodoHeader from "@/components/TodoHeader.vue";
import MyButton from "@/components/MyButton.vue";
import EditModal from "@/components/EditModal.vue";
import todosAreaData from "@/assets/todosArea.json"; // JSON 파일 불러오기

export default {
  name: "TodoArea",
  components: {
    TodoHeader,
    MyButton,
    EditModal, // 모달 컴포넌트 등록
  },
  data() {
    return {
      todos: [], // JSON에서 불러온 데이터를 저장할 배열
      newTodo: "",
      editCategoryId: null,
      editCategoryTitle: "",
      showModal: false, // 모달 표시 여부 제어
      table: null,
    };
  },
  mounted() {
    this.loadTodos(); // JSON 데이터 로드
    this.$nextTick(() => {
      this.initializeTable(); // 테이블 초기화
    });
  },
  beforeUnmount() {
    if (this.table) {
      this.table.destroy(); // 컴포넌트가 사라질 때 테이블 인스턴스 해제
    }
  },
  methods: {
    // JSON 데이터 로드 함수
    loadTodos() {
      this.todos = todosAreaData.todos; // JSON 데이터를 불러와서 todos 배열에 저장
    },
    // Tabulator 테이블 초기화
    initializeTable() {
      try {
        this.table = new Tabulator(this.$refs.tabulator, {
          layout: "fitColumns", // 열을 테이블 너비에 맞추어 균등하게 배치
          data: this.todos,
          columns: [
            {
              title: "ID",
              field: "id",
              width: 120, // 고정된 너비 설정
              hozAlign: "center", // ID 칼럼의 내용 가운데 정렬
            },
            {
              title: "카테고리",
              field: "category",
              widthGrow: 3, // 카테고리 칼럼은 다른 칼럼에 비해 2배 많이 확장
              headerHozAlign: "center",
            },
            {
              title: "", // 수정 및 삭제 아이콘 칼럼
              formatter: () => `
                <span class="edit-icon material-icons" style="cursor: pointer; margin-right: 10px;">edit</span>
                <span class="delete-icon material-icons" style="cursor: pointer;">delete</span>
              `,
              width: 90, // 칼럼의 너비 설정
              hozAlign: "center", // 아이콘 가운데 정렬
              cellClick: (e, cell) => this.handleIconClick(e, cell),
            },
          ],
          pagination: "local", // 페이지네이션 활성화
          paginationSize: 5, // 페이지당 표시할 행 수
        });
      } catch (error) {
        console.error("Tabulator 초기화 중 에러 발생:", error);
      }
    },
    // 새로운 카테고리 추가
    addTodo() {
      if (this.newTodo.trim() !== "") {
        const newTodoItem = {
          id: `N${this.todos.length + 1}`, // 새로운 ID 생성
          category: this.newTodo,
        };
        this.todos.push(newTodoItem); // todos 배열에 새로운 항목 추가
        if (this.table) {
          this.table.setData(this.todos); // 테이블 데이터 업데이트
        }
        this.newTodo = ""; // 입력란 초기화
      }
    },
    // 아이콘 클릭 이벤트 처리
    handleIconClick(e, cell) {
      const row = cell.getRow().getData();
      if (e.target.classList.contains("edit-icon")) {
        this.editCategory(row.id, row.category);
      } else if (e.target.classList.contains("delete-icon")) {
        this.deleteCategory(row.id);
      }
    },
    // 카테고리 수정
    editCategory(id, currentCategory) {
      this.editCategoryId = id;
      this.editCategoryTitle = currentCategory; // 현재 카테고리 저장
      this.showModal = true; // 모달 열기
    },
    // 카테고리 삭제
    deleteCategory(id) {
      this.todos = this.todos.filter((todo) => todo.id !== id);
      this.table.deleteRow(id);
    },
    // 카테고리 업데이트
    updateCategory(newCategory) {
      const categoryIndex = this.todos.findIndex(
        (todo) => todo.id === this.editCategoryId
      );
      if (categoryIndex !== -1) {
        this.todos[categoryIndex].category = newCategory.trim();
        this.table.updateData([
          { id: this.editCategoryId, category: newCategory.trim() },
        ]);
      }
      this.closeModal();
    },
    // 모달 닫기
    closeModal() {
      this.showModal = false;
      this.editCategoryId = null;
      this.editCategoryTitle = "";
    },
  },
};
</script>

<style scoped>
.todo-app {
  max-width: 1000px;
  margin: 50px auto;
  font-family: "Noto Sans KR", sans-serif;
  text-align: center;
  background-color: #ffe6f0; /* 배경 색상을 연한 파스텔 핑크로 설정 */
  padding: 50px;
  border-radius: 16px; /* 둥근 테두리 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
}

.new-todo {
  margin-top: 50px;
}

.new-todo input {
  padding: 10px;
  width: 70%;
  border: 1px solid #f8b6c8; /* 연한 핑크 테두리 */
  border-radius: 16px; /* 입력 필드를 둥글게 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
}

#example-table {
  margin-top: 20px;
  width: 100%; /* 테이블의 너비를 부모 요소에 맞추기 */
  height: auto; /* 높이를 자동으로 설정하여 내용에 맞춤 */
  border: 1px solid #ddd; /* 테이블 테두리 추가 */
  overflow: auto; /* 내용이 많을 경우 스크롤 */
}
</style>
