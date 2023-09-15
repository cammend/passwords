Correr proyecto en android:
$ react-native start
```
    Y en una segunda consola, ejecutar lo siguiente
```sh
$ react-native run-android
```

#Firmar APK con Android Studio
https://www.instamobile.io/android-development/generate-react-native-release-build-android/

#Generar apk release
1. Generar una llave para firmar APK
```sh
$ keytool -keystore nombre_del_archivo.jks -genkey -alias alias_llave -keyalg rsa -validity 3650
```

2. Copiar la llave en la carpeta android del proyecto

3. Agregar lo siguiente en el archivo: android\app\build.gradle
```
android {
....
  signingConfigs {
    release {
      storeFile file('your_key_name.keystore')
      storePassword 'your_key_store_password'
      keyAlias 'your_key_alias'
      keyPassword 'your_key_file_alias_password'
    }
  }
  buildTypes {
    release {
      ....
      signingConfig signingConfigs.release
    }
  }
}

--- Y para no "quemar" las claves en el archivo, de la siguiente forma:
signingConfigs {
  release {
    storeFile file('your_key_name.keystore')
    storePassword System.console().readLine("\nKeystore password:")
    keyAlias System.console().readLine("\nAlias: ")
    keyPassword System.console().readLine("\nAlias password: ")
   }
}
```

4. Generar bundle (crear si no existe la carpeta: android/app/src/main/assets/). Ejecutar comando en el directorio raíz.
```
$ react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
```

5. Entrar a la carpeta de android
```
cd android
```

6. Generar apk release
```
./gradlew assembleRelease
```

7. Buscar archivo resultante: android/app/build/outputs/apk/app-release.apk


#Errores comunes
Error "Duplicated resources"
En la carpeta del proyecto (no proyecto de android), ejecutar lo siguiente
```sh
$ rm -rf ./android/app/src/main/res/drawable-*
$ rm -rf ./android/app/src/main/res/raw
```