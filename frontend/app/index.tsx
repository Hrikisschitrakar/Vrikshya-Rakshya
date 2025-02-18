// import { View, Text, Button, Alert } from "react-native";
// import React from "react";
// import { useRouter } from "expo-router";

// const Index = () => {
//   const router = useRouter();

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Text>Index</Text>
//       <Button title="Welcome" onPress={() => Alert.alert("Button Pressed!")} />
//     </View>
//   );
// };

// export default Index;

import { View, Text, Button } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const Index = () => {
  const router = useRouter(); // Get router instance

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Index Screen</Text>
      {/* Navigate to the Welcome Page */}
      <Button title="Go to Welcome" onPress={() => router.push("/welcome")} />
    </View>
  );
};

export default Index;
