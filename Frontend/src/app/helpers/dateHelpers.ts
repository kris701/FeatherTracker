export class DateHelpers {
    public static PrettyDate(input : string | Date | null) : string {
        if (input == null || input == "")
            return "Never";
        return new Date(Date.parse(<string>input)).toLocaleString();
    }

    public static DiffinDays(d1 : Date, d2 : Date) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();
 
        return Math.floor((t2-t1)/(24*3600*1000));
    }
 
    public static DiffinMonths(d1 : Date, d2 : Date) {
        var d1Y = d1.getFullYear();
        var d2Y = d2.getFullYear();
        var d1M = d1.getMonth();
        var d2M = d2.getMonth();
 
        return (d2M+12*d2Y)-(d1M+12*d1Y);
    }
 
    public static DiffinYears(d1 : Date, d2 : Date) {
        return d2.getFullYear()-d1.getFullYear();
    }
}