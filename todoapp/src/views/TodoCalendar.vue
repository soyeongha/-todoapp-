<template>
  <div>
    <TodoHeader />
  </div>
  <div class="calendar-container">
    <h1 style="margin-top: -10px; margin-bottom: 50px; padding-right: 60px;">MY CALENDAR</h1>
    <div ref="calendarRef" class="calendar"></div> <!-- 캘린더 렌더링 -->
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import todosData from '@/assets/todos.json'; // JSON 데이터 가져오기
import { useRouter } from 'vue-router'; // 라우터 사용
import TodoHeader from '@/components/TodoHeader.vue';
import interactionPlugin from '@fullcalendar/interaction'; // interactionPlugin 임포트

export default {
  components: {
    TodoHeader,
  },
  name: 'TodoCalendar',
  setup() {
    const calendarRef = ref(null); // DOM 요소 참조
    const calendar = ref(null); // FullCalendar 인스턴스
    const events = ref([]); // 캘린더에 표시할 이벤트 목록
    const todos = ref(todosData.todos); // JSON 데이터를 반응형으로 관리
    const router = useRouter(); // 라우터 사용 정의

     // `end` 날짜에 하루를 더해 FullCalendar에 표시되도록 처리
     const addOneDay = (dateStr) => {
      const date = new Date(dateStr);
      date.setDate(date.getDate() + 1); // 하루 추가
      return date.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식으로 변환
    };

    // 할 일 데이터를 FullCalendar 이벤트 형식으로 변환
    const initializeEvents = () => {
      events.value = todos.value.map(todo => ({
        title: todo.title,
        start: todo.start, // 할 일이 시작되는 날짜 (UI에 표시)
        end: addOneDay(todo.date), // 할 일이 끝나는 날짜에 하루를 추가 (UI와 필터링에 사용)
        id: todo.id,
        backgroundColor: '#ff6f81', // 이벤트의 배경색 설정 (예: 핑크)
    borderColor: '#ff6f81' // 이벤트 테두리 색 설정 (일치시키기)
      }));
      console.log("Initialized events: ", events.value); // 이벤트가 잘 생성되었는지 확인
    };

    // JSON 데이터가 변경될 때 이벤트 업데이트
    const updateCalendarEvents = () => {
      if (calendar.value) {
        calendar.value.removeAllEvents(); // 기존 이벤트 제거
        calendar.value.addEventSource(events.value); // 새로운 이벤트 추가
        console.log("Updated events: ", events.value); // 업데이트된 이벤트 확인
      }
    };

    // 날짜 클릭 시 TodoList로 이동
    const handleDateClick = (info) => {
      console.log(info.dateStr); // 클릭한 날짜 출력
      router.push({ name: 'TodoList', query: { date: info.dateStr } }); // 선택한 날짜의 TodoList로 이동
    };

    onMounted(() => {
      initializeEvents(); // 이벤트 초기화

      if (!calendarRef.value) {
        console.error("calendarRef is null");
        return;
      }

      calendar.value = new Calendar(calendarRef.value, { // FullCalendar 인스턴스 초기화
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev', // '<', '>', '오늘(today)' 버튼
          center: 'title', // 캘린더 제목
          right: 'next today',
        },
        locale: 'ko', // 한국어 로케일 설정
        titleFormat: { // '2024년 10월' 형식으로 표시
        year: 'numeric',
        month: 'long' // 월을 긴 형식으로 표시 (예: '10월')
      },
        events: events.value, // 할 일 이벤트 추가
        dateClick: handleDateClick, // 날짜 클릭 시 이벤트 핸들러 등록
      });

      calendar.value.render(); // 캘린더 렌더링
    });

    // JSON 데이터가 변경되면 캘린더 업데이트
    watch(todos, () => {
      initializeEvents(); // 새로 변경된 데이터로 이벤트 다시 설정
      updateCalendarEvents(); // 캘린더 업데이트
    }, { deep: true });

    return {
      calendarRef,
      events,
    };
  }
};
</script>

<style scoped>
.calendar-container {
  max-width: 1000px; /* 최대 너비 설정 */
  margin: 50px auto; /* 가운데 정렬 */
  text-align: center; /* 텍스트 가운데 정렬 */
  padding: 20px; /* 내부 여백 */
  border-radius: 16px; /* 둥근 테두리 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* 그림자 효과 */
}

h1 {
  color: #ff6f81; /* 제목 색상: 핑크 */
}

.calendar {
  border: 1px solid #f8b6c8; /* 캘린더 테두리 색상 */
  border-radius: 10px; /* 캘린더 둥근 테두리 */
  padding: 10px; /* 내부 여백 */
}

/* 클릭 가능한 영역에 손 모양 커서 적용 */
.fc-event {
  cursor: pointer; /* 클릭할 수 있는 영역에서 손 모양 커서로 변경 */
 
}

</style>
