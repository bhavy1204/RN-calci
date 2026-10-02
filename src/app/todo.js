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
    const [showAddtask, setShowAddTask] = useState(false);

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
        setShowAddTask(true);
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
        setPriority("low");
        setSelectedDate(null);
        setShowAddTask(false);
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
    <View className="flex-1 bg-[#F7F7F5] px-5 pt-[60px]">
        <Text className="mb-6 text-[30px] font-bold text-[#18181B]">
            Your Daily Tasks
        </Text>

        {showAddtask && (
            <>
                {/* Task input */}
                <TextInput
                    className="h-[52px] justify-center rounded-xl border border-[#E4E4E7] bg-white px-4"
                    placeholder="Enter task"
                    placeholderTextColor="#999"
                    value={task}
                    onChangeText={setTask}
                />

                {/* Priority */}
                <Text className="mb-2 mt-[18px] text-sm font-semibold text-[#52525B]">
                    Priority
                </Text>

                <View className="flex-row gap-2">
                    <Pressable
                        className={`h-11 flex-1 items-center justify-center rounded-[10px] border ${
                            priority === "low"
                                ? "border-[#10B981] bg-[#ECFDF5]"
                                : "border-[#E4E4E7] bg-white"
                        }`}
                        onPress={() => setPriority("low")}
                    >
                        <Text
                            className={`text-sm font-semibold ${
                                priority === "low"
                                    ? "text-[#18181B]"
                                    : "text-[#52525B]"
                            }`}
                        >
                            Low
                        </Text>
                    </Pressable>

                    <Pressable
                        className={`h-11 flex-1 items-center justify-center rounded-[10px] border ${
                            priority === "medium"
                                ? "border-[#F59E0B] bg-[#FFFBEB]"
                                : "border-[#E4E4E7] bg-white"
                        }`}
                        onPress={() => setPriority("medium")}
                    >
                        <Text
                            className={`text-sm font-semibold ${
                                priority === "medium"
                                    ? "text-[#18181B]"
                                    : "text-[#52525B]"
                            }`}
                        >
                            Medium
                        </Text>
                    </Pressable>

                    <Pressable
                        className={`h-11 flex-1 items-center justify-center rounded-[10px] border ${
                            priority === "high"
                                ? "border-[#EF4444] bg-[#FEF2F2]"
                                : "border-[#E4E4E7] bg-white"
                        }`}
                        onPress={() => setPriority("high")}
                    >
                        <Text
                            className={`text-sm font-semibold ${
                                priority === "high"
                                    ? "text-[#18181B]"
                                    : "text-[#52525B]"
                            }`}
                        >
                            High
                        </Text>
                    </Pressable>
                </View>

                {/* Due date */}
                <Text className="mb-2 mt-[18px] text-sm font-semibold text-[#52525B]">
                    Due Date
                </Text>

                <Pressable
                    className="h-[52px] justify-center rounded-xl border border-[#E4E4E7] bg-white px-4"
                    onPress={() => setShowPicker(true)}
                >
                    <View className="flex-row items-center justify-between">
                        <Text
                            className={`text-[15px] ${
                                selectedDate
                                    ? "text-[#18181B]"
                                    : "text-[#999]"
                            }`}
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
            </>
        )}

        {/* Add button */}
        <Pressable
            className="mt-[22px] h-[52px] items-center justify-center rounded-xl bg-[#18181B]"
            onPress={addTodo}
        >
            {/* <Ionicons name="add" size={20} color="white" /> */}

            <Text className="text-base font-semibold text-white">
                Add Task
            </Text>
        </Pressable>

        {/* Todo list */}
        <View className="mt-5">
            {todos.map((todo) => (
                <View
                    className="mt-3 flex-row items-center justify-between rounded-[14px] border border-[#EAEAEA] bg-white p-4 shadow-sm"
                    key={todo.id}
                >
                    <View className="flex-1 pr-[10px]">
                        <Text
                            className={`text-base font-semibold text-[#18181B] ${
                                todo.completed
                                    ? "opacity-40 line-through"
                                    : ""
                            }`}
                        >
                            {todo.task}
                        </Text>

                        <View className="mt-[5px] flex-row items-center gap-1.5">
                            <Text className="text-[13px] text-[#71717A]">
                                {todo.priority}
                            </Text>

                            {todo.dueDate !== "" && (
                                <>
                                    <Text className="text-[#A1A1AA]">•</Text>

                                    <Text className="text-[13px] text-[#71717A]">
                                        Due {todo.dueDate}
                                    </Text>
                                </>
                            )}
                        </View>
                    </View>

                    <View className="flex-row gap-2">
                        {/* Complete */}
                        <Pressable
                            className="h-10 w-10 items-center justify-center rounded-[10px] bg-[#18181B]"
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
                            className="h-10 w-10 items-center justify-center rounded-[10px] bg-[#FEF2F2]"
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
