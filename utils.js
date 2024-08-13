export class Utils {
    static getDistance(x1, y1, x2, y2) {
        const squaredSubsrX = Math.pow(x2 - x1, 2);
        const squaredSubsrY = Math.pow(y2 - y1, 2);

        return Math.sqrt(squaredSubsrX + squaredSubsrY);
    }
}