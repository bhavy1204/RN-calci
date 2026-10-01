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
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Todo() {
    const [task, setTask] = useState("");
    const [priority, setPriority] = useState("medium");
    const [picker, setShowPicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load todos when app starts
    const loadTodos = async () => {
        try {
            const savedTodos = await AsyncStorage.getItem("todos");

            if (savedTodos !== null) {
                setTodos(JSON.parse(savedTodos));
            }
        } catch (error) {
            console.error("Failed to load tasks", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTodos();
    }, []);

    // Save whenever todos change
    useEffect(() => {
        if (!loading) {
            AsyncStorage.setItem("todos", JSON.stringify(todos));
        }
    }, [todos, loading]);

    const addTodo = () => {
        if (task.trim() === "") return;

        const todo = {
            id: Date.now(),
            task: task.trim(),
            priority,
            dueDate: selectedDate
                ? selectedDate.toISOString().split("T")[0]
                : "",
            completed: false,
        };

        setTodos((prevTodos) => [...prevTodos, todo]);

        setTask("");
        setPriority("medium");
        setSelectedDate(null);
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
                placeholderTextColor="#999"
                value={task}
                onChangeText={setTask}
            />

            {/* Priority */}
            <Text style={styles.label}>Priority</Text>

            <View style={styles.priorityRow}>
                <Pressable
                    style={[
                        styles.priorityButton,
                        priority === "low" && styles.lowPriority,
                    ]}
                    onPress={() => setPriority("low")}
                >
                    <Text
                        style={[
                            styles.priorityText,
                            priority === "low" && styles.selectedPriorityText,
                        ]}
                    >
                        Low
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.priorityButton,
                        priority === "medium" && styles.mediumPriority,
                    ]}
                    onPress={() => setPriority("medium")}
                >
                    <Text
                        style={[
                            styles.priorityText,
                            priority === "medium" &&
                            styles.selectedPriorityText,
                        ]}
                    >
                        Medium
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.priorityButton,
                        priority === "high" && styles.highPriority,
                    ]}
                    onPress={() => setPriority("high")}
                >
                    <Text
                        style={[
                            styles.priorityText,
                            priority === "high" && styles.selectedPriorityText,
                        ]}
                    >
                        High
                    </Text>
                </Pressable>
            </View>

            {/* Due date */}
            <Text style={styles.label}>Due Date</Text>

            <Pressable
                style={styles.input}
                onPress={() => setShowPicker(true)}
            >
                <View style={styles.dateInput}>
                    <Text
                        style={[
                            styles.dateText,
                            !selectedDate && styles.placeholderText,
                        ]}
                    >
                        {selectedDate
                            ? selectedDate.toLocaleDateString()
                            : "Select due date"}
                    </Text>

                    <Ionicons
                        name="calendar-outline"
                        size={20}
                        color="#71717A"
                    />
                </View>
            </Pressable>

            {picker && (
                <DateTimePicker
                    value={selectedDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                        setShowPicker(false);

                        if (date) {
                            setSelectedDate(date);
                        }
                    }}
                />
            )}

            {/* Add button */}
            <Pressable style={styles.addButton} onPress={addTodo}>
                <Ionicons name="add" size={20} color="white" />

                <Text style={styles.addText}>Add Task</Text>
            </Pressable>

            {/* Todo list */}
            <View style={styles.todoList}>
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

                            <View style={styles.todoMeta}>
                                <Text style={styles.details}>
                                    {todo.priority}
                                </Text>

                                {todo.dueDate !== "" && (
                                    <>
                                        <Text style={styles.metaDot}>•</Text>

                                        <Text style={styles.details}>
                                            Due {todo.dueDate}
                                        </Text>
                                    </>
                                )}
                            </View>
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
                                            ? "checkmark-circle"
                                            : "checkmark-circle-outline"
                                    }
                                    size={23}
                                    color={
                                        todo.completed ? "#16A34A" : "#52525B"
                                    }
                                />
                            </Pressable>

                            {/* Delete */}
                            <Pressable
                                style={styles.deleteButton}
                                onPress={() => deleteTodo(todo.id)}
                            >
                                <Ionicons
                                    name="trash-outline"
                                    size={20}
                                    color="#DC2626"
                                />
                            </Pressable>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F7F5",
        paddingHorizontal: 20,
        paddingTop: 60,
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
        color: "#18181B",
        marginBottom: 24,
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#52525B",
        marginTop: 18,
        marginBottom: 8,
    },

    input: {
        height: 52,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E4E4E7",
        borderRadius: 12,
        paddingHorizontal: 16,
        justifyContent: "center",
    },

    lowPriority: {
        backgroundColor: "#ECFDF5",
        borderColor: "#10B981",
    },

    mediumPriority: {
        backgroundColor: "#FFFBEB",
        borderColor: "#F59E0B",
    },

    highPriority: {
        backgroundColor: "#FEF2F2",
        borderColor: "#EF4444",
    },

    priorityText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#52525B",
    },

    selectedPriorityText: {
        color: "#18181B",
    },

    priorityRow: {
        flexDirection: "row",
        gap: 8,
    },

    priorityButton: {
        flex: 1,
        height: 44,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E4E4E7",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },

    selectedPriority: {
        backgroundColor: "#18181B",
        borderColor: "#18181B",
    },

    addButton: {
        height: 52,
        backgroundColor: "#18181B",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },

    addText: {
        color: "#FFFFFF",
        fontWeight: "600",
        fontSize: 16,
    },

    lowPriority: {
        backgroundColor: "#ECFDF5",
        borderColor: "#10B981",
    },

    mediumPriority: {
        backgroundColor: "#FFFBEB",
        borderColor: "#F59E0B",
    },

    highPriority: {
        backgroundColor: "#FEF2F2",
        borderColor: "#EF4444",
    },

    priorityText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#52525B",
    },

    selectedPriorityText: {
        color: "#18181B",
    },

    dateInput: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    dateText: {
        fontSize: 15,
        color: "#18181B",
    },

    placeholderText: {
        color: "#999",
    },

    todoList: {
        marginTop: 20,
    },

    todoMeta: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    metaDot: {
        color: "#A1A1AA",
    },

    iconButton: {
        backgroundColor: "#F4F4F5",
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },

    deleteButton: {
        backgroundColor: "#FEF2F2",
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },

    todo: {
        padding: 16,
        marginTop: 12,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#EAEAEA",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },

    todoInfo: {
        flex: 1,
        paddingRight: 10,
    },

    todoText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#18181B",
    },

    completedText: {
        textDecorationLine: "line-through",
        opacity: 0.4,
    },

    details: {
        marginTop: 5,
        fontSize: 13,
        color: "#71717A",
    },

    actions: {
        flexDirection: "row",
        gap: 8,
    },

    iconButton: {
        backgroundColor: "#18181B",
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },

    deleteButton: {
        backgroundColor: "#FEF2F2",
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
});

