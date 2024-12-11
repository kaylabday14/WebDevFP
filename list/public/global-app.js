import Element from "./element.js";

const GlobalApp = {
  data() {
    return {
      elements: [],  // Array of tasks
      completedElements: [],  // Array for completed tasks
      newTaskTitle: "",
      newTaskDescription: "",
      newTaskDateAssigned: ""
    }
  },
  components: {
    Element: Element
  },
  template: `
    <div>
      <input type="text" v-model="newTaskTitle" placeholder="Enter Task Title" />
      <input type="text" v-model="newTaskDescription" placeholder="Enter Task Description" />
      <input type="date" v-model="newTaskDateAssigned" />
      <button @click="add()">Add New Task</button>
      <h3>Incomplete Tasks</h3>
      <ul class = "incompletelist">
        <Element v-for="(element, index) in elements"
          :key="element._id"
          :element="element"
          :isCompleted="false"
          @remove="remove($event)"
          @modify="modify($event)"
          @task="task($event)"
          @dateA="dateA($event)"
          @toggleComplete="toggleComplete($event)"
        />
      </ul>
      <h3>Completed Tasks</h3>
      <ul class = "completedlist">
        <Element v-for="(element, index) in completedElements"
          :key="element._id"
          :element="element"
          :isCompleted="true"
          @remove="remove($event)"
        />
      </ul>
    </div>
  `,

  methods: {
    add() {
      var text = this.newTaskTitle || "New Task";
      var defaultTaskDescription = this.newTaskDescription || "Enter Task Description";
      var defaultDateAssigned = this.newTaskDateAssigned || "Enter Date Assigned";
      axios.post("/list", {
        text: text,
        task: defaultTaskDescription,
        dateA: defaultDateAssigned,
        completed: false
      })
      .then((response) => {
        this.elements.push({
          _id: response.data.id,
          text: text,
          task: defaultTaskDescription,
          dateA: defaultDateAssigned,
          completed: false
        });
        // Clear the input fields after adding a task
        this.newTaskTitle = "";
        this.newTaskDescription = "";
        this.newTaskDateAssigned = "";
      });
    },
    remove(params) {
      var id = params.id;
      this.elements = this.elements.filter(element => element._id !== id);
      this.completedElements = this.completedElements.filter(element => element._id !== id);
      axios.delete("/list", { data: { id: id } });
    },
    modify(params) {
      var { id, value } = params;
      this.elements = this.elements.map(element => {
        if (element._id == id) {
          element.text = value;
        }
        return element;
      });
      this.completedElements = this.completedElements.map(element => {
        if (element._id == id) {
          element.text = value;
        }
        return element;
      });
      axios.put("/list", { text: value, id: id });
    },
    task(params) {
      var { id, value } = params;
      this.elements = this.elements.map(element => {
        if (element._id == id) {
          element.task = value;
        }
        return element;
      });
      this.completedElements = this.completedElements.map(element => {
        if (element._id == id) {
          element.task = value;
        }
        return element;
      });
      axios.put("/list", { task: value, id: id });
    },
    dateA(params) {
      var { id, value } = params;
      this.elements = this.elements.map(element => {
        if (element._id == id) {
          element.dateA = value;
        }
        return element;
      });
      this.completedElements = this.completedElements.map(element => {
        if (element._id == id) {
          element.dateA = value;
        }
        return element;
      });
      axios.put("/list", { dateA: value, id: id });
    },
    toggleComplete(params) {
      var { id, value } = params;
      this.elements = this.elements.map(element => {
        if (element._id == id) {
          element.completed = value;
          if (value) {
            this.completedElements.push(element);
          }
          return element;
        }
        return element;
      }).filter(element => element._id !== id || !value);
      
      this.completedElements = this.completedElements.map(element => {
        if (element._id == id) {
          element.completed = value;
          if (!value) {
            this.elements.push(element);
          }
          return element;
        }
        return element;
      }).filter(element => element._id !== id || value);
      
      axios.put("/list", { id: id, completed: value });
    }
  },
  created() {
    axios.get("/list")
    .then((response) => {
      response.data.elements.forEach(element => {
        if (element.completed) {
          this.completedElements.push(element);
        } else {
          this.elements.push(element);
        }
      });
    });
  }
};

export default GlobalApp;

