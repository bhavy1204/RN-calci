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
    <View style={styles.container}>
      <View style={styles.displayWrap}>
        <Text style={styles.expressionText} numberOfLines={1}> {expression} </Text>
        <Text style={[styles.displayText, { fontSize: getFontSize(display) }]} numberOfLines={1} > {display} </Text>

      </View>

      <View style={styles.pad}>
        {buttons.map((row, i) => (
          <View style={styles.row} key={i}>
            {row.map((label) => (
              <Pressable
                key={label}
                onPress={() => onPress(label)}
                style={[
                  styles.button,
                  label === "0" && styles.zeroButton,
                  ["÷", "*", "-", "+", "="].includes(label) && styles.operatorButton,
                ]}
              >
                <Text style={styles.buttonText}>{label}</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "flex-end"
  },

  displayWrap: {
    padding: 24,
    alignItems: "flex-end",
    minHeight: 140,
    justifyContent: "flex-end",
  },

  expressionText: {
    color: "#888",
    fontSize: 24,
    marginBottom: 8,
  },

  displayText: {
    color: "#fff",
    fontSize: 72,
    fontWeight: "300",
  },

  pad: {
    paddingBottom: 30,
    paddingHorizontal: 12
  },
  row: {
    flexDirection: "row",
    marginBottom: 12
  },
  button: {
    flex: 1,
    aspectRatio: 1,
    marginHorizontal: 6,
    borderRadius: 999,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  zeroButton: {
    flex: 2.15,
    aspectRatio: undefined,
    height: 70,
    alignItems: "flex-start",
    paddingLeft: 28
  },
  operatorButton: {
    backgroundColor: "#ff9f0a"
  },
  buttonText: {
    color: "#fff",
    fontSize: 28
  },
});

