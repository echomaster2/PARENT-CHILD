
export const getZodiacSign = (dob: string): string => {
    // The HTML date input provides a "YYYY-MM-DD" string.
    // Parsing it this way treats it as UTC and avoids timezone issues.
    const date = new Date(dob);
    const month = date.getUTCMonth() + 1; // getUTCMonth() is 0-indexed
    const day = date.getUTCDate();
  
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
    
    // Default to Capricorn for Dec 22 - Jan 19
    return "Capricorn";
  };

  type Language = 'en' | 'es' | 'fr';

  const birthstoneMap: Record<number, Record<Language, string>> = {
    1: { en: "Garnet", es: "Granate", fr: "Grenat" },
    2: { en: "Amethyst", es: "Amatista", fr: "Améthyste" },
    3: { en: "Aquamarine", es: "Aguamarina", fr: "Aigue-marine" },
    4: { en: "Diamond", es: "Diamante", fr: "Diamant" },
    5: { en: "Emerald", es: "Esmeralda", fr: "Émeraude" },
    6: { en: "Pearl", es: "Perla", fr: "Perle" },
    7: { en: "Ruby", es: "Rubí", fr: "Rubis" },
    8: { en: "Peridot", es: "Peridoto", fr: "Péridot" },
    9: { en: "Sapphire", es: "Zafiro", fr: "Saphir" },
    10: { en: "Opal", es: "Ópalo", fr: "Opale" },
    11: { en: "Topaz", es: "Topacio", fr: "Topaze" },
    12: { en: "Turquoise", es: "Turquesa", fr: "Turquoise" },
  };
  
  export const getBirthstone = (dob: string, lang: Language = 'en'): string => {
    if (!dob) return "";
    const date = new Date(dob);
    const month = date.getUTCMonth() + 1; // 1-indexed month
  
    const monthStones = birthstoneMap[month];
    if (!monthStones) return "";
    
    return monthStones[lang] || monthStones['en']; // Fallback to English
  };
