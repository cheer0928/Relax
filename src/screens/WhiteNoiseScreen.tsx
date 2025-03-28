import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { theme } from '../theme/theme';
import { Button } from '../components/Button';
import { WaveformAnimation } from '../components/WaveformAnimation';
import { VolumeSlider } from '../components/VolumeSlider';

const { width } = Dimensions.get('window');

// 音效数据
const SOUNDS = [
    { id: 'rain', title: '雨声', source: require('../assets/sounds/rain.mp3') },
    { id: 'forest', title: '森林', source: require('../assets/sounds/forest.mp3') },
    { id: 'wave', title: '海浪', source: require('../assets/sounds/wave.mp3') },
    { id: 'fire', title: '篝火', source: require('../assets/sounds/fire.mp3') },
    { id: 'wind', title: '微风', source: require('../assets/sounds/wind.mp3') },
];

export const WhiteNoiseScreen = () => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSoundId, setCurrentSoundId] = useState<string | null>(null);
    const [volume, setVolume] = useState(1);

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    const playSound = async (soundId: string) => {
        try {
            if (sound) {
                await sound.unloadAsync();
            }

            const soundData = SOUNDS.find(s => s.id === soundId);
            if (!soundData) return;

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                staysActiveInBackground: true,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });

            const { sound: newSound } = await Audio.Sound.createAsync(
                soundData.source,
                {
                    isLooping: true,
                    shouldPlay: true,
                    volume: volume,
                }
            );

            setSound(newSound);
            setIsPlaying(true);
            setCurrentSoundId(soundId);
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    };

    const togglePlayPause = async () => {
        if (!sound) return;

        if (isPlaying) {
            await sound.pauseAsync();
        } else {
            await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = async (newVolume: number) => {
        setVolume(newVolume);
        if (sound) {
            await sound.setVolumeAsync(newVolume);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.soundGrid}>
                    {SOUNDS.map((soundItem) => (
                        <Button
                            key={soundItem.id}
                            title={soundItem.title}
                            variant={currentSoundId === soundItem.id ? 'primary' : 'secondary'}
                            style={styles.soundButton}
                            onPress={() => playSound(soundItem.id)}
                        />
                    ))}
                </View>

                {currentSoundId && (
                    <View style={styles.playerContainer}>
                        <WaveformAnimation isPlaying={isPlaying} />

                        <View style={styles.controlsContainer}>
                            <VolumeSlider
                                initialVolume={volume}
                                onVolumeChange={handleVolumeChange}
                            />

                            <Button
                                title={isPlaying ? '暂停' : '播放'}
                                size="large"
                                style={styles.playButton}
                                onPress={togglePlayPause}
                            />
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        padding: theme.spacing.md,
    },
    soundGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.xl,
    },
    soundButton: {
        width: (width - theme.spacing.md * 3) / 2,
        marginBottom: theme.spacing.md,
    },
    playerContainer: {
        alignItems: 'center',
        marginTop: theme.spacing.xl,
    },
    controlsContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: theme.spacing.xl,
    },
    playButton: {
        marginTop: theme.spacing.xl,
        width: width - theme.spacing.md * 2,
    },
}); 