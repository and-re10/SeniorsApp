// Push Notifications IOS
#import <UserNotifications/UNUserNotificationCenter.h>
// End Push Notifications IOS
#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>

// Push Notifications IOS
@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate>
// End Push Notifications IOS

@property (nonatomic, strong) UIWindow *window;

@end
