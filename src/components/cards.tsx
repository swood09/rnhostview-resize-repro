import {
  Button as SwiftButton,
  Image as SwiftImage,
  Text as SwiftText,
  VStack,
} from '@expo/ui/swift-ui';
import {
  aspectRatio,
  buttonStyle,
  clipped,
  clipShape,
  font,
  foregroundStyle,
  frame,
  lineLimit,
  padding,
  resizable,
} from '@expo/ui/swift-ui/modifiers';
import { Asset } from 'expo-asset';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

const PHOTO = require('../../assets/images/photo.jpg');

/** The bundled photo as a local `file://` URI, which SwiftUI's `Image(uiImage:)` reads. */
function usePhotoUri(): string | null {
  const [uri, setUri] = useState<string | null>(null);
  useEffect(() => {
    Asset.fromModule(PHOTO)
      .downloadAsync()
      .then((a) => setUri(a.localUri))
      .catch(() => {});
  }, []);
  return uri;
}

const TITLE = 'Card title';
const BODY =
  'Card body text. It is long enough to wrap across several lines, so a change in width reflows it.';

/**
 * The SAME card twice: once in SwiftUI (the control), once in React Native hosted in
 * `RNHostView` (the bug). Photo, title, body text and a full-width button, so a resize
 * shows on real content: a centred photo, wrapping text and a button that spans the card.
 */
export function SwiftUICard() {
  const photo = usePhotoUri();
  return (
    <VStack alignment="leading" spacing={8} modifiers={[padding({ all: 12 })]}>
      <SwiftText modifiers={[font({ textStyle: 'caption', weight: 'semibold' }), foregroundStyle('secondary')]}>
        SWIFTUI (CONTROL)
      </SwiftText>
      {photo ? (
        // The same photo as the React Native card: full width, 80pt tall, filled.
        <SwiftImage
          uiImage={photo}
          modifiers={[
            resizable(),
            aspectRatio({ contentMode: 'fill' }),
            frame({ maxWidth: Infinity, minHeight: 80, maxHeight: 80 }),
            clipped(),
            clipShape('roundedRectangle', 12),
          ]}
        />
      ) : null}
      <SwiftText modifiers={[font({ textStyle: 'headline' }), lineLimit(2)]}>{TITLE}</SwiftText>
      <SwiftText modifiers={[font({ textStyle: 'subheadline' }), foregroundStyle('secondary')]}>{BODY}</SwiftText>
      <SwiftButton onPress={() => {}} modifiers={[buttonStyle('borderedProminent')]}>
        <SwiftText modifiers={[frame({ maxWidth: Infinity })]}>Button</SwiftText>
      </SwiftButton>
    </VStack>
  );
}

export function ReactNativeCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>REACT NATIVE IN RNHostView</Text>
      <Image source={PHOTO} style={styles.photo} resizeMode="cover" />
      <Text style={styles.title} numberOfLines={2}>
        {TITLE}
      </Text>
      <Text style={styles.body}>{BODY}</Text>
      <Pressable style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>Button</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, padding: 12, gap: 8, backgroundColor: '#f2f2f7' },
  label: { fontSize: 12, fontWeight: '600', color: '#8e8e93' },
  photo: { width: '100%', height: 80, borderRadius: 12 },
  title: { fontSize: 17, fontWeight: '600', color: '#000' },
  body: { fontSize: 15, color: '#3c3c43' },
  button: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#007aff',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
