import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [firstValue, setFirstValue] = useState(null);
  const [expression, setExpression] = useState("");
  const [operator, setOperator] = useState(null);
  const [waitingForSecond, setWaitingForSecond] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForSecond) {
      const newDisplay = String(digit);

      setDisplay(newDisplay);
      setWaitingForSecond(false);

      if (firstValue !== null && operator !== null) {
        setExpression(`${firstValue} ${operator} ${newDisplay}`);
      }

    } else {
      const newDisplay =
        display === "0"
          ? String(digit)
          : display + digit;

      setDisplay(newDisplay);

      if (firstValue !== null && operator !== null) {
        setExpression(`${firstValue} ${operator} ${newDisplay}`);
      }
    }
  };

  const inputDot = () => {
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setFirstValue(null);
    setExpression(null);
    setOperator(null);
    setWaitingForSecond(false);
  };

  const calculate = (a, b, op) => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b === 0 ? NaN : a / b;
      default: return b;
    }
  };

  const getFontSize = (text) => {
    if (text.length > 9) return 32;
    if (text.length > 6) return 44;
    return 72;
  };

  const chooseOperator = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (firstValue == null) {
      setFirstValue(inputValue);
      setOperator(nextOperator);
      setExpression(`${display} ${nextOperator}`);
    } else if (operator) {
      const result = calculate(firstValue, inputValue, operator);
      setDisplay(String(result));
      setFirstValue(result);
      setOperator(nextOperator)
      setExpression(`${result} ${nextOperator}`)
    }
    setWaitingForSecond(true);
    // setOperator(nextOperator);
  };

  const handleEquals = () => {
    if (operator == null || firstValue == null)
      return;

    const inputValue = parseFloat(display);

    const result = calculate(firstValue, inputValue, operator);

    setExpression(`${firstValue} ${operator} ${inputValue}`);

    setDisplay(String(result));
    setFirstValue(null);
    setOperator(null);
    setWaitingForSecond(false);
  };

  const buttons = [
    ["C", "±", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];

  const onPress = (label) => {
    if (label === "C") return clear();
    if (label === "=") return handleEquals();
    if (["+", "-", "×", "÷"].includes(label)) return chooseOperator(label);
    if (label === ".") return inputDot();
    if (label === "±") return setDisplay(String(parseFloat(display) * -1));
    if (label === "%") return setDisplay(String(parseFloat(display) / 100));
    return inputDigit(label);
  };

  return (
 <View className="flex-1 justify-end bg-black">

  {/* Display */}
  <View className="min-h-[120px] items-end justify-end px-4">
    <Text
      className="mb-1 text-xl text-[#888]"
      numberOfLines={1}
    >
      {expression}
    </Text>

    <Text
      className="font-light text-[58px] text-white"
      style={{ fontSize: getFontSize(display) }}
      numberOfLines={1}
    >
      {display}
    </Text>
  </View>

  {/* Buttons */}
  <View className="px-3 pb-1">
    {buttons.map((row, i) => (
      <View className="mb-2 flex-row" key={i}>
        {row.map((label) => (
          <Pressable
            key={label}
            onPress={() => onPress(label)}
            className={`mx-1 items-center justify-center rounded-full bg-[#333] ${
              label === "0"
                ? "h-[70px] flex-[2.15] mt-1 items-start justify-center rounded-[30px] pl-6"
                : "aspect-square flex-1"
            } ${
              ["÷", "*", "-", "+", "="].includes(label)
                ? "bg-[#ff9f0a]"
                : ""
            }`}
          >
            <Text className="text-[24px] text-white">
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
    ))}
  </View>

</View>
  );
}



