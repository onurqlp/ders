package com.aydadil.ders

import java.net.URI

internal object NavigationPolicy {
    private val coursePaths = listOf("/a1ayda/", "/a2ayda/", "/b1ayda/", "/sinavhazirlik/", "/bibliothek/", "/derskitaplari/")
    private const val PREVIEW = "https://htmlpreview.github.io/?https://github.com/onurqlp/ders/blob/a85e3f30be72afc69419bd15b42005ac1fb4fbaa/index.html"

    fun isAllowed(raw: String, preview: Boolean): Boolean {
        val uri = runCatching { URI(raw) }.getOrNull() ?: return false
        if (!uri.scheme.equals("https", true) || uri.rawUserInfo != null || (uri.port != -1 && uri.port != 443)) return false
        val host = uri.host?.lowercase() ?: return false
        if (preview) return raw == PREVIEW
        return when (host) {
            "ders.aydadil.com" -> uri.path.isNullOrEmpty() || uri.path == "/"
            "www.aydadil.com" -> coursePaths.any { uri.path.orEmpty().startsWith(it) }
            "osd.aydadil.com", "kurs.aydadil.com" -> true
            else -> false
        }
    }

    fun isExternalScheme(raw: String): Boolean {
        val scheme = runCatching { URI(raw).scheme?.lowercase() }.getOrNull() ?: return false
        return scheme in setOf("mailto", "tel", "geo", "whatsapp")
    }
}
