import { Host, RNHostView, ScrollView, VStack } from '@expo/ui/swift-ui';
import { Animation, animation, background, frame } from '@expo/ui/swift-ui/modifiers';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ReactNativeCard, SwiftUICard } from '@/components/cards';

/**
 * Any iPhone or iPad simulator. Both cards sit in a SwiftUI frame whose width
 * animates (`animation(_:value:)`, 0.8s ease-in-out) when the button is tapped.
 *
 * Expected: both cards resize smoothly with the frame.
 * Actual: the SwiftUI card interpolates every frame; the React Native card inside
 * `RNHostView` jumps to its FINAL layout at the start, and only its outer frame
 * animates (photo, text wrap and button snap first, then slide into place).
 */
export default function AnimatedWidth() {
  const [wide, setWide] = useState(false);
  const width = wide ? 360 : 200;
  const resize = [
    frame({ width, height: 260 }),
    background('#f2f2f7'),
    animation(Animation.easeInOut({ duration: 0.8 }), wide),
  ];

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <View style={styles.controls}>
        <Button title={wide ? 'Make narrow' : 'Make wide'} onPress={() => setWide((w) => !w)} />
        <Link href="/arrangement" style={styles.link}>
          iPhone Duo: ArrangementView →
        </Link>
      </View>
      <Host style={styles.host}>
        <ScrollView>
        <VStack alignment="leading" spacing={16}>
          <VStack modifiers={resize}>
            <SwiftUICard />
          </VStack>
          <VStack modifiers={resize}>
            <RNHostView>
              <ReactNativeCard />
            </RNHostView>
          </VStack>
        </VStack>
        </ScrollView>
      </Host>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  controls: { padding: 16, gap: 8 },
  link: { color: '#007aff', fontSize: 15 },
  host: { flex: 1, marginHorizontal: 16 },
});
