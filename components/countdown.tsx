import React, { useEffect } from 'react';
import { Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface CountdownProps {
  secondsLeft: number;
  setSecondsLeft: React.Dispatch<React.SetStateAction<number>>;
}

const Countdown: React.FC<CountdownProps> = ({ secondsLeft, setSecondsLeft }) => {
  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev > 0) return prev - 1;
        clearInterval(timer);
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View className='flex gap-[8px] flex-row items-center'>
      <MaterialIcons
        name="access-time"
        size={20}
        color="black"
        style={{ marginRight: 8 }}
      />
      <Text>{formatTime(secondsLeft)}</Text>
    </View>
  );
};

export default Countdown;
