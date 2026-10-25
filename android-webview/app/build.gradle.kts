plugins { id("com.android.application") }

android {
    namespace = "com.aydadil.ders"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.aydadil.ders"
        minSdk = 23
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    flavorDimensions += "environment"
    productFlavors {
        create("preview") {
            dimension = "environment"
            applicationIdSuffix = ".preview"
            buildConfigField("String", "START_URL", "\"https://htmlpreview.github.io/?https://github.com/onurqlp/ders/blob/a85e3f30be72afc69419bd15b42005ac1fb4fbaa/index.html\"")
            buildConfigField("boolean", "PREVIEW_MODE", "true")
        }
        create("production") {
            dimension = "environment"
            buildConfigField("String", "START_URL", "\"https://ders.aydadil.com/\"")
            buildConfigField("boolean", "PREVIEW_MODE", "false")
        }
    }

    buildFeatures { buildConfig = true }
    testOptions { unitTests.isIncludeAndroidResources = false }
}

dependencies {
    testImplementation("junit:junit:4.13.2")
}
