import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
axios.defaults.baseURL = 'http://127.0.0.1:8000/api/'

//you shouldn`t modify directly the components of the store. Instead, use mutations. Any time you are mutating state, you have to define mutations property
//defining the store, where we define our states
export const store = new Vuex.Store({
    state: {
        token: localStorage.getItem('access_token') || null,
        filter: 'all',
        todos: []
    },
    //with vuex we`re moving all the computed properties to getters in store
    //all getters take state as a parameter
    getters: {
        loggedIn(state) {
            return state.token !== null
        },
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
        },
        retrieveTodos(state, todos) {
            state.todos = todos
        },
        retrieveToken(state, token) {
            state.token = token
        },
    },
    //similar to mutations, but allows for synchronous code (like any code that takes some time to complete or resolve), like ajax calls 
    actions: {
        retrieveToken(context, credentials) {

            return new Promise((resolve, reject) => {
                axios.post('/login', {
                    username: credentials.username,
                    password: credentials.password,
                })
                .then(response => {
                    const token = response.data.access_token
                     
                    localStorage.setItem('access_token', token)
                    context.commit('retrieveToken', token)
                    resolve(response)
                })
                .catch(error => {
                    console.log(error)
                    reject(error)
                })            
            })

        },
        retrieveTodos(context) {
            axios.get('/todos')
            .then(response => {
                context.commit('retrieveTodos', response.data)
            })
            .catch(error => {
                console.log(error)
            })
        },
        addTodo(context, todo) {
            axios.post('/todos', {
                title: todo.title,
                completed: false,
            })
            .then(response => {
                context.commit('addTodo', response.data)
            })
            .catch(error => {
                console.log(error)
            })
        },
        updateFilter(context, filter) {
            context.commit('updateFilter', filter)
        },
        checkAll(context, checked) {
            axios.patch('/todosCheckAll', {
                completed: checked,
            })
            .then(response => {
                context.commit('checkAll', checked)
            })
            .catch(error => {
                console.log(error)
            })
        },
        clearCompleted(context) {
            const completed = store.state.todos
                .filter(todo => todo.completed)
                .map(todo => todo.id)


            axios.delete('/todosDeleteCompleted', {
                data: {
                    todos: completed
                }
            })
            .then(response => {
                context.commit('clearCompleted')
            })
            .catch(error => {
                console.log(error)
            })
           
        },
        deleteTodo(context, id) {
            axios.delete('/todos/' + id)
            .then(response => {
                context.commit('deleteTodo', id)
            })
            .catch(error => {
                console.log(error)
            })
        },
        updateTodo(context, todo) {
            axios.patch('/todos/' + todo.id, {
                title: todo.title,
                completed: todo.completed,
            })
            .then(response => {
                context.commit('updateTodo', response.data)
            })
            .catch(error => {
                console.log(error)
            })
        }
    }
})