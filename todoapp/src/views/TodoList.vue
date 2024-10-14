완전 괜찮은 상태 Todolist
<template>
  <div>
    <TodoHeader />
    <div class="todo-app">
      <h1 style="margin-bottom: 40px; margin-top: -20px">Todo List</h1>
      <div ref="tabulatorRef"></div>
      <div class="new-todo">
        <select v-model="selectedCategory" class="category-select">
          <option disabled value="">카테고리 선택</option>
          <option value="가사">가사</option>
          <option value="공부">공부</option>
          <option value="쇼핑">쇼핑</option>
          <option value="일상">일상</option>
          <option value="약속 및 일정">약속 및 일정</option>
        </select>
        <input
          style="width: 50%"
          v-model="newTodo"
          placeholder="새로운 일정을 추가 하세요"
        />
        <input ref="flatpickrInput" placeholder="날짜 선택" />
        <MyButton style="margin-top: 10px;" buttonClass="add" @click="addTodo">할 일 추가</MyButton>
      </div>
      <EditModal
        v-if="showModal"
        :modalTitle="'할 일 수정하기'"
        :editTodoTitle="editTodoTitle"
        :editTodoDate="editTodoDate"
        @save="updateTodo"
        @close="closeModal"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import TodoHeader from "@/components/TodoHeader.vue";
import MyButton from "@/components/MyButton.vue";
import EditModal from "@/components/EditModal.vue";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import todosData from "@/assets/todos.json";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { DateTime } from "luxon";
import { useRoute } from "vue-router"; // query 파라미터를 받기 위한 라우트 가져오기

