# Thin + Vue

## Install

Inside your vue project:

```bash
npm install thin-backend thin-backend-vue
```

## Usage

1. Inside your `App.vue` add the following:

    ```vue
    <script setup lang="ts">
    // ...
    import { initThinBackend, ThinBackend } from 'thin-backend';

    initThinBackend({
        // Replace this with your project host:
        host: 'https://testus.thinbackend.app'
    });
    </script>

    <template>
        // Wrap your app with the <ThinBackend/> component
        <ThinBackend requireLogin>
            // ...
        </ThinBackend>
    </template>
    ```

2. Now you can use Thin functions like `useQuery` or `createRecord` from within your Vue app:

    ```vue
    <script setup lang="ts">
    import { createRecord, query, updateRecord, type Task } from 'thin-backend';
    import { useQuery } from './../useQuery';

    const tasks = useQuery(query('tasks').orderBy('createdAt'));

    function updateTask(task: Task) {
        updateRecord('tasks', task.id, { title: window.prompt('New title') || '' })
    }

    function addTask() {
        createRecord('tasks', {
            title: window.prompt('Title:') || ''
        });
    }
    </script>

    <template>
        <div v-for="task in tasks" v-on:dblclick="updateTask(task)">
            {{task.title}}
        </div>

        <button v-on:click="addTask()">Add Task</button>
    </template>
    ```