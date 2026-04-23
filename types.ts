
export interface ChildProfile {
  name: string;
  dob: string; 
  birthstone: string;
}

export enum Mood {
  JOYFUL = 'Joyful',
  CHILL = 'Chill',
  SAD = 'Sad',
  ANGRY = 'Angry',
  SILLY = 'Silly',
  TIRED = 'Tired',
}

export enum Tone {
  FUNNY = 'Funny & Witty',
  SPIRITUAL = 'Spiritual & Gentle',
  DIRECT = 'Direct & Actionable',
}

export interface Guidance {
  cheatCode: string;
  explanation: string;
  parentingTip: string;
  snackRec: string;
  meltdownDecoder: string;
  gamifiedFeedback: string;
}