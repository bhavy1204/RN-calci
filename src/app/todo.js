import { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Todo() {
    const [task, setTask] = useState("");
    const [todos, setTodos] = useState([]);

    const loadTodos = async () => {
       try {
         const savedTodos = await AsyncStorage.getItem("todos");
 
         if (savedTodos !== null) {
             setTodos(JSON.parse(savedTodos))
         }
       } catch (error) {
            console.error("Failed to loadTasks", error)
       }
    }

    useEffect(() => {
        loadTodos();
    }, [])

    useEffect(() => {
        AsyncStorage.setItem("todos", JSON.stringify(todos))
    }, [todos])



    const addTodo = () => {
        if (task.trim() === "") return;

        setTodos([...todos, task.trim()]);
        setTask("");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Daily Tasks</Text>

            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter task"
                    value={task}
                    onChangeText={setTask}
                />

                <Pressable style={styles.addButton} onPress={addTodo}>
                    <Text style={styles.addText}>Add</Text>
                </Pressable>
            </View>

            {todos.map((todo, index) => (
                <View style={styles.todo} key={index}>
                    <Text style={styles.todoText}>{todo}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
    },

    inputRow: {
        flexDirection: "row",
        gap: 10,
    },

    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 50,
    },

    addButton: {
        backgroundColor: "black",
        paddingHorizontal: 20,
        borderRadius: 10,
        justifyContent: "center",
    },

    addText: {
        color: "white",
        fontWeight: "bold",
    },

    todo: {
        padding: 15,
        marginTop: 12,
        backgroundColor: "#eee",
        borderRadius: 10,
    },

    todoText: {
        fontSize: 18,
    },
});

