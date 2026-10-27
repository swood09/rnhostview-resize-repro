import { ArrangementView, Host, RNHostView, VStack } from '@expo/ui/swift-ui';
import { arrangementViewStyle, frame, splitArrangementLayoutSize } from '@expo/ui/swift-ui/modifiers';
import { StyleSheet, View } from 'react-native';
import { ReactNativeCard, SwiftUICard } from '@/components/cards';

/**
 * iPhone Duo, inner display, landscape (iOS 27.1+). The two cards are the two sides of
 * an `ArrangementView`, which halves itself at the fold and animates the change.
 *
 * Fold into book pose and back to flat. Expected: both sides resize smoothly.
 * Actual: the SwiftUI side interpolates; the React Native side (`RNHostView`) lays out
 * at its final size at once while the arrangement animates around it.
 */
export default function Arrangement() {
  return (
    <View style={styles.root}>
      <Host style={styles.root}>
        <ArrangementView modifiers={[arrangementViewStyle('split', { axes: 'both' })]}>
          <ArrangementView.Primary>
            <VStack modifiers={[splitArrangementLayoutSize({ idealWidth: 372 }), frame({ maxHeight: Infinity })]}>
              <SwiftUICard />
            </VStack>
          </ArrangementView.Primary>
          <ArrangementView.Secondary>
            <RNHostView>
              <ReactNativeCard />
            </RNHostView>
          </ArrangementView.Secondary>
        </ArrangementView>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: '#fff' } });
