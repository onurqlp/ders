plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.aydadil.ders"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.aydadil.ders"
        minSdk = 23
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    val aydaStoreFile = providers.gradleProperty("AYDA_STORE_FILE").orNull ?: System.getenv("AYDA_STORE_FILE")
    val aydaStorePassword = providers.gradleProperty("AYDA_STORE_PASSWORD").orNull ?: System.getenv("AYDA_STORE_PASSWORD")
    val aydaKeyAlias = providers.gradleProperty("AYDA_KEY_ALIAS").orNull ?: System.getenv("AYDA_KEY_ALIAS")
    val aydaKeyPassword = providers.gradleProperty("AYDA_KEY_PASSWORD").orNull ?: System.getenv("AYDA_KEY_PASSWORD")

    signingConfigs {
        create("release") {
            if (!aydaStoreFile.isNullOrBlank() && !aydaStorePassword.isNullOrBlank() && !aydaKeyAlias.isNullOrBlank() && !aydaKeyPassword.isNullOrBlank()) {
                storeFile = file(aydaStoreFile)
                storePassword = aydaStorePassword
                keyAlias = aydaKeyAlias
                keyPassword = aydaKeyPassword
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            if (!aydaStoreFile.isNullOrBlank() && !aydaStorePassword.isNullOrBlank() && !aydaKeyAlias.isNullOrBlank() && !aydaKeyPassword.isNullOrBlank()) {
                signingConfig = signingConfigs.getByName("release")
            }
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
}
