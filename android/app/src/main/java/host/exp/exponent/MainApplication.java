package host.exp.exponent;


import com.facebook.react.ReactPackage;

import decode.zenroom.ZenroomPackage;

import java.util.Arrays;
import java.util.List;

import expolib_v1.okhttp3.OkHttpClient;
import expo.core.interfaces.Package;
import expo.loaders.provider.interfaces.AppLoaderPackagesProviderInterface;
import expo.modules.ads.admob.AdMobPackage;
import expo.modules.analytics.segment.SegmentPackage;
import expo.modules.appauth.AppAuthPackage;
import expo.modules.backgroundfetch.BackgroundFetchPackage;
import expo.modules.barcodescanner.BarCodeScannerPackage;
import expo.modules.camera.CameraPackage;
import expo.modules.constants.ConstantsPackage;
import expo.modules.contacts.ContactsPackage;
import expo.modules.facedetector.FaceDetectorPackage;
import expo.modules.filesystem.FileSystemPackage;
import expo.modules.font.FontLoaderPackage;
import expo.modules.gl.GLPackage;
import expo.modules.google.signin.GoogleSignInPackage;
import expo.modules.localauthentication.LocalAuthenticationPackage;
import expo.modules.localization.LocalizationPackage;
import expo.modules.medialibrary.MediaLibraryPackage;
import expo.modules.permissions.PermissionsPackage;
import expo.modules.print.PrintPackage;
import expo.modules.sensors.SensorsPackage;
import expo.modules.sms.SMSPackage;
import expo.modules.taskManager.TaskManagerPackage;


public class MainApplication extends ExpoApplication implements AppLoaderPackagesProviderInterface<ReactPackage> {

  public List<Package> getExpoPackages() {
    return Arrays.<Package>asList(
            new CameraPackage(),
            new ConstantsPackage(),
            new SensorsPackage(),
            new FileSystemPackage(),
            new FaceDetectorPackage(),
            new GLPackage(),
            new GoogleSignInPackage(),
            new PermissionsPackage(),
            new SMSPackage(),
            new PrintPackage(),
            new ConstantsPackage(),
            new MediaLibraryPackage(),
            new SegmentPackage(),
            new FontLoaderPackage(),
            new ContactsPackage(),
            new BarCodeScannerPackage(),
            new AdMobPackage(),
            new LocalAuthenticationPackage(),
            new LocalizationPackage(),
            new AppAuthPackage(),
            new TaskManagerPackage(),
            new BackgroundFetchPackage()
    );
  }

  @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }

  public List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(new ZenroomPackage());
  }

  @Override
  public String gcmSenderId() {
    return getString(R.string.gcm_defaultSenderId);
  }

  @Override
  public boolean shouldUseInternetKernel() {
    return BuildVariantConstants.USE_INTERNET_KERNEL;
  }

  public static OkHttpClient.Builder okHttpClientBuilder(OkHttpClient.Builder builder) {
    return builder;
  }
}