export default {
  name: "TodoList",
  components: {
    TodoHeader,
    MyButton,
    EditModal,
  },
  setup() {
    const todos = ref(todosData.todos);
    const filteredTodos = ref([]); // 필터된 할 일을 저장할 배열
    const newTodo = ref("");
    const selectedCategory = ref("");
    const selectedDate = ref("");
    const showModal = ref(false);
    const editTodoId = ref(null);
    const editTodoTitle = ref("");
    const editTodoDate = ref("");
    const flatpickrInput = ref(null); // flatpickr input element 참조를 위한 ref
    const flatpickrInstance = ref(null); // flatpickr 인스턴스
    const route = useRoute(); // 현재 라우트에서 query 파라미터를 받기 위해
    const tabulatorRef = ref(null); // Tabulator 테이블 DOM 참조
    const table = ref(null); // Tabulator 인스턴스

    onMounted(() => {
      initializeTable(); // 테이블 초기화
      initializeFlatpickr(); // flatpickr 초기화
    });

    const filterTodosByDate = (date) => {
      console.log("Filtering for date:", date); // 필터링할 날짜 출력
      const filtered = todos.value.filter(
        (todo) => todo.date === date && todo.status === "대기"
      );
      console.log("Filtered data:", filtered); // 필터링된 결과 출력
      filteredTodos.value = filtered.length > 0 ? filtered : []; // 필터된 데이터 또는 빈 배열 할당
    };

    // query 파라미터로 넘어온 날짜에 맞는 '대기' 상태의 할 일 필터링
    watch(
      () => route.query.date,
      (newDate) => {
        console.log("newDate:", newDate); // queryDate 값 확인

        if (newDate) {
          filterTodosByDate(newDate); // 날짜 필터링
        } else {
          filteredTodos.value = todos.value; // 필터링이 없을 경우 전체 목록 표시
        }

        if (table.value) {
          // table.value가 초기화된 이후에만 setData 호출
          table.value.setData(filteredTodos.value); // 테이블에 필터된 데이터 적용
        } else {
          console.error("Table is not initialized yet.");
         // 테이블이 초기화될 때까지 재시도하는 로직
      const interval = setInterval(() => {
        if (table.value) {
          table.value.setData(filteredTodos.value); // 테이블에 데이터 설정
          clearInterval(interval); // 테이블이 초기화되면 반복 중지
        }
      }, 100); // 100ms 간격으로 테이블 초기화 여부 확인
    }
  },
  { immediate: true } // 컴포넌트가 로드될 때에도 바로 실행되도록 설정
);

    // handleIconClick 함수 정의 추가
    const handleIconClick = (e, cell) => {
      const row = cell.getRow().getData();
      if (e.target.classList.contains("edit-icon")) {
        // 수정 아이콘 클릭 시
        editTodoId.value = row.id;
        editTodoTitle.value = row.title;
        editTodoDate.value = row.date;
        showModal.value = true; // 모달 열기
      } else if (e.target.classList.contains("delete-icon")) {
        // 삭제 아이콘 클릭 시
        todos.value = todos.value.filter((todo) => todo.id !== row.id);
        table.value.setData(todos.value); // 테이블 업데이트
      }
    };

    const initializeFlatpickr = () => {
      flatpickrInstance.value = flatpickr(flatpickrInput.value, {
        onChange: (selectedDates) => {
          if (selectedDates && selectedDates.length > 0) {
            selectedDate.value = selectedDates[0].toISOString().split("T")[0];
          } else {
            selectedDate.value = "";
          }
        },
      });
    };

    const initializeTable = () => {
      table.value = new Tabulator(tabulatorRef.value, {
        data: todos.value,
        layout: "fitColumns",
        pagination: "local",
        paginationSize: 10,
        autoHeight: true,
        columns: [
          {
            title: "No",
            field: "id",
            sorter: "number",
            width: 55,
            hozAlign: "center",
            headerHozAlign: "center",
          },
          {
            title: "내용",
            field: "title",
            sorter: "string",
            widthGrow: 3,
            headerHozAlign: "center",
            hozAlign: "center",
            formatter: (cell) => {
              return `<div style="display: flex; justify-content: center; align-items: center; height: 100%;">${cell.getValue()}</div>`;
            },
          },
          {
            title: "카테고리",
            field: "category",
            sorter: "string",
            width: 150,
            hozAlign: "center",
            headerHozAlign: "center",
            formatter: (cell) => {
              return `<div style="display: flex; justify-content: center; align-items: center; height: 100%;">${cell.getValue()}</div>`;
            },
          },
          {
            title: "날짜",
            field: "date",
            sorter: "date",
            width: 150,
            hozAlign: "center",
            headerHozAlign: "center",
            formatter: (cell) => {
              const date = cell.getValue();
              return DateTime.fromISO(date).toFormat("yyyy-MM-dd");
            },
          },
          {
            title: "상태",
            field: "status",
            hozAlign: "center",
            headerHozAlign: "center",
            formatter: (cell) => {
              const status = cell.getValue();
              let backgroundColor =
                status === "대기"
                  ? "#ffe0f5"
                  : status === "완료"
                  ? "#ff85a1"
                  : "#dbd8d9";
              return `<div style="background-color: ${backgroundColor}; display: flex; border-radius: 16px; justify-content: center; align-items: center; height: 100%;">${status}</div>`;
            },
            width: 100,
            cellClick: (e, cell) => {
              const row = cell.getRow().getData();
              changeStatus(row.id); // 상태 변경 함수 호출
            },
          },
          {
            title: "만족도",
            field: "satisfaction", // 만족도를 저장하는 필드
            formatter: (cell) => {
              const value = cell.getValue();
              let stars = "";
              for (let i = 1; i <= 5; i++) {
                stars += `<span class="material-icons star-icon"
                          style="color: ${
                            i <= value ? "#ffeb3b" : "#ccc"
                          }; cursor: pointer;"
                          data-value="${i}">star</span>`;
              }
              return `<div style="display: flex; justify-content: center; align-items: center; height: 100%;">${stars}</div>`;
            },
            width: 170,
            headerHozAlign: "center",
            hozAlign: "center",
            cellClick: (e, cell) => {
              const row = cell.getRow().getData();
              if (row.status === "완료") {
                // 상태가 '완료'일 때만 만족도 변경 가능
                const value = parseInt(e.target.getAttribute("data-value"));
                if (!isNaN(value)) {
                  updateSatisfaction(row.id, value); // 만족도 업데이트
                }
              }
            },
          },
          {
            title: "",
            formatter: () => `
              <span class="edit-icon material-icons" style="cursor: pointer; margin-right: 10px;">edit</span>
              <span class="delete-icon material-icons" style="cursor: pointer;">delete</span>
            `,
            width: 80,
            hozAlign: "center",
            cellClick: (e, cell) => handleIconClick(e, cell),
          },
        ],
      });
    };
    // 상태 변경 함수
    const changeStatus = (id) => {
      const todo = todos.value.find((todo) => todo.id === id);
      if (todo) {
        // 상태를 순차적으로 변경 (대기 → 완료 → 취소 → 대기)
        if (todo.status === "대기") {
          todo.status = "완료";
        } else if (todo.status === "완료") {
          todo.status = "취소"; // 취소 상태일 경우 만족도 초기화
          todo.satisfaction = 0;
        } else {
          todo.status = "대기";
        }
        table.value.updateData([
          { id, status: todo.status, satisfaction: todo.satisfaction },
        ]);
      }
    };

    const addTodo = () => {
      if (
        newTodo.value.trim() !== "" &&
        selectedCategory.value &&
        selectedDate.value
      ) {
        const newTodoItem = {
          id: todos.value.length + 1,
          title: newTodo.value,
          category: selectedCategory.value,
          date: selectedDate.value,
          completed: false,
          status: "대기",
          satisfaction: 0, // 만족도는 처음에 0으로 설정
        };
        todos.value.push(newTodoItem); // 새로운 할 일 추가
        table.value.addRow(newTodoItem); // 테이블에 새로운 행 추가
        newTodo.value = "";
        selectedCategory.value = "";
        selectedDate.value = "";

        flatpickrInstance.value.clear();
        flatpickrInput.value.placeholder = "날짜 선택";
        table.value.setData(todos.value);
      }
    };
    // 만족도 업데이트 함수
    const updateSatisfaction = (id, value) => {
      const todo = todos.value.find((todo) => todo.id === id);
      if (todo) {
        todo.satisfaction = value;
        table.value.updateData([{ id, satisfaction: value }]); // 테이블 데이터 업데이트
      }
    };

    return {
      tabulatorRef, // DOM 참조 반환
      todos,
      newTodo,
      selectedCategory,
      selectedDate,
      flatpickrInput, // input 요소에 접근하기 위한 참조 반환
      table,
      showModal,
      editTodoId,
      editTodoTitle,
      editTodoDate,
      addTodo,
      changeStatus,
      filterTodosByDate,
    };
  },
};
</script>

<style scoped>
.todo-app {
  max-width: 1000px;
  margin: 50px auto;
  font-family: "Noto Sans KR", sans-serif;
  text-align: center;
  background-color: #ffe6f0;
  padding: 50px;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.new-todo {
  margin-top: 50px;
}

.new-todo input,
.category-select {
  width: 15%;
  padding: 10px;
  margin-right: 20px;
  border: 1px solid #ffe0f5;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.star-icon {
  cursor: pointer;
}
</style>
