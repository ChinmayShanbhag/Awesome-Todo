import Vue from 'vue'
import {uid} from 'quasar'
const state={
    tasks:{
        'ID1':{
          name:'Do this',
          completed: false,
          DueDate:'2021/09/3',
          DueTime:'18:30'
        },
        'ID2':{
          name:'Do that',
          completed: false,
          DueDate:'2021/09/1',
          DueTime:'17:30'
        },
        'ID3':{ 
          name:'Do everything',
          completed: false,
          DueDate:'2021/09/2',
          DueTime:'18:00'
        },
    },
    search: '',
    sort: 'name'
}

const mutations={
    updateTask(state,payload){
        Object.assign(state.tasks[payload.id],payload.updates)
    },
    deleteTask(state,id){
        Vue.delete(state.tasks,id)
    },
    addTask(state,task){
        Vue.set(state.tasks,task.id,task.task)
    },
    setSearch(state,value){
        state.search=value
    },
    setSort(state,value){
        state.sort=value
    }
}

const actions={
    updateTask({commit},payload){
        commit('updateTask',payload)
    },
    deleteTask({commit},id){
        commit('deleteTask',id)
    },
    addTask({commit},task){
        let taskId=uid()
        let payload={
            id:taskId,
            task:task
        }
        commit('addTask',payload)
    },
    setSearch({commit},value){
        commit('setSearch',value)
    },
    setSort({commit},value){
        commit('setSort',value)
    }
}

const getters={
    tasksSorted:(state)=>{
        let tasksSorted={},
        keysOrdered=Object.keys(state.tasks)

        keysOrdered.sort((a,b)=>{
            let taskAProp=state.tasks[a][state.sort].toLowerCase(),
             taskBProp=state.tasks[b][state.sort].toLowerCase()

             if(taskAProp>taskBProp) return 1
             else if(taskAProp<taskBProp) return -1
             else return 0
        })
    
        keysOrdered.forEach((key)=>{
            tasksSorted[key]=state.tasks[key]
        })
        return tasksSorted
    },
    tasksFiltered:(state,getters) => {
        let tasksSorted=getters.tasksSorted,
         tasksFiltered={}
        if(state.search){
            Object.keys(tasksSorted).forEach(function(key){
                let task=tasksSorted[key],
                taskNameLowerCase=task.name.toLowerCase(),
                searchLowerCase=state.search.toLowerCase()

                if(taskNameLowerCase.includes(searchLowerCase)){
                tasksFiltered[key]=task
                }
            })
            return tasksFiltered
        }
        return tasksSorted
        },
    tasksTodo:(state,getters)=>{
       let tasksFiltered=getters.tasksFiltered 
        let tasks={}
            Object.keys(tasksFiltered).forEach(function(key){
                let task=tasksFiltered[key]
                if(!task.completed){
                    tasks[key]=task
                }
            })
        return tasks
    },
    tasksCompleted:(state,getters)=>{
        let tasksFiltered=getters.tasksFiltered
        let tasks={}
            Object.keys(tasksFiltered).forEach(function(key){
                let task=tasksFiltered[key]
                if(task.completed){
                    tasks[key]=task
                }
            })
        return tasks
    }
}

export default{
    namespaced: true,
    state,
    mutations,
    actions,
    getters 
}