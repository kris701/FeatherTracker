export class DateHelpers {
    public static PrettyDate(input : string | Date | null) : string {
        if (input == null || input == "")
            return "Never";
        return new Date(Date.parse(<string>input)).toLocaleString();
    }
}