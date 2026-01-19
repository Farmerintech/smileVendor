// import * as Location from "expo-location";
// import React, { useEffect, useState } from "react";
// import { StyleSheet, View } from "react-native";
// import MapView, { Marker } from "react-native-maps";

// export default function App() {
//   const [location, setLocation] = useState(null);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         console.error("Permission to access location was denied");
//         return;
//       }

//       let currentLocation = await Location.getCurrentPositionAsync({});
//       setLocation({
//         latitude: currentLocation.coords.latitude,
//         longitude: currentLocation.coords.longitude,
//         latitudeDelta: 0.0922,
//         longitudeDelta: 0.0421,
//       });
//     })();
//   }, []);

//   return (
//     <View style={styles.container}>
//       {location ? (
//         <MapView style={styles.map} initialRegion={location}>
//           <Marker coordinate={location} title="You are here" />
//         </MapView>
//       ) : null}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
// });
