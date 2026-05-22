import { createAudioPlayer, AudioPlayer } from 'expo-audio';

export interface SoundPlayerOptions {
  soundUrl: string;
}

// Export the type definition for the function
export type SoundPlayerType = (options: SoundPlayerOptions) => void | Promise<void>;

/**
 * Plays a sound from a given URL.
 * 
 * @param {SoundPlayerOptions} options - The options for the sound player.
 * @param {string} options.soundUrl - The URL of the sound to play.
 * 
 * @returns {void | Promise<void>}
 * 
 * @example
 * ```typescript
 * SoundPlayer({ soundUrl: 'https://example.com/sound.mp3' });
 * ```
 */

export const SoundPlayer = async ({ soundUrl }: SoundPlayerOptions): Promise<void> => {
  /**
   * Plays a sound from the specified URL using expo-audio.
   * @function
   * @param {string} url - The URL of the sound to play.
   */
  let player: AudioPlayer | null = null;
  try {
    player = createAudioPlayer(soundUrl);

    // Listen for completion to release the player
    player.addListener('playbackStatusUpdate', (status: any) => {
      if (status.didJustFinish && player) {
        player.release();
        player = null;
      }
    });

    // Play the sound
    player.play();
  } catch (error) {
    console.warn('SoundPlayer: Failed to play sound', error);
    if (player) {
      player.release();
    }
  }
};
