<template>
    <section class="real-app">
        <input 
            type="text"
            class="add-input"
            autofocus
            placeholder="接下来要做什么？"
            @keyup.enter='addTodo'
        >
        <Item 
            v-for="todo in filterTodos" :key="todo.id" 
            :todo='todo'
            @del='deleteTodo'
        ></Item>
        <Tabs :filter="filter" @clear='clearCompleted' @toggle='toggleState' :todos='todos'></Tabs>
    </section>
</template>

<script>
import Item from './item.vue'
import Tabs from './tabs.vue'

let id = 0
export default {
    data () {
        return {
            todos: [],
            // todo: {
            //     id: 1,
            //     content: 'this is todo',
            //     completed: false
            // },
            filter: 'all'
        }
    },
    components: {
        Item,
        Tabs
    },
    computed: {
        filterTodos() {
            if (this.filter === 'all') {
                return this.todos
            } else {
                return this.todos.filter(todo => (todo.completed ? 'completed' : 'active') === this.filter)
            }
        }
    },
    methods: {
        addTodo (e) {
            this.todos.unshift({
                id: id++,
                content: e.target.value.trim(),
                completed: false
            })
            e.target.value = ''
        },
        deleteTodo (id) {
            this.todos.splice(this.todos.findIndex(todo => todo.id === id), 1)
        },
        toggleState (state) {
            this.filter = state
        },
        clearCompleted() {
            this.todos = this.todos.filter(todo => !todo.completed)
        }
    }
}
</script>

<style lang="stylus" scoped>
.real-app{
    width 600px;
    margin 0 auto
    box-shadow 0 0 5px #666
}
.add-input{
    position relative
    margin 0
    width 100%
    font-size 24px
    font-family inherit
    font-weight inherit 
    line-height 1.4em
    border 0
    outline none 
    color inherit 
    box-sizing border-box
    font-smoothing antialiased 
    padding 16px 16px 16px 60px
    border none 
    box-shadow inset 0 -2px 1px rgba(0, 0, 0, .4)
}
</style>
