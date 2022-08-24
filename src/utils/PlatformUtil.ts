export class PlatformUtil {

    // Detects if running on mobile device
    public static isMobileDevice(): boolean {
        let mobile = (navigator.userAgent||navigator.vendor).match(/(quest|android|iphone|blackberry|ipod|kindle)/i) != null;
        return mobile;
    };

}