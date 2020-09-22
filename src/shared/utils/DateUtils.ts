import addMonths from 'date-fns/addMonths';

export class DateUtils {
  public static addMonths(date: Date, numberOfMonths: number): Date {
    return addMonths(date, numberOfMonths);
  }

  public static isValidStringDate(value: string): boolean {
    const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
    return dateFormat.test(value);
  }
}
