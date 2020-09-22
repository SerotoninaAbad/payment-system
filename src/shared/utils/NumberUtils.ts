export class NumberUtils {
  public static toFormatedString(number: number) {
    return `${parseFloat((number * 100).toString()).toFixed(2)}%`;
  }
}
