
<template>
    <div class="modal-overlay">
      <div class="modal-content">
        <h3>{{ modalTitle }}</h3> <!-- 동적으로 변경되는 제목 -->
        <input v-model="localEditTitle" placeholder="수정할 내용을 입력하세요" />
        <div class="modal-buttons">
          <button @click="$emit('close')">취소</button>
          <button @click="save">저장</button>
          
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
    modalTitle: String, // 부모로부터 모달창의 제목을 받음 (예: 할 일 수정, 카테고리 수정)
    editTitle: String,   // 부모로부터 수정할 초기 데이터를 받음(원본데이터)
      editTodoTitle: { //부모로부터 받은 제목을 바로 수정하지 않고 로컬로 복사해서 넣을 변수
        type: String,
        required: true,
      },
    },
    data() {
      return {
        localEditTitle: this.editTodoTitle, // 부모로부터 받은 제목을 로컬 상태로 관리
      };
    },
    methods: {
      save() {
        this.$emit('save', this.localEditTitle); // 저장 이벤트 발생, 로컬 상태를 부모에게 전달
      },
    },
  };
  </script>



<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 16px; /* 모달 창을 둥글게 */
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-buttons {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
</style>