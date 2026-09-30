import { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Todo() {
    const [task, setTask] = useState("");
    const [priority, setPriority] = useState("medium");
    const [dueDate, setDueDate] = useState("");
    const [todos, setTodos] = useState([]);

    // Load todos when app starts
    const loadTodos = async () => {
        try {
            const savedTodos = await AsyncStorage.getItem("todos");

            if (savedTodos !== null) {
                setTodos(JSON.parse(savedTodos));
            }
        } catch (error) {
            console.error("Failed to load tasks", error);
        }
    };

    useEffect(() => {
        loadTodos();
    }, []);

    // Save whenever todos change
    useEffect(() => {
        AsyncStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    const addTodo = () => {
        if (task.trim() === "") return;

        const todo = {
            id: Date.now(),
            task: task.trim(),
            priority: priority,
            dueDate: dueDate.trim(),
            completed: false,
        };

        setTodos([...todos, todo]);

        // Clear inputs
        setTask("");
        setPriority("medium");
        setDueDate("");
    };

    const toggleTodo = (id) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id
                    ? { ...todo, completed: !todo.completed }
                    : todo
            )
        );
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Daily Tasks</Text>

            {/* Task input */}
            <TextInput
                style={styles.input}
                placeholder="Enter task"
                value={task}
                onChangeText={setTask}
            />

            {/* Priority */}
            <Text style={styles.label}>Priority</Text>

            <View style={styles.priorityRow}>
                <Pressable
                    style={[
                        styles.priorityButton,
                        priority === "low" && styles.selectedPriority,
                    ]}
                    onPress={() => setPriority("low")}
                >
                    <Text>Low</Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.priorityButton,
                        priority === "medium" && styles.selectedPriority,
                    ]}
                    onPress={() => setPriority("medium")}
                >
                    <Text>Medium</Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.priorityButton,
                        priority === "high" && styles.selectedPriority,
                    ]}
                    onPress={() => setPriority("high")}
                >
                    <Text>High</Text>
                </Pressable>
            </View>

            {/* Due date */}
            <Text style={styles.label}>Due Date</Text>

            <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={dueDate}
                onChangeText={setDueDate}
            />

            {/* Add button */}
            <Pressable style={styles.addButton} onPress={addTodo}>
                <Text style={styles.addText}>Add Task</Text>
            </Pressable>

            {/* Todo list */}
            {todos.map((todo) => (
                <View style={styles.todo} key={todo.id}>
                    <View style={styles.todoInfo}>
                        <Text
                            style={[
                                styles.todoText,
                                todo.completed && styles.completedText,
                            ]}
                        >
                            {todo.task}
                        </Text>

                        <Text style={styles.details}>
                            Priority: {todo.priority}
                        </Text>

                        {todo.dueDate !== "" && (
                            <Text style={styles.details}>
                                Due: {todo.dueDate}
                            </Text>
                        )}
                    </View>

                    <View style={styles.actions}>
                        {/* Complete */}
                        <Pressable
                            style={styles.iconButton}
                            onPress={() => toggleTodo(todo.id)}
                        >
                            <Ionicons
                                name={
                                    todo.completed
                                        ? "checkmark-done"
                                        : "checkmark"
                                }
                                size={22}
                                color="white"
                            />
                        </Pressable>

                        {/* Delete */}
                        <Pressable
                            style={styles.deleteButton}
                            onPress={() => deleteTodo(todo.id)}
                        >
                            <Ionicons
                                name="trash-outline"
                                size={22}
                                color="white"
                            />
                        </Pressable>
                    </View>
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

    label: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 15,
        marginBottom: 8,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 50,
    },

    priorityRow: {
        flexDirection: "row",
        gap: 10,
    },

    priorityButton: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
    },

    selectedPriority: {
        backgroundColor: "#ddd",
        borderColor: "black",
    },

    addButton: {
        backgroundColor: "black",
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
    },

    addText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },

    todo: {
        padding: 15,
        marginTop: 12,
        backgroundColor: "#eee",
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    todoInfo: {
        flex: 1,
    },

    todoText: {
        fontSize: 18,
        fontWeight: "600",
    },

    completedText: {
        textDecorationLine: "line-through",
        opacity: 0.5,
    },

    details: {
        marginTop: 4,
        fontSize: 14,
        color: "#666",
    },

    actions: {
        flexDirection: "row",
        gap: 8,
        marginLeft: 10,
    },

    iconButton: {
        backgroundColor: "black",
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },

    deleteButton: {
        backgroundColor: "#d32f2f",
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
});

