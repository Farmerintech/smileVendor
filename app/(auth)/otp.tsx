import { NotificationBar } from '@/components/NotificationBar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
import Countdown from "@/components/countdown"
import {
  NativeSyntheticEvent,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View
} from 'react-native';

interface OtpInputProps {
  onSubmit: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ onSubmit }) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const inputsRef = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    if (!/^\d?$/.test(text)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = text;
    setOtp(updatedOtp);

    if (text && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }

    if (updatedOtp.every(digit => digit !== '')) {
      onSubmit(updatedOtp.join(''));
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };
    const [secondsLeft, setSecondsLeft] = useState(60);
    const [notifTrigger, setNotifTrigger] = useState<number | null>(null);
    const [start, setStatrt] = useState(false)
    const handleResend = () => {
      if (secondsLeft === 0) {
        setNotifTrigger(Date.now());
        setSecondsLeft(60);  // restart countdown
      }
    };



  

const router = useRouter()
  return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF", paddingTop:60, paddingLeft:10, paddingRight:10}}>
          <StatusBar barStyle="dark-content" />
{notifTrigger && <NotificationBar text="New verification code sent" trigger={notifTrigger} />}
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop:5, paddingBottom: 200 }}
          >
        <View className='flex justify-start gap-[24px] flex-row '>
            <TouchableOpacity className='w-[42px] h-[42px] rounded-full bg-white shadow-md flex items-center justify-center'
                onPress={() => router.back()}

            >
             <Ionicons name="arrow-back" size={20} color="#333" />
            </TouchableOpacity>
            <Text className="text-[32px] font-['Roboto'] font-bold text-center mb-2 text-[#FF6347] capitalize">
                Verification
           </Text>
        </View>
        <Text className="text-center text-gray-600">
            Code has been sent to (+44) 20 **** *678              
        </Text>
    
    <View style={styles.container} className='bg-white'>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref:any) => (inputsRef.current[index] = ref )}
          keyboardType="number-pad"
          maxLength={1}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          autoFocus={index === 0}
          returnKeyType="done"
          className='w-[65px] h-[65px] text-center rounded-[8px] bg-gray-800/5 hover:border text-gray-700 hover:border-[#FF6347] text-[24px] font-700'
        />
      ))}
    </View>
    <View className='flex flex-col items-center justify-center'>
      <Text>
         Didn't receive code ?
      </Text>
      <Countdown secondsLeft={secondsLeft} setSecondsLeft={setSecondsLeft}/>
      <TouchableOpacity  onPress={()=>handleResend()} disabled={secondsLeft !==0 }>
        <Text className={`${secondsLeft===0 ? "text-red-500":'disabled text-gray-100'}`}>Resend code</Text>
      </TouchableOpacity>
    </View>
    <Text>
      
    </Text>
</ScrollView>
 </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 30,
  },
  input: {
    width: 75,
    height: 75,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    color: '#000',
  },
});

export default OtpInput;
