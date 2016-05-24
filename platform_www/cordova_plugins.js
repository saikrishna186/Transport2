cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/kapsel-plugin-inappbrowser/www/inappbrowser.js",
        "id": "kapsel-plugin-inappbrowser.inappbrowser",
        "pluginId": "kapsel-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "file": "plugins/kapsel-plugin-i18n/www/i18n.js",
        "id": "kapsel-plugin-i18n.i18n",
        "pluginId": "kapsel-plugin-i18n"
    },
    {
        "file": "plugins/kapsel-plugin-authproxy/www/authproxy.js",
        "id": "kapsel-plugin-authproxy.AuthProxy",
        "pluginId": "kapsel-plugin-authproxy",
        "clobbers": [
            "sap.AuthProxy"
        ]
    },
    {
        "file": "plugins/kapsel-plugin-logon/www/common/modules/MAFLogonCorePlugin.js",
        "id": "kapsel-plugin-logon.LogonCore",
        "pluginId": "kapsel-plugin-logon",
        "clobbers": [
            "sap.logon.Core"
        ]
    },
    {
        "file": "plugins/kapsel-plugin-logon/www/common/modules/Utils.js",
        "id": "kapsel-plugin-logon.LogonUtils",
        "pluginId": "kapsel-plugin-logon",
        "clobbers": [
            "sap.logon.Utils"
        ]
    },
    {
        "file": "plugins/kapsel-plugin-logon/www/common/modules/StaticScreens.js",
        "id": "kapsel-plugin-logon.LogonStaticScreens",
        "pluginId": "kapsel-plugin-logon",
        "clobbers": [
            "sap.logon.StaticScreens"
        ]
    },
    {
        "file": "plugins/kapsel-plugin-logon/www/common/modules/DynamicScreens.js",
        "id": "kapsel-plugin-logon.LogonDynamicScreens",
        "pluginId": "kapsel-plugin-logon",
        "clobbers": [
            "sap.logon.DynamicScreens"
        ]
    },
    {
        "file": "plugins/kapsel-plugin-logon/www/common/modules/LogonController.js",
        "id": "kapsel-plugin-logon.Logon",
        "pluginId": "kapsel-plugin-logon",
        "clobbers": [
            "sap.Logon"
        ]
    },
    {
        "file": "plugins/kapsel-plugin-logon/www/common/modules/InAppBrowserUI.js",
        "id": "kapsel-plugin-logon.LogonIabUi",
        "pluginId": "kapsel-plugin-logon",
        "clobbers": [
            "sap.logon.IabUi"
        ]
    },
    {
        "file": "plugins/kapsel-plugin-logon/www/common/modules/LogonJsView.js",
        "id": "kapsel-plugin-logon.LogonJsView",
        "pluginId": "kapsel-plugin-logon",
        "clobbers": [
            "sap.logon.LogonJsView"
        ]
    },
    {
        "file": "plugins/cordova-plugin-console/www/console-via-logger.js",
        "id": "cordova-plugin-console.console",
        "pluginId": "cordova-plugin-console",
        "clobbers": [
            "console"
        ]
    },
    {
        "file": "plugins/cordova-plugin-console/www/logger.js",
        "id": "cordova-plugin-console.logger",
        "pluginId": "cordova-plugin-console",
        "clobbers": [
            "cordova.logger"
        ]
    },
    {
        "file": "plugins/cordova-plugin-network-information/www/network.js",
        "id": "cordova-plugin-network-information.network",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "file": "plugins/cordova-plugin-network-information/www/Connection.js",
        "id": "cordova-plugin-network-information.Connection",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "file": "plugins/kapsel-plugin-odata/www/OData.js",
        "id": "kapsel-plugin-odata.OData",
        "pluginId": "kapsel-plugin-odata",
        "clobbers": [
            "window.sap.OData"
        ]
    },
    {
        "file": "plugins/kapsel-plugin-odata/www/OfflineStore.js",
        "id": "kapsel-plugin-odata.OfflineStore",
        "pluginId": "kapsel-plugin-odata",
        "clobbers": [
            "window.sap.OfflineStore"
        ]
    },
    {
        "file": "plugins/cordova-plugin-dialogs/www/notification.js",
        "id": "cordova-plugin-dialogs.notification",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/kapsel-plugin-attachmentviewer/www/attachmentviewer.js",
        "id": "kapsel-plugin-attachmentviewer.AttachmentViewer",
        "pluginId": "kapsel-plugin-attachmentviewer",
        "clobbers": [
            "sap.AttachmentViewer"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/CameraConstants.js",
        "id": "cordova-plugin-camera.Camera",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "Camera"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/CameraPopoverOptions.js",
        "id": "cordova-plugin-camera.CameraPopoverOptions",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "CameraPopoverOptions"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/Camera.js",
        "id": "cordova-plugin-camera.camera",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "navigator.camera"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/ios/CameraPopoverHandle.js",
        "id": "cordova-plugin-camera.CameraPopoverHandle",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "CameraPopoverHandle"
        ]
    },
    {
        "file": "plugins/cordova-plugin-geolocation/www/Coordinates.js",
        "id": "cordova-plugin-geolocation.Coordinates",
        "pluginId": "cordova-plugin-geolocation",
        "clobbers": [
            "Coordinates"
        ]
    },
    {
        "file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
        "id": "cordova-plugin-geolocation.PositionError",
        "pluginId": "cordova-plugin-geolocation",
        "clobbers": [
            "PositionError"
        ]
    },
    {
        "file": "plugins/cordova-plugin-geolocation/www/Position.js",
        "id": "cordova-plugin-geolocation.Position",
        "pluginId": "cordova-plugin-geolocation",
        "clobbers": [
            "Position"
        ]
    },
    {
        "file": "plugins/cordova-plugin-geolocation/www/geolocation.js",
        "id": "cordova-plugin-geolocation.geolocation",
        "pluginId": "cordova-plugin-geolocation",
        "clobbers": [
            "navigator.geolocation"
        ]
    },
    {
        "file": "plugins/kapsel-plugin-toolbar/www/toolbar.js",
        "id": "kapsel-plugin-toolbar.toolbar",
        "pluginId": "kapsel-plugin-toolbar",
        "clobbers": [
            "window.sap.Toolbar"
        ]
    },
    {
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "id": "cordova-plugin-statusbar.statusbar",
        "pluginId": "cordova-plugin-statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "file": "plugins/kapsel-plugin-appupdate/www/appupdate.js",
        "id": "kapsel-plugin-appupdate.AppUpdate",
        "pluginId": "kapsel-plugin-appupdate",
        "clobbers": [
            "sap.AppUpdate"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.1",
    "kapsel-plugin-corelibs": "3.11.0",
    "cordova-plugin-device": "1.1.1",
    "kapsel-plugin-inappbrowser": "1.0.1",
    "kapsel-plugin-i18n": "3.11.0",
    "kapsel-plugin-authproxy": "3.11.0",
    "kapsel-plugin-logon": "3.11.0",
    "cordova-plugin-console": "1.0.2",
    "cordova-plugin-network-information": "1.2.0",
    "kapsel-plugin-odata": "3.11.0",
    "cordova-plugin-dialogs": "1.2.0",
    "kapsel-plugin-attachmentviewer": "3.11.0",
    "cordova-plugin-camera": "2.1.1",
    "cordova-plugin-geolocation": "2.1.0",
    "kapsel-plugin-toolbar": "3.11.0",
    "cordova-plugin-statusbar": "2.1.2",
    "kapsel-plugin-appupdate": "3.12.2"
}
// BOTTOM OF METADATA
});