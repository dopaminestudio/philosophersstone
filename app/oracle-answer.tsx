import { lifeAnswers } from "@/data/lifeAnswers";
import { loveAnswers } from "@/data/loveAnswers";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get("window");

export default function OracleAnswer() {
  const { wisdom } = useLocalSearchParams();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const hapticInterval = useRef<number | null>(null);

  // 애니메이션 값들
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;

  // 깜빡이는 애니메이션 시작
  useEffect(() => {
    if (!isExpanded) {
      const startBlinkAnimation = () => {
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start((finished) => {
          if (finished && !isExpanded) {
            startBlinkAnimation(); // 반복
          }
        });
      };
      startBlinkAnimation();
    } else {
      // 확대된 상태에서는 깜빡임 중지
      blinkAnim.setValue(1);
    }
  }, [isExpanded]);

  const startContinuousHaptics = () => {
    if (isExpanded) return; // 확대된 상태에서는 실행하지 않음

    setIsPressing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // 800ms마다 반복 진동
    hapticInterval.current = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 800);
  };

  const stopContinuousHaptics = () => {
    setIsPressing(false);
    if (hapticInterval.current) {
      clearInterval(hapticInterval.current);
      hapticInterval.current = null;
    }
  };

  const showAnswer = () => {
    if (isExpanded) return; // 이미 확대된 상태면 실행하지 않음

    stopContinuousHaptics(); // 연속 햅틱 중지

    // 0.5초 후 돌 확대 시작
    setTimeout(() => {
      setIsExpanded(true);

      // 돌을 화면 크기로 확대
      Animated.timing(scaleAnim, {
        toValue: (screenWidth / 320) * 1.2,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      // 텍스트 나타내기
      setTimeout(() => {
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      }, 600);
    }, 500);
  };

  const resetStone = () => {
    // 돌을 원래 크기로 축소
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setIsExpanded(false);
    }, 500);
  };

  const currentWisdom = wisdom as "life" | "love";

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header - 확대 상태일 때 숨김 */}
      {!isExpanded && (
        <View className="flex-row items-center justify-between p-4">
          <Pressable onPress={() => router.back()} className="w-10">
            <AntDesign name="arrowleft" size={24} color="white" />
          </Pressable>
          <Text className="text-white text-headline2">{wisdom === "life" ? "인생" : "사랑"}</Text>
          <View className="w-10" />
        </View>
      )}

      {/* Content */}
      <View className="items-center justify-center flex-1">
        {/* Instruction Text - 확대 상태일 때 숨김 */}
        {!isExpanded && (
          <View className="items-center justify-center">
            <Text className="text-center text-white text-headline1">마음속으로 질문을 생각해보세요</Text>
          </View>
        )}

        {/* Stone Image */}
        <View className="items-center justify-center">
          <TouchableOpacity
            onPress={showAnswer}
            onPressIn={startContinuousHaptics}
            onPressOut={stopContinuousHaptics}
            activeOpacity={isExpanded ? 1 : 0.8}
          >
            <View className="relative items-center justify-center">
              {/* 돌 이미지 */}
              <Animated.View
                style={{
                  width: 320,
                  height: 320,
                  borderRadius: isExpanded ? 0 : 16,
                  overflow: "hidden",
                  transform: [{ scale: scaleAnim }],
                }}
              >
                <Image
                  source={require("../assets/images/philosopher_stone.webp")}
                  contentFit="cover"
                  style={{ width: "100%", height: "100%" }}
                />

                {/* Answer Overlay - 확대 상태일 때만 표시 */}
                {isExpanded && (
                  <Animated.View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: 40,
                      opacity: opacityAnim,
                    }}
                  >
                    <Text className="leading-10 text-center text-white text-headline1">
                      {currentWisdom === "life"
                        ? lifeAnswers[Math.floor(Math.random() * lifeAnswers.length)].answer
                        : loveAnswers[Math.floor(Math.random() * loveAnswers.length)].answer}
                    </Text>
                  </Animated.View>
                )}
              </Animated.View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Guide Text - 확대 상태일 때 숨김 */}
        {!isExpanded && !isPressing && (
          <View className="absolute bottom-0 left-0 right-0 pb-20">
            <Animated.Text className="text-center text-white text-subhead3" style={{ opacity: blinkAnim }}>
              돌을 터치하여 답변을 받아보세요
            </Animated.Text>
          </View>
        )}

        {/* Action Buttons - 확대 상태일 때만 표시 */}
        {isExpanded && (
          <Animated.View
            style={{
              position: "absolute",
              bottom: 80,
              flexDirection: "row",
              gap: 20,
              opacity: opacityAnim,
            }}
          >
            <TouchableOpacity onPress={resetStone} activeOpacity={0.8} className="px-6 py-3 bg-blue-600 rounded-xl">
              <Text className="text-white text-subhead2">다시 물어보기</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}
