// A soft, low-key click for UI interaction. Best for repeated actions.
const MOOD_CLICK_SOUND = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU0AAAAAAAA/D4d/F4V/E4N/DYN/AYN/AYN/AoN/A4N/BYN/B4N/CIN/C4N/DYN/AIN/AIN/A4N/AoN/AYN/AYN/AYN/AoN/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4N/A4';

// A playful, positive sound for completing a profile.
const PROFILE_SAVE_SOUND = 'data:audio/wav;base64,UklGRkgCAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YUECAAAA/wD/AP4A/AD1APMA7gDVANYA1QDPAMQAwgC6AK8ArQCiAJoAkwCMAIsAhgB/AHgAbwBtAGoAZgBlAGIAYABdAFsAWQBXAFUAUwBRAEsASQBGAEQAQwA/ADwAOwA4ADcANgA0ADMAMgAwAC8ALgAsACoAKgApACgAJwAmACUAJAAlACQAJAAlACUAJgAnACgAKQAqACwALgAvADEAMwA1ADcAPAA/AEMARwBLAE8AUwBXAFsAXwBjAGcAbQBzAHgAfgCFAIwAkQCaAKMAqwC3AMIAxwDSANgA4ADqAPIA+gD+AP8A/wD/AP8A/wD/AP4A+wD3APIA6gDjANwA0gDHAMEAuQCsAKUAmgCSAI0AiAB/AHsAbwBtAGgAZgBiAF4AXABZAFcAUwBQAEwASQBGAEQAQgA+ADsAOAA1ADIA MC4sACoAJwAlACIAIAAdABsAGgAYABcAFQATABIAEQAQAA4ADQAMAAoACQAIAAcABgAFAAMAAgABAAAA//3/+f75/un+6f7o/uf+5v7l/uT+4/7i/uH+3/7e/t3+2/7a/tn+2P7Y/tj+2f7b/t3+3/7h/uP+5f7n/ur+8P74//8A';

// A gentle, magical chime for when guidance appears.
const GUIDANCE_SOUND = 'data:audio/wav;base64,UklGRqYBAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YYQBAAAAAP8A/wD9AP8A7wDtANsA0wDJAL4ArwCiAJQAhgB5AG0AWgBQAEcAPwA4ACwAJAAWAA0ABgAAAP8A/wD9AP8A7wDtANsA0wDJAL4ArwCiAJQAhgB5AG0AWgBQAEcAPwA4ACwAJAAWAA0ABgAAAAAAAAAAAAAAAAAAAAA=';

// A sharp, quick click for a toggle switch.
const TOGGLE_SOUND = 'data:audio/wav;base64,UklGRjYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRIBAAAA/wD9AP0A/AD4APgA+QD7APwA/QD+AP8A';

let audioContext: AudioContext | null = null;
let currentNarrationSource: AudioBufferSourceNode | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  return audioContext;
};

/**
 * Plays a sound if sounds are enabled in localStorage.
 * @param soundData - The base64 data URI of the sound to play.
 */
const playSound = (soundData: string) => {
  try {
    const soundsEnabled = localStorage.getItem('soundsEnabled');
    if (soundsEnabled === 'false') {
      return;
    }
    const audio = new Audio(soundData);
    audio.play().catch(e => console.error("Error playing sound:", e));
  } catch (error) {
    console.error("Could not play sound.", error);
  }
};

export const playMoodClickSound = () => playSound(MOOD_CLICK_SOUND);
export const playProfileSaveSound = () => playSound(PROFILE_SAVE_SOUND);
export const playGuidanceSound = () => playSound(GUIDANCE_SOUND);
export const playToggleSound = () => playSound(TOGGLE_SOUND);


// --- Narration Audio System ---

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


export const playNarration = async (base64Audio: string) => {
    if (localStorage.getItem('soundsEnabled') === 'false') return;

    const ctx = getAudioContext();
    
    // Stop any currently playing narration
    if (currentNarrationSource) {
        currentNarrationSource.stop();
        currentNarrationSource.disconnect();
    }
    
    try {
        const decodedBytes = decode(base64Audio);
        const audioBuffer = await decodeAudioData(decodedBytes, ctx, 24000, 1);
        
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
        
        currentNarrationSource = source;
        source.onended = () => {
            if (currentNarrationSource === source) {
                currentNarrationSource = null;
            }
        };
    } catch (error) {
        console.error("Failed to play narration:", error);
    }
};

export const stopNarration = () => {
    if (currentNarrationSource) {
        currentNarrationSource.stop();
        currentNarrationSource.disconnect();
        currentNarrationSource = null;
    }
};
