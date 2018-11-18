import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

//you shouldn`t modify directly the components of the store. Instead, use mutations. Any time you are mutating state, you have to define mutations property
//defining the store, where we define our states
export const store = new Vuex.Store({
    state: {
        filter: 'all',
        todos: [
            {
            id: 1,
            title: "Finish vue project",
            completed: false,
            editing: false
            },
            {
            id: 2,
            title: "Buy groceries",
            completed: false,
            editing: false
            }
        ]
    },
    //with vuex we`re moving all the computed properties to getters in store
    //all getters take state as a parameter
    getters: {
        remaining(state) {
            return state.todos.filter(todo => !todo.completed).length
          },
          anyRemaining(state, getters) {
            return getters.remaining != 0;
          },
          todosFiltered(state) {
            if (state.filter == "all") {
              return state.todos;
            } else if (state.filter == "active") {
              return state.todos.filter(todo => !todo.completed);
            } else if (state.filter == "completed") {
              return state.todos.filter(todo => todo.completed);
            }
      
            return state.todos;
          },
          showClearCompletedButton(state) {
            return state.todos.filter(todo => todo.completed).length > 0;
          }
    },
    mutations: {
        addTodo(state, todo) {
            state.todos.push({
                id: todo.id,
                title: todo.title,
                completed: false,
                editing: false,
            })
        },
        updateFilter(state, filter) {
            state.filter = filter
        },
        checkAll(state, checked) {
            state.todos.forEach((todo) => todo.completed = checked)
        },
        clearCompleted(state) {
            state.todos = state.todos.filter(todo => !todo.completed)
        },
        deleteTodo(state, id) {
            const index = state.todos.findIndex(item => item.id == id);
            state.todos.splice(index, 1);
        },
        updateTodo(state, todo) {
            const index = state.todos.findIndex(
                item => item.id == todo.id
              );
              state.todos.splice(index, 1, {
                id: todo.id,
                title: todo.title,
                completed: todo.completed,
                editing: todo.editing
              });
        }
    },
    //similar to mutations, but allows for synchronous code (like any code that takes some time to complete or resolve), like ajax calls 
    actions: {
        addTodo(context, todo) {
            context.commit('addTodo', todo)
        },
        updateFilter(context, filter) {
            context.commit('updateFilter', filter)
        },
        checkAll(context, checked) {
            context.commit('checkAll', checked)
        },
        clearCompleted(context) {
            context.commit('clearCompleted')
        },
        deleteTodo(context, id) {
            context.commit('deleteTodo', id)
        },
        updateTodo(context, todo) {
            context.commit('updateTodo', todo)
        }
    }
})