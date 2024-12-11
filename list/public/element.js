const Element = {
  data() {
    return {
      inputTitle: false,
      inputTask: false,
      inputDateA: false
    }
  },
  template: `
    <li :class="{ completed: element.completed }">
      <h4><span v-if="!inputTitle">{{ element.text }}</span>
      <input v-else type="text" v-model="element.text" @blur="modify" ref="refInputTitle" />
      </h4>

      &nbsp;&nbsp;&nbsp;<label><b> Details: </b>
      <span v-if="!inputTask">{{ element.task }}</span>
      <input v-else type="text" v-model="element.task" @blur="task" ref="refInputTask" />
      </label>&nbsp;

      <label> <b> Date Assigned: </b>
      <span v-if="!inputDateA">{{ element.dateA }}</span>
      <input v-else type="date" v-model="element.dateA" @blur="dateA" ref="refInputDateA" />
      </label>&nbsp;

      <label> <b> Check when completed: </b>
      <input type="checkbox" :checked="element.completed" @change="toggleComplete($event)" />
      </label><br>

      <div v-if="!isCompleted">
        <button @click="inputTask=true">Change Description</button>
        <button @click="inputTitle=true">Change Task</button>
        <button @click="inputDateA=true">Change Date</button>
      </div>
      <button @click="remove">Remove</button>
    </li>
  `,
  props: ["element", "isCompleted"],
  methods: {
    remove() {
      this.$emit("remove", { id: this.element._id });
    },
    modify() {
      this.inputTitle = false;
      this.$emit("modify", { id: this.element._id, value: this.element.text });
    },
    task() {
      this.inputTask = false;
      this.$emit("task", { id: this.element._id, value: this.element.task });
    },
    dateA(event) {
      this.inputDateA = false;
      this.$emit("dateA", { id: this.element._id, value: event.target.value });
    },
    toggleComplete(event) {
      this.$emit("toggleComplete", { id: this.element._id, value: event.target.checked });
    }
  },
  emits: ["remove", "modify", "task", "dateA", "toggleComplete"],
  updated() {
    if (this.$refs.refInputTitle) this.$refs.refInputTitle.focus();
    if (this.$refs.refInputTask) this.$refs.refInputTask.focus();
    if (this.$refs.refInputDateA) this.$refs.refInputDateA.focus();
  }
};
export default Element;
