export function toFrenchDateHour(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function toFrenchDate(date: Date, full?: boolean): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: full ? "full" : "short",
  }).format(date);
}

// faire une function qui prend une date et retourne une string
// avec le format :
// "Il y quelques secondes" si moins de 1 minute
// "Il y a X minutes" si moins de 1 heure
// "Il y a X heures" si moins de 24 heures
// "Il y a X jours" si moins de 30 jours
// "Il y a X mois" si moins de 12 mois
// "Il y a X ans" si plus de 12 mois
export function toFrenchRelativeDate(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Il y a quelques secondes";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Il y a ${hours} heure${hours > 1 ? "s" : ""}`;
  } else if (diffInSeconds < 2592000) {
    // 30 jours
    const days = Math.floor(diffInSeconds / 86400);
    return `Il y a ${days} jour${days > 1 ? "s" : ""}`;
  } else if (diffInSeconds < 31536000) {
    // 12 mois
    const months = Math.floor(diffInSeconds / 2592000);
    return `Il y a ${months} mois`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `Il y a ${years} an${years > 1 ? "s" : ""}`;
  }
}
