import cronParser from "cron-parser";
import { z } from 'zod';


interface Collection {
  id: string;
  collectionName: string;
  schedule: string;
  alerts?: unknown[];
}

interface ExecutionTime {
  id: string;
  title: string;
  nextDate: string;
  willDeliveryHappen: boolean;
}

// Constants
const CRON_FIELD_COUNT = 5;
const ALL_POSITIONS = '*';

type Schedule = "Daily" | "Weekly" | "Monthly";

export type CronFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Instant' | 'Custom' | 'Invalid';

// Validation schema for cron pattern
const cronFieldSchema = z.string().min(1);
const cronPatternSchema = z.string().refine((val) => {
  const fields = val.trim().split(' ');
  return fields.length === CRON_FIELD_COUNT;
}, 'Invalid cron pattern format');

interface CronFields {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

/**
 * Normalize schedule value to handle different input formats
 * @param schedule - The schedule value to normalize
 */
const normalizeSchedule = (schedule: unknown): string | null => {
  // If schedule is "Daily", "Weekly", etc. convert to corresponding cron pattern
  const scheduleMap: Record<string, string> = {
    'Daily': '0 0 * * *',
    'Weekly': '0 0 * * 1',
    'Monthly': '0 0 1 * *',
    'Instant': '* * * * *'
  };

  if (typeof schedule === 'string') {
    // If it's already a cron pattern, return as is
    if (schedule.includes('*') || /^\d/.test(schedule)) {
      return schedule;
    }
    // If it's a named schedule, convert it
    return scheduleMap[schedule] || null;
  }

  return null;
};

/**
 * Classifies a cron pattern into a human-readable frequency
 */
export const classifyCron = (cronPattern: string): CronFrequency => {
  // Handle empty or invalid patterns
  if (!cronPattern?.trim()) {
    console.debug('Empty or invalid cron pattern:', cronPattern);
    return 'Invalid';
  }

  const fields = cronPattern.trim().split(' ');
  
  if (fields.length !== CRON_FIELD_COUNT) {
    console.debug('Invalid field count:', fields.length, fields);
    return 'Invalid';
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = fields;

  // Debug log the parsed fields
  console.debug('Parsed cron fields:', { minute, hour, dayOfMonth, month, dayOfWeek });

  // Frequency classification rules with debugging
  const rules: Array<[boolean, CronFrequency]> = [
    [
      dayOfMonth === ALL_POSITIONS && 
      dayOfWeek === ALL_POSITIONS && 
      month === ALL_POSITIONS,
      'Daily'
    ],
    [
      dayOfWeek !== ALL_POSITIONS && 
      dayOfMonth === ALL_POSITIONS && 
      minute !== ALL_POSITIONS && 
      hour !== ALL_POSITIONS,
      'Weekly'
    ],
    [
      dayOfMonth !== ALL_POSITIONS && 
      minute !== ALL_POSITIONS && 
      hour !== ALL_POSITIONS && 
      dayOfWeek === ALL_POSITIONS,
      'Monthly'
    ],
    [
      minute !== ALL_POSITIONS && 
      dayOfWeek === ALL_POSITIONS,
      'Instant'
    ]
  ];

  const matchedRule = rules.find(([condition]) => condition);
  console.debug('Matched rule:', matchedRule?.[1] || 'Custom');

  return matchedRule?.[1] ?? 'Custom';
};

/**
 * Safe wrapper for classifyCron that handles all possible schedule inputs
 */
export const getCollectionScheduleFrequency = (schedule?: unknown): CronFrequency => {
  console.debug('Original schedule value:', schedule);
  
  const normalizedSchedule = normalizeSchedule(schedule);
  console.debug('Normalized schedule:', normalizedSchedule);

  if (!normalizedSchedule) {
    return 'Custom';
  }
  
  try {
    const frequency = classifyCron(normalizedSchedule);
    console.debug('Classified frequency:', frequency);
    return frequency;
  } catch (error) {
    console.error('Error classifying schedule:', error);
    return 'Custom';
  }
};

/**
 * Calculates the next execution time for a collection
 * @param collection - The collection to calculate for
 * @returns The execution time details
 */
const calculateNextExecutionForCollection = (
  collection: Collection,
): ExecutionTime => {
  try {
    const interval = cronParser.parseExpression(collection.schedule, {
      currentDate: new Date(),
      tz: "GMT",
    });

    const nextOccurrenceUTC = interval.next().toDate();
    const localNextOccurrence = new Date(nextOccurrenceUTC);

    return {
      id: collection.id,
      title: collection.collectionName,
      nextDate: localNextOccurrence.toString(),
      willDeliveryHappen:
        Array.isArray(collection.alerts) && collection.alerts.length > 0,
    };
  } catch (error) {
    console.error(
      `Error parsing cron expression for collection ${collection.id}:`,
      error,
    );
    return {
      id: collection.id,
      title: collection.collectionName,
      nextDate: "Error calculating next execution time",
      willDeliveryHappen: false,
    };
  }
};

/**
 * Converts a user-friendly schedule to a cron expression
 * @param schedule - The schedule type (Daily, Weekly, or Monthly)
 * @returns The corresponding cron expression
 */
export const scheduleFormatToCron = (schedule: Schedule): string => {
  switch (schedule) {
    case "Daily":
      // Run at 3:30 AM every day
      return "30 3 * * *";
    case "Weekly":
      // Run at 9:00 AM every Monday
      return "0 9 * * 1";
    case "Monthly":
      // Run at 9:00 AM on the 1st of every month
      return "0 9 1 * *";
    default:
      throw new Error(`Invalid schedule format: ${schedule}`);
  }
};

/**
 * Calculates next executions for multiple collections
 * @param collections - Array of collections to process
 * @returns Array of execution times or null if no collections
 */
export const calculateNextExecutions = (
  collections?: Collection[],
): ExecutionTime[] | null => {
  if (!Array.isArray(collections) || collections.length === 0) {
    return null;
  }

  return collections.map(calculateNextExecutionForCollection);
};

export const truncateText = (text: string, maxLength: number) => {
  if (text && text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export const formatDate = (date: string | Date): string => {
  const now = new Date();
  const givenDate = new Date(date);

  const timeDifference = now.getTime() - givenDate.getTime();

  const daysAgo = Math.floor(timeDifference / (1000 * 3600 * 24));

  if (daysAgo === 0) {
    return "Today";
  } else if (daysAgo === 1) {
    return "1 day ago";
  } else {
    return `${daysAgo} days ago`;
  }
};

/**
 * Generates three harmonious colors using the triadic color scheme
 * @returns Array of three HSL color strings
 */
export const generateTriadicColors = (): string[] => {
  const baseHue = Math.floor(Math.random() * 360);
  // Lower saturation and moderate lightness for a refined, muted look
  const saturation = 40; // Lower saturation reduces vibrancy
  const lightness = 55;  // Moderate lightness for balanced contrast

  // Create three colors: base, base+120, base+240 (all mod 360)
  const color1 = `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
  const color2 = `hsl(${(baseHue + 120) % 360}, ${saturation}%, ${lightness}%)`;
  const color3 = `hsl(${(baseHue + 240) % 360}, ${saturation}%, ${lightness}%)`;

  return [color1, color2, color3];
};
