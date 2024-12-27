export function notifyMe(message) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(message);
    }
}

export function requestPermission() {
    if (!("Notification" in window)) {
        // Check if the browser supports notifications
        alert("This browser does not support desktop notification");
    } else if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        // We need to ask the user for permission
        Notification.requestPermission();
    }
}
