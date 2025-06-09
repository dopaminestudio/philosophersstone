import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

export default function Index() {
  const router = useRouter();

  const handleWisdomSelect = (wisdom: string) => {
    // 새로운 페이지로 네비게이션하면서 선택한 지혜 전달
    router.push({
      pathname: "/oracle-answer",
      params: { wisdom },
    });
  };

  return (
    <View className="flex-1">
      <ImageBackground source={require("../assets/images/stone_bg.webp")} className="flex-1">
        <SafeAreaView className="flex-1 items-center justify-center gap-8 px-4" edges={["left", "right", "bottom"]}>
          <View>
            <Text className="text-headline2 text-[#ffffff] text-center mb-2">무엇에 대한 답을</Text>
            <Text className="text-headline2 text-center text-[#ffffff]">듣고 싶나요?</Text>
          </View>

          <View className="flex-row gap-4">
            <TouchableOpacity onPress={() => handleWisdomSelect("life")} activeOpacity={0.8} className="flex-1">
              <BlurView
                intensity={10}
                tint="light"
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: 64,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <Text className="text-subhead3 text-white font-semibold">인생 조언 받기</Text>
              </BlurView>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleWisdomSelect("love")} activeOpacity={0.8} className="flex-1">
              <BlurView
                intensity={10}
                tint="light"
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: 64,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <Text className="text-subhead3 text-white font-semibold">사랑 조언 받기</Text>
              </BlurView>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
