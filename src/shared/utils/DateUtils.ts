import addMonths from 'date-fns/addMonths';

export class DateUtils {
  public static addMonths(date: Date, numberOfMonths: number): Date {
    return addMonths(date, numberOfMonths);
  }
}
